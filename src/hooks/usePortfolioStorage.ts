import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from '../types/portfolio';
import { initialProjects } from '../data/initialProjects';
import { AboutData, defaultAboutData } from '../components/AboutSection';

const STORAGE_KEY = 'vdvc_portfolio_projects_v8';
const ABOUT_STORAGE_KEY = 'vdvc_portfolio_about_v1';
const AUTH_KEY = 'dive_portfolio_admin_auth';
export const ADMIN_PASSWORD = 'memeh 23';

const DELETED_PROJECT_IDS = new Set(['proj-5', 'proj-6', 'proj-7']);
const initialMap = new Map(initialProjects.map(p => [p.id, p]));

export function usePortfolioStorage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((p: Project) => !DELETED_PROJECT_IDS.has(p.id))
            .map((p: Project) => {
              const fallback = initialMap.get(p.id);
              return {
                ...fallback,
                ...p,
                galleryPictures: p.galleryPictures || fallback?.galleryPictures,
                processSteps: p.processSteps || fallback?.processSteps,
                clientRemark: p.clientRemark || fallback?.clientRemark,
                monthYear: p.monthYear || fallback?.monthYear,
                clientDescription: p.clientDescription || fallback?.clientDescription,
                shortDescription: p.shortDescription || fallback?.shortDescription,
                imageScalePercent: p.imageScalePercent ?? fallback?.imageScalePercent ?? 100,
              };
            })
            .slice(0, 4);
        }
      }
    } catch {
      // fallback
    }
    return initialProjects.slice(0, 4);
  });

  const [aboutData, setAboutData] = useState<AboutData>(() => {
    try {
      const stored = localStorage.getItem(ABOUT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.studioName) {
          if (
            !parsed.founderImage ||
            parsed.founderImage.includes('Linnea') ||
            parsed.founderImage.startsWith('data:image/svg+xml')
          ) {
            parsed.founderImage = '/VDVC 4 - Logo.png';
          }
          if (!parsed.logoUrl || parsed.logoUrl.includes('vdvc-logo.png')) {
            parsed.logoUrl = '/VDVC 4 - Logo - NO-TEXT-TRANSPARENT-BG.png';
          }
          if (!parsed.footerTagline || parsed.footerTagline.includes('Creative Direction')) {
            parsed.footerTagline = 'a flexible system for your paper workloads';
          }
          if (!parsed.bio || parsed.bio.includes('Creative Direction')) {
            parsed.bio = 'a flexible system for your paper workloads';
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return defaultAboutData;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Synchronize Projects with Firestore in Real-Time
  useEffect(() => {
    const projectsCol = collection(db, 'projects');
    const unsubscribe = onSnapshot(
      projectsCol,
      async snapshot => {
        if (snapshot.empty) {
          // Seed the 4 initial projects if Firestore is completely empty
          try {
            const batch = writeBatch(db);
            const targetProjects = initialProjects.slice(0, 4);
            targetProjects.forEach(proj => {
              const docRef = doc(db, 'projects', proj.id);
              batch.set(docRef, proj);
            });
            await batch.commit();
          } catch (err) {
            console.error('Failed to seed initial 4 projects to Firestore:', err);
          }
        } else {
          const loadedProjects: Project[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as Project;
            if (DELETED_PROJECT_IDS.has(docSnap.id) || DELETED_PROJECT_IDS.has(data.id)) {
              // Delete from Firestore
              deleteDoc(docSnap.ref).catch(() => {});
            } else {
              const fallback = initialMap.get(data.id);
              const merged: Project = {
                ...fallback,
                ...data,
                galleryPictures: data.galleryPictures || fallback?.galleryPictures,
                processSteps: data.processSteps || fallback?.processSteps,
                clientRemark: data.clientRemark || fallback?.clientRemark,
                monthYear: data.monthYear || fallback?.monthYear,
                clientDescription: data.clientDescription || fallback?.clientDescription,
                shortDescription: data.shortDescription || fallback?.shortDescription,
                imageScalePercent: data.imageScalePercent ?? fallback?.imageScalePercent ?? 100,
              };
              loadedProjects.push(merged);
            }
          });
          // Sort by createdAt descending
          loadedProjects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setProjects(loadedProjects);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedProjects));
          } catch {
            // ignore
          }
        }
        setIsLoading(false);
      },
      error => {
        // Handle offline / connection failures gracefully without raising unhandled errors
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Synchronize About Data with Firestore in Real-Time
  useEffect(() => {
    const aboutDocRef = doc(db, 'settings', 'about');
    const unsubscribe = onSnapshot(
      aboutDocRef,
      async docSnap => {
        if (!docSnap.exists()) {
          // Seed default about data to Firestore
          try {
            await setDoc(aboutDocRef, defaultAboutData);
          } catch {
            // offline fallback
          }
        } else {
          const data = docSnap.data() as AboutData;
          let founderImage = data.founderImage;
          if (
            !founderImage ||
            founderImage.includes('Linnea') ||
            founderImage.startsWith('data:image/svg+xml')
          ) {
            founderImage = '/VDVC 4 - Logo.png';
          }
          let logoUrl = data.logoUrl;
          if (!logoUrl || logoUrl.includes('vdvc-logo.png')) {
            logoUrl = '/VDVC 4 - Logo - NO-TEXT-TRANSPARENT-BG.png';
          }
          let footerTagline = data.footerTagline;
          if (!footerTagline || footerTagline.includes('Creative Direction')) {
            footerTagline = 'a flexible system for your paper workloads';
          }
          let bio = data.bio;
          if (!bio || bio.includes('Creative Direction')) {
            bio = 'a flexible system for your paper workloads';
          }
          const upgraded: AboutData = {
            ...defaultAboutData,
            ...data,
            founderImage,
            logoUrl,
            footerTagline,
            bio,
            studioName: data.studioName || defaultAboutData.studioName,
            websiteName: data.websiteName || defaultAboutData.websiteName,
          };
          setAboutData(upgraded);
          try {
            localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(upgraded));
          } catch {
            // ignore
          }
        }
      },
      error => {
        // Handle offline fallback silently
      }
    );

    return () => unsubscribe();
  }, []);

  const login = useCallback((pass: string): boolean => {
    if (pass.trim() === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Add Project (writes to Firestore)
  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newProj: Project = {
      ...projectData,
      id: newId,
      createdAt: Date.now(),
    };

    setProjects(prev => [newProj, ...prev]);
    try {
      await setDoc(doc(db, 'projects', newId), newProj);
    } catch (err) {
      console.error('Error adding project to Firestore:', err);
    }
    return newProj;
  }, []);

  // Update Project (writes to Firestore)
  const updateProject = useCallback(async (id: string, updated: Partial<Project>) => {
    setProjects(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...updated } : p));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...updated,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Error updating project in Firestore:', err);
    }
  }, []);

  // Delete Project (writes to Firestore)
  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error('Error deleting project from Firestore:', err);
    }
  }, []);

  // Reset to the 4 default projects in Firestore
  const resetToDefaults = useCallback(async () => {
    const targetProjects = initialProjects.slice(0, 4);
    setProjects(targetProjects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(targetProjects));
      // Delete existing in Firestore and reseed
      const existingSnap = await getDocs(collection(db, 'projects'));
      const batch = writeBatch(db);
      existingSnap.forEach(d => {
        batch.delete(d.ref);
      });
      targetProjects.forEach(p => {
        batch.set(doc(db, 'projects', p.id), p);
      });
      await batch.commit();
    } catch (err) {
      console.error('Error resetting projects in Firestore:', err);
    }
  }, []);

  // Update About Data (writes to Firestore)
  const updateAboutData = useCallback(async (newAbout: AboutData) => {
    setAboutData(newAbout);
    try {
      localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(newAbout));
      await setDoc(doc(db, 'settings', 'about'), {
        ...newAbout,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Error updating about data in Firestore:', err);
    }
  }, []);

  return {
    projects,
    aboutData,
    isAdmin,
    isLoading,
    login,
    logout,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    updateAboutData,
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { AboutData, defaultAboutData, SocialLinkItem } from '../components/AboutSection';

const STORAGE_KEY = 'vdvc_portfolio_projects_v9';
const SEEDED_WEB_KEY = 'vdvc_seeded_web_projects_v1';
const ABOUT_STORAGE_KEY = 'vdvc_portfolio_about_v2';
const AUTH_KEY = 'dive_portfolio_admin_auth';
export const ADMIN_PASSWORD = 'memeh 23';

const DELETED_PROJECT_IDS = new Set(['proj-5', 'proj-6', 'proj-7']);
const LEGACY_SOCIAL_IDS = new Set(['soc-1', 'soc-2', 'soc-3']);
const initialMap = new Map(initialProjects.map(p => [p.id, p]));

function sanitizeSocialLinks(links?: SocialLinkItem[]): SocialLinkItem[] {
  if (!Array.isArray(links)) return [];
  return links.filter(item => {
    if (!item) return false;
    // Remove the old hardcoded placeholder links (soc-1, soc-2, soc-3)
    if (LEGACY_SOCIAL_IDS.has(item.id)) return false;
    return true;
  });
}

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
                websiteUrl: p.websiteUrl || fallback?.websiteUrl,
                galleryPictures: p.galleryPictures || fallback?.galleryPictures,
                processSteps: p.processSteps || fallback?.processSteps,
                clientRemark: p.clientRemark || fallback?.clientRemark,
                monthYear: p.monthYear || fallback?.monthYear,
                clientDescription: p.clientDescription || fallback?.clientDescription,
                shortDescription: p.shortDescription || fallback?.shortDescription,
                imageScalePercent: p.imageScalePercent ?? fallback?.imageScalePercent ?? 100,
              };
            });
        }
      }
    } catch {
      // fallback
    }
    return [...initialProjects].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
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
          parsed.socialLinks = sanitizeSocialLinks(parsed.socialLinks);
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
  const lastProjectsJsonRef = useRef<string>('');
  const lastAboutJsonRef = useRef<string>('');
  const hasSeededWebRef = useRef<boolean>(false);

  // 1. Synchronize Projects with Firestore in Real-Time
  useEffect(() => {
    const projectsCol = collection(db, 'projects');
    const unsubscribe = onSnapshot(
      projectsCol,
      async snapshot => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            initialProjects.forEach(proj => {
              const docRef = doc(db, 'projects', proj.id);
              batch.set(docRef, proj);
            });
            await batch.commit();
            try {
              localStorage.setItem(SEEDED_WEB_KEY, 'true');
            } catch {
              // ignore
            }
          } catch (err) {
            console.error('Failed to seed initial projects to Firestore:', err);
          }
        } else {
          const loadedProjects: Project[] = [];
          const existingIds = new Set<string>();
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as Project;
            const docId = data.id || docSnap.id;
            existingIds.add(docId);
            if (!DELETED_PROJECT_IDS.has(docSnap.id) && !DELETED_PROJECT_IDS.has(data.id)) {
              const fallback = initialMap.get(data.id);
              const merged: Project = {
                ...fallback,
                ...data,
                websiteUrl: data.websiteUrl || fallback?.websiteUrl,
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

          // Ensure the 8 new website projects are seeded if not already in Firestore
          const alreadySeeded =
            hasSeededWebRef.current ||
            (() => {
              try {
                return localStorage.getItem(SEEDED_WEB_KEY) === 'true';
              } catch {
                return false;
              }
            })();

          const missingWebProjects = initialProjects.filter(
            p => p.id.startsWith('proj-web-') && !existingIds.has(p.id)
          );

          if (!alreadySeeded && missingWebProjects.length > 0) {
            hasSeededWebRef.current = true;
            missingWebProjects.forEach(p => loadedProjects.push(p));
            try {
              const batch = writeBatch(db);
              missingWebProjects.forEach(proj => {
                batch.set(doc(db, 'projects', proj.id), proj);
              });
              await batch.commit();
              localStorage.setItem(SEEDED_WEB_KEY, 'true');
            } catch (err) {
              console.error('Failed to seed website projects to Firestore:', err);
            }
          }

          loadedProjects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          const serialized = JSON.stringify(loadedProjects);
          if (serialized !== lastProjectsJsonRef.current) {
            lastProjectsJsonRef.current = serialized;
            setProjects(loadedProjects);
            try {
              localStorage.setItem(STORAGE_KEY, serialized);
            } catch {
              // ignore
            }
          }
        }
        setIsLoading(false);
      },
      () => {
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
          const sanitizedSocials = sanitizeSocialLinks(data.socialLinks);
          const hadLegacySocials =
            Array.isArray(data.socialLinks) &&
            data.socialLinks.length !== sanitizedSocials.length;

          const upgraded: AboutData = {
            ...defaultAboutData,
            ...data,
            founderImage,
            logoUrl,
            footerTagline,
            bio,
            socialLinks: sanitizedSocials,
            studioName: data.studioName || defaultAboutData.studioName,
            websiteName: data.websiteName || defaultAboutData.websiteName,
          };

          if (hadLegacySocials) {
            setDoc(aboutDocRef, upgraded).catch(() => {});
          }

          const serialized = JSON.stringify(upgraded);
          if (serialized !== lastAboutJsonRef.current) {
            lastAboutJsonRef.current = serialized;
            setAboutData(upgraded);
            try {
              localStorage.setItem(ABOUT_STORAGE_KEY, serialized);
            } catch {
              // ignore
            }
          }
        }
      },
      () => {
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

  // Reset to the default projects in Firestore
  const resetToDefaults = useCallback(async () => {
    const targetProjects = [...initialProjects].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setProjects(targetProjects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(targetProjects));
      localStorage.setItem(SEEDED_WEB_KEY, 'true');
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

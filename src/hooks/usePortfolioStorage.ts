import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from '../types/portfolio';
import { initialProjects } from '../data/initialProjects';
import { AboutData, defaultAboutData, SocialLinkItem } from '../components/AboutSection';

const STORAGE_KEY = 'vdvc_portfolio_projects_v15';
const SEEDED_WEB_KEY = 'vdvc_seeded_projects_v7';
const ABOUT_STORAGE_KEY = 'vdvc_portfolio_about_v2';
const AUTH_KEY = 'dive_portfolio_admin_auth';
export const ADMIN_PASSWORD = 'memeh 23';

const DELETED_PROJECT_IDS = new Set([
  'proj-1',
  'proj-2',
  'proj-3',
  'proj-4',
  'proj-5',
  'proj-6',
  'proj-7',
]);
const LEGACY_SOCIAL_IDS = new Set(['soc-1', 'soc-2', 'soc-3']);
const initialMap = new Map(initialProjects.map(p => [p.id, p]));

/**
 * Deduplicate projects by ID and by normalized (category + title) so duplicate
 * entries can never appear on initial load or after snapshot updates.
 */
function dedupeProjects(list: Project[]): Project[] {
  const seenIds = new Set<string>();
  const seenTitleKeys = new Set<string>();
  const result: Project[] = [];

  for (const item of list) {
    if (!item || !item.id || DELETED_PROJECT_IDS.has(item.id)) continue;
    const titleKey = `${(item.category || '').toLowerCase()}::${(item.title || '').trim().toLowerCase()}`;
    if (seenIds.has(item.id) || (item.title && seenTitleKeys.has(titleKey))) {
      continue;
    }
    seenIds.add(item.id);
    if (item.title) seenTitleKeys.add(titleKey);
    result.push(item);
  }
  return result;
}

/**
 * Layers a stored project over the built-in defaults.
 * A field the user has explicitly saved (even as an empty string) always wins, so
 * clearing a field really clears it. Defaults only fill fields that were never stored.
 */
function mergeWithDefaults(data: Project): Project {
  const fallback = initialMap.get(data.id);
  const merged: Project = {
    ...fallback,
    ...data,
    deliverables: Array.isArray(data.deliverables) ? data.deliverables : (fallback?.deliverables ?? []),
    industries: Array.isArray(data.industries) ? data.industries : (fallback?.industries ?? []),
    imageScalePercent: data.imageScalePercent ?? fallback?.imageScalePercent ?? 100,
  };
  if (
    fallback &&
    data.id?.startsWith('proj-web-') &&
    (!data.images?.length || data.images[0]?.startsWith('data:image/svg+xml'))
  ) {
    merged.imageUrl = fallback.imageUrl;
    merged.images = fallback.images;
    merged.galleryPictures = fallback.galleryPictures;
    merged.websiteUrl = fallback.websiteUrl;
  }
  return merged;
}

/** Firestore rejects documents above 1 MiB; keep a safety margin. */
const MAX_DOC_BYTES = 1_000_000;

function assertDocSize(payload: unknown, label: string) {
  const bytes = new Blob([JSON.stringify(payload)]).size;
  if (bytes > MAX_DOC_BYTES) {
    throw new Error(
      `${label} is ${(bytes / 1024).toFixed(0)} KB, which exceeds the 1 MB database limit. ` +
        'Use smaller images or add images by link instead of uploading them.'
    );
  }
}

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

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
          return dedupeProjects(
            parsed
              .filter((p: Project) => !DELETED_PROJECT_IDS.has(p.id))
              .map((p: Project) => mergeWithDefaults(p))
          ).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }
      }
    } catch {
      // fallback
    }
    return dedupeProjects([...initialProjects]).sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
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
            parsed.founderImage.startsWith('data:image/svg+xml') ||
            parsed.founderImage === '/VDVC 4 - Logo.png' ||
            parsed.founderImage === '/vdvc-4-logo.png'
          ) {
            parsed.founderImage = '/VDVC 4 - Logo - NO-TEXT-TRANSPARENT-BG.png';
          }
          if (
            !parsed.logoUrl ||
            parsed.logoUrl.includes('vdvc-logo.png') ||
            parsed.logoUrl === '/VDVC 4 - Logo - NO-TEXT.png' ||
            parsed.logoUrl === '/VDVC 4 - Logo.png'
          ) {
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
  const [dbError, setDbError] = useState<string | null>(null);
  const lastProjectsJsonRef = useRef<string>('');
  const lastAboutJsonRef = useRef<string>('');

  // Latest state mirrors, used to roll back optimistic updates when a write fails
  const projectsRef = useRef<Project[]>(projects);
  const aboutRef = useRef<AboutData>(aboutData);
  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);
  useEffect(() => {
    aboutRef.current = aboutData;
  }, [aboutData]);

  // 1. Synchronize Projects with Firestore in Real-Time
  useEffect(() => {
    const projectsCol = collection(db, 'projects');
    const unsubscribe = onSnapshot(
      projectsCol,
      async snapshot => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            dedupeProjects(initialProjects).forEach(proj => {
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
          const rawProjects: Project[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as Project;
            const docId = data.id || docSnap.id;
            if (!DELETED_PROJECT_IDS.has(docSnap.id) && !DELETED_PROJECT_IDS.has(docId)) {
              rawProjects.push(mergeWithDefaults({ ...data, id: docId }));
            }
          });

          const loadedProjects = dedupeProjects(rawProjects).sort(
            (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
          );
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
        setDbError(null);
        setIsLoading(false);
      },
      err => {
        console.error('Firestore projects listener failed:', err);
        setDbError(`Cannot read from the database: ${describeError(err)}`);
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
            founderImage.startsWith('data:image/svg+xml') ||
            founderImage === '/VDVC 4 - Logo.png' ||
            founderImage === '/vdvc-4-logo.png'
          ) {
            founderImage = '/VDVC 4 - Logo - NO-TEXT-TRANSPARENT-BG.png';
          }
          let logoUrl = data.logoUrl;
          if (
            !logoUrl ||
            logoUrl.includes('vdvc-logo.png') ||
            logoUrl === '/VDVC 4 - Logo - NO-TEXT.png' ||
            logoUrl === '/VDVC 4 - Logo.png'
          ) {
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
      err => {
        console.error('Firestore about listener failed:', err);
        setDbError(`Cannot read from the database: ${describeError(err)}`);
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

    setProjects(prev => dedupeProjects([newProj, ...prev]));
    try {
      assertDocSize(newProj, 'This project');
      await setDoc(doc(db, 'projects', newId), newProj);
      setDbError(null);
    } catch (err) {
      console.error('Error adding project to Firestore:', err);
      setProjects(prev => prev.filter(p => p.id !== newId));
      setDbError(`Project was not saved: ${describeError(err)}`);
      throw err;
    }
    return newProj;
  }, []);

  // Update Project (writes to Firestore). Throws if the database rejects the write.
  const updateProject = useCallback(async (id: string, updated: Partial<Project>) => {
    const before = projectsRef.current;
    const existing = before.find(p => p.id === id);
    const nextDoc = { ...existing, ...updated, id, updatedAt: Date.now() } as Project;

    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    try {
      assertDocSize(nextDoc, 'This project');
      await setDoc(doc(db, 'projects', id), { ...updated, id, updatedAt: nextDoc.updatedAt }, { merge: true });
      setDbError(null);
    } catch (err) {
      console.error('Error updating project in Firestore:', err);
      setProjects(before);
      setDbError(`Changes were not saved: ${describeError(err)}`);
      throw err;
    }
  }, []);

  // Delete Project (writes to Firestore)
  const deleteProject = useCallback(async (id: string) => {
    const before = projectsRef.current;
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'projects', id));
      setDbError(null);
    } catch (err) {
      console.error('Error deleting project from Firestore:', err);
      setProjects(before);
      setDbError(`Project was not deleted: ${describeError(err)}`);
      throw err;
    }
  }, []);

  // Reset to the default projects in Firestore
  const resetToDefaults = useCallback(async () => {
    const before = projectsRef.current;
    const targetProjects = dedupeProjects([...initialProjects]).sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
    setProjects(targetProjects);
    try {
      const existingSnap = await getDocs(collection(db, 'projects'));
      const batch = writeBatch(db);
      existingSnap.forEach(d => {
        batch.delete(d.ref);
      });
      targetProjects.forEach(p => {
        batch.set(doc(db, 'projects', p.id), p);
      });
      await batch.commit();
      try {
        localStorage.setItem(SEEDED_WEB_KEY, 'true');
      } catch {
        // ignore
      }
      setDbError(null);
    } catch (err) {
      console.error('Error resetting projects in Firestore:', err);
      setProjects(before);
      setDbError(`Reset was not saved: ${describeError(err)}`);
      throw err;
    }
  }, []);

  // Update About Data (writes to Firestore). Throws if the database rejects the write.
  const updateAboutData = useCallback(async (newAbout: AboutData) => {
    const before = aboutRef.current;
    setAboutData(newAbout);
    try {
      const payload = { ...newAbout, updatedAt: Date.now() };
      assertDocSize(payload, 'The About/settings data');
      await setDoc(doc(db, 'settings', 'about'), payload);
      setDbError(null);
    } catch (err) {
      console.error('Error updating about data in Firestore:', err);
      setAboutData(before);
      setDbError(`Settings were not saved: ${describeError(err)}`);
      throw err;
    }
  }, []);

  const clearDbError = useCallback(() => setDbError(null), []);

  return {
    projects,
    aboutData,
    isAdmin,
    isLoading,
    dbError,
    clearDbError,
    login,
    logout,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    updateAboutData,
  };
}

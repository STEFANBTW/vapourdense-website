import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from '../types/portfolio';
import { AboutData, defaultAboutData, SocialLinkItem } from '../components/AboutSection';

const STORAGE_KEY = 'vdvc_portfolio_projects_v21';
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

function normalizeProject(data: Project): Project {
  const industries = (Array.isArray(data.industries) && data.industries.length > 0)
    ? data.industries
    : (Array.isArray(data.industry) ? data.industry : []);
  return {
    ...data,
    deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
    industries,
    industry: industries,
    imageScalePercent: data.imageScalePercent ?? 100,
  };
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
              .map((p: Project) => normalizeProject(p))
          ).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [aboutData, setAboutData] = useState<AboutData>(() => {
    try {
      const stored = localStorage.getItem(ABOUT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.studioName) {
          parsed.socialLinks = sanitizeSocialLinks(parsed.socialLinks);
          return parsed;
        }
      }
    } catch {
      // ignore
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

  const projectsRef = useRef<Project[]>(projects);
  const aboutRef = useRef<AboutData>(aboutData);
  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);
  useEffect(() => {
    aboutRef.current = aboutData;
  }, [aboutData]);

  // 1. Synchronize Projects with Firestore in Real-Time (no automatic seeding)
  useEffect(() => {
    const projectsCol = collection(db, 'projects');
    const unsubscribe = onSnapshot(
      projectsCol,
      snapshot => {
        const rawProjects: Project[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as Project;
          const docId = data.id || docSnap.id;
          if (!DELETED_PROJECT_IDS.has(docSnap.id) && !DELETED_PROJECT_IDS.has(docId)) {
            rawProjects.push(normalizeProject({ ...data, id: docId }));
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
      docSnap => {
        if (!docSnap.exists()) return;
        const data = docSnap.data() as AboutData;
        const sanitizedSocials = sanitizeSocialLinks(data.socialLinks);
        const upgraded: AboutData = {
          ...defaultAboutData,
          ...data,
          socialLinks: sanitizedSocials,
        };

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
    updateAboutData,
  };
}

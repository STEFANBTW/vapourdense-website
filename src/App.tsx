/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { usePortfolioStorage } from './hooks/usePortfolioStorage';
import { Navbar } from './components/Navbar';
import { GallerySection } from './components/GallerySection';
import { AboutSection } from './components/AboutSection';
import { BookingSection } from './components/BookingSection';
import { LoginPage } from './components/LoginPage';
import { ProjectBlogView } from './components/ProjectBlogView';
import { DashboardView } from './components/DashboardView';
import { Project } from './types/portfolio';
import { uploadToCloudinary } from './utils/cloudinary';

export default function App() {
  const {
    projects,
    aboutData,
    isAdmin,
    login,
    logout,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    updateAboutData,
    dbError,
    clearDbError,
  } = usePortfolioStorage();

  // The hook already reports failures through dbError (shown in the banner below) and rolls back
  // the optimistic change, so these wrappers only keep the rejection from going unhandled.
  const swallow = <A extends unknown[], R>(fn: (...args: A) => Promise<R>) => async (...args: A) => {
    try {
      return await fn(...args);
    } catch {
      return undefined;
    }
  };

  const [currentView, setCurrentView] = useState<'portfolio' | 'dashboard' | 'login'>('portfolio');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [isEditingCaseStudy, setIsEditingCaseStudy] = useState<boolean>(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  // Throttled scroll listener to avoid layout recalculation thrash and synchronize bottom bars
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Handle mobile navbar / gallery filter slide in / slide out synchronization
      if (Math.abs(delta) > 4) {
        const nextVisible = !(currentScrollY > lastScrollY.current && currentScrollY > 30);
        setIsMobileNavVisible(prev => (prev !== nextVisible ? nextVisible : prev));
        lastScrollY.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Window-level drag and drop listener
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          handleInitiateImageUpload(file);
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [isAdmin, projects]);

  const safeAddProject = swallow(addProject);
  const safeDeleteProject = swallow(deleteProject);
  const safeResetToDefaults = swallow(resetToDefaults);
  const safeUpdateProject = swallow(updateProject);

  const handleInitiateImageUpload = async (file: File) => {
    if (!isAdmin) {
      setCurrentView('login');
      return;
    }

    try {
      const cdnUrl = await uploadToCloudinary(file);
      const created = await safeAddProject({
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Graphic Design',
        client: 'Bespoke Client',
        year: String(new Date().getFullYear()),
        monthYear: 'October 2026',
        description: 'New creative project portfolio entry.',
        shortDescription: 'New creative project portfolio entry.',
        fullDescription: 'Comprehensive design process and artifact showcase.',
        imageUrl: cdnUrl,
        images: [cdnUrl],
        galleryPictures: [
          {
            id: `gal-${Date.now()}`,
            url: cdnUrl,
            caption: '',
            isAI: false,
          },
        ],
        processSteps: [],
        tags: ['Design', 'Direction'],
        deliverables: [],
        industries: [],
        price: '$18,500 USD',
        duration: '4 Weeks',
        isRealLife: false,
      });
      if (created) setSelectedCaseStudy(created);
    } catch (err) {
      console.error('Failed to upload image to Cloudinary:', err);
      alert('Image upload failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleAddNewProject = async () => {
    const newProj = await safeAddProject({
      title: 'New Untitled Project',
      category: 'Graphic Design',
      client: 'Bespoke Client',
      year: String(new Date().getFullYear()),
      monthYear: 'October 2026',
      description: 'Comprehensive design direction, identity, and spatial craft.',
      shortDescription: 'Comprehensive design direction, identity, and spatial craft.',
      fullDescription: 'Comprehensive process artifacts, typography systems, and delivery.',
      imageUrl: '',
      images: [],
      galleryPictures: [],
      processSteps: [],
      tags: ['Identity', 'Concept'],
      deliverables: [],
      industries: [],
      price: '$24,500 USD',
      duration: '6 Weeks',
      isRealLife: false,
    });
    if (newProj) setSelectedCaseStudy(newProj);
  };

  const visibleProjects = projects.filter(p => !p.isHidden);

  return (
    <div
      className="relative min-h-screen text-slate-800 selection:bg-slate-300 selection:text-slate-900 flex flex-col bg-[#d9d9d9]"
      style={{
        backgroundColor: '#d9d9d9',
      }}
    >
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onNavigateToLogin={() => setCurrentView('login')}
        websiteName={aboutData.websiteName}
        logoUrl={aboutData.logoUrl}
        isMobileNavVisible={isMobileNavVisible}
      />

      {/* Database error banner (admins only): writes/reads are being rejected */}
      {isAdmin && dbError && (
        <div
          role="alert"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-3xl px-4 py-3 rounded-xl bg-red-600 text-white text-sm flex items-start justify-between gap-4 shadow-lg"
        >
          <span>{dbError}</span>
          <button type="button" onClick={clearDbError} className="font-bold cursor-pointer" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 bg-[#d9d9d9]">
        {currentView === 'login' ? (
          <LoginPage
            onLogin={login}
            onSuccess={handleLoginSuccess}
            onCancel={() => setCurrentView('portfolio')}
          />
        ) : currentView === 'portfolio' ? (
          <>
            {/* 1. Gallery Section (curated visible projects) */}
            <GallerySection
              projects={visibleProjects}
              onSelectProject={project => {
                setSelectedCaseStudy(project);
                setIsEditingCaseStudy(false);
              }}
              onDropImage={handleInitiateImageUpload}
              isMobileNavVisible={isMobileNavVisible}
            />
            {/* 2. Booking Section (Positioned before About as requested) */}
            <BookingSection />
            {/* 3. About Section (Synced with Firestore) */}
            <AboutSection data={aboutData} />
          </>
        ) : (
          <DashboardView
            projects={projects}
            aboutData={aboutData}
            onUpdateAbout={updateAboutData}
            onAddNew={handleAddNewProject}
            onEdit={project => {
              // Direct redirect to Project Show for editing as requested
              setSelectedCaseStudy(project);
              setIsEditingCaseStudy(true);
            }}
            onDelete={safeDeleteProject}
            onPreview={project => {
              setSelectedCaseStudy(project);
              setIsEditingCaseStudy(false);
            }}
            onDropImage={handleInitiateImageUpload}
            onResetDefaults={safeResetToDefaults}
            onUpdateProject={safeUpdateProject}
          />
        )}
      </main>

      {/* Minimalist Uncluttered Footer */}
      <footer className="relative z-10 border-t border-slate-300/80 pt-6 pb-16 sm:py-10 bg-[#d9d9d9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Footer (Clean & Uncluttered) */}
          <div className="flex sm:hidden flex-col items-center justify-center gap-1.5 text-center text-xs text-slate-700">
            <span className="font-bold text-slate-900 tracking-wide">
              <span className="font-vapour">VAPOUR</span><span className="font-dense">DENSE</span> <span className="font-virtual-cafe text-xs">VIRTUAL CAFE</span>
            </span>
            <span className="text-[11px] text-slate-500 font-light">
              @2026
            </span>
          </div>

          {/* Desktop Footer */}
          <div className="hidden sm:flex items-center justify-between gap-4 text-xs text-slate-600 font-light">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 tracking-wide">
                <span className="font-vapour">VAPOUR</span><span className="font-dense">DENSE</span> <span className="font-virtual-cafe text-xs">VIRTUAL CAFE</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {aboutData.footerTagline && !aboutData.footerTagline.includes('Creative Direction')
                  ? aboutData.footerTagline
                  : 'a flexible system for your paper workloads'}
              </span>
            </div>

            <div className="flex items-center">
              <span>@2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Full-Screen Project Show (70/30 Dark Layout in #130f30 with Close Icons at top corners) */}
      {selectedCaseStudy && (
        <ProjectBlogView
          project={projects.find(p => p.id === selectedCaseStudy.id) || selectedCaseStudy}
          onClose={() => {
            setSelectedCaseStudy(null);
            setIsEditingCaseStudy(false);
          }}
          allProjects={currentView === 'portfolio' ? visibleProjects : projects}
          onNavigateProject={proj => setSelectedCaseStudy(proj)}
          isEditable={isEditingCaseStudy && isAdmin && currentView === 'dashboard'}
          onUpdateProject={async (id, updated) => {
            setSelectedCaseStudy(prev => (prev && prev.id === id ? { ...prev, ...updated } : prev));
            await updateProject(id, updated);
          }}
        />
      )}
    </div>
  );
}

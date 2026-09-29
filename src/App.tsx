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
import { ArrowUp } from 'lucide-react';

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
  } = usePortfolioStorage();

  const [currentView, setCurrentView] = useState<'portfolio' | 'dashboard' | 'login'>('portfolio');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [isEditingCaseStudy, setIsEditingCaseStudy] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  // Throttled scroll listener to avoid layout recalculation thrash and synchronize bottom bars
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Handle mobile navbar / gallery filter slide in / slide out synchronization
      if (currentScrollY > lastScrollY.current && currentScrollY > 30) {
        setIsMobileNavVisible(false);
      } else {
        setIsMobileNavVisible(true);
      }
      lastScrollY.current = currentScrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = currentScrollY > 400;
          setShowScrollTop(prev => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
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

  const handleInitiateImageUpload = async (file: File) => {
    if (!isAdmin) {
      setCurrentView('login');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const created = await addProject({
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Graphic Design',
        client: 'Bespoke Client',
        year: String(new Date().getFullYear()),
        monthYear: 'October 2026',
        description: 'New creative project portfolio entry.',
        shortDescription: 'New creative project portfolio entry.',
        fullDescription: 'Comprehensive design process and artifact showcase.',
        imageUrl: dataUrl,
        images: [dataUrl],
        tags: ['Design', 'Direction'],
        deliverables: ['Creative Concept', 'Visual Identity'],
        price: '$18,500 USD',
        duration: '4 Weeks',
        isRealLife: false,
      });
      setSelectedCaseStudy(created);
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleAddNewProject = async () => {
    const newProj = await addProject({
      title: 'New Untitled Project',
      category: 'Graphic Design',
      client: 'Bespoke Client',
      year: String(new Date().getFullYear()),
      monthYear: 'October 2026',
      description: 'Comprehensive design direction, identity, and spatial craft.',
      shortDescription: 'Comprehensive design direction, identity, and spatial craft.',
      fullDescription: 'Comprehensive process artifacts, typography systems, and delivery.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80'],
      tags: ['Identity', 'Concept'],
      deliverables: ['Brand Guidelines', 'Digital System'],
      price: '$24,500 USD',
      duration: '6 Weeks',
      isRealLife: false,
    });
    setSelectedCaseStudy(newProj);
  };

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
            {/* 1. Gallery Section (4 curated projects) */}
            <GallerySection
              projects={projects}
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
            onDelete={deleteProject}
            onPreview={project => {
              setSelectedCaseStudy(project);
              setIsEditingCaseStudy(false);
            }}
            onDropImage={handleInitiateImageUpload}
            onResetDefaults={resetToDefaults}
            onUpdateProject={updateProject}
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
              © {new Date().getFullYear()} All rights reserved
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

            <div className="flex items-center gap-4">
              <span>{aboutData.footerLocation || 'Jos, Plateau State // UNIJOS'}</span>
              <span aria-hidden="true">·</span>
              <span>{aboutData.footerRights || 'All rights reserved'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top button (Positioned above mobile bottom bar) */}
      {showScrollTop && currentView === 'portfolio' && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-40 p-2.5 rounded-full bg-white/90 hover:bg-white border border-slate-300 text-slate-800 backdrop-blur-xl shadow-lg transition-all cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Full-Screen Project Show (70/30 Dark Layout in #130f30 with Close Icons at top corners) */}
      {selectedCaseStudy && (
        <ProjectBlogView
          project={projects.find(p => p.id === selectedCaseStudy.id) || selectedCaseStudy}
          onClose={() => {
            setSelectedCaseStudy(null);
            setIsEditingCaseStudy(false);
          }}
          allProjects={projects}
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

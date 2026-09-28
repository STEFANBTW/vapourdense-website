import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UploadCloud, ChevronDown, Check, Palette, Globe, Briefcase } from 'lucide-react';
import { Project } from '../types/portfolio';

interface GallerySectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDropImage: (file: File) => void;
}

export type FilterMode =
  | 'All'
  | 'Graphic Design'
  | 'Web Design'
  | 'Real Life: All'
  | 'Real Life: Graphic Design'
  | 'Real Life: Web Design';

export const GallerySection: React.FC<GallerySectionProps> = ({
  projects,
  onSelectProject,
  onDropImage,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterMode>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleSelectFilter = (filter: FilterMode) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);

    // Graceful smooth animated scroll back to the top of the gallery section
    setTimeout(() => {
      const el = document.getElementById('gallery') || sectionRef.current;
      if (el) {
        const topPos = el.getBoundingClientRect().top + window.pageYOffset - 10;
        window.scrollTo({
          top: Math.max(0, topPos),
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 10);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isRealLifeActive = selectedFilter.startsWith('Real Life');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      let matchesFilter = false;

      if (selectedFilter === 'All') {
        matchesFilter = true;
      } else if (selectedFilter === 'Graphic Design') {
        matchesFilter = project.category === 'Graphic Design';
      } else if (selectedFilter === 'Web Design') {
        matchesFilter = project.category === 'Web Design';
      } else if (selectedFilter === 'Real Life: All') {
        matchesFilter = Boolean(project.isRealLife);
      } else if (selectedFilter === 'Real Life: Graphic Design') {
        matchesFilter = Boolean(project.isRealLife) && project.category === 'Graphic Design';
      } else if (selectedFilter === 'Real Life: Web Design') {
        matchesFilter = Boolean(project.isRealLife) && project.category === 'Web Design';
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        (project.descriptors && project.descriptors.toLowerCase().includes(q)) ||
        (project.threeWordDesc && project.threeWordDesc.toLowerCase().includes(q)) ||
        (project.deliverables && project.deliverables.some(d => d.toLowerCase().includes(q)));

      return matchesFilter && matchesSearch;
    });
  }, [projects, selectedFilter, searchQuery]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onDropImage(file);
      }
    }
  };

  const getDescriptorsText = (project: Project): string => {
    if (project.descriptors && project.descriptors.trim()) {
      return project.descriptors.trim();
    }
    if (project.threeWordDesc && project.threeWordDesc.trim()) {
      const parts = project.threeWordDesc.trim().split(/[,\s]+/).filter(Boolean);
      return parts.join(', ');
    }
    const words = project.description.trim().split(/\s+/).slice(0, 3);
    return words.join(', ') || project.category;
  };

  return (
    <section
      id="gallery"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`py-12 sm:py-16 relative transition-colors ${
        isDragOver ? 'ring-2 ring-sky-400 bg-sky-50/60' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pure 'Gallery' heading without eyebrow text */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 pb-4 border-b border-slate-400/40">
          <div>
            <h1 className="font-phenomena-bold text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#090132]">
              Gallery
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono-numbers text-slate-700 font-medium">
              {filteredProjects.length} projects
            </span>
          </div>
        </div>

        {/* STICKY FILTER BAR & SEARCH BAR: Transparent on mobile, solid #d9d9d9 on desktop */}
        <div
          className="sticky top-0 sm:top-16 z-30 bg-transparent sm:bg-[#d9d9d9] py-2 sm:py-3.5 mb-6 sm:mb-12 transition-all overflow-visible"
        >
          {/* Single line filter container with overflow-visible so dropdown opens on mobile */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 overflow-visible whitespace-nowrap pb-1 sm:pb-0 w-full">
            {/* Filters: All, Graphic Design, Web Design */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-visible">
              <div
                className="flex items-center gap-1 sm:gap-1.5 p-1 bg-white/20 backdrop-blur-md rounded-2xl border border-slate-400/30 shadow-xs"
              >
                {/* Filter 0: All (Always text) */}
                <button
                  type="button"
                  onClick={() => handleSelectFilter('All')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedFilter === 'All'
                      ? 'bg-[#090132] text-white shadow-sm font-semibold'
                      : 'text-slate-900 hover:text-black hover:bg-white/20'
                  }`}
                >
                  All
                </button>

                {/* Filter 1: Graphic Design (Icon on mobile, text on desktop & when active) */}
                <button
                  type="button"
                  onClick={() => handleSelectFilter('Graphic Design')}
                  className={`px-2.5 sm:px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    selectedFilter === 'Graphic Design'
                      ? 'bg-[#090132] text-white shadow-sm font-semibold'
                      : 'text-slate-900 hover:text-black hover:bg-white/20'
                  }`}
                  title="Graphic Design"
                >
                  <Palette className="w-3.5 h-3.5 shrink-0 sm:hidden" />
                  <span className={selectedFilter === 'Graphic Design' ? 'inline' : 'hidden sm:inline'}>
                    Graphic Design
                  </span>
                </button>

                {/* Filter 2: Web Design (Icon on mobile, text on desktop & when active) */}
                <button
                  type="button"
                  onClick={() => handleSelectFilter('Web Design')}
                  className={`px-2.5 sm:px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    selectedFilter === 'Web Design'
                      ? 'bg-[#090132] text-white shadow-sm font-semibold'
                      : 'text-slate-900 hover:text-black hover:bg-white/20'
                  }`}
                  title="Web Design"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0 sm:hidden" />
                  <span className={selectedFilter === 'Web Design' ? 'inline' : 'hidden sm:inline'}>
                    Web Design
                  </span>
                </button>
              </div>

              {/* Filter 3: Real Life Projects Dropdown (Icon on mobile, text on desktop & when active) */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className={`px-3 py-1.5 sm:py-2 text-xs font-medium rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs backdrop-blur-md ${
                    isRealLifeActive
                      ? 'bg-[#090132] text-white border-[#090132] font-semibold'
                      : 'bg-white/20 hover:bg-white/30 border-slate-400/30 text-slate-900'
                  }`}
                  title="Real Life Projects"
                >
                  <Briefcase className="w-3.5 h-3.5 shrink-0 sm:hidden" />
                  <span className={isRealLifeActive ? 'inline' : 'hidden sm:inline'}>
                    {isRealLifeActive
                      ? selectedFilter.replace('Real Life: ', 'Real Life: ')
                      : 'Real Life Projects'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1.5 w-52 sm:w-56 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-300 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] py-1.5 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-800 font-bold border-b border-slate-400/30">
                        Real Life Categories
                      </div>

                      <button
                        onClick={() => handleSelectFilter('Real Life: Graphic Design')}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-900 hover:bg-black/5 hover:text-black flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>Graphic Design</span>
                        {selectedFilter === 'Real Life: Graphic Design' && (
                          <Check className="w-3.5 h-3.5 text-[#090132]" />
                        )}
                      </button>

                      <button
                        onClick={() => handleSelectFilter('Real Life: Web Design')}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-900 hover:bg-black/5 hover:text-black flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>Web Design</span>
                        {selectedFilter === 'Real Life: Web Design' && (
                          <Check className="w-3.5 h-3.5 text-[#090132]" />
                        )}
                      </button>

                      <div className="border-t border-slate-400/30 my-1" />

                      <button
                        onClick={() => handleSelectFilter('Real Life: All')}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-900 hover:bg-black/5 hover:text-black flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>All Real Life Projects</span>
                        {selectedFilter === 'Real Life: All' && (
                          <Check className="w-3.5 h-3.5 text-[#090132]" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sticky Search Bar - fitted in single line with translucent background */}
            <div className="relative shrink-0 w-36 sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-7 pr-2.5 py-1 text-[11px] sm:pl-9 sm:pr-4 sm:py-2 sm:text-xs text-slate-900 placeholder-slate-600 bg-white/20 backdrop-blur-md border border-slate-400/30 rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white/40 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Drag & Drop Visual Hint */}
        {isDragOver && (
          <div className="mb-12 p-8 border-2 border-dashed border-sky-400 rounded-3xl bg-sky-50/80 text-center flex flex-col items-center justify-center gap-2 shadow-inner">
            <UploadCloud className="w-8 h-8 text-sky-500 animate-bounce" />
            <p className="text-sm font-semibold text-slate-800">Drop image to create a new project entry</p>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <p className="text-base text-slate-700 font-medium mb-1">No projects found for {selectedFilter}.</p>
            <p className="text-xs text-slate-500">Try switching filters or clearing your search term.</p>
          </div>
        ) : (
          /* Grid of Circle Cards (2-column on mobile, 3-column on desktop; retains circular shape) */
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-10 sm:gap-12 lg:gap-14"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const heroImage =
                  project.images && project.images.length > 0 ? project.images[0] : null;
                const descriptorsText = getDescriptorsText(project);

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(idx * 0.03, 0.2),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => onSelectProject(project)}
                    className="group cursor-pointer flex flex-col items-center sm:items-stretch"
                  >
                    {/* Circle Card: Retains circular shape */}
                    <div className={`w-[92%] sm:w-[90%] mx-auto aspect-square rounded-full overflow-hidden bg-white ${idx === 0 ? 'border-0' : 'border border-slate-200'} shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)]`}>
                      {heroImage ? (
                        <img
                          src={heroImage}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-mono-numbers text-xs">
                          NO ASSET
                        </div>
                      )}
                    </div>

                    {/* Outside under it: scaled down text on mobile */}
                    <div className="pt-2 sm:pt-4 px-0.5 sm:px-1 w-[95%] sm:w-[90%] mx-auto space-y-0.5 sm:space-y-1.5 text-left">
                      <h3 className="font-phenomena text-[14px] sm:text-[22px] lg:text-[23px] font-bold text-slate-950 group-hover:text-sky-900 transition-colors line-clamp-2 leading-tight tracking-tight">
                        {project.title}
                      </h3>

                      <div className="font-unisans-regular text-[10px] sm:text-xs font-normal text-slate-800 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                        {descriptorsText}
                      </div>

                      <div className="font-unisans-thin text-[9px] sm:text-xs font-[100] sm:font-[200] text-slate-600 line-clamp-2 leading-relaxed">
                        {project.client}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

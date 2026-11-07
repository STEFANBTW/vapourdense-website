import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UploadCloud, ChevronDown, Check, Palette, Globe, Briefcase } from 'lucide-react';
import { Project } from '../types/portfolio';
import { getProjectThumbnail } from '../utils/projectMeta';

interface GallerySectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDropImage: (file: File) => void;
  isMobileNavVisible?: boolean;
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
  isMobileNavVisible,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterMode>('All');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPastGallery, setIsPastGallery] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Collect unique Industry Types and Deliverables from all projects
  const secondaryFilterOptions = useMemo(() => {
    const seen = new Set<string>();
    const industriesList: { key: string; label: string; type: 'industry' | 'deliverable' }[] = [];
    const deliverablesList: { key: string; label: string; type: 'industry' | 'deliverable' }[] = [];

    projects.forEach(project => {
      (project.industries || []).forEach(ind => {
        const trimmed = ind?.trim();
        if (!trimmed) return;
        const norm = trimmed.toLowerCase();
        if (!seen.has(norm)) {
          seen.add(norm);
          industriesList.push({ key: norm, label: trimmed, type: 'industry' });
        }
      });
    });

    projects.forEach(project => {
      (project.deliverables || []).forEach(deliv => {
        const trimmed = deliv?.trim();
        if (!trimmed) return;
        const norm = trimmed.toLowerCase();
        if (!seen.has(norm)) {
          seen.add(norm);
          deliverablesList.push({ key: norm, label: trimmed, type: 'deliverable' });
        }
      });
    });

    return [...industriesList, ...deliverablesList];
  }, [projects]);

  const scrollToGalleryTop = () => {
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

  // Keep filter bar strictly confined within the Gallery section on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const navOffset = isMobileNavVisible !== false ? 44 : 0;
      // When the bottom edge of the gallery reaches or passes above the bottom threshold
      const threshold = window.innerHeight - navOffset;
      setIsPastGallery(rect.bottom <= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobileNavVisible]);

  const handleSelectFilter = (filter: FilterMode) => {
    setSelectedFilter(filter);
    if (filter === 'All') {
      setSelectedSubFilter(null);
    } else if (selectedSubFilter) {
      const hasMatchInNewCategory = projects.some(project => {
        let matchesCat = false;
        if (filter === 'Graphic Design') matchesCat = project.category === 'Graphic Design';
        else if (filter === 'Web Design') matchesCat = project.category === 'Web Design';
        else if (filter === 'Real Life: All') matchesCat = Boolean(project.isRealLife);
        else if (filter === 'Real Life: Graphic Design') matchesCat = Boolean(project.isRealLife) && project.category === 'Graphic Design';
        else if (filter === 'Real Life: Web Design') matchesCat = Boolean(project.isRealLife) && project.category === 'Web Design';
        const matchesSub =
          (project.industries && project.industries.some(i => i?.trim().toLowerCase() === selectedSubFilter)) ||
          (project.deliverables && project.deliverables.some(d => d?.trim().toLowerCase() === selectedSubFilter));
        return matchesCat && matchesSub;
      });
      if (!hasMatchInNewCategory) {
        setSelectedSubFilter(null);
      }
    }
    setIsDropdownOpen(false);
    scrollToGalleryTop();
  };

  const handleSelectSubFilter = (subKey: string | null) => {
    setSelectedSubFilter(subKey);
    scrollToGalleryTop();
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

      const matchesSubFilter =
        !selectedSubFilter ||
        (project.industries &&
          project.industries.some(ind => ind?.trim().toLowerCase() === selectedSubFilter)) ||
        (project.deliverables &&
          project.deliverables.some(d => d?.trim().toLowerCase() === selectedSubFilter));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        (project.descriptors && project.descriptors.toLowerCase().includes(q)) ||
        (project.threeWordDesc && project.threeWordDesc.toLowerCase().includes(q)) ||
        (project.deliverables && project.deliverables.some(d => d.toLowerCase().includes(q))) ||
        (project.industries && project.industries.some(ind => ind.toLowerCase().includes(q)));

      return matchesFilter && matchesSubFilter && matchesSearch;
    });
  }, [projects, selectedFilter, selectedSubFilter, searchQuery]);

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
      ref={sectionRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`pt-3 sm:pt-4 pb-28 sm:pb-16 relative transition-colors ${
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

        {/* STICKY FILTER BAR & SEARCH BAR: Confined strictly to Gallery section on mobile (<sm), sticky top-16 on tablet/desktop (>=sm) */}
        <div
          className={`z-30 left-0 right-0 sm:left-auto sm:right-auto px-4 sm:px-0 py-2 sm:py-3.5 mb-0 sm:mb-12 transition-[bottom,transform,background-color] duration-300 ease-in-out overflow-visible bg-[#d9d9d9]/95 backdrop-blur-md sm:bg-[#d9d9d9] border-t border-slate-300/80 sm:border-0 shadow-lg sm:shadow-none sm:sticky sm:top-16 sm:bottom-auto ${
            isPastGallery
              ? 'max-sm:absolute max-sm:bottom-0'
              : `max-sm:fixed ${isMobileNavVisible !== false ? 'max-sm:bottom-11' : 'max-sm:bottom-0'}`
          }`}
        >
          {/* Single line filter container with overflow-visible so dropdown opens on mobile */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 overflow-visible whitespace-nowrap pb-0 w-full max-w-7xl mx-auto">
            {/* Left & Center Group: Fixed Main Filters + Separate Horizontally Scrollable Industry & Deliverable Filters */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 overflow-visible">
              {/* Main Filters: All, Graphic Design, Web Design + Real Life Dropdown (shrink-0, never scrolls) */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-visible">
                <div
                  className="h-9 sm:h-10 flex items-center gap-1 sm:gap-1.5 p-1 bg-white/20 backdrop-blur-md rounded-2xl border border-slate-400/30 shadow-xs"
                >
                  {/* Filter 0: All (Always text) */}
                  <button
                    type="button"
                    onClick={() => handleSelectFilter('All')}
                    className={`h-full px-3 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      selectedFilter === 'All' && !selectedSubFilter
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
                    className={`h-full px-2.5 sm:px-3.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 justify-center ${
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
                    className={`h-full px-2.5 sm:px-3.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 justify-center ${
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
                    className={`h-9 sm:h-10 px-3 text-xs font-medium rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs backdrop-blur-md ${
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

                  {/* Dropdown Menu (Opens upwards on mobile at bottom, downwards on desktop) */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-1.5 w-52 sm:w-56 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-300 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] py-1.5 z-50 overflow-hidden"
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

              {secondaryFilterOptions.length > 0 && (
                <div className="h-5 w-px bg-slate-400/40 shrink-0 mx-0.5" aria-hidden="true" />
              )}

              {/* Separate Horizontally Scrollable Div for Industry Types & Deliverables */}
              <div
                onWheel={e => {
                  const container = e.currentTarget;
                  if (container.scrollWidth > container.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    container.scrollLeft += e.deltaY;
                  }
                }}
                className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center gap-1 sm:gap-1.5"
                aria-label="Industry and deliverable filters"
              >
                {secondaryFilterOptions.map(option => {
                  const isActive = selectedSubFilter === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => handleSelectSubFilter(isActive ? null : option.key)}
                      className={`h-9 sm:h-10 px-3 text-xs font-medium rounded-2xl border whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs backdrop-blur-md ${
                        isActive
                          ? 'bg-[#090132] text-white border-[#090132] font-semibold'
                          : 'bg-white/20 hover:bg-white/30 border-slate-400/30 text-slate-900 hover:text-black'
                      }`}
                      title={`${option.type === 'industry' ? 'Industry' : 'Deliverable'}: ${option.label}`}
                    >
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sticky Search Bar - unified height with distinct magnifying glass icon */}
            <div className="h-9 sm:h-10 relative shrink-0 flex items-center">
              <Search className="w-4 h-4 text-slate-700 absolute left-3 pointer-events-none z-10 shrink-0" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-full w-28 focus:w-36 sm:w-48 lg:w-56 pl-9 pr-3 text-[12px] sm:text-xs text-slate-900 placeholder-slate-600 bg-white/20 backdrop-blur-md border border-slate-400/30 rounded-2xl focus:outline-none focus:border-slate-800 focus:bg-white/40 transition-all shadow-xs"
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
                const heroImage = getProjectThumbnail(project);
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
                    {/* Circle Card: Retains circular shape, only drop shadow on hover (no scale/grow) */}
                    <div className={`w-[92%] sm:w-[90%] mx-auto aspect-square rounded-full overflow-hidden bg-white ${idx === 0 ? 'border-0' : 'border border-slate-200'} shadow-sm transition-shadow duration-300 ease-out hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)]`}>
                      {heroImage ? (
                        <img
                          src={heroImage}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200/50" />
                      )}
                    </div>

                    {/* Outside under it: scaled down text on mobile */}
                    <div className="pt-2 sm:pt-4 px-0.5 sm:px-1 w-[95%] sm:w-[90%] mx-auto space-y-0.5 sm:space-y-1.5 text-left">
                      <h3 className="font-phenomena text-[17px] sm:text-[22px] lg:text-[23px] font-bold text-slate-950 transition-colors line-clamp-2 leading-tight tracking-tight">
                        {project.title}
                      </h3>

                      <div className="font-unisans-regular text-[12px] sm:text-xs font-normal text-slate-800 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                        {descriptorsText}
                      </div>

                      <div className="font-unisans-thin text-[11px] sm:text-xs font-[100] sm:font-[200] text-slate-600 line-clamp-2 leading-relaxed">
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

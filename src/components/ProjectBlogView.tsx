import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Sparkles,
  CheckCircle2,
  Maximize2,
  MessageSquare,
  Mic,
  Image as ImageIcon,
  Trash2,
  Plus,
  Link2,
  Save,
  Check,
  UploadCloud,
  Sliders,
  Minus,
} from 'lucide-react';
import { Project, ProcessPicture, GalleryPicture, ClientRemarkType, ProcessStep } from '../types/portfolio';

interface ProjectBlogViewProps {
  project: Project | null;
  onClose: () => void;
  allProjects: Project[];
  onNavigateProject: (project: Project) => void;
  isEditable?: boolean;
  onUpdateProject?: (id: string, updated: Partial<Project>) => Promise<void> | void;
}

interface ExpandedImageState {
  url: string;
  caption?: string;
  isAI?: boolean;
  type?: 'AI' | 'Final';
  title?: string;
}

export const ProjectBlogView: React.FC<ProjectBlogViewProps> = ({
  project: initialProject,
  onClose,
  allProjects,
  onNavigateProject,
  isEditable = false,
  onUpdateProject,
}) => {
  // Local project state to manage edits without auto-saving until explicit click
  const [currentProject, setCurrentProject] = useState<Project>(() => initialProject || allProjects[0]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  // Image size slider state (initialized from project's saved scale)
  const [imageScalePercent, setImageScalePercent] = useState<number>(() => initialProject?.imageScalePercent || 100);

  // Modal for big picture expansion
  const [expandedImage, setExpandedImage] = useState<ExpandedImageState | null>(null);

  // Active client remark type
  const [activeRemarkType, setActiveRemarkType] = useState<ClientRemarkType>('voice');

  // Mobile active pane switcher ('gallery_process' | 'other_details')
  const [mobileActivePane, setMobileActivePane] = useState<'gallery_process' | 'other_details'>('gallery_process');

  // Voice note audio player state
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<number | null>(null);

  // File input refs for uploading from local device
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);
  const processFileInputRef = useRef<HTMLInputElement | null>(null);
  const newProcessFileInputRef = useRef<HTMLInputElement | null>(null);
  const remarkAudioFileInputRef = useRef<HTMLInputElement | null>(null);
  const remarkPictureFileInputRef = useRef<HTMLInputElement | null>(null);
  const activeProcessStepIndexRef = useRef<number>(0);

  // State for Add Image by Link modal
  const [linkModalTarget, setLinkModalTarget] = useState<'gallery' | { stepIndex: number } | 'newProcess' | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageCaptionInput, setImageCaptionInput] = useState('');
  const [imageIsAI, setImageIsAI] = useState(false);
  const [imageType, setImageType] = useState<'AI' | 'Final'>('Final');

  // State for "Add Process" creation form at the end of Process section
  const [isAddingProcess, setIsAddingProcess] = useState(false);
  const [newProcessName, setNewProcessName] = useState('');
  const [newProcessDescription, setNewProcessDescription] = useState('');
  const [newProcessPictures, setNewProcessPictures] = useState<ProcessPicture[]>([]);

  // Deliverable input state
  const [newDeliverableText, setNewDeliverableText] = useState('');

  // Synchronize internal project state when initialProject changes
  useEffect(() => {
    if (initialProject) {
      setCurrentProject(initialProject);
      setImageScalePercent(initialProject.imageScalePercent || 100);
      setHasUnsavedChanges(false);
      if (initialProject.clientRemark?.type) {
        setActiveRemarkType(initialProject.clientRemark.type);
      } else {
        setActiveRemarkType('voice');
      }
      setIsPlayingVoice(false);
      setVoicePlaybackProgress(0);
      setExpandedImage(null);
      setIsAddingProcess(false);
      setMobileActivePane('gallery_process');
    }
  }, [initialProject]);

  // Handle keyboard shortcuts (Esc to close, Left/Right for project navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedImage) {
        if (e.key === 'Escape') {
          setExpandedImage(null);
        }
        return;
      }

      if (linkModalTarget) {
        if (e.key === 'Escape') {
          setLinkModalTarget(null);
        }
        return;
      }

      // If user is typing in an input/textarea in editable mode, don't trigger Esc or arrows
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      if (isInput) return;

      if (e.key === 'Escape') {
        onClose();
      }

      if (!currentProject) return;
      const currentIndex = allProjects.findIndex(p => p.id === currentProject.id);

      if (e.key === 'ArrowRight' && currentIndex < allProjects.length - 1) {
        onNavigateProject(allProjects[currentIndex + 1]);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigateProject(allProjects[currentIndex - 1]);
      }
    };

    if (currentProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      stopAudioPlayback();
    };
  }, [currentProject, allProjects, onNavigateProject, onClose, expandedImage, linkModalTarget]);

  // Audio simulation for voice note
  const startAudioPlayback = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.value = 650;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(196, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch {
      // AudioContext unavailable in silent sandbox
    }

    setIsPlayingVoice(true);

    const startTime = Date.now();
    const durationMs = 12000;

    if (audioTimerRef.current) {
      window.clearInterval(audioTimerRef.current);
    }

    audioTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / durationMs) * 100);
      setVoicePlaybackProgress(progress);

      if (progress >= 100) {
        stopAudioPlayback();
      }
    }, 100);
  };

  const stopAudioPlayback = () => {
    setIsPlayingVoice(false);
    if (audioTimerRef.current) {
      window.clearInterval(audioTimerRef.current);
      audioTimerRef.current = null;
    }
  };

  const toggleVoicePlayback = () => {
    if (isPlayingVoice) {
      stopAudioPlayback();
    } else {
      if (voicePlaybackProgress >= 100) {
        setVoicePlaybackProgress(0);
      }
      startAudioPlayback();
    }
  };

  if (!currentProject) return null;

  const currentIndex = allProjects.findIndex(p => p.id === currentProject.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  // Fallback gallery pictures
  const effectiveGallery: GalleryPicture[] = currentProject.galleryPictures && currentProject.galleryPictures.length > 0
    ? currentProject.galleryPictures
    : currentProject.images.map((img, idx) => ({
        id: `gal-${idx}`,
        url: img,
        caption: `${currentProject.title} — Visual Asset ${idx + 1}`,
        isAI: idx % 2 === 1,
      }));

  // Fallback process steps
  const effectiveProcessSteps: ProcessStep[] = currentProject.processSteps && currentProject.processSteps.length > 0
    ? currentProject.processSteps
    : [
        {
          id: 'step-auto-1',
          name: 'Phase 01: Concept Exploration & Generative Prototyping',
          description: `Iterative discovery exploring core design themes for ${currentProject.client}. Combining algorithmic AI prompt synthesis with bespoke typography structures.`,
          pictures: [
            {
              id: 'pic-proc-1',
              url: currentProject.images[0] || '',
              caption: 'AI generative visual exploration assessing spatial hierarchy and palette mood.',
              type: 'AI',
            },
            {
              id: 'pic-proc-2',
              url: currentProject.images[1] || currentProject.images[0] || '',
              caption: 'Refined composition and component matrix engineered for production.',
              type: 'Final',
            },
          ],
        },
      ];

  const remark = currentProject.clientRemark || {
    type: 'voice',
    comment: `“Working with VDVC completely transformed our digital positioning. The craftsmanship and attention to detail are world-class.”`,
    clientAuthor: `${currentProject.client} Leadership`,
    voiceDuration: '0:42',
    voiceDate: currentProject.monthYear || `${currentProject.year}`,
  };

  // Local update handler (No auto-saving, marks as unsaved)
  const updateProjectLocal = (updated: Partial<Project>) => {
    setCurrentProject(prev => ({ ...prev, ...updated }));
    setHasUnsavedChanges(true);
  };

  const handleScaleChange = (scale: number) => {
    const bounded = Math.max(50, Math.min(250, scale));
    setImageScalePercent(bounded);
    updateProjectLocal({ imageScalePercent: bounded });
  };

  // Explicit Save Changes button click
  const handleSaveChanges = async () => {
    if (onUpdateProject && currentProject) {
      await onUpdateProject(currentProject.id, currentProject);
      setHasUnsavedChanges(false);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  // ---------------------------------------------------------------------------
  // Gallery Picture Handlers
  // ---------------------------------------------------------------------------
  const handleDeleteGalleryPicture = (index: number) => {
    const updated = effectiveGallery.filter((_, i) => i !== index);
    updateProjectLocal({ galleryPictures: updated });
  };

  const handleToggleGalleryAI = (index: number) => {
    const updated = effectiveGallery.map((pic, i) =>
      i === index ? { ...pic, isAI: !pic.isAI } : pic
    );
    updateProjectLocal({ galleryPictures: updated });
  };

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        const newPic: GalleryPicture = {
          id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url: resultUrl,
          caption: `${currentProject.title} — New Asset`,
          isAI: false,
        };
        const updated = [...effectiveGallery, newPic];
        updateProjectLocal({ galleryPictures: updated });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // ---------------------------------------------------------------------------
  // Process Picture Handlers
  // ---------------------------------------------------------------------------
  const handleDeleteProcessPicture = (stepIndex: number, picIndex: number) => {
    const updatedSteps = effectiveProcessSteps.map((step, sIdx) => {
      if (sIdx !== stepIndex) return step;
      return {
        ...step,
        pictures: step.pictures.filter((_, pIdx) => pIdx !== picIndex),
      };
    });
    updateProjectLocal({ processSteps: updatedSteps });
  };

  const handleToggleProcessPictureType = (stepIndex: number, picIndex: number) => {
    const updatedSteps = effectiveProcessSteps.map((step, sIdx) => {
      if (sIdx !== stepIndex) return step;
      return {
        ...step,
        pictures: step.pictures.map((pic, pIdx) => {
          if (pIdx !== picIndex) return pic;
          return {
            ...pic,
            type: (pic.type === 'AI' ? 'Final' : 'AI') as 'AI' | 'Final',
          };
        }),
      };
    });
    updateProjectLocal({ processSteps: updatedSteps });
  };

  const handleProcessFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const stepIdx = activeProcessStepIndexRef.current;
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        const newPic: ProcessPicture = {
          id: `proc-pic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url: resultUrl,
          caption: 'Process visual artifact.',
          type: 'Final',
        };
        const updatedSteps = effectiveProcessSteps.map((step, sIdx) => {
          if (sIdx !== stepIdx) return step;
          return {
            ...step,
            pictures: [...step.pictures, newPic],
          };
        });
        updateProjectLocal({ processSteps: updatedSteps });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleUpdateStepName = (stepIndex: number, newName: string) => {
    const updatedSteps = effectiveProcessSteps.map((step, sIdx) =>
      sIdx === stepIndex ? { ...step, name: newName } : step
    );
    updateProjectLocal({ processSteps: updatedSteps });
  };

  const handleUpdateStepDesc = (stepIndex: number, newDesc: string) => {
    const updatedSteps = effectiveProcessSteps.map((step, sIdx) =>
      sIdx === stepIndex ? { ...step, description: newDesc } : step
    );
    updateProjectLocal({ processSteps: updatedSteps });
  };

  const handleDeleteStep = (stepIndex: number) => {
    if (window.confirm('Delete this process phase?')) {
      const updatedSteps = effectiveProcessSteps.filter((_, sIdx) => sIdx !== stepIndex);
      updateProjectLocal({ processSteps: updatedSteps });
    }
  };

  // ---------------------------------------------------------------------------
  // Remark Audio & Picture Upload Handlers
  // ---------------------------------------------------------------------------
  const handleRemarkAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        updateProjectLocal({
          clientRemark: {
            ...remark,
            type: 'voice',
            voiceAudioUrl: resultUrl,
          },
        });
        setActiveRemarkType('voice');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleRemarkPictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        updateProjectLocal({
          clientRemark: {
            ...remark,
            type: 'picture',
            pictureUrl: resultUrl,
          },
        });
        setActiveRemarkType('picture');
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleDeleteClientRemark = () => {
    updateProjectLocal({
      clientRemark: {
        type: 'none',
        comment: '',
        clientAuthor: '',
        voiceAudioUrl: '',
        pictureUrl: '',
      },
    });
    setActiveRemarkType('none');
    stopAudioPlayback();
  };

  // ---------------------------------------------------------------------------
  // Add Process Step Form Handlers
  // ---------------------------------------------------------------------------
  const handleNewProcessFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        const newPic: ProcessPicture = {
          id: `np-pic-${Date.now()}`,
          url: resultUrl,
          caption: 'Process step artifact.',
          type: 'Final',
        };
        setNewProcessPictures(prev => [...prev, newPic]);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleConfirmAddProcess = () => {
    if (!newProcessName.trim()) {
      alert('Please enter a process step name');
      return;
    }
    const newStep: ProcessStep = {
      id: `step-${Date.now()}`,
      name: newProcessName.trim(),
      description: newProcessDescription.trim() || 'Comprehensive design & development documentation.',
      pictures: newProcessPictures.length > 0 ? newProcessPictures : (currentProject.images[0] ? [{
        id: `np-pic-${Date.now()}`,
        url: currentProject.images[0],
        caption: 'Design process documentation.',
        type: 'Final',
      }] : []),
    };

    const updatedSteps = [...effectiveProcessSteps, newStep];
    updateProjectLocal({ processSteps: updatedSteps });

    // Reset form
    setNewProcessName('');
    setNewProcessDescription('');
    setNewProcessPictures([]);
    setIsAddingProcess(false);
  };

  // ---------------------------------------------------------------------------
  // Modal for Adding Image via Link
  // ---------------------------------------------------------------------------
  const handleConfirmAddByLink = () => {
    if (!imageUrlInput.trim()) return;

    if (linkModalTarget === 'gallery') {
      const newPic: GalleryPicture = {
        id: `gal-${Date.now()}`,
        url: imageUrlInput.trim(),
        caption: imageCaptionInput.trim() || `${currentProject.title} — Visual Asset`,
        isAI: imageIsAI,
      };
      const updated = [...effectiveGallery, newPic];
      updateProjectLocal({ galleryPictures: updated });
    } else if (linkModalTarget && typeof linkModalTarget === 'object' && 'stepIndex' in linkModalTarget) {
      const stepIdx = linkModalTarget.stepIndex;
      const newPic: ProcessPicture = {
        id: `proc-pic-${Date.now()}`,
        url: imageUrlInput.trim(),
        caption: imageCaptionInput.trim() || 'Process artifact.',
        type: imageType,
      };
      const updatedSteps = effectiveProcessSteps.map((step, sIdx) => {
        if (sIdx !== stepIdx) return step;
        return {
          ...step,
          pictures: [...step.pictures, newPic],
        };
      });
      updateProjectLocal({ processSteps: updatedSteps });
    } else if (linkModalTarget === 'newProcess') {
      const newPic: ProcessPicture = {
        id: `np-pic-${Date.now()}`,
        url: imageUrlInput.trim(),
        caption: imageCaptionInput.trim() || 'Process step artifact.',
        type: imageType,
      };
      setNewProcessPictures(prev => [...prev, newPic]);
    }

    // Reset
    setImageUrlInput('');
    setImageCaptionInput('');
    setImageIsAI(false);
    setImageType('Final');
    setLinkModalTarget(null);
  };

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scaled down appropriately for mobile screens in mobile view:
  // Mobile (<640px): 230px base for gallery cards, 185px base for process cards
  // Tablet (640px-1024px): 300px base for gallery cards, 240px base for process cards
  // Desktop (>=1024px): 360px base for gallery cards, 280px base for process cards
  const baseGalleryWidth = windowWidth < 640 ? 230 : windowWidth < 1024 ? 300 : 360;
  const baseProcessWidth = windowWidth < 640 ? 185 : windowWidth < 1024 ? 240 : 280;
  const galleryCardPixelWidth = Math.max(150, Math.round(baseGalleryWidth * (imageScalePercent / 100)));
  const processCardPixelWidth = Math.max(120, Math.round(baseProcessWidth * (imageScalePercent / 100)));

  return (
    <div
      className="fixed inset-0 z-50 h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col overscroll-contain selection:bg-[#003663] selection:text-white"
      style={{ backgroundColor: '#130f30' }}
    >
      {/* Hidden file inputs for local device uploads */}
      <input
        type="file"
        ref={galleryFileInputRef}
        onChange={handleGalleryFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={processFileInputRef}
        onChange={handleProcessFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={newProcessFileInputRef}
        onChange={handleNewProcessFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={remarkAudioFileInputRef}
        onChange={handleRemarkAudioUpload}
        accept="audio/*"
        className="hidden"
      />
      <input
        type="file"
        ref={remarkPictureFileInputRef}
        onChange={handleRemarkPictureUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Utility Bar (Always Sticky at top) */}
      <header className="sticky top-0 z-40 h-[52px] shrink-0 w-full bg-[#130f30] px-4 sm:px-6 flex items-center justify-between text-white/70 border-b border-white/5">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="font-unisans-thin-caps text-sm sm:text-base uppercase tracking-wider text-white/90">
            Project Details
          </span>

          {/* Project switcher dropdown when in editable mode */}
          {isEditable && allProjects.length > 1 && (
            <select
              value={currentProject.id || ''}
              onChange={e => {
                const target = allProjects.find(p => p.id === e.target.value);
                if (target) onNavigateProject(target);
              }}
              className="px-3 py-1.5 text-xs sm:text-sm font-unisans-regular rounded-xl bg-white/10 border-0 text-white focus:outline-none focus:ring-1 focus:ring-white/40 cursor-pointer hidden md:block"
            >
              {allProjects.map(p => (
                <option key={p.id} value={p.id} className="bg-[#130f30] text-white">
                  {p.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Center Indicator */}
        <div className="flex items-center gap-2 text-sm sm:text-base font-unisans-regular text-white/60 tracking-wider">
          <span className="text-white font-normal">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span>/</span>
          <span>{String(allProjects.length).padStart(2, '0')}</span>
        </div>

        {/* Right side controls with Explicit "Save Changes" Button (No Auto-Save) & Close Icon */}
        <div className="flex items-center gap-3">
          {isEditable && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveChanges}
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-unisans-regular flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  hasUnsavedChanges
                    ? 'bg-white/20 text-white hover:bg-white/30 ring-1 ring-white/40'
                    : isSavedNotice
                    ? 'bg-white/25 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavedNotice ? 'Saved!' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
              </button>
            </div>
          )}

          {/* Top-right Close Icon (Always visible on all screens) */}
          <button
            onClick={onClose}
            className="flex p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer bg-transparent border-0"
            title="Close Project Details (Esc)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
          </button>
        </div>
      </header>

      {/* TABLET ONLY: Pane Selector Slider sticky at top right beneath header */}
      <div className="hidden sm:flex lg:hidden shrink-0 sticky top-[52px] z-30 px-4 py-2 bg-[#130f30]/95 backdrop-blur-md border-b border-white/10 items-center justify-center">
        <div className="flex items-center p-1 bg-white/10 rounded-2xl border border-white/10 w-full max-w-sm relative">
          <button
            type="button"
            onClick={() => setMobileActivePane('gallery_process')}
            className={`flex-1 py-1.5 px-3 text-xs font-unisans-regular rounded-xl transition-colors relative z-10 text-center cursor-pointer ${
              mobileActivePane === 'gallery_process'
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {mobileActivePane === 'gallery_process' && (
              <motion.div
                layoutId="showroom-tablet-top-slider"
                className="absolute inset-0 bg-white/20 rounded-xl -z-10 shadow-sm border border-white/25"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            Gallery &amp; Process
          </button>

          <button
            type="button"
            onClick={() => setMobileActivePane('other_details')}
            className={`flex-1 py-1.5 px-3 text-xs font-unisans-regular rounded-xl transition-colors relative z-10 text-center cursor-pointer ${
              mobileActivePane === 'other_details'
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {mobileActivePane === 'other_details' && (
              <motion.div
                layoutId="showroom-tablet-top-slider"
                className="absolute inset-0 bg-white/20 rounded-xl -z-10 shadow-sm border border-white/25"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            Project Details
          </button>
        </div>
      </div>

      {/* Main Full-Screen Layout */}
      <div className="flex-1 w-full flex flex-row overflow-hidden min-h-0 py-0">
        {/* SLIM LEFT COLUMN: PREVIOUS ARROW ONLY */}
        <aside
          aria-label="Previous project navigation"
          className="w-8 sm:w-10 md:w-12 lg:w-16 shrink-0 flex items-center justify-center h-full z-20 bg-transparent border-0"
        >
          <button
            disabled={!prevProject}
            onClick={() => prevProject && onNavigateProject(prevProject)}
            className={`p-2 transition-colors duration-[250ms] ease-out cursor-pointer bg-transparent border-0 ${
              prevProject
                ? 'text-white/40 hover:text-white/90'
                : 'text-white/10 cursor-not-allowed'
            }`}
            title={prevProject ? `Previous: ${prevProject.title}` : 'No previous project'}
          >
            <ChevronLeft
              className="w-6 h-6 sm:w-7 sm:h-7"
              strokeWidth={1.96}
              style={{ transform: 'scaleX(0.98)' }}
            />
          </button>
        </aside>

        {/* MAIN SECTION: IN ONE BOX THAT SPANS 80vw AND CLAMPS AT 2000px (Borderless, 100% height, touching header) */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0 min-h-0 h-full overflow-hidden w-full lg:w-[80vw] lg:max-w-[2000px] lg:mx-auto lg:rounded-none lg:border-0 bg-transparent lg:bg-transparent">
          {/* LEFT PANEL: GALLERY & PROCESS */}
          <div
            className={`w-full lg:w-[70%] lg:border-r border-white/10 p-5 sm:p-7 md:p-8 flex-col space-y-8 sm:space-y-10 min-w-0 min-h-0 h-full overflow-y-auto no-scrollbar ${
              mobileActivePane === 'gallery_process' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            
            {/* SECTION 1: GALLERY */}
            <section aria-labelledby="gallery-title" className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
                <h2
                  id="gallery-title"
                  className="font-phenomena-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-wide leading-none"
                >
                  Gallery
                </h2>

                {/* Interactive Image Scale Slider (only in edit mode) */}
                {isEditable && (
                  <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 text-white/80">
                      <Sliders className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-unisans-regular uppercase tracking-wider">
                        Size: {imageScalePercent}%
                      </span>
                    </div>

                    {/* Decrement button */}
                    <button
                      type="button"
                      onClick={() => handleScaleChange(imageScalePercent - 10)}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Decrease image size"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    {/* Range Slider */}
                    <input
                      type="range"
                      min={50}
                      max={250}
                      step={5}
                      value={imageScalePercent}
                      onChange={e => handleScaleChange(Number(e.target.value))}
                      className="w-24 sm:w-32 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                      title={`Image scale: ${imageScalePercent}%`}
                    />

                    {/* Increment button */}
                    <button
                      type="button"
                      onClick={() => handleScaleChange(imageScalePercent + 10)}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Increase image size"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleScaleChange(100)}
                      className="text-[11px] font-unisans-regular text-white/80 hover:text-white px-2 py-0.5 rounded bg-white/10 border border-white/20 transition-colors cursor-pointer"
                      title="Reset to 100% default"
                    >
                      Default
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Pictures arranged horizontally */}
              <div className="flex flex-row items-start gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar min-w-0">
                {effectiveGallery.map((pic, idx) => {
                  const isAIGenerated = Boolean(pic.isAI);

                  return (
                    <div
                      key={pic.id || idx}
                      style={{ width: `${galleryCardPixelWidth}px` }}
                      className="shrink-0 group relative transition-all duration-200"
                    >
                      {/* Image Container preserving natural 16:10 aspect ratio */}
                      <div className="relative rounded-2xl overflow-hidden transition-transform duration-300">
                        <div
                          onClick={() => {
                            if (!isEditable) {
                              setExpandedImage({
                                url: pic.url,
                                caption: pic.caption,
                                isAI: isAIGenerated,
                                title: `${currentProject.title} — Gallery Asset ${idx + 1}`,
                              });
                            }
                          }}
                          className={`relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0d0a22] shadow-lg transition-shadow duration-300 hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.65)] ${
                            isEditable ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <img
                            src={pic.url}
                            alt={pic.caption || `Gallery asset ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />

                          {/* AI / Asset Badge */}
                          <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                            {isEditable ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleGalleryAI(idx);
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-unisans-regular tracking-wide transition-all cursor-pointer ${
                                  isAIGenerated
                                    ? 'bg-black/80 text-white border border-white/40 shadow-md'
                                    : 'bg-black/70 text-white/70 border border-white/15 hover:text-white'
                                }`}
                                title="Click to toggle AI filter"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-white" />
                                <span>{isAIGenerated ? 'AI ON' : 'AI OFF'}</span>
                              </button>
                            ) : (
                              isAIGenerated && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-unisans-regular tracking-wide bg-black/80 text-white border border-white/30 backdrop-blur-md shadow-sm">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                  <span>AI Generated</span>
                                </span>
                              )
                            )}
                          </div>

                          {/* Delete Icon on top of every picture (Dashboard) */}
                          {isEditable && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGalleryPicture(idx);
                              }}
                              className="absolute top-2 right-2 z-20 w-8 h-8 rounded-xl bg-black/80 hover:bg-black text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border border-white/30"
                              title="Delete this image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Hover Overlay for viewing */}
                          {!isEditable && (
                            <div className="absolute inset-x-0 bottom-0 pt-10 pb-2 px-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end">
                              <p className="text-xs sm:text-sm text-white/95 font-unisans-regular leading-snug line-clamp-2">
                                {pic.caption || `${currentProject.title} — Visual Asset`}
                              </p>
                              <span className="text-[10px] font-unisans-regular text-white/80 mt-1 inline-flex items-center gap-1">
                                <Maximize2 className="w-2.5 h-2.5" /> Enlarge
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Editable caption in dashboard */}
                      {isEditable && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={pic.caption || ''}
                            onChange={e => {
                              const updated = effectiveGallery.map((p, i) =>
                                i === idx ? { ...p, caption: e.target.value } : p
                              );
                              updateProjectLocal({ galleryPictures: updated });
                            }}
                            placeholder="Image caption..."
                            className="w-full px-2.5 py-1 text-xs font-unisans-regular text-white/90 bg-white/5 focus:bg-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/40 border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Image Buttons (URL Link and Device Upload) */}
                {isEditable && (
                  <div
                    style={{ width: `${Math.max(80, Math.round(120 * (imageScalePercent / 100)))}px` }}
                    className="flex flex-col items-center justify-center gap-3 p-3 rounded-2xl bg-white/5 border border-dashed border-white/20 shrink-0 self-stretch min-h-[140px]"
                  >
                    <button
                      type="button"
                      onClick={() => setLinkModalTarget('gallery')}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md group border border-white/20"
                      title="Add image via Link"
                    >
                      <Link2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="h-3 w-px bg-white/15" />

                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md group border border-white/20"
                      title="Upload image from device"
                    >
                      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2: PROCESS */}
            <section aria-labelledby="process-title" className="pt-2 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                <h2
                  id="process-title"
                  className="font-phenomena-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-wide leading-none"
                >
                  Process
                </h2>

                {/* Interactive Image Scale Slider also available in Process when in edit mode */}
                {isEditable && (
                  <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 text-white/80">
                      <Sliders className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-unisans-regular uppercase tracking-wider">
                        Size: {imageScalePercent}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleScaleChange(imageScalePercent - 10)}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Decrease image size"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <input
                      type="range"
                      min={50}
                      max={250}
                      step={5}
                      value={imageScalePercent}
                      onChange={e => handleScaleChange(Number(e.target.value))}
                      className="w-24 sm:w-32 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                      title={`Image scale: ${imageScalePercent}%`}
                    />

                    <button
                      type="button"
                      onClick={() => handleScaleChange(imageScalePercent + 10)}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Increase image size"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleScaleChange(100)}
                      className="text-[11px] font-unisans-regular text-white/80 hover:text-white px-2 py-0.5 rounded bg-white/10 border border-white/20 transition-colors cursor-pointer"
                      title="Reset to 100% default"
                    >
                      Default
                    </button>
                  </div>
                )}
              </div>

              {/* Process Steps List */}
              <div className="space-y-8 sm:space-y-10 min-w-0">
                {effectiveProcessSteps.map((step, stepIdx) => (
                  <div key={step.id || stepIdx} className="space-y-4 min-w-0 pb-4 border-b border-white/5 last:border-0">
                    {/* 1. Pictures Section */}
                    <div className="flex flex-row items-start gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar min-w-0">
                      {step.pictures.map((pic: ProcessPicture, picIdx: number) => {
                        const isAI = pic.type === 'AI';

                        return (
                          <div
                            key={pic.id || picIdx}
                            style={{ width: `${processCardPixelWidth}px` }}
                            className="shrink-0 group relative transition-all duration-200"
                          >
                            <div className="relative rounded-2xl overflow-hidden transition-transform duration-300">
                              <div
                                onClick={() => {
                                  if (!isEditable) {
                                    setExpandedImage({
                                      url: pic.url,
                                      caption: pic.caption,
                                      type: pic.type,
                                      isAI: isAI,
                                      title: `${step.name} — Asset ${picIdx + 1}`,
                                    });
                                  }
                                }}
                                className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0a071c] shadow-lg transition-shadow duration-300 hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.65)] ${
                                  isEditable ? 'cursor-default' : 'cursor-pointer'
                                }`}
                              >
                                <img
                                  src={pic.url}
                                  alt={pic.caption || `${step.name} pic ${picIdx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />

                                {/* Tag: Marked as "Final" or "AI" */}
                                <div className="absolute top-2 left-2 z-10">
                                  {isEditable ? (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleProcessPictureType(stepIdx, picIdx)}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-unisans-regular tracking-wider uppercase transition-all cursor-pointer bg-black/80 text-white border border-white/30 shadow-md"
                                      title="Toggle between AI and Final"
                                    >
                                      {isAI ? (
                                        <>
                                          <Sparkles className="w-2 h-2 text-white" />
                                          AI
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle2 className="w-2 h-2 text-white" />
                                          Final
                                        </>
                                      )}
                                    </button>
                                  ) : (
                                    isAI ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-unisans-regular tracking-wider uppercase bg-black/80 text-white border border-white/30 backdrop-blur-md shadow-md">
                                        <Sparkles className="w-2 h-2 text-white" />
                                        AI
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-unisans-regular tracking-wider uppercase bg-black/80 text-white border border-white/30 backdrop-blur-md shadow-md">
                                        <CheckCircle2 className="w-2 h-2 text-white" />
                                        Final
                                      </span>
                                    )
                                  )}
                                </div>

                                {/* Delete Icon on picture */}
                                {isEditable && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProcessPicture(stepIdx, picIdx)}
                                    className="absolute top-2 right-2 z-20 w-8 h-8 rounded-xl bg-black/80 hover:bg-black text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border border-white/30"
                                    title="Delete picture"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}

                                {!isEditable && (
                                  <div className="absolute inset-x-0 bottom-0 pt-10 pb-2 px-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end">
                                    <p className="text-xs sm:text-sm text-white/95 font-unisans-regular leading-snug line-clamp-2">
                                      {pic.caption || 'Process documentation artifact.'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Caption editor */}
                            {isEditable && (
                              <div className="mt-1.5">
                                <input
                                  type="text"
                                  value={pic.caption || ''}
                                  onChange={e => {
                                    const updatedSteps = effectiveProcessSteps.map((s, sI) => {
                                      if (sI !== stepIdx) return s;
                                      return {
                                        ...s,
                                        pictures: s.pictures.map((p, pI) =>
                                          pI === picIdx ? { ...p, caption: e.target.value } : p
                                        ),
                                      };
                                    });
                                    updateProjectLocal({ processSteps: updatedSteps });
                                  }}
                                  placeholder="Caption..."
                                  className="w-full px-2 py-1 text-xs font-unisans-regular text-white/90 bg-white/5 focus:bg-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/40 border border-white/10"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Picture Buttons for this step */}
                      {isEditable && (
                        <div
                          style={{ width: `${Math.max(70, Math.round(100 * (imageScalePercent / 100)))}px` }}
                          className="flex flex-col items-center justify-center gap-2 p-2 rounded-2xl bg-white/5 border border-dashed border-white/20 shrink-0 self-stretch min-h-[110px]"
                        >
                          <button
                            type="button"
                            onClick={() => setLinkModalTarget({ stepIndex: stepIdx })}
                            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md group border border-white/20"
                            title="Add image via link"
                          >
                            <Link2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>

                          <div className="h-2 w-px bg-white/15" />

                          <button
                            type="button"
                            onClick={() => {
                              activeProcessStepIndexRef.current = stepIdx;
                              processFileInputRef.current?.click();
                            }}
                            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md group border border-white/20"
                            title="Upload image from device"
                          >
                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. Name Section */}
                    <div>
                      {isEditable ? (
                        <input
                          type="text"
                          value={step.name || ''}
                          onChange={e => handleUpdateStepName(stepIdx, e.target.value)}
                          className="w-full bg-white/5 px-3 py-2 text-white font-phenomena-bold text-xl sm:text-2xl tracking-wide focus:outline-none focus:ring-2 focus:ring-white/40 rounded-xl border border-white/10"
                          placeholder="Process Phase Name"
                          title="Click to edit phase name"
                        />
                      ) : (
                        <h3 className="font-phenomena-bold text-xl sm:text-2xl md:text-[26px] text-white tracking-wide">
                          {step.name}
                        </h3>
                      )}
                    </div>

                    {/* 3. Description Section */}
                    <div>
                      {isEditable ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={step.description || ''}
                            onChange={e => handleUpdateStepDesc(stepIdx, e.target.value)}
                            className="w-full bg-white/5 p-3 text-white/90 font-unisans-regular text-sm sm:text-base font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/40 rounded-xl resize-y border border-white/10"
                            placeholder="Detailed narrative of this process phase..."
                            title="Click to edit phase description"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteStep(stepIdx)}
                              className="px-3.5 py-1.5 text-xs font-unisans-regular text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Phase</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="font-unisans-regular text-sm sm:text-base lg:text-[16px] text-white/85 font-normal leading-relaxed max-w-3xl">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Process Button */}
                {isEditable && (
                  <div className="pt-4">
                    {!isAddingProcess ? (
                      <button
                        type="button"
                        onClick={() => setIsAddingProcess(true)}
                        className="w-full py-4 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-white font-phenomena-bold text-lg sm:text-xl tracking-wide flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:border-white/40"
                      >
                        <Plus className="w-5 h-5 text-white" />
                        <span>Add Process Phase</span>
                      </button>
                    ) : (
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/20 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="font-unisans-thin-caps text-sm uppercase tracking-wider text-white">
                            New Process Phase
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsAddingProcess(false)}
                            className="text-white/40 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Pictures list */}
                        <div className="space-y-2">
                          <label className="font-unisans-thin-caps text-xs uppercase tracking-wider text-white/60 block">
                            Pictures ({newProcessPictures.length})
                          </label>
                          <div className="flex flex-row items-center gap-3 overflow-x-auto pb-2">
                            {newProcessPictures.map((pic, pIdx) => (
                              <div key={pIdx} className="w-24 aspect-[4/3] rounded-xl overflow-hidden relative group shrink-0 bg-black/40 border border-white/10">
                                <img src={pic.url} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setNewProcessPictures(prev => prev.filter((_, i) => i !== pIdx))}
                                  className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setLinkModalTarget('newProcess')}
                                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-unisans-regular flex items-center gap-1.5"
                              >
                                <Link2 className="w-3.5 h-3.5" />
                                <span>Link</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => newProcessFileInputRef.current?.click()}
                                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-unisans-regular flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Upload</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="font-unisans-thin-caps text-xs uppercase tracking-wider text-white/60 block mb-1">
                            Phase Name
                          </label>
                          <input
                            type="text"
                            value={newProcessName}
                            onChange={e => setNewProcessName(e.target.value)}
                            placeholder="e.g. Phase 02: Typography Matrix & Production Blueprint"
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-unisans-regular focus:outline-none focus:border-white/40"
                          />
                        </div>

                        <div>
                          <label className="font-unisans-thin-caps text-xs uppercase tracking-wider text-white/60 block mb-1">
                            Phase Description
                          </label>
                          <textarea
                            rows={3}
                            value={newProcessDescription}
                            onChange={e => setNewProcessDescription(e.target.value)}
                            placeholder="Describe what occurred in this process phase..."
                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm font-unisans-regular focus:outline-none focus:border-white/40 resize-y"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingProcess(false)}
                            className="px-4 py-2 text-xs sm:text-sm font-unisans-regular text-white/60 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmAddProcess}
                            className="px-5 py-2.5 text-xs sm:text-sm font-unisans-regular text-white bg-white/15 hover:bg-white/25 rounded-xl shadow-lg cursor-pointer border border-white/25"
                          >
                            Add Process Phase
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT PANEL (30%): PROJECT DETAILS & METADATA ("Other Details") */}
          <div
            className={`w-full lg:w-[30%] p-5 sm:p-7 md:p-8 flex-col space-y-7 sm:space-y-8 min-w-0 min-h-0 h-full overflow-y-auto no-scrollbar ${
              mobileActivePane === 'other_details' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            
            {/* 1. Name of the project */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                PROJECT TITLE
              </span>
              {isEditable ? (
                <input
                  type="text"
                  value={currentProject.title || ''}
                  onChange={e => updateProjectLocal({ title: e.target.value })}
                  className="w-full bg-white/5 px-3 py-2 text-white font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light tracking-wide focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10"
                  placeholder="Project Name"
                />
              ) : (
                <h1 className="font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light text-white tracking-wide leading-tight">
                  {currentProject.title}
                </h1>
              )}
            </div>

            {/* 2. Date */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                DATE
              </span>
              {isEditable ? (
                <input
                  type="text"
                  value={currentProject.monthYear || (currentProject.year ? `${currentProject.year}` : '')}
                  onChange={e => updateProjectLocal({ monthYear: e.target.value })}
                  placeholder="e.g. October 2026"
                  className="w-full bg-white/5 px-3 py-2 text-white font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10"
                />
              ) : (
                <div className="font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light text-white">
                  {currentProject.monthYear || `${currentProject.year}`}
                </div>
              )}
            </div>

            {/* 2b. Live Website Link (for Website projects or when editable) */}
            {(isEditable || currentProject.websiteUrl) && (
              <div>
                <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                  WEBSITE LINK
                </span>
                {isEditable ? (
                  <input
                    type="url"
                    value={currentProject.websiteUrl || ''}
                    onChange={e => updateProjectLocal({ websiteUrl: e.target.value })}
                    placeholder="https://example.vercel.app/"
                    className="w-full bg-white/5 px-3 py-2 text-white font-unisans-regular text-base sm:text-lg lg:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10"
                  />
                ) : (
                  <a
                    href={currentProject.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-unisans-regular text-base sm:text-lg lg:text-[15px] text-white hover:text-white/80 underline underline-offset-4 decoration-white/30 hover:decoration-white break-all transition-colors"
                  >
                    <Link2 className="w-4 h-4 shrink-0 text-white/80" />
                    <span>{currentProject.websiteUrl}</span>
                  </a>
                )}
              </div>
            )}

            {/* 3. CLIENT'S REMARK (Moon 2.0 Light headings, UniSans Thin AllCaps top label, UniSans Regular body) */}
            <div className="space-y-3.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal">
                  CLIENT&apos;S REMARK
                </span>

                {/* Delete Remark Button in Edit Mode */}
                {isEditable && (
                  <button
                    type="button"
                    onClick={handleDeleteClientRemark}
                    className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-unisans-regular flex items-center gap-1.5 transition-all cursor-pointer shadow-md border border-white/20"
                    title="Delete client remark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Remark</span>
                  </button>
                )}
              </div>

              {/* Editable Remark Type Selector */}
              {isEditable && (
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      updateProjectLocal({ clientRemark: { ...remark, type: 'voice' } });
                      setActiveRemarkType('voice');
                    }}
                    className={`py-1.5 px-2 text-[11px] font-unisans-regular rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeRemarkType === 'voice'
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Memo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateProjectLocal({ clientRemark: { ...remark, type: 'comment' } });
                      setActiveRemarkType('comment');
                    }}
                    className={`py-1.5 px-2 text-[11px] font-unisans-regular rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeRemarkType === 'comment'
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Text Quote</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateProjectLocal({ clientRemark: { ...remark, type: 'picture' } });
                      setActiveRemarkType('picture');
                    }}
                    className={`py-1.5 px-2 text-[11px] font-unisans-regular rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeRemarkType === 'picture'
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Document</span>
                  </button>
                </div>
              )}

              {/* Active Remark: Voice */}
              {activeRemarkType === 'voice' && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-full bg-white/15 text-white">
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base lg:text-xs font-vapour text-white block">
                          Client Audio Memo
                        </span>
                        <span className="text-xs sm:text-sm lg:text-[11px] text-white/50 block font-unisans-regular">
                          {remark.voiceDate || currentProject.monthYear || currentProject.year}
                        </span>
                      </div>
                    </div>

                    {isEditable ? (
                      <input
                        type="text"
                        value={remark.voiceDuration || '0:42'}
                        onChange={e => updateProjectLocal({ clientRemark: { ...remark, voiceDuration: e.target.value } })}
                        className="w-16 text-right bg-white/5 text-white/90 font-unisans-regular text-xs sm:text-sm lg:text-xs focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1.5 py-0.5 border border-white/10"
                        title="Edit duration"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm lg:text-xs font-unisans-regular text-white/90">
                        {remark.voiceDuration || '0:42'}
                      </span>
                    )}
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="flex items-center gap-0.5 h-7 px-2 py-0.5 rounded bg-black/30">
                    {Array.from({ length: 24 }).map((_, barIdx) => {
                      const isActive = (barIdx / 24) * 100 <= voicePlaybackProgress;
                      const dynamicHeight = isPlayingVoice
                        ? Math.sin(barIdx * 0.8 + voicePlaybackProgress * 0.1) * 40 + 50
                        : (barIdx % 5) * 15 + 25;

                      return (
                        <div
                          key={barIdx}
                          className="flex-1 rounded-full transition-all duration-150"
                          style={{
                            height: `${Math.max(15, dynamicHeight)}%`,
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.18)',
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={toggleVoicePlayback}
                      className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm lg:text-xs font-unisans-regular flex items-center gap-2 transition-all cursor-pointer shadow-md border border-white/25"
                    >
                      {isPlayingVoice ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>

                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => remarkAudioFileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-unisans-regular text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl cursor-pointer"
                      >
                        Upload Audio
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Active Remark: Text Quote */}
              {activeRemarkType === 'comment' && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                  {isEditable ? (
                    <textarea
                      rows={3}
                      value={remark.comment || ''}
                      onChange={e => updateProjectLocal({ clientRemark: { ...remark, comment: e.target.value } })}
                      placeholder="Write the client's quote..."
                      className="w-full bg-white/5 text-white italic font-unisans-regular text-base sm:text-lg lg:text-[15px] leading-relaxed lg:leading-normal focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl p-3 border border-white/10 resize-y"
                    />
                  ) : (
                    <p className="text-base sm:text-lg lg:text-[15px] text-white/95 italic font-unisans-regular leading-relaxed lg:leading-normal">
                      {remark.comment || `“Working with VDVC completely transformed our digital positioning.”`}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm lg:text-xs text-white/80 font-vapour">
                      Author: {remark.clientAuthor || currentProject.client}
                    </span>
                    {isEditable && (
                      <input
                        type="text"
                        value={remark.clientAuthor || currentProject.client || ''}
                        onChange={e => updateProjectLocal({ clientRemark: { ...remark, clientAuthor: e.target.value } })}
                        placeholder="Author name"
                        className="text-xs text-right bg-white/5 text-white/80 font-unisans-regular px-2 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-white/40"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Active Remark: Picture Document */}
              {activeRemarkType === 'picture' && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/40">
                    <img
                      src={remark.pictureUrl || currentProject.images[0]}
                      alt="Client endorsement document"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditable && (
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <input
                        type="text"
                        value={remark.pictureCaption || ''}
                        onChange={e => updateProjectLocal({ clientRemark: { ...remark, pictureCaption: e.target.value } })}
                        placeholder="Document caption..."
                        className="flex-1 text-xs font-unisans-regular text-white/80 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/40"
                      />
                      <button
                        type="button"
                        onClick={() => remarkPictureFileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-unisans-regular text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl cursor-pointer"
                      >
                        Upload Doc
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* When Remark is None / Deleted */}
              {activeRemarkType === 'none' && isEditable && (
                <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-center space-y-2">
                  <span className="text-xs text-white/50 block font-unisans-regular">
                    No client remark attached.
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateProjectLocal({ clientRemark: { ...remark, type: 'voice' } });
                        setActiveRemarkType('voice');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-unisans-regular transition-all cursor-pointer border border-white/25"
                    >
                      + Voice Memo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateProjectLocal({ clientRemark: { ...remark, type: 'comment', comment: 'Exceptional creative design execution.' } });
                        setActiveRemarkType('comment');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-unisans-regular transition-all cursor-pointer border border-white/20"
                    >
                      + Text Quote
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Client Name (Moon 2.0 Light) */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                CLIENT NAME
              </span>
              {isEditable ? (
                <input
                  type="text"
                  value={currentProject.client || ''}
                  onChange={e => updateProjectLocal({ client: e.target.value })}
                  className="w-full bg-white/5 px-3 py-2 text-white font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10"
                  placeholder="Client Name"
                />
              ) : (
                <span className="font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light text-white block">
                  {currentProject.client}
                </span>
              )}
            </div>

            {/* 5. Client Profile (Moon 2.0 Light heading, UniSans Regular body) */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                CLIENT PROFILE
              </span>
              {isEditable ? (
                <textarea
                  rows={3}
                  value={currentProject.clientDescription || ''}
                  onChange={e => updateProjectLocal({ clientDescription: e.target.value })}
                  placeholder="Description of the client organization..."
                  className="w-full bg-white/5 p-3 text-white/90 font-unisans-regular text-base sm:text-lg lg:text-[15px] font-normal leading-relaxed lg:leading-normal focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10 resize-y"
                />
              ) : (
                <p className="font-unisans-regular text-base sm:text-lg lg:text-[15px] text-white/85 font-normal leading-relaxed lg:leading-normal">
                  {currentProject.clientDescription ||
                    `${currentProject.client} is a premier international partner collaborating on bespoke identity and interactive digital experiences.`}
                </p>
              )}
            </div>

            {/* 6. Project Scope & Description (Moon 2.0 Light heading, UniSans Regular body) */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                PROJECT SCOPE &amp; DESCRIPTION
              </span>
              {isEditable ? (
                <textarea
                  rows={4}
                  value={currentProject.shortDescription || currentProject.description || ''}
                  onChange={e => updateProjectLocal({ shortDescription: e.target.value, description: e.target.value })}
                  placeholder="Short description of the project..."
                  className="w-full bg-white/5 p-3 text-white/90 font-unisans-regular text-base sm:text-lg lg:text-[15px] font-normal leading-relaxed lg:leading-normal focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10 resize-y"
                />
              ) : (
                <p className="font-unisans-regular text-base sm:text-lg lg:text-[15px] text-white/85 font-normal leading-relaxed lg:leading-normal">
                  {currentProject.shortDescription || currentProject.description}
                </p>
              )}
            </div>

            {/* 7. Valuation / Investment (Moon 2.0 Light) */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                VALUATION / INVESTMENT
              </span>
              {isEditable ? (
                <input
                  type="text"
                  value={currentProject.price || ''}
                  onChange={e => updateProjectLocal({ price: e.target.value })}
                  placeholder="e.g. $24,500 USD"
                  className="w-full bg-white/5 px-3 py-2 text-white font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10"
                />
              ) : (
                <span className="font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light text-white block">
                  {currentProject.price || 'Undisclosed'}
                </span>
              )}
            </div>

            {/* 8. Build Duration (Moon 2.0 Light) */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                BUILD DURATION
              </span>
              {isEditable ? (
                <input
                  type="text"
                  value={currentProject.duration || ''}
                  onChange={e => updateProjectLocal({ duration: e.target.value })}
                  placeholder="e.g. 6 Weeks"
                  className="w-full bg-white/5 px-3 py-2 text-white font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10"
                />
              ) : (
                <span className="font-vapour text-2xl sm:text-3xl lg:text-[28px] font-light text-white block">
                  {currentProject.duration || '6 Weeks'}
                </span>
              )}
            </div>

            {/* 9. Designer's Remark (Moon 2.0 Light) */}
            <div>
              <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-1.5">
                DESIGNER&apos;S REMARK
              </span>
              {isEditable ? (
                <input
                  type="text"
                  value={currentProject.threeWordDesc || currentProject.descriptors || ''}
                  onChange={e => updateProjectLocal({ threeWordDesc: e.target.value, descriptors: e.target.value })}
                  placeholder="e.g. Rational Swiss Architecture"
                  className="w-full bg-white/5 px-3 py-2 text-white font-vapour text-xl sm:text-2xl lg:text-[28px] font-light tracking-wide focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl border border-white/10"
                />
              ) : (
                <span className="font-vapour text-xl sm:text-2xl lg:text-[28px] font-light text-white tracking-wide block">
                  {currentProject.threeWordDesc || currentProject.descriptors || 'Minimal Swiss Direction'}
                </span>
              )}
            </div>

            {/* 10. Category & "Real-Life Project" (Styled identically) */}
            <div className="pt-2 border-t border-white/10 space-y-3.5">
              <div>
                <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal mb-2.5">
                  CATEGORY
                </span>
                {isEditable ? (
                  <div className="flex flex-wrap gap-2.5">
                    {(['Graphic Design', 'Web Design', 'Other'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateProjectLocal({ category: cat })}
                        className={`px-3.5 py-1.5 text-sm lg:text-[15px] rounded-xl font-unisans-regular transition-all cursor-pointer border ${
                          currentProject.category === cat
                            ? 'bg-white/20 text-white border-white/60 shadow-md ring-1 ring-white/30'
                            : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/15 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-block px-3.5 py-1.5 lg:px-3 lg:py-1 rounded-xl text-sm sm:text-base lg:text-[15px] font-unisans-regular font-normal bg-white/5 text-white/90 border border-white/10">
                      {currentProject.category}
                    </span>
                    {currentProject.isRealLife && (
                      <span className="inline-block px-3.5 py-1.5 lg:px-3 lg:py-1 rounded-xl text-sm sm:text-base lg:text-[15px] font-unisans-regular font-normal bg-white/5 text-white/90 border border-white/10">
                        Real-Life Project
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Real-Life Project Toggle in Edit Mode */}
              {isEditable && (
                <button
                  type="button"
                  onClick={() => updateProjectLocal({ isRealLife: !currentProject.isRealLife })}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    currentProject.isRealLife
                      ? 'bg-white/20 border-white/50 text-white ring-1 ring-white/30'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm lg:text-[15px] font-unisans-regular font-normal text-white">Mark as &apos;Real-Life Project&apos;</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    currentProject.isRealLife ? 'bg-white border-white text-black' : 'border-white/30 bg-transparent'
                  }`}>
                    {currentProject.isRealLife && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              )}
            </div>

            {/* 11. Deliverables (UniSans Regular) */}
            {(isEditable || (currentProject.deliverables && currentProject.deliverables.length > 0)) && (
              <div className="pt-2 border-t border-white/10 space-y-3">
                <span className="font-unisans-thin-caps text-[14px] sm:text-[15px] uppercase tracking-wider text-white/55 block font-normal">
                  DELIVERABLES ({currentProject.deliverables?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {(currentProject.deliverables || []).map((deliv, dIdx) => (
                    <span
                      key={dIdx}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 lg:px-3 lg:py-1 rounded-xl text-sm sm:text-base lg:text-[15px] font-unisans-regular font-normal bg-white/5 text-white/90 border border-white/10 group"
                    >
                      <span>{deliv}</span>
                      {isEditable && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = (currentProject.deliverables || []).filter((_, i) => i !== dIdx);
                            updateProjectLocal({ deliverables: updated });
                          }}
                          className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/20 transition-colors cursor-pointer -mr-1"
                          title={`Remove ${deliv}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditable && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newDeliverableText}
                      onChange={e => setNewDeliverableText(e.target.value)}
                      placeholder="Add deliverable..."
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = newDeliverableText.trim();
                          if (val) {
                            const updated = [...(currentProject.deliverables || []), val];
                            updateProjectLocal({ deliverables: updated });
                            setNewDeliverableText('');
                          }
                        }
                      }}
                      className="flex-1 px-3.5 py-2.5 text-sm lg:text-[15px] font-unisans-regular text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newDeliverableText.trim();
                        if (val) {
                          const updated = [...(currentProject.deliverables || []), val];
                          updateProjectLocal({ deliverables: updated });
                          setNewDeliverableText('');
                        }
                      }}
                      className="px-4 py-2.5 text-sm lg:text-[15px] font-unisans-regular bg-white/15 text-white rounded-xl hover:bg-white/25 transition-all cursor-pointer shadow-md border border-white/25"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SLIM RIGHT COLUMN: NEXT ARROW + MOBILE CIRCULAR CLOSE BUTTON AT BOTTOM */}
        <aside
          aria-label="Next project navigation"
          className="w-8 sm:w-10 md:w-12 lg:w-16 shrink-0 flex items-center justify-center h-full z-20 bg-transparent border-0 relative"
        >
          <button
            disabled={!nextProject}
            onClick={() => nextProject && onNavigateProject(nextProject)}
            className={`p-2 transition-colors duration-[250ms] ease-out cursor-pointer bg-transparent border-0 ${
              nextProject
                ? 'text-white/40 hover:text-white/90'
                : 'text-white/10 cursor-not-allowed'
            }`}
            title={nextProject ? `Next: ${nextProject.title}` : 'No next project'}
          >
            <ChevronRight
              className="w-6 h-6 sm:w-7 sm:h-7"
              strokeWidth={1.96}
              style={{ transform: 'scaleX(0.98)' }}
            />
          </button>
        </aside>
      </div>

      {/* Floating Circular Close Button on mobile & tablet */}
      <button
        type="button"
        onClick={onClose}
        className="lg:hidden fixed bottom-[72px] sm:bottom-6 right-4 sm:right-6 md:right-8 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/25 text-white/90 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xl z-50 backdrop-blur-md"
        title="Close Project Details"
        aria-label="Close Project Details"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </button>

      {/* MOBILE ONLY: Pane Selector Slider sticky at the bottom */}
      <div className="sm:hidden shrink-0 sticky bottom-0 px-4 py-2.5 bg-[#130f30]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-center z-30">
        <div className="flex items-center p-1 bg-white/10 rounded-2xl border border-white/10 w-full max-w-sm relative">
          <button
            type="button"
            onClick={() => setMobileActivePane('gallery_process')}
            className={`flex-1 py-2 px-3 text-xs font-unisans-regular rounded-xl transition-colors relative z-10 text-center cursor-pointer ${
              mobileActivePane === 'gallery_process'
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {mobileActivePane === 'gallery_process' && (
              <motion.div
                layoutId="showroom-mobile-bottom-slider"
                className="absolute inset-0 bg-white/20 rounded-xl -z-10 shadow-sm border border-white/25"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            Gallery &amp; Process
          </button>

          <button
            type="button"
            onClick={() => setMobileActivePane('other_details')}
            className={`flex-1 py-2 px-3 text-xs font-unisans-regular rounded-xl transition-colors relative z-10 text-center cursor-pointer ${
              mobileActivePane === 'other_details'
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {mobileActivePane === 'other_details' && (
              <motion.div
                layoutId="showroom-mobile-bottom-slider"
                className="absolute inset-0 bg-white/20 rounded-xl -z-10 shadow-sm border border-white/25"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            Project Details
          </button>
        </div>
      </div>

      {/* MODAL: Enlarge Image */}
      <AnimatePresence>
        {expandedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedImage(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center z-10 p-2 sm:p-4"
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-2 right-2 sm:-top-10 sm:right-0 p-2 text-white/80 hover:text-white bg-black/60 rounded-full cursor-pointer z-20"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl max-h-[80vh] flex items-center justify-center border border-white/10">
                <img
                  src={expandedImage.url}
                  alt={expandedImage.caption || 'Enlarged view'}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              {expandedImage.caption && (
                <div className="mt-3 text-center px-4 max-w-2xl">
                  <p className="text-base font-unisans-regular text-white/90">
                    {expandedImage.caption}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Add Image via Link */}
      <AnimatePresence>
        {linkModalTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLinkModalTarget(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full bg-[#18133d] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-unisans-thin-caps text-white uppercase tracking-wider flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-white/80" />
                  <span>Add Image via Link</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setLinkModalTarget(null)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-unisans-thin-caps uppercase tracking-wider text-white/70 block mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrlInput || ''}
                    onChange={e => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-unisans-regular focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-unisans-thin-caps uppercase tracking-wider text-white/70 block mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={imageCaptionInput || ''}
                    onChange={e => setImageCaptionInput(e.target.value)}
                    placeholder="Short description of the asset..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-unisans-regular focus:outline-none focus:border-white/40"
                  />
                </div>

                {linkModalTarget === 'gallery' ? (
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={imageIsAI}
                      onChange={e => setImageIsAI(e.target.checked)}
                      className="rounded accent-white"
                    />
                    <span className="text-xs text-white/80 font-unisans-regular">
                      Tag as AI Generated
                    </span>
                  </label>
                ) : (
                  <div>
                    <label className="text-xs font-unisans-thin-caps uppercase tracking-wider text-white/70 block mb-1">
                      Step Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setImageType('Final')}
                        className={`flex-1 py-1.5 text-xs font-unisans-regular rounded-lg border ${
                          imageType === 'Final'
                            ? 'bg-white/20 text-white border-white/50'
                            : 'bg-white/5 text-white/60 border-white/10'
                        }`}
                      >
                        Final
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType('AI')}
                        className={`flex-1 py-1.5 text-xs font-unisans-regular rounded-lg border ${
                          imageType === 'AI'
                            ? 'bg-white/20 text-white border-white/50'
                            : 'bg-white/5 text-white/60 border-white/10'
                        }`}
                      >
                        AI
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setLinkModalTarget(null)}
                  className="px-4 py-2 text-xs font-unisans-regular text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddByLink}
                  disabled={!imageUrlInput.trim()}
                  className="px-5 py-2 text-xs font-unisans-regular text-white bg-white/15 hover:bg-white/25 rounded-xl disabled:opacity-40 cursor-pointer shadow-lg border border-white/25"
                >
                  Add Picture
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

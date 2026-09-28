import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateBriefPdf } from '../utils/generateBriefPdf';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  UploadCloud,
  Save,
  Check,
  Building,
  FolderGit2,
  Layout,
  PlusCircle,
  X,
  ChevronUp,
  ChevronDown,
  Table as TableIcon,
  Cpu,
  List,
  Grid,
  FileText,
  Palette,
  Phone,
  Mail,
  Sparkles,
  Briefcase,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  User,
  Users,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Dribbble,
  MessageCircle,
  Menu,
} from 'lucide-react';
import { Project, FilterCategory } from '../types/portfolio';
import {
  AboutData,
  SocialLinks,
  SocialLinkItem,
  TeamMemberItem,
  AboutCustomSection,
  TableRowItem,
  SoftwareToolItem,
  PhoneItem,
  EmailItem,
  defaultAboutSections,
  defaultSocialLinks,
} from './AboutSection';
import { compressImage } from '../utils/imageCompressor';

interface DashboardViewProps {
  projects: Project[];
  aboutData: AboutData;
  onUpdateAbout: (data: AboutData) => void;
  onAddNew: () => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onPreview: (project: Project) => void;
  onDropImage: (file: File) => void;
  onResetDefaults: () => void;
  onUpdateProject?: (id: string, updated: Partial<Project>) => Promise<void> | void;
}

const CATEGORIES: FilterCategory[] = [
  'All',
  'Graphic Design',
  'Web Design',
];

const COLOR_PRESETS = [
  { label: 'Emerald Green', value: '#047857' },
  { label: 'Slate Dark', value: '#1e293b' },
  { label: 'Amber Orange', value: '#b45309' },
  { label: 'Urgent Red', value: '#b91c1c' },
  { label: 'Purple Royalty', value: '#7e22ce' },
  { label: 'Sky Blue', value: '#0284c7' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  aboutData,
  onUpdateAbout,
  onAddNew,
  onEdit,
  onDelete,
  onPreview,
  onDropImage,
  onResetDefaults,
}) => {
  // Three filters as requested:
  // 1. Project
  // 2. About
  // 3. Navigation on footer
  const [activeTab, setActiveTab] = useState<'projects' | 'about' | 'nav_footer' | 'briefs'>('projects');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Submitted briefs list & details modal state
  const [submittedBriefs, setSubmittedBriefs] = useState<any[]>([]);
  const [briefFilter, setBriefFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedBriefModal, setSelectedBriefModal] = useState<any | null>(null);
  const [isBriefFilterDropdownOpen, setIsBriefFilterDropdownOpen] = useState(false);
  const [isProjectCategoryDropdownOpen, setIsProjectCategoryDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeBriefMenuId, setActiveBriefMenuId] = useState<string | null>(null);

  // Load Submitted Client Briefs in Real-time from Firestore & localStorage
  useEffect(() => {
    const briefsCol = collection(db, 'briefs');
    const unsubscribe = onSnapshot(briefsCol, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => d.data());
        loaded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setSubmittedBriefs(loaded);
      } else {
        try {
          const local = localStorage.getItem('vdvc_briefs_submitted');
          if (local) setSubmittedBriefs(JSON.parse(local));
        } catch {
          // ignore
        }
      }
    }, (err) => {
      console.warn('Briefs snapshot error:', err);
      try {
        const local = localStorage.getItem('vdvc_briefs_submitted');
        if (local) setSubmittedBriefs(JSON.parse(local));
      } catch {
        // ignore
      }
    });
    return () => unsubscribe();
  }, []);

  const unreadBriefsCount = useMemo(() => {
    return submittedBriefs.filter(b => b.status === 'new' || b.status === 'unread' || !b.status).length;
  }, [submittedBriefs]);

  const readBriefsCount = useMemo(() => {
    return submittedBriefs.filter(b => b.status === 'read').length;
  }, [submittedBriefs]);

  const filteredBriefs = useMemo(() => {
    return submittedBriefs.filter(b => {
      const isUnread = b.status === 'new' || b.status === 'unread' || !b.status;
      if (briefFilter === 'unread') return isUnread;
      if (briefFilter === 'read') return !isUnread;
      return true;
    });
  }, [submittedBriefs, briefFilter]);

  const handleToggleReadStatus = async (brief: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentIsUnread = brief.status === 'new' || brief.status === 'unread' || !brief.status;
    const newStatus = currentIsUnread ? 'read' : 'unread';

    try {
      if (brief.referenceId) {
        await updateDoc(doc(db, 'briefs', brief.referenceId), { status: newStatus });
      }
    } catch {
      // fallback
    }

    setSubmittedBriefs(prev =>
      prev.map(b => (b.referenceId === brief.referenceId ? { ...b, status: newStatus } : b))
    );

    if (selectedBriefModal && selectedBriefModal.referenceId === brief.referenceId) {
      setSelectedBriefModal((prev: any) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleOpenDetails = (brief: any) => {
    setSelectedBriefModal(brief);
    if (brief.status === 'new' || brief.status === 'unread' || !brief.status) {
      handleToggleReadStatus(brief);
    }
  };

  // Editable About form state
  const [editingAbout, setEditingAbout] = useState<AboutData>(() => ({
    ...aboutData,
    sections:
      aboutData.sections && aboutData.sections.length > 0
        ? aboutData.sections
        : defaultAboutSections,
  }));
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Sync when prop updates
  React.useEffect(() => {
    setEditingAbout(prev => ({
      ...aboutData,
      sections:
        aboutData.sections && aboutData.sections.length > 0
          ? aboutData.sections
          : prev.sections && prev.sections.length > 0
          ? prev.sections
          : defaultAboutSections,
    }));
  }, [aboutData]);

  const activeSections = editingAbout.sections || defaultAboutSections;

  const phoneItemsList: PhoneItem[] = useMemo(() => {
    if (editingAbout.phoneItems && editingAbout.phoneItems.length > 0) {
      return editingAbout.phoneItems;
    }
    const rawPhones = editingAbout.phones && editingAbout.phones.length > 0
      ? editingAbout.phones
      : [editingAbout.phone || '0701 841 6894'];
    return rawPhones.map((num, i) => ({
      id: `ph-${i}`,
      number: num,
      iconUrl: '',
    }));
  }, [editingAbout.phoneItems, editingAbout.phones, editingAbout.phone]);

  const emailItemsList: EmailItem[] = useMemo(() => {
    if (editingAbout.emailItems && editingAbout.emailItems.length > 0) {
      return editingAbout.emailItems;
    }
    const rawEmails = editingAbout.emails && editingAbout.emails.length > 0
      ? editingAbout.emails
      : [editingAbout.email || 'vapourdense@gmail.com'];
    return rawEmails.map((em, i) => ({
      id: `em-${i}`,
      email: em,
      iconUrl: '',
    }));
  }, [editingAbout.emailItems, editingAbout.emails, editingAbout.email]);

  const handleUpdatePhoneItem = (index: number, field: 'number' | 'iconUrl', value: string) => {
    const updated = [...phoneItemsList];
    updated[index] = { ...updated[index], [field]: value };
    setEditingAbout(prev => ({
      ...prev,
      phoneItems: updated,
      phones: updated.map(p => p.number),
      phone: updated[0]?.number || '',
    }));
  };

  const handleAddPhoneItem = () => {
    if (phoneItemsList.length < 5) {
      const updated: PhoneItem[] = [
        ...phoneItemsList,
        { id: `ph-${Date.now()}`, number: '', iconUrl: '' },
      ];
      setEditingAbout(prev => ({
        ...prev,
        phoneItems: updated,
        phones: updated.map(p => p.number),
        phone: updated[0]?.number || '',
      }));
    }
  };

  const handleRemovePhoneItem = (index: number) => {
    if (phoneItemsList.length <= 1) return;
    const updated = phoneItemsList.filter((_, i) => i !== index);
    setEditingAbout(prev => ({
      ...prev,
      phoneItems: updated,
      phones: updated.map(p => p.number),
      phone: updated[0]?.number || '',
    }));
  };

  const handlePhoneIconUpload = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImage(file, 200, 200, 0.9);
      handleUpdatePhoneItem(index, 'iconUrl', compressed);
    } catch {
      // fallback
    }
  };

  const handleUpdateEmailItem = (index: number, field: 'email' | 'iconUrl', value: string) => {
    const updated = [...emailItemsList];
    updated[index] = { ...updated[index], [field]: value };
    setEditingAbout(prev => ({
      ...prev,
      emailItems: updated,
      emails: updated.map(e => e.email),
      email: updated[0]?.email || '',
    }));
  };

  const handleAddEmailItem = () => {
    if (emailItemsList.length < 5) {
      const updated: EmailItem[] = [
        ...emailItemsList,
        { id: `em-${Date.now()}`, email: '', iconUrl: '' },
      ];
      setEditingAbout(prev => ({
        ...prev,
        emailItems: updated,
        emails: updated.map(e => e.email),
        email: updated[0]?.email || '',
      }));
    }
  };

  const handleRemoveEmailItem = (index: number) => {
    if (emailItemsList.length <= 1) return;
    const updated = emailItemsList.filter((_, i) => i !== index);
    setEditingAbout(prev => ({
      ...prev,
      emailItems: updated,
      emails: updated.map(e => e.email),
      email: updated[0]?.email || '',
    }));
  };

  const handleEmailIconUpload = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImage(file, 200, 200, 0.9);
      handleUpdateEmailItem(index, 'iconUrl', compressed);
    } catch {
      // fallback
    }
  };

  const handleFounderImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImage(file, 1200, 1200, 0.85);
      setEditingAbout(prev => ({ ...prev, founderImage: compressed }));
    } catch {
      // fallback
    }
  };

  const handleNavbarLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImage(file, 600, 600, 0.9);
      setEditingAbout(prev => ({ ...prev, logoUrl: compressed }));
    } catch {
      // fallback
    }
  };

  const socialLinksList: SocialLinkItem[] =
    editingAbout.socialLinks && editingAbout.socialLinks.length > 0
      ? editingAbout.socialLinks
      : defaultSocialLinks;

  const handleAddSocialLink = () => {
    const newSocial: SocialLinkItem = {
      id: `soc-${Date.now()}`,
      platform: 'Instagram',
      url: 'https://',
      handle: '',
      iconUrl: '',
    };
    const updated = [...socialLinksList, newSocial];
    setEditingAbout(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleUpdateSocialLink = (
    index: number,
    field: keyof SocialLinkItem,
    value: string
  ) => {
    const updated = [...socialLinksList];
    updated[index] = { ...updated[index], [field]: value };
    setEditingAbout(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleSocialIconUpload = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImage(file, 200, 200, 0.9);
      handleUpdateSocialLink(index, 'iconUrl', compressed);
    } catch {
      // fallback
    }
  };

  const handleDeleteSocialLink = (index: number) => {
    const updated = socialLinksList.filter((_, i) => i !== index);
    setEditingAbout(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleMoveSocialLink = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= socialLinksList.length) return;
    const updated = [...socialLinksList];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setEditingAbout(prev => ({ ...prev, socialLinks: updated }));
  };

  // Team Members State & Handlers
  const teamMembersList: TeamMemberItem[] = editingAbout.teamMembers || [];

  const handleAddTeamMember = () => {
    const newMember: TeamMemberItem = {
      id: `tm-${Date.now()}`,
      name: '',
      role: '',
      avatarUrl: '',
    };
    setEditingAbout(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), newMember],
    }));
  };

  const handleUpdateTeamMember = (
    index: number,
    field: keyof TeamMemberItem,
    value: string
  ) => {
    const updated = [...teamMembersList];
    updated[index] = { ...updated[index], [field]: value };
    setEditingAbout(prev => ({ ...prev, teamMembers: updated }));
  };

  const handleMemberAvatarUpload = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImage(file, 400, 400, 0.85);
      handleUpdateTeamMember(index, 'avatarUrl', compressed);
    } catch {
      // fallback
    }
  };

  const handleDeleteTeamMember = (index: number) => {
    const updated = teamMembersList.filter((_, i) => i !== index);
    setEditingAbout(prev => ({ ...prev, teamMembers: updated }));
  };

  const handleMoveTeamMember = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= teamMembersList.length) return;
    const updated = [...teamMembersList];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setEditingAbout(prev => ({ ...prev, teamMembers: updated }));
  };

  const handleSocialChange = (key: keyof SocialLinks, val: string) => {
    setEditingAbout(prev => ({
      ...prev,
      socials: {
        ...(prev.socials || {}),
        [key]: val,
      },
    }));
  };

  // Section Management Functions
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= activeSections.length) return;

    const updated = [...activeSections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);

    setEditingAbout(prev => ({ ...prev, sections: updated }));
  };

  const handleUpdateSection = (index: number, changes: Partial<AboutCustomSection>) => {
    const updated = [...activeSections];
    updated[index] = { ...updated[index], ...changes };
    setEditingAbout(prev => ({ ...prev, sections: updated }));
  };

  const handleDeleteSection = (index: number) => {
    if (window.confirm(`Delete the section "${activeSections[index]?.category}"?`)) {
      const updated = activeSections.filter((_, i) => i !== index);
      setEditingAbout(prev => ({ ...prev, sections: updated }));
    }
  };

  const handleAddNewSection = () => {
    const newSec: AboutCustomSection = {
      id: `sec-${Date.now()}`,
      category: 'NEW SECTION',
      tagline: 'SECTION SUB-TAGLINE',
      type: 'text',
      content: 'Write your detailed narrative, specifications, or information here...',
      layoutTheme: 'spaced',
    };
    const updated = [...activeSections, newSec];
    setEditingAbout(prev => ({ ...prev, sections: updated }));
    setExpandedSectionId(newSec.id);
  };

  // Table Row Helpers
  const handleAddTableRow = (secIdx: number) => {
    const sec = activeSections[secIdx];
    const newRow: TableRowItem = {
      id: `row-${Date.now()}`,
      bracket: 'CUSTOM TIER',
      timeframe: '1-2 WKS',
      multiplier: 'CUSTOM',
      meaning: 'Description of turnaround tier and delivery expectations.',
      textColor: '#1e293b',
    };
    const rows = [...(sec.tableRows || []), newRow];
    handleUpdateSection(secIdx, { tableRows: rows });
  };

  const handleUpdateTableRow = (
    secIdx: number,
    rowIdx: number,
    field: keyof TableRowItem,
    value: string
  ) => {
    const sec = activeSections[secIdx];
    const rows = [...(sec.tableRows || [])];
    rows[rowIdx] = { ...rows[rowIdx], [field]: value };
    handleUpdateSection(secIdx, { tableRows: rows });
  };

  const handleDeleteTableRow = (secIdx: number, rowIdx: number) => {
    const sec = activeSections[secIdx];
    const rows = (sec.tableRows || []).filter((_, i) => i !== rowIdx);
    handleUpdateSection(secIdx, { tableRows: rows });
  };

  // Software Tool Helpers
  const handleAddSoftwareTool = (secIdx: number) => {
    const sec = activeSections[secIdx];
    const newTool: SoftwareToolItem = {
      id: `tool-${Date.now()}`,
      name: 'New Creative Software',
      code: 'App',
      color: 'bg-indigo-600 text-white',
      desc: 'Creative & Digital Suite',
    };
    const tools = [...(sec.tools || []), newTool];
    handleUpdateSection(secIdx, { tools });
  };

  const handleUpdateSoftwareTool = (
    secIdx: number,
    toolIdx: number,
    field: keyof SoftwareToolItem,
    value: string
  ) => {
    const sec = activeSections[secIdx];
    const tools = [...(sec.tools || [])];
    tools[toolIdx] = { ...tools[toolIdx], [field]: value };
    handleUpdateSection(secIdx, { tools });
  };

  const handleDeleteSoftwareTool = (secIdx: number, toolIdx: number) => {
    const sec = activeSections[secIdx];
    const tools = (sec.tools || []).filter((_, i) => i !== toolIdx);
    handleUpdateSection(secIdx, { tools });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.threeWordDesc && p.threeWordDesc.toLowerCase().includes(q)) ||
        (p.descriptors && p.descriptors.toLowerCase().includes(q)) ||
        (p.deliverables && p.deliverables.some(d => d.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onDropImage(file);
      }
    }
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAbout(editingAbout);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div
      className="w-full bg-[#d9d9d9] min-h-screen py-0 px-0 sm:py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#d9d9d9' }}
    >
      <div className="w-full sm:max-w-7xl sm:mx-auto sm:space-y-8">
        {/* Studio Dashboard Title: Non-sticky (scrolls naturally) */}
        <div className="pt-6 pb-2 px-4 sm:px-0 w-full">
          <h1 className="font-phenomena-bold text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Studio Dashboard
          </h1>
        </div>

        {/* Sticky Tab Filter Bar (Only the filter bar is sticky, no background) */}
        <div className="sticky top-0 sm:top-16 z-30 bg-transparent py-2.5 px-4 sm:px-0 w-full transition-all flex items-center justify-between gap-3 overflow-visible">
        {/* Dashboard Tab Switcher: Icons on mobile when inactive, text on desktop */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap p-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm max-w-full">
            {/* Filter 1: Project */}
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'projects'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Projects"
            >
              <FolderGit2 className="w-3.5 h-3.5 shrink-0 sm:hidden" />
              <span className={activeTab === 'projects' ? 'inline' : 'hidden sm:inline'}>
                Project ({projects.length})
              </span>
            </button>

            {/* Filter 2: About */}
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'about'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="About"
            >
              <Building className="w-3.5 h-3.5 shrink-0 sm:hidden" />
              <span className={activeTab === 'about' ? 'inline' : 'hidden sm:inline'}>
                About
              </span>
            </button>

            {/* Filter 3: Navigation on footer */}
            <button
              type="button"
              onClick={() => setActiveTab('nav_footer')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'nav_footer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Navigation on footer"
            >
              <Layout className="w-3.5 h-3.5 shrink-0 sm:hidden" />
              <span className={activeTab === 'nav_footer' ? 'inline' : 'hidden sm:inline'}>
                Navigation on footer
              </span>
            </button>

            {/* Filter 4: Client Briefs */}
            <button
              type="button"
              onClick={() => setActiveTab('briefs')}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'briefs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Client Briefs"
            >
              <FileText className="w-3.5 h-3.5 shrink-0 sm:hidden" />
              <span className={activeTab === 'briefs' ? 'inline' : 'hidden sm:inline'}>
                Client Briefs ({submittedBriefs.length})
              </span>
            </button>
          </div>

          {activeTab === 'projects' && (
            <button
              onClick={() => {
                if (window.confirm('Reset portfolio back to 4 default projects in Firestore?')) {
                  onResetDefaults();
                }
              }}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="Restore 4 initial projects"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
      </div>

      {/* =====================================================================
         FILTER 4: CLIENT BRIEFS & LEADS INBOX
         ===================================================================== */}
      {activeTab === 'briefs' ? (
        <div className="w-full space-y-0 divide-y divide-black sm:space-y-8 sm:divide-y-0">
          <div className="w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-none sm:shadow-sm">
            {/* Header & Sticky Filter */}
            <div className="sticky top-12 sm:top-28 z-20 bg-white/95 backdrop-blur-md pb-4 pt-1 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Client Briefs &amp; Direct Leads
                </h2>
              </div>

              {/* Desktop View: Horizontal Filter Tabs */}
              <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                {[
                  { id: 'all', label: `All (${submittedBriefs.length})` },
                  { id: 'unread', label: `Unread (${unreadBriefsCount})` },
                  { id: 'read', label: `Read (${readBriefsCount})` },
                ].map(tab => {
                  const isSel = briefFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setBriefFilter(tab.id as any)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        isSel
                          ? 'bg-slate-900 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Mobile View: Compressed Dropdown Filter (Sticky & Only active shows) */}
              <div className="relative sm:hidden w-fit self-start">
                <button
                  type="button"
                  onClick={() => setIsBriefFilterDropdownOpen(prev => !prev)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <span>
                    {briefFilter === 'unread'
                      ? `Unread (${unreadBriefsCount})`
                      : briefFilter === 'read'
                      ? `Read (${readBriefsCount})`
                      : `All (${submittedBriefs.length})`}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isBriefFilterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBriefFilterDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsBriefFilterDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1.5 w-44 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      {[
                        { id: 'all', label: `All (${submittedBriefs.length})` },
                        { id: 'unread', label: `Unread (${unreadBriefsCount})` },
                        { id: 'read', label: `Read (${readBriefsCount})` },
                      ].map(tab => {
                        const isSel = briefFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              setBriefFilter(tab.id as any);
                              setIsBriefFilterDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between gap-2 transition-all cursor-pointer ${
                              isSel
                                ? 'bg-slate-900 text-white font-bold'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{tab.label}</span>
                            {isSel && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {filteredBriefs.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No briefs match this filter</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Try switching filters or submit a test brief from the inquiry form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBriefs.map((brief, idx) => {
                  const isUnread = brief.status === 'new' || brief.status === 'unread' || !brief.status;
                  const briefKey = brief.referenceId || brief.id || String(idx);

                  return (
                    <div
                      key={briefKey}
                      onClick={() => handleOpenDetails(brief)}
                      className={`p-5 sm:p-6 rounded-2xl space-y-4 transition-all shadow-2xs cursor-pointer border ${
                        isUnread
                          ? 'bg-slate-50/80 border-slate-300 hover:border-slate-400'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-mono-numbers font-bold text-slate-600 uppercase tracking-wider bg-slate-200/80 px-2 py-0.5 rounded-md">
                              REF: {brief.referenceId || 'N/A'}
                            </span>

                            {/* Read / Unread Tag (No yellow border) */}
                            {isUnread ? (
                              <span className="text-[10px] font-bold text-slate-800 bg-slate-200/90 border border-slate-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Unread
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Read
                              </span>
                            )}

                            <span className="text-xs font-bold text-slate-900">
                              {brief.businessName || 'Unnamed Business'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-light">
                              ({brief.industry || 'General'})
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                            {brief.fullName} — <span className="text-slate-600 font-normal">{brief.service}</span>
                          </h3>
                        </div>

                        {/* Mobile Action Menu: Hamburger Menu (sm:hidden) */}
                        <div className="relative self-end sm:hidden" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveBriefMenuId(prev => (prev === briefKey ? null : briefKey))
                            }
                            className="p-2 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                            title="Actions Menu"
                          >
                            <Menu className="w-4 h-4" />
                          </button>

                          {activeBriefMenuId === briefKey && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveBriefMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                                {/* 1. Details */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveBriefMenuId(null);
                                    handleOpenDetails(brief);
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                                >
                                  <Eye className="w-4 h-4 text-sky-600 shrink-0" />
                                  <span>Details</span>
                                </button>

                                {/* 2. Download PDF */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveBriefMenuId(null);
                                    try {
                                      const docPdf = generateBriefPdf(brief);
                                      docPdf.save(`VDVC_Brief_${(brief.businessName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                                    } catch (e) {
                                      console.error('PDF error:', e);
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                                >
                                  <FileText className="w-4 h-4 text-slate-700 shrink-0" />
                                  <span>Download PDF</span>
                                </button>

                                {/* 3. Check mark (Mark as Read / Unread) */}
                                <button
                                  type="button"
                                  onClick={e => {
                                    setActiveBriefMenuId(null);
                                    handleToggleReadStatus(brief, e);
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                                >
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>{isUnread ? 'Mark as Read' : 'Mark as Unread'}</span>
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                {/* 4. Delete: Highlighted with a red icon and red border */}
                                <button
                                  type="button"
                                  onClick={async e => {
                                    setActiveBriefMenuId(null);
                                    e.stopPropagation();
                                    if (window.confirm(`Delete brief REF ${brief.referenceId || brief.id}?`)) {
                                      try {
                                        if (brief.referenceId) {
                                          await deleteDoc(doc(db, 'briefs', brief.referenceId));
                                        }
                                      } catch {
                                        // fallback local
                                      }
                                      setSubmittedBriefs(prev =>
                                        prev.filter(b => (b.referenceId || b.id) !== briefKey)
                                      );
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>Delete Brief</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Desktop Action Buttons: Visible directly on desktop */}
                        <div className="hidden sm:flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(brief)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const docPdf = generateBriefPdf(brief);
                                docPdf.save(`VDVC_Brief_${(brief.businessName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                              } catch (e) {
                                console.error('PDF error:', e);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-700" />
                            <span>Download PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={e => handleToggleReadStatus(brief, e)}
                            className="p-1.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                            title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                          >
                            <Check className={`w-4 h-4 ${isUnread ? 'text-slate-400' : 'text-emerald-600'}`} />
                          </button>

                          <button
                            type="button"
                            onClick={async e => {
                              e.stopPropagation();
                              if (window.confirm(`Delete brief REF ${brief.referenceId || brief.id}?`)) {
                                try {
                                  if (brief.referenceId) {
                                    await deleteDoc(doc(db, 'briefs', brief.referenceId));
                                  }
                                } catch {
                                  // fallback local
                                }
                                setSubmittedBriefs(prev =>
                                  prev.filter(b => (b.referenceId || b.id) !== briefKey)
                                );
                              }
                            }}
                            className="p-1.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-all cursor-pointer"
                            title="Delete brief"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact</span>
                          <div className="font-semibold text-slate-900 mt-0.5">{brief.email}</div>
                          <div className="text-slate-500 font-mono-numbers">{brief.phone || 'No phone provided'}</div>
                          <div className="text-[11px] text-slate-600 mt-1">Prefers: <strong className="text-slate-800">{brief.preferredContact}</strong></div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Timeline &amp; Budget</span>
                          <div className="font-semibold text-slate-900 mt-0.5">{brief.budgetBand || brief.budgetType || 'N/A'}</div>
                          <div className="text-slate-600">Timeline: {brief.timelineType === 'weeks' ? `${brief.timelineWeeks} Weeks` : brief.timelineType}</div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200/60 lg:col-span-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Goals &amp; Deliverables</span>
                          <div className="text-slate-800 font-medium mt-0.5">
                            {brief.projectType ? `${brief.projectType} — ` : ''}
                            {Array.isArray(brief.goals) ? brief.goals.join(', ') : 'N/A'}
                          </div>
                          {brief.feelMood && <div className="text-slate-500 text-[11px] mt-1">Style: {brief.feelMood}</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'nav_footer' ? (
        <form onSubmit={handleSaveAbout} className="w-full space-y-0 divide-y divide-black sm:space-y-8 sm:divide-y-0">
          <div className="w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 p-6 sm:p-10 lg:p-12 space-y-6 shadow-none sm:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Navigation &amp; Footer Configuration
                </h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Brand name, logo image, and global footer tags.
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-800">
                <Layout className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Website / Studio Title
                </label>
                <input
                  type="text"
                  value={editingAbout.websiteName || ''}
                  onChange={e => setEditingAbout(prev => ({ ...prev, websiteName: e.target.value }))}
                  placeholder="VAPOURDENSE VIRTUAL CAFE"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Navbar Logo (Upload from Device or Drop Link)
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    {editingAbout.logoUrl ? (
                      <img
                        src={editingAbout.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingAbout.logoUrl || ''}
                    onChange={e => setEditingAbout(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="/VDVC 4 - Logo - NO-TEXT-TRANSPARENT-BG.png or image link"
                    className="flex-1 px-4 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono"
                  />
                  <label
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shrink-0 transition-colors shadow-sm flex items-center justify-center"
                    title="Upload logo from device (auto-compressed)"
                  >
                    <Plus className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleNavbarLogoUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  value={editingAbout.footerTagline || ''}
                  onChange={e => setEditingAbout(prev => ({ ...prev, footerTagline: e.target.value }))}
                  placeholder="a flexible system for your paper workloads"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Footer Location
                </label>
                <input
                  type="text"
                  value={editingAbout.footerLocation || ''}
                  onChange={e => setEditingAbout(prev => ({ ...prev, footerLocation: e.target.value }))}
                  placeholder="Jos, Plateau State // UNIJOS"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Footer Rights
                </label>
                <input
                  type="text"
                  value={editingAbout.footerRights || ''}
                  onChange={e => setEditingAbout(prev => ({ ...prev, footerRights: e.target.value }))}
                  placeholder="All rights reserved"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSavedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{isSavedNotice ? 'Saved to Firestore!' : 'Save Navbar & Footer'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : activeTab === 'about' ? (
        /* ===================================================================
           FILTER 2: ABOUT SECTION & ACCORDIONS (Dynamic Section Management)
           =================================================================== */
        <form onSubmit={handleSaveAbout} className="w-full space-y-0 divide-y divide-black sm:space-y-8 sm:divide-y-0">
          {/* SECTION 1: ABOUT PICTURE */}
          <div className="w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 p-6 sm:p-10 lg:p-12 space-y-6 shadow-none sm:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  About Picture
                </h2>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-800">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>

            <div>
              {/* Picture URL or Upload */}
              <div className="space-y-2 max-w-xl">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Picture Link or Device Upload
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    {editingAbout.founderImage ? (
                      <img
                        src={editingAbout.founderImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingAbout.founderImage || ''}
                    onChange={e => setEditingAbout(prev => ({ ...prev, founderImage: e.target.value }))}
                    placeholder="/VDVC 4 - Logo.png or paste image link"
                    className="flex-1 px-4 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono"
                  />
                  <label
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shrink-0 transition-colors shadow-sm flex items-center justify-center"
                    title="Upload picture from device (auto-compressed)"
                  >
                    <Plus className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleFounderImageUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Save Changes Button for Section 1 */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAbout}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSavedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{isSavedNotice ? 'Saved Changes!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: TEAM MEMBERS */}
          <div className="w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 p-6 sm:p-10 lg:p-12 space-y-6 shadow-none sm:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Team Members
                </h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Team members and roles
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-800">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Founder / Lead Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Founder Name
                </label>
                <input
                  type="text"
                  value={editingAbout.ceoName || editingAbout.founderName || ''}
                  onChange={e =>
                    setEditingAbout(prev => ({
                      ...prev,
                      ceoName: e.target.value,
                      founderName: e.target.value,
                    }))
                  }
                  placeholder="_TURBOFAN"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 uppercase font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingAbout.ceoTitle !== undefined ? editingAbout.ceoTitle : 'CEO'}
                  onChange={e => setEditingAbout(prev => ({ ...prev, ceoTitle: e.target.value }))}
                  placeholder="CEO"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 uppercase"
                />
              </div>
            </div>

            {/* Team Members List */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Team Members ({teamMembersList.length})
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-3">
                {teamMembersList.map((member, idx) => (
                  <div
                    key={member.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {member.name || 'Untitled Member'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-auto">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveTeamMember(idx, 'up')}
                          className={`p-1 rounded-lg ${
                            idx === 0
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer'
                          }`}
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === teamMembersList.length - 1}
                          onClick={() => handleMoveTeamMember(idx, 'down')}
                          className={`p-1 rounded-lg ${
                            idx === teamMembersList.length - 1
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer'
                          }`}
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeamMember(idx)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      {/* Member Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={e => handleUpdateTeamMember(idx, 'name', e.target.value)}
                          placeholder="Member name"
                          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-semibold"
                        />
                      </div>

                      {/* Member Role */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={e => handleUpdateTeamMember(idx, 'role', e.target.value)}
                          placeholder="Role"
                          className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      {/* Avatar upload / URL */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Avatar
                        </label>
                        <div className="flex items-center gap-2">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-7 h-7 rounded-full object-cover bg-slate-200 border border-black/10 shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <input
                            type="text"
                            value={member.avatarUrl || ''}
                            onChange={e => handleUpdateTeamMember(idx, 'avatarUrl', e.target.value)}
                            placeholder="Avatar URL or upload"
                            className="flex-1 px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono text-[11px]"
                          />
                          <label className="p-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-slate-700 cursor-pointer shrink-0 transition-colors" title="Upload avatar from device">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                  handleMemberAvatarUpload(idx, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {teamMembersList.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No team members added yet. Click &quot;Add Member&quot; to add one.
                  </div>
                )}
              </div>
            </div>

            {/* Save Changes Button for Section 2 */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAbout}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSavedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{isSavedNotice ? 'Saved Changes!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: CONTACT & SOCIAL CHANNELS */}
          <div className="w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 p-6 sm:p-10 lg:p-12 space-y-6 shadow-none sm:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Contact &amp; Social Channels
                </h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Phone numbers, email addresses, and social media buttons
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-800">
                <Phone className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Numbers List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Phone Numbers ({phoneItemsList.length})
                  </label>
                  {phoneItemsList.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddPhoneItem}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Phone</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {phoneItemsList.map((ph, idx) => (
                    <div key={ph.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Phone #{idx + 1}
                        </span>
                        {phoneItemsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoneItem(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Remove phone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Number
                          </label>
                          <input
                            type="text"
                            value={ph.number || ''}
                            onChange={e => handleUpdatePhoneItem(idx, 'number', e.target.value)}
                            placeholder="0701 841 6894"
                            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono-numbers"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Icon (Upload or Link)
                          </label>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 p-1">
                              {ph.iconUrl ? (
                                <img src={ph.iconUrl} alt="Phone icon" className="w-5 h-5 object-contain" />
                              ) : (
                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </div>
                            <input
                              type="text"
                              value={ph.iconUrl || ''}
                              onChange={e => handleUpdatePhoneItem(idx, 'iconUrl', e.target.value)}
                              placeholder="Paste icon URL or upload"
                              className="flex-1 min-w-0 px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono text-[11px]"
                            />
                            <label className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shrink-0 transition-colors shadow-2xs" title="Upload phone icon from device">
                              <Plus className="w-3.5 h-3.5" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    handlePhoneIconUpload(idx, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Addresses List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email Addresses ({emailItemsList.length})
                  </label>
                  {emailItemsList.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddEmailItem}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Email</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {emailItemsList.map((em, idx) => (
                    <div key={em.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Email #{idx + 1}
                        </span>
                        {emailItemsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEmailItem(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Remove email"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={em.email || ''}
                            onChange={e => handleUpdateEmailItem(idx, 'email', e.target.value)}
                            placeholder="vapourdense@gmail.com"
                            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Icon (Upload or Link)
                          </label>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 p-1">
                              {em.iconUrl ? (
                                <img src={em.iconUrl} alt="Email icon" className="w-5 h-5 object-contain" />
                              ) : (
                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </div>
                            <input
                              type="text"
                              value={em.iconUrl || ''}
                              onChange={e => handleUpdateEmailItem(idx, 'iconUrl', e.target.value)}
                              placeholder="Paste icon URL or upload"
                              className="flex-1 min-w-0 px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono text-[11px]"
                            />
                            <label className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shrink-0 transition-colors shadow-2xs" title="Upload email icon from device">
                              <Plus className="w-3.5 h-3.5" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleEmailIconUpload(idx, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media Buttons Manager */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Social Media Buttons ({socialLinksList.length})
                  </label>
                  <p className="text-[11px] text-slate-500 truncate">
                    Upload icon from device or provide an icon link, and set the destination URL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Social Icon</span>
                </button>
              </div>

              <div className="space-y-3">
                {socialLinksList.map((soc, idx) => {
                  const getPresetIcon = (name: string) => {
                    const p = (name || '').toLowerCase();
                    if (p.includes('instagram')) return Instagram;
                    if (p.includes('twitter') || p.includes('x')) return Twitter;
                    if (p.includes('linkedin')) return Linkedin;
                    if (p.includes('github')) return Github;
                    if (p.includes('dribbble')) return Dribbble;
                    if (p.includes('whatsapp')) return MessageCircle;
                    return Globe;
                  };
                  const FallbackIcon = getPresetIcon(soc.platform);

                  return (
                    <div
                      key={soc.id || idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 transition-all min-w-0 overflow-hidden"
                    >
                      {/* Top bar: Index, Platform/Label & Actions */}
                      <div className="flex items-center justify-between gap-3 min-w-0">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={soc.platform || ''}
                            onChange={e => handleUpdateSocialLink(idx, 'platform', e.target.value)}
                            placeholder="Platform / Label (e.g. Instagram, WhatsApp)"
                            className="w-full sm:max-w-xs px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSocialLink(idx, 'up')}
                            className={`p-1.5 rounded-lg ${
                              idx === 0
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer'
                            }`}
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === socialLinksList.length - 1}
                            onClick={() => handleMoveSocialLink(idx, 'down')}
                            className={`p-1.5 rounded-lg ${
                              idx === socialLinksList.length - 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer'
                            }`}
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSocialLink(idx)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete social button"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Inputs: Icon & Destination Link */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1 min-w-0">
                        {/* Icon Field: Device Upload OR Icon Link */}
                        <div className="lg:col-span-6 space-y-1.5 min-w-0">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            1. Icon (Upload from Device OR Link)
                          </label>
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Live Icon Preview */}
                            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 p-1">
                              {soc.iconUrl ? (
                                <img
                                  src={soc.iconUrl}
                                  alt="Icon preview"
                                  className="w-6 h-6 object-contain"
                                />
                              ) : (
                                <FallbackIcon className="w-5 h-5 text-slate-700" />
                              )}
                            </div>

                            {/* Icon Link Input */}
                            <input
                              type="text"
                              value={soc.iconUrl || ''}
                              onChange={e => handleUpdateSocialLink(idx, 'iconUrl', e.target.value)}
                              placeholder="Paste icon image URL or upload ->"
                              className="flex-1 min-w-0 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono text-[11px]"
                            />

                            {/* Upload Icon Button */}
                            <label className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs" title="Upload Icon from device">
                              <Plus className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleSocialIconUpload(idx, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Destination Link Input */}
                        <div className="lg:col-span-6 space-y-1.5 min-w-0">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            2. Destination Link (Where icon clicks to)
                          </label>
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                              <LinkIcon className="w-4 h-4" />
                            </div>
                            <input
                              type="url"
                              value={soc.url || ''}
                              onChange={e => handleUpdateSocialLink(idx, 'url', e.target.value)}
                              placeholder="https://instagram.com/yourhandle or https://wa.me/..."
                              className="flex-1 min-w-0 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {socialLinksList.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No social icons added yet. Click &quot;Add Social Icon&quot; to add one.
                  </div>
                )}
              </div>
            </div>

            {/* Save Changes Button for Section 3 */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAbout}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSavedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{isSavedNotice ? 'Saved Changes!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC ABOUT ACCORDION SECTIONS (Full Reordering, Table Drawer with Colors, Software, Lists) */}
          <div className="w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 p-6 sm:p-10 lg:p-12 space-y-6 shadow-none sm:shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  About Accordion Sections ({activeSections.length})
                </h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Reorder, customize themes, draw tables with text colors, add software, and create new sections.
                </p>
              </div>

              {/* + Add New Section Button */}
              <button
                type="button"
                onClick={handleAddNewSection}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Section</span>
              </button>
            </div>

            {/* Sections List */}
            <div className="space-y-5">
              {activeSections.map((sec, sIdx) => {
                const isExpanded = expandedSectionId === sec.id;

                return (
                  <div
                    key={sec.id || sIdx}
                    className="rounded-2xl border border-slate-200/90 bg-slate-50/70 overflow-hidden transition-all shadow-xs"
                  >
                    {/* Section Header Bar with Reordering Arrows */}
                    <div className="p-4 bg-white border-b border-slate-200/70 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                          <button
                            type="button"
                            disabled={sIdx === 0}
                            onClick={() => handleMoveSection(sIdx, 'up')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              sIdx === 0
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-white hover:shadow-xs cursor-pointer'
                            }`}
                            title="Move Section Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={sIdx === activeSections.length - 1}
                            onClick={() => handleMoveSection(sIdx, 'down')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              sIdx === activeSections.length - 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-white hover:shadow-xs cursor-pointer'
                            }`}
                            title="Move Section Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div
                          onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                          className="cursor-pointer min-w-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono-numbers font-bold text-slate-400">
                              #{String(sIdx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 truncate">
                              {sec.category || 'Untitled Section'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 uppercase">
                              {sec.type || 'text'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 truncate block mt-0.5">
                            {sec.tagline || 'No tagline specified'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {isExpanded ? 'Collapse' : 'Edit Section'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sIdx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Detailed Edit Area */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 space-y-6 bg-slate-50/40">
                        {/* 1. Main Name & 2. Tagline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                              Main Name (Top Header)
                            </label>
                            <input
                              type="text"
                              value={sec.category || ''}
                              onChange={e => handleUpdateSection(sIdx, { category: e.target.value.toUpperCase() })}
                              placeholder="e.g. WELCOME, SERVICES, GUARANTEE"
                              className="w-full px-3.5 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                              Section Tagline (Subtitle)
                            </label>
                            <input
                              type="text"
                              value={sec.tagline || ''}
                              onChange={e => handleUpdateSection(sIdx, { tagline: e.target.value })}
                              placeholder="e.g. SUP, I'M _TURBOFAN"
                              className="w-full px-3.5 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                            />
                          </div>
                        </div>

                        {/* Format / Organizational Theme Switcher */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Organizational Theme / Content Type
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { id: 'text', label: 'Rich Text', icon: FileText },
                              { id: 'table', label: 'Table Drawer', icon: TableIcon },
                              { id: 'software', label: 'Software Suite', icon: Cpu },
                              { id: 'list', label: 'Numbered List', icon: List },
                              { id: 'grid', label: '2-Col Grid', icon: Grid },
                            ].map(theme => {
                              const Icon = theme.icon;
                              const isSel = (sec.type || 'text') === theme.id;
                              return (
                                <button
                                  key={theme.id}
                                  type="button"
                                  onClick={() => handleUpdateSection(sIdx, { type: theme.id as any })}
                                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    isSel
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span>{theme.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. TYPE 1: RICH TEXT / PARAGRAPH */}
                        {(sec.type === 'text' || sec.type === 'custom' || !sec.type) && (
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                Text Narrative Content
                              </label>
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-slate-400">Spacing Theme:</span>
                                {['spaced', 'compact', 'boxed'].map(themeKey => (
                                  <button
                                    key={themeKey}
                                    type="button"
                                    onClick={() => handleUpdateSection(sIdx, { layoutTheme: themeKey as any })}
                                    className={`px-2 py-0.5 rounded-lg capitalize text-[11px] font-medium transition-colors cursor-pointer ${
                                      (sec.layoutTheme || 'spaced') === themeKey
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {themeKey}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <textarea
                              rows={4}
                              value={sec.content || ''}
                              onChange={e => handleUpdateSection(sIdx, { content: e.target.value })}
                              placeholder="Write your text content here..."
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 leading-relaxed resize-y"
                            />
                          </div>
                        )}

                        {/* TYPE 2: TABLE DRAWER WITH COLOR UTILITY */}
                        {sec.type === 'table' && (
                          <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200/80">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <div>
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                                  Table Drawer &amp; Text Color Utility
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Define timeframe brackets, multipliers, and custom color accents for each row.
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddTableRow(sIdx)}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Table Row</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {(sec.tableRows || []).map((row, rIdx) => (
                                <div
                                  key={row.id || rIdx}
                                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                        Bracket
                                      </label>
                                      <input
                                        type="text"
                                        value={row.bracket || ''}
                                        onChange={e => handleUpdateTableRow(sIdx, rIdx, 'bracket', e.target.value)}
                                        placeholder="FLEXIBLE / STANDARD"
                                        className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                        Timeframe
                                      </label>
                                      <input
                                        type="text"
                                        value={row.timeframe || ''}
                                        onChange={e => handleUpdateTableRow(sIdx, rIdx, 'timeframe', e.target.value)}
                                        placeholder="1 WK / 24 HRS"
                                        className="w-full px-2.5 py-1.5 text-xs font-mono-numbers text-slate-800 bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                        Multiplier / Price Delta
                                      </label>
                                      <input
                                        type="text"
                                        value={row.multiplier || ''}
                                        onChange={e => handleUpdateTableRow(sIdx, rIdx, 'multiplier', e.target.value)}
                                        placeholder="+25% / BASELINE"
                                        className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>
                                    {/* Color Utility */}
                                    <div>
                                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                        Text Color Accent
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="color"
                                          value={row.textColor || '#1e293b'}
                                          onChange={e => handleUpdateTableRow(sIdx, rIdx, 'textColor', e.target.value)}
                                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 bg-white p-0.5"
                                          title="Pick custom color"
                                        />
                                        <div className="flex items-center gap-1">
                                          {COLOR_PRESETS.map(preset => (
                                            <button
                                              key={preset.value}
                                              type="button"
                                              onClick={() => handleUpdateTableRow(sIdx, rIdx, 'textColor', preset.value)}
                                              className="w-4 h-4 rounded-full border border-black/20 cursor-pointer transition-transform hover:scale-125"
                                              style={{ backgroundColor: preset.value }}
                                              title={preset.label}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                        What It Means (Description)
                                      </label>
                                      <input
                                        type="text"
                                        value={row.meaning || ''}
                                        onChange={e => handleUpdateTableRow(sIdx, rIdx, 'meaning', e.target.value)}
                                        placeholder="Explanation of delivery tier..."
                                        className="w-full px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTableRow(sIdx, rIdx)}
                                      className="text-rose-500 hover:text-rose-700 p-2 self-end cursor-pointer"
                                      title="Delete Table Row"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TYPE 3: SOFTWARE SUITE MANAGER */}
                        {sec.type === 'software' && (
                          <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200/80">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <div>
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                                  Software &amp; Creative Tools Manager
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Add software tools with names, logo URLs, badges, and descriptions.
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddSoftwareTool(sIdx)}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Software</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(sec.tools || []).map((tool, tIdx) => (
                                <div
                                  key={tool.id || tIdx}
                                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      value={tool.name || ''}
                                      onChange={e => handleUpdateSoftwareTool(sIdx, tIdx, 'name', e.target.value)}
                                      placeholder="Software Name"
                                      className="flex-1 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSoftwareTool(sIdx, tIdx)}
                                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
                                      title="Delete Software"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">
                                        Badge Code
                                      </label>
                                      <input
                                        type="text"
                                        value={tool.code || ''}
                                        onChange={e => handleUpdateSoftwareTool(sIdx, tIdx, 'code', e.target.value)}
                                        placeholder="Ps, Ai, Word"
                                        className="w-full px-2 py-1 text-xs font-mono-numbers bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">
                                        Custom Logo URL
                                      </label>
                                      <input
                                        type="text"
                                        value={tool.logoUrl || ''}
                                        onChange={e => handleUpdateSoftwareTool(sIdx, tIdx, 'logoUrl', e.target.value)}
                                        placeholder="https://... / logo.png"
                                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">
                                      Description
                                    </label>
                                    <input
                                      type="text"
                                      value={tool.desc || ''}
                                      onChange={e => handleUpdateSoftwareTool(sIdx, tIdx, 'desc', e.target.value)}
                                      placeholder="Image Editing, Vector & Logos"
                                      className="w-full px-2 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TYPE 4 & 5: LIST OR GRID ITEMS */}
                        {(sec.type === 'list' || sec.type === 'grid') && (
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Items List ({sec.items?.length || 0})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const items = [...(sec.items || []), 'New Deliverable or Service Item'];
                                  handleUpdateSection(sIdx, { items });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Item</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {(sec.items || []).map((item, iIdx) => (
                                <div key={iIdx} className="flex items-center gap-2">
                                  <span className="w-6 text-xs font-mono-numbers text-slate-400 text-center font-bold">
                                    {iIdx + 1}.
                                  </span>
                                  <input
                                    type="text"
                                    value={item || ''}
                                    onChange={e => {
                                      const updatedItems = [...(sec.items || [])];
                                      updatedItems[iIdx] = e.target.value;
                                      handleUpdateSection(sIdx, { items: updatedItems });
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedItems = (sec.items || []).filter((_, idx2) => idx2 !== iIdx);
                                      handleUpdateSection(sIdx, { items: updatedItems });
                                    }}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TYPE 6: CONTACT CARD */}
                        {sec.type === 'contact' && (
                          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80">
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
                              Contact Section Details
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                  Contact Phone
                                </label>
                                <input
                                  type="text"
                                  value={sec.phone || editingAbout.phone || ''}
                                  onChange={e => handleUpdateSection(sIdx, { phone: e.target.value })}
                                  placeholder="0701 841 6894"
                                  className="w-full px-3 py-1.5 text-xs font-mono-numbers bg-slate-50 border border-slate-200 rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                  Contact Email
                                </label>
                                <input
                                  type="email"
                                  value={sec.email || editingAbout.email || ''}
                                  onChange={e => handleUpdateSection(sIdx, { email: e.target.value })}
                                  placeholder="vapourdense@gmail.com"
                                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                                Contact Note / Narrative
                              </label>
                              <textarea
                                rows={3}
                                value={sec.content || ''}
                                onChange={e => handleUpdateSection(sIdx, { content: e.target.value })}
                                placeholder="Details regarding office hours, student schedule, transit..."
                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-y"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Section Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddNewSection}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-800 bg-slate-50 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Another Section to About Page</span>
              </button>
            </div>

            {/* Save All Changes Action Bar */}
            {/* Save Changes Button for Section 4 */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveAbout}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSavedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{isSavedNotice ? 'Saved Changes!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* ===================================================================
           FILTER 1: PROJECT (Projects table with big delete buttons)
           =================================================================== */
        <>
          {/* Single Unified Container for Filter, Drag & Drop, and Projects Table/Cards */}
          <div className="w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 p-4 sm:p-8 lg:p-10 shadow-none sm:shadow-sm space-y-6 sm:space-y-0 sm:flex sm:flex-col sm:max-h-[calc(100vh-14rem)] sm:overflow-hidden">
            <div className="sticky top-12 sm:static z-20 bg-white pb-4 pt-1 flex flex-row items-center justify-between gap-2 sm:gap-4 border-b border-slate-100 shrink-0">
              {/* Desktop View: Horizontal Category Tabs */}
              <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                {CATEGORIES.map(category => {
                  const isSel = selectedCategory === category;
                  const getCatIcon = () => {
                    if (category === 'Graphic Design') return <Palette className="w-3.5 h-3.5" />;
                    if (category === 'Web Design') return <Globe className="w-3.5 h-3.5" />;
                    return <FolderGit2 className="w-3.5 h-3.5" />;
                  };
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-slate-900 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {getCatIcon()}
                      <span>{category === 'All' ? 'All Projects' : category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile View: Compressed Category Dropdown (Sticky & Only active filter shows) */}
              <div className="relative sm:hidden w-fit">
                <button
                  type="button"
                  onClick={() => setIsProjectCategoryDropdownOpen(prev => !prev)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  {selectedCategory === 'Graphic Design' ? (
                    <Palette className="w-3.5 h-3.5" />
                  ) : selectedCategory === 'Web Design' ? (
                    <Globe className="w-3.5 h-3.5" />
                  ) : (
                    <FolderGit2 className="w-3.5 h-3.5" />
                  )}
                  <span>{selectedCategory === 'All' ? 'All Projects' : selectedCategory}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProjectCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProjectCategoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProjectCategoryDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1.5 w-48 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      {CATEGORIES.map(category => {
                        const isSel = selectedCategory === category;
                        const getCatIcon = () => {
                          if (category === 'Graphic Design') return <Palette className="w-3.5 h-3.5" />;
                          if (category === 'Web Design') return <Globe className="w-3.5 h-3.5" />;
                          return <FolderGit2 className="w-3.5 h-3.5" />;
                        };
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsProjectCategoryDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between gap-2 transition-all cursor-pointer ${
                              isSel
                                ? 'bg-slate-900 text-white font-bold'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {getCatIcon()}
                              <span>{category === 'All' ? 'All Projects' : category}</span>
                            </div>
                            {isSel && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Right Aligned Controls: Search Icon (expandable) and Add Project Button (icon only) */}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                {isSearchExpanded || searchQuery ? (
                  <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery || ''}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-32 sm:w-56 pl-8 pr-7 py-1.5 sm:py-2 text-xs text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-slate-800 transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchExpanded(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      title="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                    title="Search projects"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onAddNew}
                  className="p-2 sm:p-2.5 text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer shrink-0"
                  title="Add Project"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Container on Desktop: Drag & Drop + Projects Table scroll together inside */}
            <div className="space-y-6 sm:overflow-y-auto sm:flex-1 sm:min-h-0 sm:pt-6 sm:pr-2">
              {/* Drag & Drop Visual Hint Section (Non-sticky, scrolls away with projects) */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-5 sm:p-6 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
                  isDragOver
                    ? 'border-slate-800 bg-slate-200/80 shadow-inner'
                    : 'border-slate-300 bg-slate-50/70 hover:bg-white hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-3 text-slate-600 text-xs">
                  <UploadCloud className="w-5 h-5 text-slate-800" />
                  <span>Drag &amp; drop an image here anytime to create a new project in Firestore</span>
                </div>
              </div>

              {/* Projects Table & Mobile Cards Section */}
              <div className="overflow-x-auto pt-1">
              {/* Mobile View Cards (block sm:hidden) with subtle border box around each item */}
              <div className="block sm:hidden space-y-3">
                {filteredProjects.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-light">
                    No projects found.
                  </div>
                ) : (
                  filteredProjects.map(proj => {
                    const heroImg = proj.images && proj.images.length > 0 ? proj.images[0] : null;
                    return (
                      <div
                        key={proj.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
                      >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            {heroImg ? (
                              <img
                                src={heroImg}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                N/A
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">
                              {proj.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono-numbers block">
                              {proj.id}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                          {proj.category}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Client</span>
                          <span className="text-slate-800 font-medium">{proj.client}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fee / Year</span>
                          <span className="text-slate-800 font-mono-numbers">{proj.price || 'Undisclosed'} ({proj.year})</span>
                        </div>
                      </div>

                      {proj.descriptors && (
                        <div className="text-xs text-slate-500 font-light">
                          {proj.descriptors}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => onEdit(proj)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onPreview(proj)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(proj.id)}
                          className="p-1.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-3.5 px-6">Project</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Descriptors</th>
                    <th className="py-3.5 px-4">Fee / Year</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-light">
                        No projects found.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map(proj => {
                      const heroImg = proj.images && proj.images.length > 0 ? proj.images[0] : null;
                      return (
                        <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                {heroImg ? (
                                  <img
                                    src={heroImg}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                    N/A
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block">
                                  {proj.title}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono-numbers">
                                  {proj.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-medium text-slate-600">
                            {proj.category}
                          </td>

                          <td className="py-4 px-4 text-slate-500">
                            {proj.client}
                          </td>

                          <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                            {proj.descriptors || proj.threeWordDesc || '—'}
                          </td>

                          <td className="py-4 px-4 font-mono-numbers text-slate-600">
                            <div>{proj.price || 'Undisclosed'}</div>
                            <div className="text-[11px] text-slate-400">
                              {proj.year}
                              {proj.duration ? ` · ${proj.duration}` : ''}
                            </div>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              {/* Edit Pen Button: Redirects directly to Project Show */}
                              <button
                                onClick={() => onEdit(proj)}
                                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                                title="Edit Project in Project Show"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* View Project Show Button */}
                              <button
                                onClick={() => onPreview(proj)}
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                                title="View Project Show"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Bigger Delete Button as requested */}
                              <button
                                onClick={() => setDeleteConfirmId(proj.id)}
                                className="p-2 sm:p-2.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border border-rose-200/80 transition-all cursor-pointer shadow-2xs"
                                title="Delete project"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {deleteConfirmId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeleteConfirmId(null)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-sm w-full shadow-2xl z-10 text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Delete Project?
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This will permanently delete this project record from Firestore database.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-3">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onDelete(deleteConfirmId);
                        setDeleteConfirmId(null);
                      }}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg transition-colors cursor-pointer"
                    >
                      Delete Forever
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
      </div>

      {/* Full-Screen Brief Details Modal (Portaled to document.body above navbar & footer) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedBriefModal && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBriefModal(null)}
                  className="fixed inset-0 bg-[#090132]/80 sm:bg-slate-950/85 backdrop-blur-2xl backdrop-saturate-150 transition-all"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 8 }}
                  className="relative bg-white rounded-none sm:rounded-3xl border-0 shadow-[0_25px_70px_rgba(0,0,0,0.6)] max-w-full sm:max-w-3xl xl:max-w-4xl w-full h-full sm:h-auto my-0 sm:my-auto z-10 overflow-hidden text-slate-900 flex flex-col max-h-full sm:max-h-[85vh]"
                >
              {/* Modal Header Bar - Seamless Dark Slate */}
              <div className="p-5 sm:p-6 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shrink-0">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono-numbers font-bold bg-white/10 px-2 py-0.5 rounded-md text-[#38bdf8]">
                      REF: {selectedBriefModal.referenceId || 'N/A'}
                    </span>
                    <span className="text-[11px] font-light text-slate-300">
                      {selectedBriefModal.submittedAt}
                    </span>
                    {selectedBriefModal.status === 'read' ? (
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Read
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-200 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Unread
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
                    {selectedBriefModal.businessName || 'Client Project Brief'}
                  </h2>
                  <p className="text-xs text-slate-300 font-light mt-0.5">
                    {selectedBriefModal.fullName} — {selectedBriefModal.service} ({selectedBriefModal.industry || 'General'})
                  </p>
                </div>

                {/* Top Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const docPdf = generateBriefPdf(selectedBriefModal);
                        docPdf.save(`VDVC_Brief_${(selectedBriefModal.businessName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                      } catch (e) {
                        console.error('PDF error:', e);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#003663] hover:bg-[#002647] border border-[#38bdf8]/40 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReadStatus(selectedBriefModal)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    {selectedBriefModal.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBriefModal(null)}
                    className="p-1.5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body Content (Responsive & Scrollable) */}
              <div className="p-5 sm:p-6 md:p-7 overflow-y-auto space-y-6 sm:space-y-7 flex-1 text-slate-800">
                {/* 1. CLIENT & BUSINESS DETAILS */}
                <div className="space-y-3">
                  <div className="border-b border-slate-200/80 pb-1.5">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                      1. Client &amp; Contact Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Client Name
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                        {selectedBriefModal.fullName}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Business &amp; Industry
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate">
                        {selectedBriefModal.businessName || 'Not specified'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {selectedBriefModal.industry}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Preferred Contact
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                        {selectedBriefModal.preferredContact}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${selectedBriefModal.email}`}
                        className="text-xs font-semibold text-sky-700 hover:underline block truncate"
                      >
                        {selectedBriefModal.email}
                      </a>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Phone Number
                      </span>
                      <a
                        href={`tel:${selectedBriefModal.phone}`}
                        className="text-xs font-semibold text-slate-800 hover:underline font-mono-numbers block"
                      >
                        {selectedBriefModal.phone || 'Not provided'}
                      </a>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Client Readiness
                      </span>
                      <span className="text-xs font-medium text-slate-800 block">
                        {selectedBriefModal.profileType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. PROJECT REQUIREMENTS */}
                <div className="space-y-3">
                  <div className="border-b border-slate-200/80 pb-1.5">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                      2. Project Requirements &amp; Scope
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Service Category
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                        {selectedBriefModal.service}
                      </span>
                    </div>

                    {selectedBriefModal.projectType && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Deliverable Type
                        </span>
                        <span className="text-xs font-bold text-slate-900 block">
                          {selectedBriefModal.projectType}
                        </span>
                      </div>
                    )}

                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Key Goals &amp; Objectives
                      </span>
                      <span className="text-xs font-semibold text-slate-800 block leading-relaxed">
                        {Array.isArray(selectedBriefModal.goals)
                          ? selectedBriefModal.goals.join(', ')
                          : 'General consultation'}
                        {selectedBriefModal.customGoal ? ` (${selectedBriefModal.customGoal})` : ''}
                      </span>
                    </div>

                    {selectedBriefModal.feelMood && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Design Direction / Mood
                        </span>
                        <span className="text-xs font-bold text-slate-900 block">
                          {selectedBriefModal.feelMood}
                        </span>
                      </div>
                    )}

                    {selectedBriefModal.feelDescription && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Style Description / Notes
                        </span>
                        <span className="text-xs text-slate-800 block">
                          {selectedBriefModal.feelDescription}
                        </span>
                      </div>
                    )}

                    {selectedBriefModal.referenceWebsiteLink && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 sm:col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Reference Website / Inspiration Link
                        </span>
                        <a
                          href={selectedBriefModal.referenceWebsiteLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-sky-700 hover:underline break-all"
                        >
                          {selectedBriefModal.referenceWebsiteLink}
                        </a>
                      </div>
                    )}

                    {selectedBriefModal.scopePages && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Page Count / Scope
                        </span>
                        <span className="text-xs font-bold text-slate-900 block">
                          {selectedBriefModal.scopePages}
                        </span>
                      </div>
                    )}

                    {selectedBriefModal.graphicQuantity && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Design Output Quantity
                        </span>
                        <span className="text-xs font-bold text-slate-900 block">
                          {selectedBriefModal.graphicQuantity}
                        </span>
                      </div>
                    )}

                    {selectedBriefModal.brandAssets && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Brand Assets Available
                        </span>
                        <span className="text-xs font-medium text-slate-800 block">
                          {selectedBriefModal.brandAssets}
                        </span>
                      </div>
                    )}

                    {selectedBriefModal.existingAssets && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Existing System / Assets
                        </span>
                        <span className="text-xs font-medium text-slate-800 block">
                          {selectedBriefModal.existingAssets}
                        </span>
                      </div>
                    )}

                    {selectedBriefModal.techStackPreference && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Tech Stack Preferences
                        </span>
                        <span className="text-xs font-medium text-slate-800 block">
                          {selectedBriefModal.techStackPreference}
                        </span>
                      </div>
                    )}

                    {selectedBriefModal.systemCurrentState && (
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          System Current State
                        </span>
                        <span className="text-xs font-medium text-slate-800 block">
                          {selectedBriefModal.systemCurrentState}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. TIMELINE & BUDGET */}
                <div className="space-y-3">
                  <div className="border-b border-slate-200/80 pb-1.5">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                      3. Timeline &amp; Budget
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Estimated Budget
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 font-mono-numbers block">
                        {selectedBriefModal.budgetBand || selectedBriefModal.budgetType || 'Not specified'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Target Delivery Window
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 block">
                        {selectedBriefModal.timelineType === 'weeks'
                          ? `${selectedBriefModal.timelineWeeks || 4} Weeks`
                          : selectedBriefModal.timelineType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200/80 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedBriefModal(null)}
                  className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300/90 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
};

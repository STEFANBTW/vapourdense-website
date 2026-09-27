import React, { useState } from 'react';
import {
  Mail,
  Phone,
  ChevronDown,
  Sparkles,
  FileText,
  Presentation,
  Sheet,
  Palette,
  Layers,
  Box,
  Code2,
  Brush,
  Compass,
  BookOpen,
  ArrowUpRight,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Dribbble,
  Globe,
  MessageCircle,
} from 'lucide-react';

export interface DisciplineItem {
  id: string;
  num: string;
  title: string;
  description: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  dribbble?: string;
  github?: string;
  arena?: string;
  whatsapp?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  handle?: string;
  iconUrl?: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface TableRowItem {
  id: string;
  bracket: string;
  timeframe: string;
  multiplier: string;
  meaning: string;
  textColor?: string;
}

export interface SoftwareToolItem {
  id: string;
  name: string;
  code?: string;
  logoUrl?: string;
  color?: string;
  desc?: string;
}

export interface AboutCustomSection {
  id: string;
  category: string; // The main name (e.g. 'WELCOME', 'SERVICES', etc.)
  tagline: string; // The sub-tagline (e.g. "SUP, I'M _TURBOFAN")
  type?: 'text' | 'list' | 'grid' | 'table' | 'software' | 'contact' | 'custom';
  content?: string;
  layoutTheme?: 'spaced' | 'compact' | 'boxed' | 'table' | 'grid' | 'bullets';
  items?: string[];
  tableRows?: TableRowItem[];
  tools?: SoftwareToolItem[];
  phone?: string;
  email?: string;
  socialLinks?: SocialLinkItem[];
}

export interface AboutData {
  studioName: string;
  founderName: string;
  bio: string;
  statement?: string;
  badge: string;
  founderImage: string;
  location?: string;
  available?: boolean;
  logoUrl?: string;
  disciplines: DisciplineItem[];
  sections?: AboutCustomSection[];
  phone: string;
  phones?: string[];
  email: string;
  emails?: string[];
  socials?: SocialLinks;
  socialLinks?: SocialLinkItem[];
  websiteName?: string;
  footerTagline?: string;
  footerLocation?: string;
  footerRights?: string;
  ceoName?: string;
  ceoTitle?: string;
  teamMembers?: TeamMemberItem[];
  founderImageScale?: number;
}

export const defaultFounderPortraitSvg = '/VDVC 4 - Logo.png';

export const defaultSocialLinks: SocialLinkItem[] = [
  { id: 'soc-1', platform: 'Instagram', url: 'https://instagram.com/vapourdense', handle: '@vapourdense' },
  { id: 'soc-2', platform: 'Twitter / X', url: 'https://x.com/vapourdense', handle: '@vapourdense' },
  { id: 'soc-3', platform: 'WhatsApp', url: 'https://wa.me/2347018416894', handle: '+234 701 841 6894' },
];

export const defaultAboutSections: AboutCustomSection[] = [
  {
    id: 'sec-welcome',
    category: 'WELCOME',
    tagline: "SUP, I'M _TURBOFAN",
    type: 'text',
    content: "I'M A FULL TIME STUDENT AND PART-TIME DESIGNER. I'LL BE YOUR GUIDE. VDVC IS A GRAPHIC DESIGN AND DTP SERVICE. HERE IS HOW WE CAN HELP YOU!",
    layoutTheme: 'spaced',
  },
  {
    id: 'sec-services',
    category: 'SERVICES',
    tagline: 'WHAT WE CAN DO FOR YOU',
    type: 'list',
    items: [
      'CREATE, EDIT, DIGITISE AND CONVERT DOCUMENTS',
      'DESIGN GRAPHICS AND WEBSITES',
      'PRINT',
      'DELIVERY & PICKUP',
    ],
  },
  {
    id: 'sec-deliverables',
    category: 'DELIVERABLES',
    tagline: 'WHAT WE MEAN BY "DOCUMENTS"',
    type: 'grid',
    items: [
      'TEXTS (.docx)',
      'SLIDES (.pptx)',
      'SHEETS (.xlsx)',
      'PDFS (.pdf)',
      'IMAGES (.jpg, .png)',
      'FIGMA FILES',
      'ADOBE FILES',
      'PRINTED DOCUMENTS',
      'WEB FILES (.html, .css, .js, .ts, .jsx, .tsx, etc)',
    ],
  },
  {
    id: 'sec-tat',
    category: 'TURN AROUND TIME',
    tagline: "HOW LONG'S THE WAIT",
    type: 'table',
    tableRows: [
      {
        id: 'r1',
        bracket: 'FLEXIBLE',
        timeframe: '2-3 WKS',
        multiplier: '-5% TO -20%',
        meaning: 'I SLOT YOU IN WHENEVER I HAVE TIME. NO PRESSURE ON MY SIDE OR YOURS.',
      },
      {
        id: 'r2',
        bracket: 'STANDARD',
        timeframe: '1 WK',
        multiplier: 'BASELINE (0%)',
        meaning: 'MY NORMAL WORKING PACE - THE DEFAULT PRICE.',
      },
      {
        id: 'r3',
        bracket: 'PRIORITY',
        timeframe: '48-72 HRS',
        multiplier: '+25%',
        meaning: 'I REORDER MY QUEUE TO FIT YOU IN SOONER.',
      },
      {
        id: 'r4',
        bracket: 'URGENT',
        timeframe: '24 HRS',
        multiplier: '+50%',
        meaning: 'SAME-DAY OR NEXT-DAY - YOU ARE GIVEN TOP PRIORITY.',
      },
    ],
  },
  {
    id: 'sec-delivery',
    category: 'DELIVERY & PICKUP',
    tagline: "VIRTUAL WON'T ALWAYS WORK",
    type: 'list',
    items: [
      'WITHIN UNIJOS: FREE DELIVERY & PICKUP',
      'WITHIN JOSCITY: 2,000 NAIRA DELIVERY FEE',
    ],
  },
  {
    id: 'sec-contact',
    category: 'CONTACT',
    tagline: 'HOW TO REACH ME',
    type: 'contact',
    phone: '0701 841 6894',
    email: 'vapourdense@gmail.com',
    content: "I AM MOSTLY IN SCHOOL OR ON TRANSIT, BIRDS HAVE NEST, MY LAPTOP HAS A BAG BUT VDVC DOESN'T HAVE AN OFFICE. WE REMAIN ONLINE FOR NOW. YOU CAN ALWAYS REACH US VIA ANY OF OUR PLATFORMS: WHATSAPP OR GMAIL.",
  },
  {
    id: 'sec-tools',
    category: 'SOME OF OUR TOOLS',
    tagline: 'SOFTWARE, CREATIVE SUITES & WORKFLOW ENGINES',
    type: 'software',
    tools: [
      { id: 't1', name: 'Microsoft Word', code: 'Word', color: 'bg-blue-600 text-white', desc: 'Texts (.docx)' },
      { id: 't2', name: 'Microsoft PowerPoint', code: 'PPT', color: 'bg-orange-600 text-white', desc: 'Slides (.pptx)' },
      { id: 't3', name: 'Microsoft Excel', code: 'Excel', color: 'bg-emerald-600 text-white', desc: 'Sheets (.xlsx)' },
      { id: 't4', name: 'Adobe Illustrator', code: 'Ai', color: 'bg-amber-500 text-slate-950 font-bold', desc: 'Vector & Logos' },
      { id: 't5', name: 'Adobe Photoshop', code: 'Ps', color: 'bg-sky-600 text-white font-bold', desc: 'Image Editing' },
      { id: 't6', name: 'Adobe InDesign', code: 'Id', color: 'bg-fuchsia-700 text-white font-bold', desc: 'DTP & Editorial' },
      { id: 't7', name: 'Adobe Dimension', code: 'Dn', color: 'bg-emerald-700 text-white font-bold', desc: '3D Mockups' },
      { id: 't8', name: 'Canva', code: 'Canva', color: 'bg-teal-500 text-white', desc: 'Fast Collateral' },
      { id: 't9', name: 'Google Gemini / AI', code: 'Gemini', color: 'bg-indigo-600 text-white', desc: 'Generative AI' },
      { id: 't10', name: 'ArtStation', code: 'AS', color: 'bg-cyan-600 text-white', desc: 'Digital Concept' },
      { id: 't11', name: 'Visual Studio Code', code: 'VSCode', color: 'bg-blue-500 text-white', desc: 'Web & Scripts' },
    ],
  },
];

export const defaultAboutData: AboutData = {
  studioName: 'VAPOURDENSE',
  founderName: 'VIRTUAL CAFE',
  bio: 'a flexible system for your paper workloads',
  badge: '',
  founderImage: '/VDVC 4 - Logo.png',
  logoUrl: '/VDVC 4 - Logo - NO-TEXT.png',
  disciplines: [],
  sections: defaultAboutSections,
  phone: '0701 841 6894',
  phones: ['0701 841 6894'],
  email: 'vapourdense@gmail.com',
  emails: ['vapourdense@gmail.com'],
  socialLinks: defaultSocialLinks,
  socials: {
    instagram: 'https://instagram.com/vapourdense',
    twitter: 'https://x.com/vapourdense',
    whatsapp: 'https://wa.me/2347018416894',
  },
  websiteName: 'VAPOURDENSE VIRTUAL CAFE',
  footerTagline: 'a flexible system for your paper workloads',
  footerLocation: 'Jos, Plateau State // UNIJOS',
  footerRights: 'All rights reserved',
  ceoName: '_TURBOFAN',
  ceoTitle: 'CEO',
  teamMembers: [],
  founderImageScale: 100,
};

interface AboutSectionProps {
  data?: AboutData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data = defaultAboutData }) => {
  const sections = data.sections && data.sections.length > 0 ? data.sections : defaultAboutSections;

  // Initialize all sections as open by default
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec, idx) => {
      initial[sec.id || `sec-${idx}`] = idx === 0 || idx === 1 || idx === 3 || idx === 4 || idx === 5;
    });
    return initial;
  });

  const [activeModal, setActiveModal] = useState<'pricelist' | 'radius' | null>(null);

  const togglePanel = (key: string) => {
    setOpenPanels(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const imageSrc =
    data.founderImage &&
    !data.founderImage.includes('Linnea') &&
    !data.founderImage.startsWith('data:image/svg+xml')
      ? data.founderImage
      : '/VDVC 4 - Logo.png';

  const defaultSoftwareIcons: Record<string, any> = {
    'Microsoft Word': FileText,
    'Microsoft PowerPoint': Presentation,
    'Microsoft Excel': Sheet,
    'Adobe Illustrator': Palette,
    'Adobe Photoshop': Layers,
    'Adobe InDesign': BookOpen,
    'Adobe Dimension': Box,
    Canva: Brush,
    'Google Gemini / AI': Sparkles,
    ArtStation: Compass,
    'Visual Studio Code': Code2,
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return Instagram;
    if (p.includes('twitter') || p.includes('x')) return Twitter;
    if (p.includes('linkedin')) return Linkedin;
    if (p.includes('github')) return Github;
    if (p.includes('dribbble')) return Dribbble;
    if (p.includes('whatsapp')) return MessageCircle;
    return Globe;
  };

  const activeSocials = data.socialLinks && data.socialLinks.length > 0
    ? data.socialLinks
    : defaultSocialLinks;

  return (
    <section id="about" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          
          {/* PINNED LEFT COLUMN: About Heading, Picture Card & CEO/Team spot */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-6 sm:space-y-8 z-10">
            <div>
              <h2 className="font-phenomena-bold text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#090132]">
                About
              </h2>
            </div>

            {/* Picture Card with "VDVC 4 - Logo.png" (Square shape, no borders, #d6d3d3 background behind image) */}
            <div
              className="p-4 sm:p-6 rounded-none bg-[#d6d3d3] w-full flex flex-col items-center justify-center border-0 shadow-none transition-all"
              style={{ maxWidth: `${Math.round(448 * ((data.founderImageScale || 100) / 100))}px` }}
            >
              <div className="w-full aspect-square rounded-none overflow-hidden bg-[#202226] p-0 flex items-center justify-center relative border-0">
                <img
                  src={imageSrc}
                  alt="VDVC 4 - Logo.png"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src.indexOf('vdvc-4-logo.png') === -1) {
                      target.src = '/vdvc-4-logo.png';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* SPOT FOR CEO NAME AND MEMBERS OF THE TEAM (Right under the picture) */}
            <div className="w-full max-w-sm sm:max-w-md space-y-4 pt-1">
              {/* CEO Spot (Same line, Moon 2.0 Light font, body copy size & font weight, wider character spacing) */}
              <div>
                <h4 className="font-moon-light text-sm sm:text-base font-semibold text-[#090132] leading-relaxed uppercase tracking-widest flex items-baseline gap-2 flex-wrap">
                  <span>{data.ceoTitle ? (data.ceoTitle.endsWith(':') ? data.ceoTitle : `${data.ceoTitle}:`) : 'CEO:'}</span>
                  <span>{data.ceoName || data.founderName || '_TURBOFAN'}</span>
                </h4>
              </div>

              {/* Members of the Team */}
              {data.teamMembers && data.teamMembers.length > 0 && (
                <div className="pt-3 border-t border-black/10 space-y-2.5">
                  <span className="font-unisans-thin-caps text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                    Team Members
                  </span>
                  <div className="space-y-2">
                    {data.teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover bg-slate-200 border border-black/10 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-phenomena text-xs flex items-center justify-center font-bold shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-phenomena text-lg sm:text-xl text-[#090132] font-semibold leading-tight uppercase truncate">
                            {member.name}
                          </p>
                          {member.role && (
                            <p className="text-[11px] sm:text-xs text-slate-600 font-normal font-mono-numbers truncate">
                              {member.role}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Accordion Sections & Centralized Tagline */}
          <div className="lg:col-span-7 space-y-6 lg:pt-2">
            
            {/* Top Header of the Right Panel (Centralized Tagline under VAPOURDENSE VIRTUAL CAFE) */}
            <div className="pb-6 space-y-2 text-center flex flex-col items-center justify-center border-b border-black/[0.06]">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#090132] tracking-tight flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                <span>
                  <span className="font-vapour">VAPOUR</span><span className="font-dense">DENSE</span>
                </span>
                <span className="font-phenomena-extralight text-3xl sm:text-4xl lg:text-5xl text-[#090132] tracking-wider font-extralight">
                  VIRTUAL CAFE
                </span>
              </h3>
              <p className="text-[18px] sm:text-[20px] text-slate-600 italic font-semibold pt-1 font-body-copy text-center max-w-xl mx-auto">
                {data.footerTagline && !data.footerTagline.includes('Creative Direction')
                  ? data.footerTagline
                  : data.bio && !data.bio.includes('Creative Direction')
                  ? data.bio
                  : 'a flexible system for your paper workloads'}
              </p>
            </div>

            {/* DYNAMIC ACCORDION CONTAINER */}
            <div className="space-y-3.5 pt-2">
              {sections.map((section, idx) => {
                const secKey = section.id || `sec-${idx}`;
                const isOpen = openPanels[secKey] ?? false;

                return (
                  <div
                    key={secKey}
                    className="rounded-2xl bg-transparent shadow-none overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => togglePanel(secKey)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none bg-transparent"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-1">
                        <span className="font-unisans-thin-caps text-[11px] sm:text-xs text-slate-500 font-normal block">
                          {section.category}
                        </span>
                        <span className="font-phenomena text-[18px] sm:text-[20px] md:text-[22px] text-[#090132] block leading-snug font-normal">
                          {section.tagline}
                        </span>
                      </div>
                      <div
                        className={`shrink-0 p-1.5 rounded-full bg-transparent text-slate-800 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-slate-950' : ''
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 bg-transparent text-slate-800">
                        {/* 1. TABLE TYPE */}
                        {section.type === 'table' && section.tableRows && (
                          <div className="space-y-4">
                            {/* Mobile Responsive Cards View */}
                            <div className="block sm:hidden space-y-3">
                              {section.tableRows.map((row) => (
                                <div
                                  key={row.id}
                                  className="p-3.5 rounded-2xl bg-white/30 border border-slate-400/30 backdrop-blur-md space-y-2 shadow-xs"
                                >
                                  <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-2">
                                    <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                                      {row.bracket}
                                    </span>
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <span className="font-mono bg-black/5 px-2 py-0.5 rounded-md text-slate-900 font-semibold">
                                        {row.timeframe}
                                      </span>
                                      <span className="font-bold text-slate-900 bg-slate-900/10 px-2 py-0.5 rounded-md">
                                        {row.multiplier}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-slate-800 leading-relaxed font-normal">
                                    {row.meaning}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden sm:block overflow-x-auto rounded-xl">
                              <table className="w-full text-left text-xs sm:text-sm border-collapse bg-transparent">
                                <thead>
                                  <tr className="text-slate-800 font-bold uppercase text-[11px] sm:text-xs bg-transparent border-b border-black/10">
                                    <th className="py-2.5 px-3 sm:px-4">BRACKET</th>
                                    <th className="py-2.5 px-3 sm:px-4">TIMEFRAME</th>
                                    <th className="py-2.5 px-3 sm:px-4">MULTIPLIER</th>
                                    <th className="py-2.5 px-3 sm:px-4">WHAT IT MEANS</th>
                                  </tr>
                                </thead>
                                <tbody className="font-medium bg-transparent divide-y divide-black/[0.04]">
                                  {section.tableRows.map((row) => (
                                    <tr
                                      key={row.id}
                                      className="bg-transparent text-slate-800">
                                      <td className="py-3 px-3 sm:px-4 font-bold">{row.bracket}</td>
                                      <td className="py-3 px-3 sm:px-4 font-mono">{row.timeframe}</td>
                                      <td className="py-3 px-3 sm:px-4 font-bold">{row.multiplier}</td>
                                      <td className="py-3 px-3 sm:px-4 opacity-90">{row.meaning}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* "SEE SUMMARISED PRICELIST" in phenomena font with standard black arrow to top-right */}
                            <button
                              type="button"
                              onClick={() => setActiveModal('pricelist')}
                              className="font-phenomena text-[18px] sm:text-[20px] md:text-[22px] text-[#090132] font-normal leading-snug inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer pt-2"
                            >
                              <span>SEE SUMMARISED PRICELIST FOR MORE INFO</span>
                              <ArrowUpRight className="w-5 h-5 text-black inline-block shrink-0 stroke-[2.2]" />
                            </button>
                          </div>
                        )}

                        {/* 2. SOFTWARE TOOLS TYPE */}
                        {section.type === 'software' && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                              {(section.tools || []).map((tool) => {
                                const IconComponent = defaultSoftwareIcons[tool.name] || FileText;
                                return (
                                  <div
                                    key={tool.id || tool.name}
                                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-transparent"
                                  >
                                    {tool.logoUrl ? (
                                      <img
                                        src={tool.logoUrl}
                                        alt={tool.name}
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-lg object-contain bg-white shadow-2xs shrink-0 p-1"
                                      />
                                    ) : (
                                      <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shadow-2xs shrink-0 ${
                                          tool.color || 'bg-slate-800 text-white'
                                        }`}
                                      >
                                        {tool.code ? tool.code : <IconComponent className="w-4 h-4" />}
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <span className="text-xs font-bold text-slate-900 truncate block">
                                        {tool.name}
                                      </span>
                                      {tool.desc && (
                                        <span className="text-[10px] text-slate-600 truncate block">
                                          {tool.desc}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 3. CONTACT TYPE WITH SOCIAL MEDIA BUTTONS */}
                        {section.type === 'contact' && (
                          <div className="space-y-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(section.phone || data.phone) && (
                                <a
                                  href={`tel:${(section.phone || data.phone).replace(/\s+/g, '')}`}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-800 shadow-2xs shrink-0">
                                    <Phone className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <span className="text-[10px] text-slate-600 block uppercase tracking-wider font-semibold">Phone</span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono-numbers">
                                      {section.phone || data.phone}
                                    </span>
                                  </div>
                                </a>
                              )}

                              {(section.email || data.email) && (
                                <a
                                  href={`mailto:${section.email || data.email}`}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-800 shadow-2xs shrink-0">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <span className="text-[10px] text-slate-600 block uppercase tracking-wider font-semibold">Email</span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                                      {section.email || data.email}
                                    </span>
                                  </div>
                                </a>
                              )}
                            </div>

                            {/* SOCIAL MEDIA BUTTONS IN CONTACT SECTION (ICONS ONLY) */}
                            {activeSocials.length > 0 && (
                              <div className="pt-2">
                                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-2 font-unisans-thin-caps">
                                  Connect Across Platforms
                                </span>
                                <div className="flex flex-wrap items-center gap-2.5">
                                  {activeSocials.map(soc => {
                                    const IconComponent = getSocialIcon(soc.platform);
                                    return (
                                      <a
                                        key={soc.id}
                                        href={soc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={soc.platform || 'Social Link'}
                                        aria-label={soc.platform || 'Social Link'}
                                        className="w-10 h-10 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center transition-all border border-black/5 hover:border-black/10 group cursor-pointer"
                                      >
                                        {soc.iconUrl ? (
                                          <img
                                            src={soc.iconUrl}
                                            alt={soc.platform || 'Social Icon'}
                                            className="w-5 h-5 object-contain"
                                          />
                                        ) : (
                                          <IconComponent className="w-5 h-5 text-slate-700 group-hover:text-black shrink-0 transition-colors" />
                                        )}
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {section.content && (
                              <div className="p-3.5 rounded-xl bg-transparent text-xs sm:text-sm text-slate-800 uppercase leading-relaxed font-semibold">
                                {section.content}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 4. LIST TYPE */}
                        {section.type === 'list' && section.items && (
                          <div className="pt-1">
                            <ol className="space-y-2.5 text-sm sm:text-base font-semibold text-slate-800">
                              {section.items.map((item, iIdx) => (
                                <li key={iIdx} className="flex items-start gap-3">
                                  <span className="font-mono text-xs font-bold text-slate-800 px-2 py-0.5 rounded shrink-0 bg-transparent">
                                    {iIdx + 1}.
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ol>
                            {section.category.includes('DELIVERY') && (
                              <div className="pt-3">
                                <button
                                  type="button"
                                  onClick={() => setActiveModal('radius')}
                                  className="font-phenomena text-[18px] sm:text-[20px] md:text-[22px] text-[#090132] font-normal leading-snug inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                  <span>SEE DELIVERY RADIUS FOR MORE INFO</span>
                                  <ArrowUpRight className="w-5 h-5 text-black inline-block shrink-0 stroke-[2.2]" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 5. GRID TYPE */}
                        {section.type === 'grid' && section.items && (
                          <div className="pt-1">
                            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base font-semibold text-slate-800">
                              {section.items.map((item, iIdx) => (
                                <li
                                  key={iIdx}
                                  className={`flex items-center gap-2.5 p-2 rounded-lg bg-transparent ${
                                    iIdx === section.items!.length - 1 && section.items!.length % 2 !== 0 ? 'sm:col-span-2' : ''
                                  }`}
                                >
                                  <span className="font-mono text-xs font-bold text-slate-800 px-1.5 py-0.5 rounded bg-transparent">
                                    {iIdx + 1}.
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* 6. TEXT / CUSTOM TYPE */}
                        {(section.type === 'text' || section.type === 'custom' || !section.type) && section.content && (
                          <div
                            className={`text-sm sm:text-base leading-relaxed uppercase font-medium ${
                              section.layoutTheme === 'spaced'
                                ? 'tracking-wider space-y-3 py-1'
                                : section.layoutTheme === 'boxed'
                                ? 'p-4 rounded-xl bg-black/[0.02] border border-black/[0.05]'
                                : 'py-1'
                            }`}
                          >
                            <p className="whitespace-pre-line">{section.content}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Summarised Pricelist */}
      {activeModal === 'pricelist' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-xl font-bold text-slate-900">
                SUMMARISED PRICELIST &amp; TIMEFRAMES
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>STANDARD (1 WK)</span>
                  <span className="font-mono text-slate-600">BASELINE</span>
                </div>
                <p className="text-xs text-slate-500">Regular scheduling for design, DTP, slide decks, documents, and web pages.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>FLEXIBLE (2-3 WKS)</span>
                  <span className="font-mono text-emerald-600 font-bold">-5% TO -20%</span>
                </div>
                <p className="text-xs text-slate-500">Self-paced queue slotted between classes and exams. Best value for non-urgent tasks.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>PRIORITY (48-72 HRS)</span>
                  <span className="font-mono text-amber-600 font-bold">+25%</span>
                </div>
                <p className="text-xs text-slate-500">Queue reordered immediately for express turnaround.</p>
              </div>

              <div className="p-3 rounded-xl bg-red-50/50 border border-red-200 space-y-1">
                <div className="flex justify-between font-bold text-red-900">
                  <span>URGENT (24 HRS)</span>
                  <span className="font-mono text-red-600 font-bold">+50%</span>
                </div>
                <p className="text-xs text-slate-500">Same-day or next-day turnaround. Queue jumped to immediate top priority.</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-bold text-slate-900 bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delivery Radius */}
      {activeModal === 'radius' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-xl font-bold text-slate-900">
                DELIVERY RADIUS &amp; PICKUP LOCATIONS
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <h4 className="font-bold text-emerald-900">UNIJOS CAMPUSES (FREE)</h4>
                <p className="text-xs text-slate-600">
                  Naraguta Campus, Bauchi Road Campus, Township Campus, and nearby student quarters.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
                <h4 className="font-bold text-sky-900">JOS METROPOLIS (₦2,000 DISPATCH)</h4>
                <p className="text-xs text-slate-600">
                  Rayfield, Terminus, Bukuru, British America, Lamingo, Hwolshe, and surrounding metropolitan hubs.
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-bold text-slate-900 bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

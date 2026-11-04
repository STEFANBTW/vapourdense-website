import { Project } from '../types/portfolio';

const escapeXml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// High-fidelity SVG generator with soft snowy white aesthetic and light shades of blue
const createSnowyDesignSvg = (
  title: string,
  subtitle: string,
  accentBlue: string,
  patternType: 'poster' | 'ui' | 'packaging' | 'editorial' | 'identity' | 'web'
): string => {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeId = title.replace(/\W/g, '') || 'asset';
  let innerArt = '';

  if (patternType === 'poster') {
    innerArt = `
      <rect x="60" y="50" width="320" height="400" rx="6" fill="#ffffff" stroke="${accentBlue}" stroke-width="1.5" stroke-opacity="0.3" filter="drop-shadow(0 8px 16px rgba(186,230,253,0.3))" />
      <circle cx="500" cy="180" r="105" fill="${accentBlue}" fill-opacity="0.12" stroke="${accentBlue}" stroke-width="1.5" />
      <circle cx="500" cy="180" r="65" fill="${accentBlue}" fill-opacity="0.2" />
      <line x1="80" y1="260" x2="720" y2="260" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4 6" stroke-opacity="0.4" />
      <text x="90" y="145" font-family="'Syne', sans-serif" font-weight="800" font-size="44" fill="#0f172a" letter-spacing="-1">SWISS 04</text>
      <text x="90" y="195" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="16" fill="${accentBlue}">TYPOGRAPHIC ARCHIVE · ZÜRICH</text>
      <rect x="90" y="295" width="230" height="14" rx="2" fill="#0284c7" fill-opacity="0.8" />
      <rect x="90" y="325" width="160" height="8" rx="2" fill="#94a3b8" />
      <rect x="90" y="342" width="240" height="8" rx="2" fill="#cbd5e1" />
      <text x="540" y="440" font-family="monospace" font-size="13" fill="#64748b">12-COL RATIO · 1.618</text>
    `;
  } else if (patternType === 'ui' || patternType === 'web') {
    innerArt = `
      <rect x="60" y="45" width="680" height="440" rx="14" fill="#ffffff" stroke="none" stroke-width="0" filter="drop-shadow(0 12px 28px rgba(186,230,253,0.35))" />
      <rect x="60" y="45" width="680" height="48" rx="14" fill="#f8fafc" />
      <circle cx="88" cy="69" r="5" fill="#f87171" opacity="0.8"/>
      <circle cx="106" cy="69" r="5" fill="#fbbf24" opacity="0.8"/>
      <circle cx="124" cy="69" r="5" fill="#38bdf8" opacity="0.9"/>
      <rect x="160" y="60" width="300" height="18" rx="6" fill="#e2e8f0" fill-opacity="0.6" />
      <line x1="60" y1="93" x2="740" y2="93" stroke="#f1f5f9" stroke-width="1.5" />
      <rect x="90" y="125" width="130" height="16" fill="${accentBlue}" fill-opacity="0.2" rx="4" />
      <text x="90" y="190" font-family="'Syne', sans-serif" font-weight="700" font-size="30" fill="#0f172a" letter-spacing="-1">${safeTitle}</text>
      <text x="90" y="220" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="#64748b">${safeSubtitle}</text>
      <rect x="90" y="255" width="280" height="180" rx="10" fill="#f8fafc" stroke="none" stroke-width="0" />
      <circle cx="130" cy="295" r="16" fill="${accentBlue}" fill-opacity="0.2" />
      <rect x="160" y="288" width="110" height="14" rx="3" fill="#0284c7" fill-opacity="0.8" />
      <line x1="110" y1="345" x2="340" y2="345" stroke="${accentBlue}" stroke-width="2.5" />
      <line x1="110" y1="375" x2="280" y2="375" stroke="#cbd5e1" stroke-width="2" />
      <rect x="390" y="255" width="320" height="180" rx="10" fill="#f0f9ff" stroke="none" stroke-width="0" />
      <path d="M 410 380 Q 480 290 550 350 T 670 280" fill="none" stroke="${accentBlue}" stroke-width="3.5" />
    `;
  } else if (patternType === 'packaging') {
    innerArt = `
      <g transform="translate(180, 60)">
        <rect x="40" y="110" width="140" height="280" rx="16" fill="#ffffff" stroke="${accentBlue}" stroke-width="1.5" filter="drop-shadow(0 12px 24px rgba(186,230,253,0.3))" />
        <rect x="90" y="60" width="40" height="52" rx="4" fill="${accentBlue}" fill-opacity="0.25" stroke="${accentBlue}" stroke-width="1" />
        <rect x="60" y="170" width="100" height="130" fill="#f8fafc" rx="4" stroke="#e2e8f0" stroke-width="1" />
        <text x="75" y="205" font-family="'Syne', serif" font-weight="700" font-size="16" fill="#0f172a" letter-spacing="2">DIVE</text>
        <text x="75" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="${accentBlue}" letter-spacing="1">SNOW ESSENCE</text>
        <line x1="75" y1="235" x2="145" y2="235" stroke="#cbd5e1" stroke-width="0.8" />
        <text x="75" y="265" font-family="monospace" font-size="8" fill="#64748b">50 ML · 1.7 FL OZ</text>
      </g>
      <g transform="translate(420, 100)">
        <rect x="20" y="60" width="180" height="290" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="drop-shadow(0 10px 20px rgba(186,230,253,0.25))" />
        <text x="45" y="130" font-family="'Syne', sans-serif" font-size="28" font-weight="700" fill="#0f172a">GLACIER</text>
        <text x="45" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="${accentBlue}">PACKAGING DIRECTION</text>
        <line x1="45" y1="180" x2="175" y2="180" stroke="#bae6fd" stroke-width="1.5" />
        <circle cx="110" cy="255" r="34" fill="none" stroke="${accentBlue}" stroke-width="1.5" stroke-dasharray="3 3" />
      </g>
    `;
  } else if (patternType === 'editorial') {
    innerArt = `
      <g transform="translate(100, 50)">
        <rect x="0" y="0" width="280" height="390" rx="3" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 10px 24px rgba(186,230,253,0.3))" />
        <rect x="285" y="0" width="280" height="390" rx="3" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 10px 24px rgba(186,230,253,0.3))" />
        <line x1="282" y1="0" x2="282" y2="390" stroke="#cbd5e1" stroke-width="2.5" />
        <rect x="30" y="40" width="220" height="210" fill="#e0f2fe" rx="4" />
        <circle cx="140" cy="145" r="50" fill="${accentBlue}" fill-opacity="0.3" />
        <text x="30" y="285" font-family="'Plus Jakarta Sans', serif" font-style="italic" font-size="13" fill="#334155">Fig. 01 — Glacial Topography</text>
        <text x="30" y="325" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#64748b" letter-spacing="0.5">VOL. IX · ARCHIVE MONOGRAPH</text>
        <text x="320" y="70" font-family="'Syne', sans-serif" font-weight="800" font-size="30" fill="#0f172a" letter-spacing="-0.5">${safeTitle}</text>
        <line x1="320" y1="90" x2="520" y2="90" stroke="#0284c7" stroke-width="1.5" />
        <rect x="320" y="120" width="190" height="6" rx="2" fill="#64748b" />
        <rect x="320" y="135" width="210" height="6" rx="2" fill="#94a3b8" />
        <rect x="320" y="150" width="180" height="6" rx="2" fill="#cbd5e1" />
        <rect x="320" y="210" width="100" height="120" rx="4" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1" />
        <circle cx="370" cy="270" r="24" fill="${accentBlue}" fill-opacity="0.4" />
      </g>
    `;
  } else {
    innerArt = `
      <g transform="translate(80, 70)">
        <circle cx="160" cy="170" r="110" fill="none" stroke="${accentBlue}" stroke-width="2" />
        <polygon points="160,80 250,240 70,240" fill="none" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="160" cy="170" r="16" fill="${accentBlue}" fill-opacity="0.6" />
        <text x="340" y="140" font-family="'Syne', sans-serif" font-weight="800" font-size="32" fill="#0f172a" letter-spacing="-1">${safeTitle}</text>
        <text x="340" y="175" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="${accentBlue}" letter-spacing="3">${safeSubtitle}</text>
        <line x1="340" y1="195" x2="600" y2="195" stroke="#bae6fd" stroke-width="1.5" />
        <rect x="340" y="220" width="40" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
        <rect x="390" y="220" width="40" height="40" rx="6" fill="${accentBlue}" fill-opacity="0.8" />
        <rect x="440" y="220" width="40" height="40" rx="6" fill="#e0f2fe" />
        <rect x="490" y="220" width="40" height="40" rx="6" fill="#0284c7" />
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="snowGrad_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#f0f9ff"/>
      </linearGradient>
      <linearGradient id="snowGlow_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accentBlue}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <pattern id="softGrid_${safeId}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="0.8" stroke-opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="800" height="500" fill="url(#snowGrad_${safeId})"/>
    <rect width="800" height="500" fill="url(#softGrid_${safeId})"/>
    <circle cx="700" cy="110" r="290" fill="url(#snowGlow_${safeId})"/>
    ${innerArt}
    <g transform="translate(60, 470)">
      <text font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748b" letter-spacing="1.5">${safeTitle.toUpperCase()} // ${safeSubtitle.toUpperCase()}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Helper for process step SVGs
const createProcessStepSvg = (
  title: string,
  badge: 'AI' | 'Final',
  themeColor: string
): string => {
  const isAI = badge === 'AI';
  const safeTitle = escapeXml(title);
  const safeId = title.replace(/\W/g, '') || 'proc';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" width="600" height="420">
    <defs>
      <linearGradient id="bgGrad_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${isAI ? '#1e1138' : '#0f172a'}"/>
        <stop offset="100%" stop-color="${isAI ? '#130f30' : '#1e293b'}"/>
      </linearGradient>
      <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c084fc"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#8b5cf6"/>
      </linearGradient>
    </defs>
    <rect width="600" height="420" fill="url(#bgGrad_${safeId})"/>
    <g opacity="0.15">
      <path d="M 0,70 L 600,70 M 0,140 L 600,140 M 0,210 L 600,210 M 0,280 L 600,280 M 0,350 L 600,350" stroke="#a855f7" stroke-width="1"/>
      <path d="M 100,0 L 100,420 M 200,0 L 200,420 M 300,0 L 300,420 M 400,0 L 400,420 M 500,0 L 500,420" stroke="#a855f7" stroke-width="1"/>
    </g>
    <circle cx="480" cy="120" r="140" fill="${themeColor}" fill-opacity="${isAI ? '0.18' : '0.12'}"/>
    <rect x="50" y="50" width="500" height="320" rx="12" fill="none" stroke="${isAI ? 'url(#purpleGlow)' : '#334155'}" stroke-width="${isAI ? '2' : '1.5'}" stroke-dasharray="${isAI ? 'none' : '4 4'}"/>
    <text x="80" y="120" font-family="'Syne', sans-serif" font-weight="700" font-size="26" fill="#f8fafc">${safeTitle}</text>
    <text x="80" y="155" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="14" fill="${themeColor}">${isAI ? 'AI Generative Exploration Stage' : 'Production Master Artifact'}</text>
    <rect x="80" y="190" width="220" height="12" rx="3" fill="${themeColor}" fill-opacity="0.7"/>
    <rect x="80" y="215" width="340" height="8" rx="2" fill="#64748b"/>
    <rect x="80" y="235" width="280" height="8" rx="2" fill="#475569"/>
    <g transform="translate(80, 290)">
      <rect width="90" height="26" rx="6" fill="${isAI ? '#7e22ce' : '#0f766e'}" fill-opacity="0.8"/>
      <text x="45" y="17" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${badge}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const initialProjects: Project[] = [
  // 1
  {
    id: 'proj-1',
    title: 'Kroma Sound Architecture & Spatial Web Platform',
    category: 'Web Design',
    client: 'Kroma Audio Labs, Berlin',
    clientDescription: 'European acoustic research institute and luxury nearfield monitor manufacturer headquartered in Berlin-Kreuzberg.',
    shortDescription: 'Interactive 3D configurator, acoustic sound wave shaders, and spatial audio design tokens for flagship acoustic hardware.',
    threeWordDesc: 'Spatial Audio Architecture',
    descriptors: 'Spatial, Audio, Architecture',
    isRealLife: true,
    price: '$14,500 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '3.5 Months',
    featured: true,
    description: 'An immersive, spatial 3D audio configuration and web commerce experience for high-end acoustic monitors. Designed with interactive real-time audio visualizers, reactive soundwave shaders, and an ultra-minimalist soft glass aesthetic.',
    images: [
      createSnowyDesignSvg('Kroma Audio', 'Spatial Web Experience', '#0284c7', 'web'),
      createSnowyDesignSvg('Kroma Audio', 'Interface Architecture', '#38bdf8', 'ui'),
      createSnowyDesignSvg('Kroma Audio', 'Sonic Identity & Grid', '#0ea5e9', 'poster'),
    ],
    galleryPictures: [
      {
        id: 'kroma-g1',
        url: createSnowyDesignSvg('Kroma Audio', 'Spatial Web Experience', '#0284c7', 'web'),
        caption: 'Spatial Web Experience — Real-time WebGL audio viewport with interactive acoustic dispersion simulation.',
        isAI: false,
      },
      {
        id: 'kroma-g2',
        url: createProcessStepSvg('Acoustic Diffusion Mesh', 'AI', '#a855f7'),
        caption: 'AI Generative Latent Mesh — Neural synthesis of organic acoustic dispersion waves generated using Midjourney v6 + custom latent sound depth.',
        isAI: true,
      },
      {
        id: 'kroma-g3',
        url: createSnowyDesignSvg('Kroma Audio', 'Interface Architecture', '#38bdf8', 'ui'),
        caption: 'Interface Architecture — Modular 12-channel parametric frequency slider and room geometry analyzer.',
        isAI: false,
      },
      {
        id: 'kroma-g4',
        url: createProcessStepSvg('Neural Frequency Field', 'AI', '#ec4899'),
        caption: 'AI Frequency Vector Synthesis — Algorithmic timbre mapping and sound visualizer prototypes generated via AI prompt pipelines.',
        isAI: true,
      },
    ],
    processSteps: [
      {
        id: 'step-kroma-1',
        name: 'Phase 01: Generative Frequency Modeling',
        description: 'We trained lightweight generative spatial models to compute acoustic diffraction patterns around studio walls, generating organic wave geometries that informed the user interface layout.',
        pictures: [
          {
            id: 'proc-k1',
            url: createProcessStepSvg('Acoustic Diffraction AI', 'AI', '#c084fc'),
            caption: 'AI-generated wave diffraction field mapping organic acoustic bounces.',
            type: 'AI',
          },
          {
            id: 'proc-k2',
            url: createProcessStepSvg('Diffraction Node Analysis', 'Final', '#38bdf8'),
            caption: 'Vectorized mathematical sound node matrix integrated into WebGL shaders.',
            type: 'Final',
          },
        ],
      },
      {
        id: 'step-kroma-2',
        name: 'Phase 02: Spatial 3D Interface Architecture',
        description: 'Constructed an ultra-responsive Three.js canvas permitting clients to reposition virtual studio monitors with sub-millimeter precision, receiving real-time decibel dissipation readouts.',
        pictures: [
          {
            id: 'proc-k3',
            url: createProcessStepSvg('Spatial Studio Viewport', 'Final', '#0ea5e9'),
            caption: 'Final 3D studio viewport rendering real-time reflections and acoustic boundaries.',
            type: 'Final',
          },
          {
            id: 'proc-k4',
            url: createProcessStepSvg('Latent Glass Refraction AI', 'AI', '#d946ef'),
            caption: 'AI optical refraction simulation explored for frosted glass dial components.',
            type: 'AI',
          },
        ],
      },
    ],
    clientRemark: {
      type: 'voice',
      comment: '“DIVE exceeded our loftiest expectations. The spatial acoustic configurator boosted pre-order conversions by 280% within the first month alone.”',
      clientAuthor: 'Henrik Vane, VP Product & Sound Architecture @ Kroma',
      voiceDuration: '0:48',
      voiceDate: 'Oct 14, 2026',
    },
    videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
    deliverables: ['Creative Direction', 'WebGL Audio Visualizers', 'Design System & Tokens', 'Responsive Web Application'],
    createdAt: 1711200000000,
  },
  // 2
  {
    id: 'proj-2',
    title: 'Monolith Zurich — Swiss Editorial & Monograph Design',
    category: 'Graphic Design',
    client: 'Monolith Architecture Review',
    clientDescription: 'Prestigious architectural quarterly publication curating brutalist and modernist structures across Central Europe.',
    shortDescription: 'Complete 340-page monograph publication, strict Swiss rationalist grid typography, and custom display typeface.',
    threeWordDesc: 'Swiss Typographic Monograph',
    descriptors: 'Editorial, Monograph, Swiss',
    isRealLife: true,
    price: '$9,200 EUR',
    year: '2026',
    monthYear: 'August 2026',
    duration: '7 Weeks',
    featured: true,
    description: 'Complete publication design, custom typography, and physical monograph packaging for a prestigious architectural quarterly. Built around strict Swiss rationalist grid structures, tactile paper stock curation, and radical typographic hierarchy.',
    images: [
      createSnowyDesignSvg('Monolith Zürich', 'Editorial Monograph', '#0284c7', 'editorial'),
      createSnowyDesignSvg('Monolith Zürich', 'Typography System', '#38bdf8', 'poster'),
      createSnowyDesignSvg('Monolith Zürich', 'Print Production', '#0ea5e9', 'identity'),
    ],
    galleryPictures: [
      {
        id: 'monolith-g1',
        url: createSnowyDesignSvg('Monolith Zürich', 'Editorial Monograph', '#0284c7', 'editorial'),
        caption: 'Monolith Vol. IX Cover — 340-page Swiss rationalist architectural quarterly monograph.',
        isAI: false,
      },
      {
        id: 'monolith-g2',
        url: createProcessStepSvg('Architectural Form AI Study', 'AI', '#a855f7'),
        caption: 'AI Brutalist Elevation Study — Generative architectural massing models exploring brutalist concrete shadow patterns.',
        isAI: true,
      },
      {
        id: 'monolith-g3',
        url: createSnowyDesignSvg('Monolith Zürich', 'Typography System', '#38bdf8', 'poster'),
        caption: 'Custom Display Typeface — Monolith Grotesk variable typeface engineered for asymmetric page folios.',
        isAI: false,
      },
      {
        id: 'monolith-g4',
        url: createProcessStepSvg('Generative Grid Lattice AI', 'AI', '#ec4899'),
        caption: 'AI Algorithmic Grid Generation — Experimental layout generation balancing golden ratio column distributions.',
        isAI: true,
      },
    ],
    processSteps: [
      {
        id: 'step-mono-1',
        name: 'Phase 01: Typographic Anatomy & Grid Foundations',
        description: 'Established a rigorous 12-column Swiss typographic grid pairing custom geometric display glyphs with ultra-legible editorial body prose.',
        pictures: [
          {
            id: 'proc-m1',
            url: createProcessStepSvg('Grid Foundation AI', 'AI', '#c084fc'),
            caption: 'Generative baseline harmonic study testing vertical rhythm ratios.',
            type: 'AI',
          },
          {
            id: 'proc-m2',
            url: createProcessStepSvg('Final Monolith Type Suite', 'Final', '#0284c7'),
            caption: 'Final production character map including custom ligatures and tabular fractions.',
            type: 'Final',
          },
        ],
      },
      {
        id: 'step-mono-2',
        name: 'Phase 02: Tactile Print Specs & Binding',
        description: 'Hand-selected Fedrigoni Materica 360gsm cotton-blend cardstock with black blind deboss foil stamping for an unforgettable physical object.',
        pictures: [
          {
            id: 'proc-m3',
            url: createProcessStepSvg('Blind Deboss Proof Sheet', 'Final', '#38bdf8'),
            caption: 'Physical deboss press check and foil test sheet from Zürich print shop.',
            type: 'Final',
          },
        ],
      },
    ],
    clientRemark: {
      type: 'comment',
      comment: '“The tactile Swiss clarity and uncompromising editorial rhythm elevated our monograph to an international museum benchmark. Absolute design mastery.”',
      clientAuthor: 'Beatriz Leuenberger, Editor-in-Chief @ Monolith Zürich',
      voiceDuration: '0:35',
    },
    videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'],
    deliverables: ['Editorial Direction', 'Monograph Layout', 'Custom Display Typeface', 'Foil-Stamped Dust Jacket'],
    createdAt: 1711100000000,
  },
  // 3
  {
    id: 'proj-3',
    title: 'Aura Botanicals — Luxury Cosmetic Identity & Packaging',
    category: 'Graphic Design',
    client: 'Aura Skincare Collective, Paris',
    clientDescription: 'Parisian clean luxury cosmetic lab focusing on cold-extracted glacial botanicals and zero-plastic glass vessels.',
    shortDescription: 'Brand identity, bespoke frosted glass vessels, sustainable secondary packaging, and blind debossed cartons.',
    threeWordDesc: 'Glacial Botanical Essence',
    descriptors: 'Botanical, Identity, Luxury',
    isRealLife: true,
    price: '$16,800 EUR',
    year: '2025',
    monthYear: 'November 2025',
    duration: '2 Months',
    featured: true,
    description: 'High-end cosmetic brand identity and sustainable packaging system. Utilizing blind debossing, bespoke frosted bottles, and a quiet editorial typography system communicating purity, precision, and luxury minimalism.',
    images: [
      createSnowyDesignSvg('Aura Skincare', 'Luxury Packaging Suite', '#0284c7', 'packaging'),
      createSnowyDesignSvg('Aura Skincare', 'Brand Collateral', '#38bdf8', 'identity'),
      createSnowyDesignSvg('Aura Skincare', 'Packaging Specs', '#0ea5e9', 'poster'),
    ],
    galleryPictures: [
      {
        id: 'aura-g1',
        url: createSnowyDesignSvg('Aura Skincare', 'Luxury Packaging Suite', '#0284c7', 'packaging'),
        caption: 'Aura Skincare Luxury Suite — Bespoke frosted cylindrical glass containers with matte powder caps.',
        isAI: false,
      },
      {
        id: 'aura-g2',
        url: createProcessStepSvg('AI Glacial Refraction Textures', 'AI', '#a855f7'),
        caption: 'AI Synthetic Texture Synthesis — Generating crystalline ice fracture patterns for outer carton emboss plates.',
        isAI: true,
      },
      {
        id: 'aura-g3',
        url: createSnowyDesignSvg('Aura Skincare', 'Brand Collateral', '#38bdf8', 'identity'),
        caption: 'Brand Identity Monogram — Subtle geometric ligature evoking pure botanical droplet symmetry.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-aura-1',
        name: 'Phase 01: Glacial Organic Concept Synthesis',
        description: 'Iterated through dozens of organic droplet silhouettes using generative prompting combined with hand-carved wax container molds.',
        pictures: [
          {
            id: 'proc-a1',
            url: createProcessStepSvg('AI Silhouette Iteration', 'AI', '#d946ef'),
            caption: 'Generative exploration of cylindrical glass taper angles.',
            type: 'AI',
          },
          {
            id: 'proc-a2',
            url: createProcessStepSvg('Tooling Mold Engineering', 'Final', '#0ea5e9'),
            caption: 'Final 50ml glass container industrial tooling blueprint.',
            type: 'Final',
          },
        ],
      },
    ],
    clientRemark: {
      type: 'picture',
      comment: '“Every retail partner in Paris and Tokyo commended the tactile elegance of the packaging. DIVE captured our ethos with flawless precision.”',
      clientAuthor: 'Camille Delacroix, Creative Founder @ Aura Botanicals',
      pictureUrl: createSnowyDesignSvg('Aura Skincare', 'Client Endorsement Letter', '#0284c7', 'editorial'),
      pictureCaption: 'Official recommendation letter and Grand Prix du Design award citation.',
    },
    videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'],
    deliverables: ['Visual Identity & Logo Suite', 'Secondary Packaging Architecture', 'Glass Container Tooling Specs'],
    createdAt: 1710900000000,
  },
  // 4
  {
    id: 'proj-4',
    title: 'Verve OS — Decentralized Governance & Financial Dashboard',
    category: 'Web Design',
    client: 'Verve Protocol Foundation',
    clientDescription: 'Decentralized liquidity and algorithmic treasury protocol managing over $1.2B in multi-chain assets.',
    shortDescription: 'Enterprise high-throughput treasury cockpit with real-time financial visualizers, tabular numeric metrics, and frosted glass.',
    threeWordDesc: 'Minimal Treasury Interface',
    descriptors: 'Financial, Dashboard, Protocol',
    isRealLife: false,
    price: '$18,500 USD',
    year: '2026',
    monthYear: 'January 2026',
    duration: '4 Months',
    featured: false,
    description: 'An avant-garde financial web application engineered for high-throughput treasury tracking and proposal voting. Engineered with fluid micro-interactions, snowy frosted glass cards, live charts, and tabular numeric hierarchy for frictionless asset management.',
    images: [
      createSnowyDesignSvg('Verve OS', 'Financial Dashboard', '#0284c7', 'ui'),
      createSnowyDesignSvg('Verve OS', 'Treasury Analytics', '#38bdf8', 'web'),
      createSnowyDesignSvg('Verve OS', 'Design Tokens', '#0ea5e9', 'poster'),
    ],
    galleryPictures: [
      {
        id: 'verve-g1',
        url: createSnowyDesignSvg('Verve OS', 'Financial Dashboard', '#0284c7', 'ui'),
        caption: 'Verve OS Primary Cockpit — Tabular portfolio distribution, real-time staking yield graphs, and proposal cards.',
        isAI: false,
      },
      {
        id: 'verve-g2',
        url: createProcessStepSvg('AI Latent Liquidity Shaders', 'AI', '#a855f7'),
        caption: 'AI Reactive Flow Shader — Neural generative heatmaps visualizing multi-chain capital velocity.',
        isAI: true,
      },
      {
        id: 'verve-g3',
        url: createSnowyDesignSvg('Verve OS', 'Treasury Analytics', '#38bdf8', 'web'),
        caption: 'Treasury Analytics Drill-down — Low-latency asset allocation breakdowns with tabular mono typography.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-verve-1',
        name: 'Phase 01: Information Hierarchy & Live Charts',
        description: 'Designed a dense yet serene multi-tier data visualization system ensuring financial clarity under intense market volatility.',
        pictures: [
          {
            id: 'proc-v1',
            url: createProcessStepSvg('AI Chart Density Matrix', 'AI', '#c084fc'),
            caption: 'Generative testing of 24-hour candlestick visual clustering.',
            type: 'AI',
          },
          {
            id: 'proc-v2',
            url: createProcessStepSvg('Final Tabular UI Tokens', 'Final', '#0ea5e9'),
            caption: 'Tabular numeric components and micro-interaction states.',
            type: 'Final',
          },
        ],
      },
    ],
    clientRemark: {
      type: 'voice',
      comment: '“Verve OS set a new visual standard across Web3. User retention surged 190% following the redesign.”',
      clientAuthor: 'Julian K., Core Protocol Lead @ Verve Foundation',
      voiceDuration: '0:52',
      voiceDate: 'Jan 28, 2026',
    },
    videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'],
    deliverables: ['Complex UI/UX Architecture', 'Real-time Financial Visualizers', 'Interactive Design System'],
    createdAt: 1710800000000,
  },
  // 5 — Merona Media | Specialists for every design
  {
    id: 'proj-web-1',
    title: 'Merona Media | Specialists for every design',
    category: 'Web Design',
    client: 'Merona Media',
    clientDescription: 'Multidisciplinary creative agency specializing in cinematic videography, immersive web design, and editorial book design.',
    shortDescription: 'Design itself. Cinematic Videography, Immersive Web Design, Editorial Book Design.',
    threeWordDesc: 'Cinematic Editorial Web',
    descriptors: 'Videography, Web Design, Editorial',
    websiteUrl: 'https://merona-media.vercel.app/',
    isRealLife: true,
    price: '$12,500 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '6 Weeks',
    featured: true,
    description: 'Design itself. Cinematic Videography, Immersive Web Design, Editorial Book Design. A bespoke digital showcase and interactive agency flagship built for Merona Media.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810814/vdvc-portfolio/merona-media/tcpvtf9dmokbkefarf32.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810814/vdvc-portfolio/merona-media/tcpvtf9dmokbkefarf32.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810815/vdvc-portfolio/merona-media/v4rlqiosv5obqw7pklqt.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810817/vdvc-portfolio/merona-media/xslls7ekv2aneuohvmxd.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810818/vdvc-portfolio/merona-media/weeckpatgaq34zq21ytx.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810820/vdvc-portfolio/merona-media/npndmkifjmrzvtwxpdmv.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810823/vdvc-portfolio/merona-media/j3rrwd5tdhccjsvwufel.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810825/vdvc-portfolio/merona-media/p7ntfzjqcqar4euzf4ar.jpg"
    ],
    galleryPictures: [
          {
                "id": "web1-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810814/vdvc-portfolio/merona-media/tcpvtf9dmokbkefarf32.jpg",
                "caption": "Merona Media — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web1-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810815/vdvc-portfolio/merona-media/v4rlqiosv5obqw7pklqt.jpg",
                "caption": "Merona Media — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web1-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810817/vdvc-portfolio/merona-media/xslls7ekv2aneuohvmxd.jpg",
                "caption": "Merona Media — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web1-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810818/vdvc-portfolio/merona-media/weeckpatgaq34zq21ytx.jpg",
                "caption": "Merona Media — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web1-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810820/vdvc-portfolio/merona-media/npndmkifjmrzvtwxpdmv.jpg",
                "caption": "Merona Media — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web1-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810823/vdvc-portfolio/merona-media/j3rrwd5tdhccjsvwufel.jpg",
                "caption": "Merona Media — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web1-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810825/vdvc-portfolio/merona-media/p7ntfzjqcqar4euzf4ar.jpg",
                "caption": "Merona Media — Raw Live Scrolled Mobile Experience.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-merona-1',
        name: 'Phase 01: Multidisciplinary Direction & Web Architecture',
        description: 'Unified cinematic motion reel playback, interactive web case studies, and tactile book design presentations into a cohesive digital experience.',
        pictures: [
          {
            id: 'proc-merona-1',
            url: createProcessStepSvg('Merona Layout Concept', 'AI', '#c084fc'),
            caption: 'Generative layout rhythm exploration for multi-format media.',
            type: 'AI',
          },
          {
            id: 'proc-merona-2',
            url: createProcessStepSvg('Merona Production Web', 'Final', '#0284c7'),
            caption: 'Final production build deployed at merona-media.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Immersive Web Design', 'Cinematic Video Showcase', 'Editorial Portfolio System', 'Frontend Architecture'],
    createdAt: 1712000000000,
  },
  // 6 — Stillwater Therapy Collective
  {
    id: 'proj-web-2',
    title: 'Stillwater Therapy Collective',
    category: 'Web Design',
    client: 'Stillwater Therapy Collective',
    clientDescription: 'Modern mental health clinic and therapeutic sanctuary dedicated to emotionally intelligent, compassionate care.',
    shortDescription: 'A high-fidelity, emotionally intelligent landing page for a mental health clinic, designed with a watercolor sanctuary aesthetic.',
    threeWordDesc: 'Watercolor Sanctuary Aesthetic',
    descriptors: 'Sanctuary, Healthcare, Web',
    websiteUrl: 'https://stillwater-tau-six.vercel.app/',
    isRealLife: true,
    price: '$9,800 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '5 Weeks',
    featured: true,
    description: 'A high-fidelity, emotionally intelligent landing page for a mental health clinic, designed with a watercolor sanctuary aesthetic.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810827/vdvc-portfolio/stillwater-therapy/jzoai1q2wpjctxxpg2ak.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810827/vdvc-portfolio/stillwater-therapy/jzoai1q2wpjctxxpg2ak.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810828/vdvc-portfolio/stillwater-therapy/vtivp1iqv6vpr2ixdyjm.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810830/vdvc-portfolio/stillwater-therapy/eh30egmviqk8n3mkuso9.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810831/vdvc-portfolio/stillwater-therapy/ffqrincz0fllmqwr7wux.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810833/vdvc-portfolio/stillwater-therapy/tvc3cel6ovrukfyqs88j.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810836/vdvc-portfolio/stillwater-therapy/a3njspb3ucqa2fb5l9ot.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810837/vdvc-portfolio/stillwater-therapy/zedy8a7os1qfrtwwlfds.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810839/vdvc-portfolio/stillwater-therapy/byjuonsavfuijxwclsjd.jpg"
    ],
    galleryPictures: [
          {
                "id": "web2-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810827/vdvc-portfolio/stillwater-therapy/jzoai1q2wpjctxxpg2ak.jpg",
                "caption": "Stillwater Therapy Collective — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web2-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810828/vdvc-portfolio/stillwater-therapy/vtivp1iqv6vpr2ixdyjm.jpg",
                "caption": "Stillwater Therapy Collective — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web2-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810830/vdvc-portfolio/stillwater-therapy/eh30egmviqk8n3mkuso9.jpg",
                "caption": "Stillwater Therapy Collective — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web2-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810831/vdvc-portfolio/stillwater-therapy/ffqrincz0fllmqwr7wux.jpg",
                "caption": "Stillwater Therapy Collective — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web2-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810833/vdvc-portfolio/stillwater-therapy/tvc3cel6ovrukfyqs88j.jpg",
                "caption": "Stillwater Therapy Collective — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web2-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810836/vdvc-portfolio/stillwater-therapy/a3njspb3ucqa2fb5l9ot.jpg",
                "caption": "Stillwater Therapy Collective — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web2-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810837/vdvc-portfolio/stillwater-therapy/zedy8a7os1qfrtwwlfds.jpg",
                "caption": "Stillwater Therapy Collective — Raw Live Form & Booking Section.",
                "isAI": false
          },
          {
                "id": "web2-g-extra-2",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810839/vdvc-portfolio/stillwater-therapy/byjuonsavfuijxwclsjd.jpg",
                "caption": "Stillwater Therapy Collective — Raw Live Form & Booking Section.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-stillwater-1',
        name: 'Phase 01: Emotional Palette & Sanctuary UX',
        description: 'Crafted soft watercolor tonal gradients and calming typographic hierarchy to foster immediate psychological safety and effortless appointment scheduling.',
        pictures: [
          {
            id: 'proc-sw-1',
            url: createProcessStepSvg('Watercolor Texture Study', 'AI', '#c084fc'),
            caption: 'Generative watercolor wash exploration for hero backdrops.',
            type: 'AI',
          },
          {
            id: 'proc-sw-2',
            url: createProcessStepSvg('Stillwater Live Platform', 'Final', '#0284c7'),
            caption: 'Final responsive web platform deployed at stillwater-tau-six.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Web Design & Direction', 'Watercolor Visual System', 'Patient Intake Flow', 'Responsive Frontend'],
    createdAt: 1711900000000,
  },
  // 7 — OUMERA | The Cultural Vanguard
  {
    id: 'proj-web-3',
    title: 'OUMERA | The Cultural Vanguard',
    category: 'Web Design',
    client: 'OUMERA Media',
    clientDescription: 'Next-generation media house and cultural vanguard shaping contemporary narratives through fearless storytelling.',
    shortDescription: 'Shaping culture through fearless storytelling and immersive media.',
    threeWordDesc: 'Fearless Cultural Storytelling',
    descriptors: 'Culture, Storytelling, Media',
    websiteUrl: 'https://oumera-media.vercel.app/',
    isRealLife: true,
    price: '$14,000 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '6 Weeks',
    featured: true,
    description: 'Shaping culture through fearless storytelling and immersive media. An editorial-grade digital platform engineered for high-impact visual journalism and cultural productions.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810841/vdvc-portfolio/oumera/qpwywunuglq80whftcgn.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810841/vdvc-portfolio/oumera/qpwywunuglq80whftcgn.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810843/vdvc-portfolio/oumera/by6zvlgtkile3sofmlqe.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810845/vdvc-portfolio/oumera/odvhezwlx6ldtfbqneh3.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810847/vdvc-portfolio/oumera/kkcapzn6c3in58gsjnuc.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810850/vdvc-portfolio/oumera/xdjezez5bck2ygfx4ocv.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810852/vdvc-portfolio/oumera/thuy8pkkkv6d973vmvkr.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810853/vdvc-portfolio/oumera/tfldlb8lcoxewibxgkx8.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810855/vdvc-portfolio/oumera/wysdglj9bg952axpmfw0.jpg"
    ],
    galleryPictures: [
          {
                "id": "web3-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810841/vdvc-portfolio/oumera/qpwywunuglq80whftcgn.jpg",
                "caption": "OUMERA — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web3-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810843/vdvc-portfolio/oumera/by6zvlgtkile3sofmlqe.jpg",
                "caption": "OUMERA — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web3-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810845/vdvc-portfolio/oumera/odvhezwlx6ldtfbqneh3.jpg",
                "caption": "OUMERA — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web3-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810847/vdvc-portfolio/oumera/kkcapzn6c3in58gsjnuc.jpg",
                "caption": "OUMERA — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web3-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810850/vdvc-portfolio/oumera/xdjezez5bck2ygfx4ocv.jpg",
                "caption": "OUMERA — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web3-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810852/vdvc-portfolio/oumera/thuy8pkkkv6d973vmvkr.jpg",
                "caption": "OUMERA — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web3-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810853/vdvc-portfolio/oumera/tfldlb8lcoxewibxgkx8.jpg",
                "caption": "OUMERA — Raw Live Form & Booking Section.",
                "isAI": false
          },
          {
                "id": "web3-g-extra-2",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810855/vdvc-portfolio/oumera/wysdglj9bg952axpmfw0.jpg",
                "caption": "OUMERA — Raw Live Form & Booking Section.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-oumera-1',
        name: 'Phase 01: Editorial Narrative & Interactive Architecture',
        description: 'Designed a bold, high-contrast digital stage that elevates long-form cultural essays and documentary media.',
        pictures: [
          {
            id: 'proc-oum-1',
            url: createProcessStepSvg('OUMERA Editorial Grid', 'AI', '#c084fc'),
            caption: 'Exploratory typographic pacing and story-card choreography.',
            type: 'AI',
          },
          {
            id: 'proc-oum-2',
            url: createProcessStepSvg('OUMERA Live Build', 'Final', '#0284c7'),
            caption: 'Production platform deployed at oumera-media.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Digital Flagship Design', 'Interactive Storytelling Engine', 'Editorial Typography System', 'Web Deployment'],
    createdAt: 1711800000000,
  },
  // 8 — Little Acorn
  {
    id: 'proj-web-4',
    title: 'Little Acorn',
    category: 'Web Design',
    client: 'Little Acorn',
    clientDescription: 'Boutique lifestyle and early-learning collective focused on nurturing curiosity, warmth, and mindful growth.',
    shortDescription: 'Warm, approachable digital platform and brand web experience crafted with organic storytelling and intuitive navigation.',
    threeWordDesc: 'Organic Digital Storytelling',
    descriptors: 'Boutique, Interactive, Web',
    websiteUrl: 'https://little-acorn.vercel.app/',
    isRealLife: true,
    price: '$8,500 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '4 Weeks',
    featured: false,
    description: 'Warm, approachable digital platform and brand web experience for Little Acorn, blending playful micro-interactions with clean, accessible information architecture.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810857/vdvc-portfolio/little-acorn/gxlevgz2xxdfy8st3b1f.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810857/vdvc-portfolio/little-acorn/gxlevgz2xxdfy8st3b1f.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810858/vdvc-portfolio/little-acorn/skipr73uuu7qiepis2fe.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810860/vdvc-portfolio/little-acorn/hhp8nzrkebhioxgoxixg.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810862/vdvc-portfolio/little-acorn/fsef5cdcqjdhwbn6mt9c.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810865/vdvc-portfolio/little-acorn/wwwfycuonoig2wbkwzwf.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810868/vdvc-portfolio/little-acorn/gn95euin5u4u8lnwxpqj.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810869/vdvc-portfolio/little-acorn/a6sjuey4fw1gge45zlfz.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810871/vdvc-portfolio/little-acorn/corinppkb71t325sya3m.jpg"
    ],
    galleryPictures: [
          {
                "id": "web4-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810857/vdvc-portfolio/little-acorn/gxlevgz2xxdfy8st3b1f.jpg",
                "caption": "Little Acorn — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web4-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810858/vdvc-portfolio/little-acorn/skipr73uuu7qiepis2fe.jpg",
                "caption": "Little Acorn — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web4-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810860/vdvc-portfolio/little-acorn/hhp8nzrkebhioxgoxixg.jpg",
                "caption": "Little Acorn — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web4-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810862/vdvc-portfolio/little-acorn/fsef5cdcqjdhwbn6mt9c.jpg",
                "caption": "Little Acorn — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web4-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810865/vdvc-portfolio/little-acorn/wwwfycuonoig2wbkwzwf.jpg",
                "caption": "Little Acorn — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web4-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810868/vdvc-portfolio/little-acorn/gn95euin5u4u8lnwxpqj.jpg",
                "caption": "Little Acorn — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web4-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810869/vdvc-portfolio/little-acorn/a6sjuey4fw1gge45zlfz.jpg",
                "caption": "Little Acorn — Raw Live Form & Booking Section.",
                "isAI": false
          },
          {
                "id": "web4-g-extra-2",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810871/vdvc-portfolio/little-acorn/corinppkb71t325sya3m.jpg",
                "caption": "Little Acorn — Raw Live Form & Booking Section.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-acorn-1',
        name: 'Phase 01: Visual Direction & Responsive Web Build',
        description: 'Developed an inviting visual language paired with fast, accessible page transitions across desktop and mobile devices.',
        pictures: [
          {
            id: 'proc-acorn-1',
            url: createProcessStepSvg('Little Acorn Wireframes', 'AI', '#c084fc'),
            caption: 'Early layout explorations and visual hierarchy studies.',
            type: 'AI',
          },
          {
            id: 'proc-acorn-2',
            url: createProcessStepSvg('Little Acorn Production', 'Final', '#0284c7'),
            caption: 'Final live web application deployed at little-acorn.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Responsive Website Design', 'Interactive UI Components', 'Brand Visual Integration'],
    createdAt: 1711700000000,
  },
  // 9 — The Daily Knead | Uncomplicated Dining
  {
    id: 'proj-web-5',
    title: 'The Daily Knead | Uncomplicated Dining',
    category: 'Web Design',
    client: 'The Daily Knead Bakery & Kitchen',
    clientDescription: 'Neighborhood artisan bakery and all-day dining kitchen celebrating naturally leavened breads and seasonal plates.',
    shortDescription: 'Artisan carbs and seasonal plates.',
    threeWordDesc: 'Artisan Culinary Web',
    descriptors: 'Artisan, Dining, Hospitality',
    websiteUrl: 'https://the-daily-knead-2.vercel.app/',
    isRealLife: true,
    price: '$9,500 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '5 Weeks',
    featured: true,
    description: 'Artisan carbs and seasonal plates. A tactile, appetite-led digital home for The Daily Knead featuring daily bake schedules, seasonal menus, and table reservations.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810873/vdvc-portfolio/the-daily-knead/tudzklcopsanrmz23zg8.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810873/vdvc-portfolio/the-daily-knead/tudzklcopsanrmz23zg8.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810874/vdvc-portfolio/the-daily-knead/iriemwpcj6ybopnl3gse.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810876/vdvc-portfolio/the-daily-knead/zo6oulrnwymucj5gc36b.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810877/vdvc-portfolio/the-daily-knead/brjmu8fgvcfg4battzqa.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810880/vdvc-portfolio/the-daily-knead/a8pn5brtn1eilaoaw9oo.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810883/vdvc-portfolio/the-daily-knead/amcl1fsz3erk1p78kufs.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810885/vdvc-portfolio/the-daily-knead/crxchvjfe7gwk6uo1afy.jpg"
    ],
    galleryPictures: [
          {
                "id": "web5-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810873/vdvc-portfolio/the-daily-knead/tudzklcopsanrmz23zg8.jpg",
                "caption": "The Daily Knead — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web5-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810874/vdvc-portfolio/the-daily-knead/iriemwpcj6ybopnl3gse.jpg",
                "caption": "The Daily Knead — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web5-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810876/vdvc-portfolio/the-daily-knead/zo6oulrnwymucj5gc36b.jpg",
                "caption": "The Daily Knead — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web5-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810877/vdvc-portfolio/the-daily-knead/brjmu8fgvcfg4battzqa.jpg",
                "caption": "The Daily Knead — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web5-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810880/vdvc-portfolio/the-daily-knead/a8pn5brtn1eilaoaw9oo.jpg",
                "caption": "The Daily Knead — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web5-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810883/vdvc-portfolio/the-daily-knead/amcl1fsz3erk1p78kufs.jpg",
                "caption": "The Daily Knead — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web5-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810885/vdvc-portfolio/the-daily-knead/crxchvjfe7gwk6uo1afy.jpg",
                "caption": "The Daily Knead — Raw Live Scrolled Mobile Experience.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-knead-1',
        name: 'Phase 01: Culinary Editorial UX & Menu Architecture',
        description: 'Translated the warmth of a morning bakehouse into an uncomplicated, tactile web experience with effortless mobile menu browsing.',
        pictures: [
          {
            id: 'proc-knead-1',
            url: createProcessStepSvg('Menu Typography Exploration', 'AI', '#c084fc'),
            caption: 'Editorial menu grid and typographic pairing studies.',
            type: 'AI',
          },
          {
            id: 'proc-knead-2',
            url: createProcessStepSvg('The Daily Knead Live', 'Final', '#0284c7'),
            caption: 'Final production site deployed at the-daily-knead-2.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Hospitality Web Design', 'Interactive Menu System', 'Reservation Flow', 'Mobile Optimization'],
    createdAt: 1711600000000,
  },
  // 10 — Brasa | Steakhouse & Grill
  {
    id: 'proj-web-6',
    title: 'Brasa | Steakhouse & Grill',
    category: 'Web Design',
    client: 'Brasa Steakhouse & Grill',
    clientDescription: 'Contemporary wood-fired steakhouse and open-hearth grill offering prime dry-aged cuts and curated cellar pairings.',
    shortDescription: 'Atmospheric digital flagship, tasting menu showcase, and reservation platform for a premier steakhouse and grill.',
    threeWordDesc: 'Wood-Fired Dining Flagship',
    descriptors: 'Steakhouse, Hospitality, Web',
    websiteUrl: 'https://brasa-3.vercel.app/',
    isRealLife: true,
    price: '$11,200 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '5 Weeks',
    featured: true,
    description: 'Atmospheric digital flagship and reservation experience for Brasa | Steakhouse & Grill, crafted with rich editorial pacing, cut-by-cut culinary storytelling, and frictionless booking.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810887/vdvc-portfolio/brasa/np8hixln9at15dnxbakb.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810887/vdvc-portfolio/brasa/np8hixln9at15dnxbakb.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810888/vdvc-portfolio/brasa/ubrpxoe0potwissbz1gl.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810889/vdvc-portfolio/brasa/xytgy0ul3zvb6ltahk3k.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810891/vdvc-portfolio/brasa/k4osfqcivj0m6hczdttn.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810893/vdvc-portfolio/brasa/y2pbzjdg17mgdcc2h9w7.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810897/vdvc-portfolio/brasa/gcdj8lv8dnte79x8fahg.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810899/vdvc-portfolio/brasa/jmbst0ekgbkxtlcwgn1s.jpg"
    ],
    galleryPictures: [
          {
                "id": "web6-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810887/vdvc-portfolio/brasa/np8hixln9at15dnxbakb.jpg",
                "caption": "Brasa — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web6-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810888/vdvc-portfolio/brasa/ubrpxoe0potwissbz1gl.jpg",
                "caption": "Brasa — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web6-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810889/vdvc-portfolio/brasa/xytgy0ul3zvb6ltahk3k.jpg",
                "caption": "Brasa — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web6-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810891/vdvc-portfolio/brasa/k4osfqcivj0m6hczdttn.jpg",
                "caption": "Brasa — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web6-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810893/vdvc-portfolio/brasa/y2pbzjdg17mgdcc2h9w7.jpg",
                "caption": "Brasa — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web6-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810897/vdvc-portfolio/brasa/gcdj8lv8dnte79x8fahg.jpg",
                "caption": "Brasa — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web6-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810899/vdvc-portfolio/brasa/jmbst0ekgbkxtlcwgn1s.jpg",
                "caption": "Brasa — Raw Live Scrolled Mobile Experience.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-brasa-1',
        name: 'Phase 01: Atmospheric Art Direction & Booking Flow',
        description: 'Engineered a refined hospitality interface balancing dramatic culinary photography with instant table availability and private dining inquiries.',
        pictures: [
          {
            id: 'proc-brasa-1',
            url: createProcessStepSvg('Brasa Visual Mood Study', 'AI', '#c084fc'),
            caption: 'Lighting and typographic contrast exploration.',
            type: 'AI',
          },
          {
            id: 'proc-brasa-2',
            url: createProcessStepSvg('Brasa Production Site', 'Final', '#0284c7'),
            caption: 'Final production build live at brasa-3.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Restaurant Flagship Website', 'Interactive Menu Showcase', 'Table Reservation UX', 'Responsive Build'],
    createdAt: 1711500000000,
  },
  // 11 — Kinetic Edge Physiotherapy
  {
    id: 'proj-web-7',
    title: 'Kinetic Edge Physiotherapy',
    category: 'Web Design',
    client: 'Kinetic Edge Physiotherapy',
    clientDescription: 'Specialized sports rehabilitation, biomechanics, and performance physiotherapy clinic.',
    shortDescription: 'High-performance clinical web platform and patient booking experience engineered for sports rehabilitation and physiotherapy.',
    threeWordDesc: 'Sports Rehab Platform',
    descriptors: 'Physiotherapy, Clinical, Web',
    websiteUrl: 'https://kinetic-edge-mu.vercel.app/',
    isRealLife: true,
    price: '$10,400 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '5 Weeks',
    featured: false,
    description: 'High-performance clinical web platform and patient booking experience for Kinetic Edge Physiotherapy, clarity-first treatment pathways, and streamlined practitioner scheduling.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810902/vdvc-portfolio/kinetic-edge/dmagnjnmmtnzeylx1cda.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810902/vdvc-portfolio/kinetic-edge/dmagnjnmmtnzeylx1cda.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810904/vdvc-portfolio/kinetic-edge/qcsewdobdbu4e0ckroln.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810906/vdvc-portfolio/kinetic-edge/sx28waxlsqzvsborqwat.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810908/vdvc-portfolio/kinetic-edge/kiioqvie8vprf7fk4f1c.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810911/vdvc-portfolio/kinetic-edge/nklbohkwol9wnkvjhin3.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810913/vdvc-portfolio/kinetic-edge/gxutcwjapevlarqfvtw3.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810914/vdvc-portfolio/kinetic-edge/hldxjqlwcsbndzos0zjv.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810916/vdvc-portfolio/kinetic-edge/qc32skbl95hjsukv2nms.jpg"
    ],
    galleryPictures: [
          {
                "id": "web7-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810902/vdvc-portfolio/kinetic-edge/dmagnjnmmtnzeylx1cda.jpg",
                "caption": "Kinetic Edge — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web7-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810904/vdvc-portfolio/kinetic-edge/qcsewdobdbu4e0ckroln.jpg",
                "caption": "Kinetic Edge — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web7-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810906/vdvc-portfolio/kinetic-edge/sx28waxlsqzvsborqwat.jpg",
                "caption": "Kinetic Edge — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web7-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810908/vdvc-portfolio/kinetic-edge/kiioqvie8vprf7fk4f1c.jpg",
                "caption": "Kinetic Edge — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web7-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810911/vdvc-portfolio/kinetic-edge/nklbohkwol9wnkvjhin3.jpg",
                "caption": "Kinetic Edge — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web7-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810913/vdvc-portfolio/kinetic-edge/gxutcwjapevlarqfvtw3.jpg",
                "caption": "Kinetic Edge — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web7-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810914/vdvc-portfolio/kinetic-edge/hldxjqlwcsbndzos0zjv.jpg",
                "caption": "Kinetic Edge — Raw Live Form & Booking Section.",
                "isAI": false
          },
          {
                "id": "web7-g-extra-2",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810916/vdvc-portfolio/kinetic-edge/qc32skbl95hjsukv2nms.jpg",
                "caption": "Kinetic Edge — Raw Live Form & Booking Section.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-kinetic-1',
        name: 'Phase 01: Clinical Clarity & Patient Conversion Architecture',
        description: 'Structured complex rehabilitation services into an intuitive, confidence-inspiring digital journey tailored for athletes and recovering patients.',
        pictures: [
          {
            id: 'proc-kin-1',
            url: createProcessStepSvg('Biomechanics UI Study', 'AI', '#c084fc'),
            caption: 'Generative motion and anatomical grid layout exploration.',
            type: 'AI',
          },
          {
            id: 'proc-kin-2',
            url: createProcessStepSvg('Kinetic Edge Live Build', 'Final', '#0284c7'),
            caption: 'Final clinical platform deployed at kinetic-edge-mu.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Clinical Web Platform', 'Treatment Pathway UX', 'Patient Booking Interface', 'Frontend Engineering'],
    createdAt: 1711400000000,
  },
  // 12 — Banjue Seat
  {
    id: 'proj-web-8',
    title: 'Banjue Seat',
    category: 'Web Design',
    client: 'Banjue Seat Studio',
    clientDescription: 'Industrial design and architectural seating studio crafting ergonomic, sculptural furniture pieces.',
    shortDescription: 'Contemporary product showcase and bespoke seating configurator designed with tactile minimalism and spatial clarity.',
    threeWordDesc: 'Sculptural Seating Showcase',
    descriptors: 'Furniture, Product, Web',
    websiteUrl: 'https://banjue-seat-2-dun.vercel.app/',
    isRealLife: true,
    price: '$11,800 USD',
    year: '2026',
    monthYear: 'October 2026',
    duration: '6 Weeks',
    featured: true,
    description: 'Contemporary product showcase and digital commerce platform for Banjue Seat, highlighting sculptural ergonomics, material finishes, and studio craftsmanship.',
    imageUrl: 'https://res.cloudinary.com/dwo7oemds/image/upload/v1793810918/vdvc-portfolio/banjue-seat/fsfpyzrhokodjofonmos.jpg',
    images: [
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810918/vdvc-portfolio/banjue-seat/fsfpyzrhokodjofonmos.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810919/vdvc-portfolio/banjue-seat/e4c26rfrd09jp4fmzja8.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810921/vdvc-portfolio/banjue-seat/wphfce69mm8juvrqk5pf.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810922/vdvc-portfolio/banjue-seat/cf1np7fd2wuz1ow3rmej.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810924/vdvc-portfolio/banjue-seat/kg3ksratbnuqgvc3dgsj.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810928/vdvc-portfolio/banjue-seat/btqivmdoirfwu6kvufgk.jpg",
          "https://res.cloudinary.com/dwo7oemds/image/upload/v1793811124/vdvc-portfolio/banjue-seat/kpcbfcdph1orijwumnfu.jpg"
    ],
    galleryPictures: [
          {
                "id": "web8-g-raw-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810918/vdvc-portfolio/banjue-seat/fsfpyzrhokodjofonmos.jpg",
                "caption": "Banjue Seat — Raw Live Desktop Screenshot.",
                "isAI": false
          },
          {
                "id": "web8-g-mock-cmp",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810919/vdvc-portfolio/banjue-seat/e4c26rfrd09jp4fmzja8.jpg",
                "caption": "Banjue Seat — Responsive Devices Comparison Showcase.",
                "isAI": false
          },
          {
                "id": "web8-g-mock-desk",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810921/vdvc-portfolio/banjue-seat/wphfce69mm8juvrqk5pf.jpg",
                "caption": "Banjue Seat — Desktop Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web8-g-mock-ph",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810922/vdvc-portfolio/banjue-seat/cf1np7fd2wuz1ow3rmej.jpg",
                "caption": "Banjue Seat — Mobile Studio Mockup.",
                "isAI": false
          },
          {
                "id": "web8-g-raw-tab",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810924/vdvc-portfolio/banjue-seat/kg3ksratbnuqgvc3dgsj.jpg",
                "caption": "Banjue Seat — Raw Live Tablet View.",
                "isAI": false
          },
          {
                "id": "web8-g-raw-mob",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793810928/vdvc-portfolio/banjue-seat/btqivmdoirfwu6kvufgk.jpg",
                "caption": "Banjue Seat — Raw Live Mobile View.",
                "isAI": false
          },
          {
                "id": "web8-g-extra-1",
                "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793811124/vdvc-portfolio/banjue-seat/kpcbfcdph1orijwumnfu.jpg",
                "caption": "Banjue Seat — Raw Live Scrolled Mobile Experience.",
                "isAI": false
          }
    ],
    processSteps: [
      {
        id: 'step-banjue-1',
        name: 'Phase 01: Industrial Form Presentation & Web Commerce',
        description: 'Designed a gallery-grade digital environment that lets material grain, silhouette, and ergonomic engineering take center stage.',
        pictures: [
          {
            id: 'proc-banjue-1',
            url: createProcessStepSvg('Seating Silhouette Study', 'AI', '#c084fc'),
            caption: 'Generative lighting and studio plinth composition study.',
            type: 'AI',
          },
          {
            id: 'proc-banjue-2',
            url: createProcessStepSvg('Banjue Seat Production', 'Final', '#0284c7'),
            caption: 'Final production showcase deployed at banjue-seat-2-dun.vercel.app.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Product Showcase Website', 'Material Finish Selector', 'Editorial Art Direction', 'Web Commerce UI'],
    createdAt: 1711300000000,
  },
  // GD 1 — PIC Organics — Zobo Tea with Beetroot Packaging
  {
    "id": "proj-gd-1",
    "title": "PIC Organics — Zobo Tea with Beetroot Packaging",
    "category": "Graphic Design",
    "client": "PIC Organics (Pharmacy Informatics Consult)",
    "clientDescription": "Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.",
    "shortDescription": "Stand-up pouch packaging design and 3D commercial product visualization for heart-friendly Zobo Tea with Beetroot.",
    "threeWordDesc": "Botanical Pouch Packaging",
    "descriptors": "Packaging, Product Visualization, FMCG",
    "isRealLife": true,
    "price": "₦450,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "October 2026",
    "duration": "3 Weeks",
    "featured": true,
    "description": "Complete front and back stand-up pouch packaging design for PIC Organics Zobo Tea with Beetroot, paired with high-impact commercial product renders amidst hibiscus petals and water splashes.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806391/VDVC_Portfolio/graphic-design/pghqoqryveqhvzju0szv.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806386/VDVC_Portfolio/graphic-design/mfucqsgaqikax7j7ne8g.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806366/VDVC_Portfolio/graphic-design/ftjxarldypwnnfawnbdd.png"
    ],
    "galleryPictures": [
      {
        "id": "gd1-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
        "caption": "Zobo Tea with Beetroot — Commercial hero product visualization with hibiscus petals and botanical dust.",
        "isAI": true
      },
      {
        "id": "gd1-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806391/VDVC_Portfolio/graphic-design/pghqoqryveqhvzju0szv.jpg",
        "caption": "Zobo Tea with Beetroot — Aquatic product staging on rippled water surface.",
        "isAI": true
      },
      {
        "id": "gd1-g3",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806386/VDVC_Portfolio/graphic-design/mfucqsgaqikax7j7ne8g.png",
        "caption": "Front Pouch Master Artwork — Custom typography, botanical illustrations, and heart-friendly seal.",
        "isAI": false
      },
      {
        "id": "gd1-g4",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806366/VDVC_Portfolio/graphic-design/ftjxarldypwnnfawnbdd.png",
        "caption": "Back Pouch Master Artwork — Nutritional facts, brewing guide, NAFDAC compliance, and barcode layout.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd1-1",
        "name": "Phase 01: Pouch Die-Line & Print Master Layout",
        "description": "Developed the front and back print dielines incorporating rich burgundy hibiscus tones, clear preparation instructions, and regulatory labeling.",
        "pictures": [
          {
            "id": "proc-gd1-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806386/VDVC_Portfolio/graphic-design/mfucqsgaqikax7j7ne8g.png",
            "caption": "Final front cover print master (V22).",
            "type": "Final"
          },
          {
            "id": "proc-gd1-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806366/VDVC_Portfolio/graphic-design/ftjxarldypwnnfawnbdd.png",
            "caption": "Final back cover print master (V2).",
            "type": "Final"
          }
        ]
      },
      {
        "id": "step-gd1-2",
        "name": "Phase 02: AI-Assisted Commercial Product Staging",
        "description": "Composite product photography and generative environment lighting crafted to showcase the physical pouch in dynamic botanical and aquatic scenes.",
        "pictures": [
          {
            "id": "proc-gd1-3",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
            "caption": "Hibiscus explosion commercial key visual.",
            "type": "AI"
          },
          {
            "id": "proc-gd1-4",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806391/VDVC_Portfolio/graphic-design/pghqoqryveqhvzju0szv.jpg",
            "caption": "Water surface reflection commercial render.",
            "type": "AI"
          }
        ]
      }
    ],
    "deliverables": [
      "Front & Back Pouch Artwork",
      "Print-Ready Die-Lines",
      "Commercial 3D/AI Product Mockups"
    ],
    "createdAt": 1712600000000
  },
  // GD 2 — PIC Organics — Herbal Supplement Capsules Suite
  {
    "id": "proj-gd-2",
    "title": "PIC Organics — Herbal Supplement Capsules Suite",
    "category": "Graphic Design",
    "client": "PIC Organics (Pharmacy Informatics Consult)",
    "clientDescription": "Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.",
    "shortDescription": "Pharmaceutical-grade label system and 3D levitating bottle campaign for Garlic, Ginger, and NeemCal herbal capsules.",
    "threeWordDesc": "Herbal Supplement Packaging",
    "descriptors": "Pharmaceutical, Packaging, 3D Mockup",
    "isRealLife": true,
    "price": "₦680,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "September 2026",
    "duration": "4 Weeks",
    "featured": true,
    "description": "Comprehensive bottle label architecture and promotional product visualization for PIC Organics’ herbal capsule line—spanning Garlic, Ginger, and NeemCal formulations with cohesive botanical curves and dynamic levitating product shots.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807379/VDVC_Portfolio/graphic-design/i4mies3zpvnehegr5yp9.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807383/VDVC_Portfolio/graphic-design/wcnnblzsxagyfadposw0.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807386/VDVC_Portfolio/graphic-design/otuzwsrpqwacndd4jpdt.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807388/VDVC_Portfolio/graphic-design/dlkluw0oofnfbtkfrhk0.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806438/VDVC_Portfolio/graphic-design/ilfigtxtm2stk7n8euqn.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806469/VDVC_Portfolio/graphic-design/s0qyud8g19qnsbr05bsa.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806478/VDVC_Portfolio/graphic-design/bdcymegalcq5whl2p0b2.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd2-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
        "caption": "Levitating Supplement Bottle — Botanical studio staging with natural ingredients.",
        "isAI": true
      },
      {
        "id": "gd2-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807379/VDVC_Portfolio/graphic-design/i4mies3zpvnehegr5yp9.jpg",
        "caption": "Floating Supplement Bottle — Soft fabric & botanical environment showcase.",
        "isAI": true
      },
      {
        "id": "gd2-g3",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807383/VDVC_Portfolio/graphic-design/wcnnblzsxagyfadposw0.jpg",
        "caption": "Levitating Bottle Concept I — High-contrast atmospheric product presentation.",
        "isAI": true
      },
      {
        "id": "gd2-g4",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807386/VDVC_Portfolio/graphic-design/otuzwsrpqwacndd4jpdt.jpg",
        "caption": "Levitating Bottle Concept II — Organic lighting and hero angle.",
        "isAI": true
      },
      {
        "id": "gd2-g5",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807388/VDVC_Portfolio/graphic-design/dlkluw0oofnfbtkfrhk0.jpg",
        "caption": "Levitating Bottle Concept III — Pedestal and natural shadow study.",
        "isAI": true
      },
      {
        "id": "gd2-g6",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806438/VDVC_Portfolio/graphic-design/ilfigtxtm2stk7n8euqn.png",
        "caption": "Garlic Capsule Label — Final production wrap-around bottle label.",
        "isAI": false
      },
      {
        "id": "gd2-g7",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806469/VDVC_Portfolio/graphic-design/s0qyud8g19qnsbr05bsa.png",
        "caption": "Ginger Capsule Label — Final production wrap-around bottle label.",
        "isAI": false
      },
      {
        "id": "gd2-g8",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806478/VDVC_Portfolio/graphic-design/bdcymegalcq5whl2p0b2.jpg",
        "caption": "NeemCal Capsules (500mg x 30) — Full production label with dosage, ingredients, and NAFDAC specifications.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd2-1",
        "name": "Phase 01: Multi-SKU Label Architecture",
        "description": "Created a unified wrap-around label system across Garlic, Ginger, and NeemCal SKUs, balancing botanical illustration with clear dosage and regulatory data.",
        "pictures": [
          {
            "id": "proc-gd2-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806478/VDVC_Portfolio/graphic-design/bdcymegalcq5whl2p0b2.jpg",
            "caption": "NeemCal Capsule production print master (v2).",
            "type": "Final"
          },
          {
            "id": "proc-gd2-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806438/VDVC_Portfolio/graphic-design/ilfigtxtm2stk7n8euqn.png",
            "caption": "Garlic Capsule final label master.",
            "type": "Final"
          },
          {
            "id": "proc-gd2-3",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806469/VDVC_Portfolio/graphic-design/s0qyud8g19qnsbr05bsa.png",
            "caption": "Ginger Capsule final label master.",
            "type": "Final"
          }
        ]
      },
      {
        "id": "step-gd2-2",
        "name": "Phase 02: Levitating Bottle Campaign Visuals",
        "description": "Generated five distinct levitating and floating bottle scenes to power digital marketing and retail displays.",
        "pictures": [
          {
            "id": "proc-gd2-4",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
            "caption": "Levitating bottle hero visual.",
            "type": "AI"
          },
          {
            "id": "proc-gd2-5",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807379/VDVC_Portfolio/graphic-design/i4mies3zpvnehegr5yp9.jpg",
            "caption": "Floating bottle environment study.",
            "type": "AI"
          }
        ]
      }
    ],
    "deliverables": [
      "3 SKU Production Labels (Garlic, Ginger, NeemCal)",
      "5 Commercial Bottle Renders",
      "Print Production Prepress"
    ],
    "createdAt": 1712550000000
  },
  // GD 3 — PIC Organics — Ecumenical Product Catalog Trifold
  {
    "id": "proj-gd-3",
    "title": "PIC Organics — Ecumenical Product Catalog Trifold",
    "category": "Graphic Design",
    "client": "PIC Organics (Pharmacy Informatics Consult)",
    "clientDescription": "Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.",
    "shortDescription": "6-panel trifold brochure and product shelf catalog designed in dual Light and Dark editorial themes.",
    "threeWordDesc": "Dual-Theme Trifold Catalog",
    "descriptors": "Brochure, Print Design, Editorial",
    "isRealLife": true,
    "price": "₦380,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "September 2026",
    "duration": "2 Weeks",
    "featured": true,
    "description": "An informative 6-panel trifold brochure cataloging PIC Organics’ curative cosmetics, vivifying herbal teas, natural food alternatives, capsules, and essential oils—delivered in both lush forest-dark and crisp botanical-light print editions.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806496/VDVC_Portfolio/graphic-design/j8oo0ee8k2r0si79tgbk.png",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806496/VDVC_Portfolio/graphic-design/j8oo0ee8k2r0si79tgbk.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806634/VDVC_Portfolio/graphic-design/oyl0gbnvpq8kiwtkppga.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806590/VDVC_Portfolio/graphic-design/rbsfwafunohxoibwqejf.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806555/VDVC_Portfolio/graphic-design/b53m4djok0x0etdw1vnz.png"
    ],
    "galleryPictures": [
      {
        "id": "gd3-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806496/VDVC_Portfolio/graphic-design/j8oo0ee8k2r0si79tgbk.png",
        "caption": "3D Trifold Brochure Mockup — Inside spread of the forest-dark edition on matte stock.",
        "isAI": false
      },
      {
        "id": "gd3-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806634/VDVC_Portfolio/graphic-design/oyl0gbnvpq8kiwtkppga.png",
        "caption": "Outside Spread (Light Edition) — Front cover, back cover, and introductory fold panel.",
        "isAI": false
      },
      {
        "id": "gd3-g3",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806590/VDVC_Portfolio/graphic-design/rbsfwafunohxoibwqejf.png",
        "caption": "Inside Spread (Light Edition) — Curative Cosmetics, Vivifying Cha, and complete shelf inventory.",
        "isAI": false
      },
      {
        "id": "gd3-g4",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806555/VDVC_Portfolio/graphic-design/b53m4djok0x0etdw1vnz.png",
        "caption": "Inside Spread (Dark Edition) — Deep forest green editorial variant with high-contrast typography.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd3-1",
        "name": "Phase 01: Information Architecture & Dual-Theme Layout",
        "description": "Structured over 35 herbal products across four categories (Capsules, Essential Oils, Foods, Herbal Tea) alongside instructional callouts and photography.",
        "pictures": [
          {
            "id": "proc-gd3-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806634/VDVC_Portfolio/graphic-design/oyl0gbnvpq8kiwtkppga.png",
            "caption": "Outside 3-panel master layout (Light theme).",
            "type": "Final"
          },
          {
            "id": "proc-gd3-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806555/VDVC_Portfolio/graphic-design/b53m4djok0x0etdw1vnz.png",
            "caption": "Inside 3-panel master layout (Dark theme).",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "6-Panel Trifold Layout (Light & Dark Editions)",
      "3D Print Presentation Mockup",
      "Press-Ready CMYK Spreads"
    ],
    "createdAt": 1712500000000
  },
  // GD 4 — Pamtronics Nig. Ltd. — Independence Day Solar Campaign
  {
    "id": "proj-gd-4",
    "title": "Pamtronics Nig. Ltd. — Independence Day Solar Campaign",
    "category": "Graphic Design",
    "client": "Pamtronics Nig. Ltd.",
    "clientDescription": "Renewable energy and solar power solutions provider supplying inverters, lithium batteries, solar panels, and electric mobility in Nigeria.",
    "shortDescription": "Dual promotional campaign flyers celebrating Nigeria’s 66th Independence Day with clean solar energy solutions.",
    "threeWordDesc": "Solar Campaign Key-Visuals",
    "descriptors": "Campaign Flyer, Social Media, Energy",
    "isRealLife": true,
    "price": "₦220,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "October 2026",
    "duration": "1 Week",
    "featured": true,
    "description": "High-impact promotional flyer suite for Pamtronics Nig. Ltd. marking Nigeria’s 66th Independence Day (\"Let the sun power your home today\"), showcasing their flagship Lemax & Megarevo inverters, solar panels, and electric scooter range.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806662/VDVC_Portfolio/graphic-design/juw9bz8sil92umaon1oq.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd4-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
        "caption": "Pamtronics Independence Day Flyer I (v5) — Clean white & emerald \"66\" typographic composition with product lineup.",
        "isAI": false
      },
      {
        "id": "gd4-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806662/VDVC_Portfolio/graphic-design/juw9bz8sil92umaon1oq.jpg",
        "caption": "Pamtronics Independence Day Flyer II (v4) — Alternate campaign variation for social and print distribution.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd4-1",
        "name": "Phase 01: Campaign Typography & Product Compositing",
        "description": "Combined celebratory national green-and-gold numeral styling with crisp product cutouts and clear contact metadata.",
        "pictures": [
          {
            "id": "proc-gd4-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
            "caption": "Primary Independence Day key visual (v5).",
            "type": "Final"
          },
          {
            "id": "proc-gd4-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806662/VDVC_Portfolio/graphic-design/juw9bz8sil92umaon1oq.jpg",
            "caption": "Secondary campaign variation (v4).",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "2 Campaign Flyer Variations",
      "Social Media & Print Assets",
      "Product Cutout Compositing"
    ],
    "createdAt": 1712450000000
  },
  // GD 5 — To The End — Sports & Badminton Editorial Magazine
  {
    "id": "proj-gd-5",
    "title": "To The End — Sports & Badminton Editorial Magazine",
    "category": "Graphic Design",
    "client": "To The End Sports Publication",
    "clientDescription": "Athletic performance and competitive racquet sports magazine spotlighting youth grit and training routines.",
    "shortDescription": "Dynamic sports magazine cover design and photorealistic print mockup built around high-velocity badminton action photography.",
    "threeWordDesc": "Athletic Editorial Cover",
    "descriptors": "Magazine Cover, Editorial, Sports",
    "isRealLife": true,
    "price": "₦280,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "August 2026",
    "duration": "1.5 Weeks",
    "featured": true,
    "description": "Editorial cover direction for \"TO THE END\", pairing dramatic stadium lighting and mid-air badminton smash photography with bold italic display typography (\"You fight to the end, that’s all that counts\") and callout badges.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806663/VDVC_Portfolio/graphic-design/vrxzn4whoaytctlefosi.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd5-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
        "caption": "To The End Magazine — Photorealistic print edition mockup.",
        "isAI": false
      },
      {
        "id": "gd5-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806663/VDVC_Portfolio/graphic-design/vrxzn4whoaytctlefosi.jpg",
        "caption": "To The End Magazine Cover — Full-bleed typographic layout and athletic action composite.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd5-1",
        "name": "Phase 01: Editorial Cover Hierarchy & Print Mockup",
        "description": "Balanced dynamic subject masking with high-contrast white and crimson cover lines to capture competitive intensity.",
        "pictures": [
          {
            "id": "proc-gd5-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806663/VDVC_Portfolio/graphic-design/vrxzn4whoaytctlefosi.jpg",
            "caption": "Flat cover production artwork.",
            "type": "Final"
          },
          {
            "id": "proc-gd5-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
            "caption": "3D glossy magazine presentation mockup.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Magazine Cover Artwork",
      "3D Print Presentation Mockup",
      "Typography & Cover Line System"
    ],
    "createdAt": 1712400000000
  },
  // GD 6 — Virtuoso Magazine — Menswear & Bespoke Style Cover
  {
    "id": "proj-gd-6",
    "title": "Virtuoso Magazine — Menswear & Bespoke Style Cover",
    "category": "Graphic Design",
    "client": "Virtuoso Fashion & Style",
    "clientDescription": "Contemporary African menswear, tailoring, and sartorial lifestyle publication.",
    "shortDescription": "Refined serif editorial cover design for Virtuoso Magazine celebrating crisp elegance and 64+ contemporary men’s styles.",
    "threeWordDesc": "Sartorial Magazine Cover",
    "descriptors": "Fashion Editorial, Magazine, Typography",
    "isRealLife": true,
    "price": "₦260,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "August 2026",
    "duration": "1 Week",
    "featured": true,
    "description": "Editorial cover design for VIRTUOSO Magazine (\"Crisp Elegance in Every Design and Style — No Room for Mediocre Looks\"), featuring classic high-contrast serif typography, angled folio callouts, and tactile stone-textured backdrop.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd6-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg",
        "caption": "Virtuoso Magazine Cover Mockup — Bespoke menswear issue featuring 64+ men styles.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd6-1",
        "name": "Phase 01: Sartorial Typography & Perspective Mockup",
        "description": "Paired full-length menswear portraiture with classic editorial serif masthead placement so the subject interacts naturally with the title.",
        "pictures": [
          {
            "id": "proc-gd6-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg",
            "caption": "Final Virtuoso Magazine cover presentation mockup.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Magazine Cover Layout",
      "Editorial Masthead Typography",
      "Print Mockup Presentation"
    ],
    "createdAt": 1712350000000
  },
  // GD 7 — Pete's Bakery — Peanut Roll Snack of the Week Campaign
  {
    "id": "proj-gd-7",
    "title": "Pete's Bakery — Peanut Roll Snack of the Week Campaign",
    "category": "Graphic Design",
    "client": "Pete's Bakery, Odena Plaza",
    "clientDescription": "Artisan neighborhood bakery and confectionery located at Odena Plaza offering fresh daily pastries and snacks.",
    "shortDescription": "Warm, appetite-driven promotional poster for Pete’s Bakery featuring their signature Peanut Roll at 30% off.",
    "threeWordDesc": "Artisan Bakery Promotion",
    "descriptors": "Food Advertising, Poster, Typography",
    "isRealLife": true,
    "price": "₦150,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "July 2026",
    "duration": "4 Days",
    "featured": false,
    "description": "Promotional graphic design for Pete’s Bakery spotlighting the \"Peanut Roll — Snack of the Week (30% off)\". Crafted with warm roasted-peanut tones, stacked macro pastry photography, and playful hand-lettered copy (\"In a nutshell, roll up stress and chill\").",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd7-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg",
        "caption": "Pete's Bakery Peanut Roll — Snack of the Week 30% off promotional poster.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd7-1",
        "name": "Phase 01: Appetite Color Grading & Promotional Copy",
        "description": "Combined close-up swirled pastry imagery with warm golden-brown textures and custom outlined script typography.",
        "pictures": [
          {
            "id": "proc-gd7-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg",
            "caption": "Final Peanut Roll promotional banner.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Promotional Landscape Poster",
      "Social Media Ad Graphic",
      "Copywriting & Visual Direction"
    ],
    "createdAt": 1712300000000
  },
  // GD 8 — Pete's Kitchen — "Savor the Flavour" Culinary Ad
  {
    "id": "proj-gd-8",
    "title": "Pete's Kitchen — \"Savor the Flavour\" Culinary Ad",
    "category": "Graphic Design",
    "client": "Pete's Kitchen & Bakery",
    "clientDescription": "Vibrant culinary kitchen and dining spot celebrating simple ingredients and extraordinary taste.",
    "shortDescription": "Dynamic levitating pasta advertisement (\"Pro tip: Lick the plate. We won’t judge\") crafted with rich royal blue contrast.",
    "threeWordDesc": "Dynamic Culinary Advertising",
    "descriptors": "Culinary Ad, Levitation, Hospitality",
    "isRealLife": true,
    "price": "₦160,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "July 2026",
    "duration": "4 Days",
    "featured": false,
    "description": "Eye-catching culinary advertisement for Pete’s (\"Savor the Flavour! — Simple Ingredients, Extraordinary Taste\"), contrasting warm orange flying pasta, cherry tomatoes, and seared protein against a deep royal blue studio backdrop.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd8-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg",
        "caption": "Savor the Flavour at Pete’s — \"Pro tip: Lick the plate. We won’t judge\" promotional banner.",
        "isAI": true
      }
    ],
    "processSteps": [
      {
        "id": "step-gd8-1",
        "name": "Phase 01: High-Contrast Food Staging & Ribbon Badge",
        "description": "Paired a dynamic mid-air culinary illustration with a burgundy corner ribbon and bold complementary orange branding.",
        "pictures": [
          {
            "id": "proc-gd8-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg",
            "caption": "Final \"Pro Tip\" culinary promotional banner.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Digital Billboard & Social Banner",
      "Generative Food Illustration",
      "Brand Typography"
    ],
    "createdAt": 1712250000000
  },
  // GD 9 — From Our Kitchen to Your Heart — Culinary Story Poster
  {
    "id": "proj-gd-9",
    "title": "From Our Kitchen to Your Heart — Culinary Story Poster",
    "category": "Graphic Design",
    "client": "Pete's Kitchen Collective",
    "clientDescription": "Artisan culinary collective celebrating authentic kitchen prep, fresh ingredients, and shared meals.",
    "shortDescription": "Overhead mise-en-place culinary poster celebrating kitchen craft (\"The kitchen is where magic happens — and the mess\").",
    "threeWordDesc": "Overhead Culinary Storytelling",
    "descriptors": "Culinary, Poster, Typography",
    "isRealLife": true,
    "price": "₦140,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "June 2026",
    "duration": "3 Days",
    "featured": false,
    "description": "Warm overhead flat-lay poster capturing a chef’s chopping board surrounded by fresh mirepoix, herbs, and spices, engraved with wood-burned script typography (\"From our kitchen to your heart\") and lower-third editorial messaging.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd9-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg",
        "caption": "From Our Kitchen to Your Heart — Overhead culinary prep poster.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd9-1",
        "name": "Phase 01: Wood-Burned Script Integration & Editorial Lower-Third",
        "description": "Blended warm golden-glow script directly onto the timber cutting board grain with legible serif & display lower-third copy.",
        "pictures": [
          {
            "id": "proc-gd9-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg",
            "caption": "Final culinary storytelling poster.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Wall & Social Poster Design",
      "Typographic Photo Compositing"
    ],
    "createdAt": 1712200000000
  },
  // GD 10 — De Padua Learning Academy — 9th Inter-House Sports Emblem
  {
    "id": "proj-gd-10",
    "title": "De Padua Learning Academy — 9th Inter-House Sports Emblem",
    "category": "Graphic Design",
    "client": "De Padua Learning Academy",
    "clientDescription": "Primary and secondary educational academy fostering academic excellence and athletic sportsmanship.",
    "shortDescription": "Commemorative circular medal and crest print artwork designed for the 9th Inter-House Sports Competition (2025).",
    "threeWordDesc": "Commemorative Sports Crest",
    "descriptors": "Emblem, Print Medal, Illustration",
    "isRealLife": true,
    "price": "₦120,000",
    "currency": "NGN",
    "year": "2025",
    "monthYear": "November 2025",
    "duration": "1 Week",
    "featured": false,
    "description": "Custom circular medal print emblem created for De Padua Learning Academy’s 9th Inter-House Sports (2025). Features twin growth trees symbolizing mentorship and youth development, arched academy lettering, and tactile vintage speckle texture.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png"
    ],
    "galleryPictures": [
      {
        "id": "gd10-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png",
        "caption": "De Padua Learning Academy — 9th Inter-House Sports 2025 circular medal print artwork.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd10-1",
        "name": "Phase 01: Circular Badge Vector & Print Preparation",
        "description": "Engineered a balanced circular crest for physical medal die-sublimation and event apparel printing.",
        "pictures": [
          {
            "id": "proc-gd10-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png",
            "caption": "Final medal print master artwork.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Circular Medal Print Artwork",
      "Event Crest Illustration",
      "Print-Ready PNG Master"
    ],
    "createdAt": 1712150000000
  },
  // GD 1 — PIC Organics — Zobo Tea with Beetroot Packaging
  {
    "id": "proj-gd-1",
    "title": "PIC Organics — Zobo Tea with Beetroot Packaging",
    "category": "Graphic Design",
    "client": "PIC Organics (Pharmacy Informatics Consult)",
    "clientDescription": "Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.",
    "shortDescription": "Stand-up pouch packaging design and 3D commercial product visualization for heart-friendly Zobo Tea with Beetroot.",
    "threeWordDesc": "Botanical Pouch Packaging",
    "descriptors": "Packaging, Product Visualization, FMCG",
    "isRealLife": true,
    "price": "₦450,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "October 2026",
    "duration": "3 Weeks",
    "featured": true,
    "description": "Complete front and back stand-up pouch packaging design for PIC Organics Zobo Tea with Beetroot, paired with high-impact commercial product renders amidst hibiscus petals and water splashes.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806391/VDVC_Portfolio/graphic-design/pghqoqryveqhvzju0szv.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806386/VDVC_Portfolio/graphic-design/mfucqsgaqikax7j7ne8g.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806366/VDVC_Portfolio/graphic-design/ftjxarldypwnnfawnbdd.png"
    ],
    "galleryPictures": [
      {
        "id": "gd1-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
        "caption": "Zobo Tea with Beetroot — Commercial hero product visualization with hibiscus petals and botanical dust.",
        "isAI": true
      },
      {
        "id": "gd1-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806391/VDVC_Portfolio/graphic-design/pghqoqryveqhvzju0szv.jpg",
        "caption": "Zobo Tea with Beetroot — Aquatic product staging on rippled water surface.",
        "isAI": true
      },
      {
        "id": "gd1-g3",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806386/VDVC_Portfolio/graphic-design/mfucqsgaqikax7j7ne8g.png",
        "caption": "Front Pouch Master Artwork — Custom typography, botanical illustrations, and heart-friendly seal.",
        "isAI": false
      },
      {
        "id": "gd1-g4",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806366/VDVC_Portfolio/graphic-design/ftjxarldypwnnfawnbdd.png",
        "caption": "Back Pouch Master Artwork — Nutritional facts, brewing guide, NAFDAC compliance, and barcode layout.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd1-1",
        "name": "Phase 01: Pouch Die-Line & Print Master Layout",
        "description": "Developed the front and back print dielines incorporating rich burgundy hibiscus tones, clear preparation instructions, and regulatory labeling.",
        "pictures": [
          {
            "id": "proc-gd1-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806386/VDVC_Portfolio/graphic-design/mfucqsgaqikax7j7ne8g.png",
            "caption": "Final front cover print master (V22).",
            "type": "Final"
          },
          {
            "id": "proc-gd1-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806366/VDVC_Portfolio/graphic-design/ftjxarldypwnnfawnbdd.png",
            "caption": "Final back cover print master (V2).",
            "type": "Final"
          }
        ]
      },
      {
        "id": "step-gd1-2",
        "name": "Phase 02: AI-Assisted Commercial Product Staging",
        "description": "Composite product photography and generative environment lighting crafted to showcase the physical pouch in dynamic botanical and aquatic scenes.",
        "pictures": [
          {
            "id": "proc-gd1-3",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806396/VDVC_Portfolio/graphic-design/gjtbt7pzvzwkisqygdhk.jpg",
            "caption": "Hibiscus explosion commercial key visual.",
            "type": "AI"
          },
          {
            "id": "proc-gd1-4",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806391/VDVC_Portfolio/graphic-design/pghqoqryveqhvzju0szv.jpg",
            "caption": "Water surface reflection commercial render.",
            "type": "AI"
          }
        ]
      }
    ],
    "deliverables": [
      "Front & Back Pouch Artwork",
      "Print-Ready Die-Lines",
      "Commercial 3D/AI Product Mockups"
    ],
    "createdAt": 1712600000000
  },
  // GD 2 — PIC Organics — Herbal Supplement Capsules Suite
  {
    "id": "proj-gd-2",
    "title": "PIC Organics — Herbal Supplement Capsules Suite",
    "category": "Graphic Design",
    "client": "PIC Organics (Pharmacy Informatics Consult)",
    "clientDescription": "Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.",
    "shortDescription": "Pharmaceutical-grade label system and 3D levitating bottle campaign for Garlic, Ginger, and NeemCal herbal capsules.",
    "threeWordDesc": "Herbal Supplement Packaging",
    "descriptors": "Pharmaceutical, Packaging, 3D Mockup",
    "isRealLife": true,
    "price": "₦680,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "September 2026",
    "duration": "4 Weeks",
    "featured": true,
    "description": "Comprehensive bottle label architecture and promotional product visualization for PIC Organics’ herbal capsule line—spanning Garlic, Ginger, and NeemCal formulations with cohesive botanical curves and dynamic levitating product shots.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807379/VDVC_Portfolio/graphic-design/i4mies3zpvnehegr5yp9.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807383/VDVC_Portfolio/graphic-design/wcnnblzsxagyfadposw0.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807386/VDVC_Portfolio/graphic-design/otuzwsrpqwacndd4jpdt.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807388/VDVC_Portfolio/graphic-design/dlkluw0oofnfbtkfrhk0.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806438/VDVC_Portfolio/graphic-design/ilfigtxtm2stk7n8euqn.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806469/VDVC_Portfolio/graphic-design/s0qyud8g19qnsbr05bsa.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806478/VDVC_Portfolio/graphic-design/bdcymegalcq5whl2p0b2.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd2-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
        "caption": "Levitating Supplement Bottle — Botanical studio staging with natural ingredients.",
        "isAI": true
      },
      {
        "id": "gd2-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807379/VDVC_Portfolio/graphic-design/i4mies3zpvnehegr5yp9.jpg",
        "caption": "Floating Supplement Bottle — Soft fabric & botanical environment showcase.",
        "isAI": true
      },
      {
        "id": "gd2-g3",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807383/VDVC_Portfolio/graphic-design/wcnnblzsxagyfadposw0.jpg",
        "caption": "Levitating Bottle Concept I — High-contrast atmospheric product presentation.",
        "isAI": true
      },
      {
        "id": "gd2-g4",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807386/VDVC_Portfolio/graphic-design/otuzwsrpqwacndd4jpdt.jpg",
        "caption": "Levitating Bottle Concept II — Organic lighting and hero angle.",
        "isAI": true
      },
      {
        "id": "gd2-g5",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807388/VDVC_Portfolio/graphic-design/dlkluw0oofnfbtkfrhk0.jpg",
        "caption": "Levitating Bottle Concept III — Pedestal and natural shadow study.",
        "isAI": true
      },
      {
        "id": "gd2-g6",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806438/VDVC_Portfolio/graphic-design/ilfigtxtm2stk7n8euqn.png",
        "caption": "Garlic Capsule Label — Final production wrap-around bottle label.",
        "isAI": false
      },
      {
        "id": "gd2-g7",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806469/VDVC_Portfolio/graphic-design/s0qyud8g19qnsbr05bsa.png",
        "caption": "Ginger Capsule Label — Final production wrap-around bottle label.",
        "isAI": false
      },
      {
        "id": "gd2-g8",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806478/VDVC_Portfolio/graphic-design/bdcymegalcq5whl2p0b2.jpg",
        "caption": "NeemCal Capsules (500mg x 30) — Full production label with dosage, ingredients, and NAFDAC specifications.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd2-1",
        "name": "Phase 01: Multi-SKU Label Architecture",
        "description": "Created a unified wrap-around label system across Garlic, Ginger, and NeemCal SKUs, balancing botanical illustration with clear dosage and regulatory data.",
        "pictures": [
          {
            "id": "proc-gd2-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806478/VDVC_Portfolio/graphic-design/bdcymegalcq5whl2p0b2.jpg",
            "caption": "NeemCal Capsule production print master (v2).",
            "type": "Final"
          },
          {
            "id": "proc-gd2-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806438/VDVC_Portfolio/graphic-design/ilfigtxtm2stk7n8euqn.png",
            "caption": "Garlic Capsule final label master.",
            "type": "Final"
          },
          {
            "id": "proc-gd2-3",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806469/VDVC_Portfolio/graphic-design/s0qyud8g19qnsbr05bsa.png",
            "caption": "Ginger Capsule final label master.",
            "type": "Final"
          }
        ]
      },
      {
        "id": "step-gd2-2",
        "name": "Phase 02: Levitating Bottle Campaign Visuals",
        "description": "Generated five distinct levitating and floating bottle scenes to power digital marketing and retail displays.",
        "pictures": [
          {
            "id": "proc-gd2-4",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807391/VDVC_Portfolio/graphic-design/kbpl9ibaqionr7pn0meb.jpg",
            "caption": "Levitating bottle hero visual.",
            "type": "AI"
          },
          {
            "id": "proc-gd2-5",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793807379/VDVC_Portfolio/graphic-design/i4mies3zpvnehegr5yp9.jpg",
            "caption": "Floating bottle environment study.",
            "type": "AI"
          }
        ]
      }
    ],
    "deliverables": [
      "3 SKU Production Labels (Garlic, Ginger, NeemCal)",
      "5 Commercial Bottle Renders",
      "Print Production Prepress"
    ],
    "createdAt": 1712550000000
  },
  // GD 3 — PIC Organics — Ecumenical Product Catalog Trifold
  {
    "id": "proj-gd-3",
    "title": "PIC Organics — Ecumenical Product Catalog Trifold",
    "category": "Graphic Design",
    "client": "PIC Organics (Pharmacy Informatics Consult)",
    "clientDescription": "Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.",
    "shortDescription": "6-panel trifold brochure and product shelf catalog designed in dual Light and Dark editorial themes.",
    "threeWordDesc": "Dual-Theme Trifold Catalog",
    "descriptors": "Brochure, Print Design, Editorial",
    "isRealLife": true,
    "price": "₦380,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "September 2026",
    "duration": "2 Weeks",
    "featured": true,
    "description": "An informative 6-panel trifold brochure cataloging PIC Organics’ curative cosmetics, vivifying herbal teas, natural food alternatives, capsules, and essential oils—delivered in both lush forest-dark and crisp botanical-light print editions.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806496/VDVC_Portfolio/graphic-design/j8oo0ee8k2r0si79tgbk.png",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806496/VDVC_Portfolio/graphic-design/j8oo0ee8k2r0si79tgbk.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806634/VDVC_Portfolio/graphic-design/oyl0gbnvpq8kiwtkppga.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806590/VDVC_Portfolio/graphic-design/rbsfwafunohxoibwqejf.png",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806555/VDVC_Portfolio/graphic-design/b53m4djok0x0etdw1vnz.png"
    ],
    "galleryPictures": [
      {
        "id": "gd3-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806496/VDVC_Portfolio/graphic-design/j8oo0ee8k2r0si79tgbk.png",
        "caption": "3D Trifold Brochure Mockup — Inside spread of the forest-dark edition on matte stock.",
        "isAI": false
      },
      {
        "id": "gd3-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806634/VDVC_Portfolio/graphic-design/oyl0gbnvpq8kiwtkppga.png",
        "caption": "Outside Spread (Light Edition) — Front cover, back cover, and introductory fold panel.",
        "isAI": false
      },
      {
        "id": "gd3-g3",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806590/VDVC_Portfolio/graphic-design/rbsfwafunohxoibwqejf.png",
        "caption": "Inside Spread (Light Edition) — Curative Cosmetics, Vivifying Cha, and complete shelf inventory.",
        "isAI": false
      },
      {
        "id": "gd3-g4",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806555/VDVC_Portfolio/graphic-design/b53m4djok0x0etdw1vnz.png",
        "caption": "Inside Spread (Dark Edition) — Deep forest green editorial variant with high-contrast typography.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd3-1",
        "name": "Phase 01: Information Architecture & Dual-Theme Layout",
        "description": "Structured over 35 herbal products across four categories (Capsules, Essential Oils, Foods, Herbal Tea) alongside instructional callouts and photography.",
        "pictures": [
          {
            "id": "proc-gd3-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806634/VDVC_Portfolio/graphic-design/oyl0gbnvpq8kiwtkppga.png",
            "caption": "Outside 3-panel master layout (Light theme).",
            "type": "Final"
          },
          {
            "id": "proc-gd3-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806555/VDVC_Portfolio/graphic-design/b53m4djok0x0etdw1vnz.png",
            "caption": "Inside 3-panel master layout (Dark theme).",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "6-Panel Trifold Layout (Light & Dark Editions)",
      "3D Print Presentation Mockup",
      "Press-Ready CMYK Spreads"
    ],
    "createdAt": 1712500000000
  },
  // GD 4 — Pamtronics Nig. Ltd. — Independence Day Solar Campaign
  {
    "id": "proj-gd-4",
    "title": "Pamtronics Nig. Ltd. — Independence Day Solar Campaign",
    "category": "Graphic Design",
    "client": "Pamtronics Nig. Ltd.",
    "clientDescription": "Renewable energy and solar power solutions provider supplying inverters, lithium batteries, solar panels, and electric mobility in Nigeria.",
    "shortDescription": "Dual promotional campaign flyers celebrating Nigeria’s 66th Independence Day with clean solar energy solutions.",
    "threeWordDesc": "Solar Campaign Key-Visuals",
    "descriptors": "Campaign Flyer, Social Media, Energy",
    "isRealLife": true,
    "price": "₦220,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "October 2026",
    "duration": "1 Week",
    "featured": true,
    "description": "High-impact promotional flyer suite for Pamtronics Nig. Ltd. marking Nigeria’s 66th Independence Day (\"Let the sun power your home today\"), showcasing their flagship Lemax & Megarevo inverters, solar panels, and electric scooter range.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806662/VDVC_Portfolio/graphic-design/juw9bz8sil92umaon1oq.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd4-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
        "caption": "Pamtronics Independence Day Flyer I (v5) — Clean white & emerald \"66\" typographic composition with product lineup.",
        "isAI": false
      },
      {
        "id": "gd4-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806662/VDVC_Portfolio/graphic-design/juw9bz8sil92umaon1oq.jpg",
        "caption": "Pamtronics Independence Day Flyer II (v4) — Alternate campaign variation for social and print distribution.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd4-1",
        "name": "Phase 01: Campaign Typography & Product Compositing",
        "description": "Combined celebratory national green-and-gold numeral styling with crisp product cutouts and clear contact metadata.",
        "pictures": [
          {
            "id": "proc-gd4-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806641/VDVC_Portfolio/graphic-design/byww8ryqw7jo3pwn5mia.jpg",
            "caption": "Primary Independence Day key visual (v5).",
            "type": "Final"
          },
          {
            "id": "proc-gd4-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806662/VDVC_Portfolio/graphic-design/juw9bz8sil92umaon1oq.jpg",
            "caption": "Secondary campaign variation (v4).",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "2 Campaign Flyer Variations",
      "Social Media & Print Assets",
      "Product Cutout Compositing"
    ],
    "createdAt": 1712450000000
  },
  // GD 5 — To The End — Sports & Badminton Editorial Magazine
  {
    "id": "proj-gd-5",
    "title": "To The End — Sports & Badminton Editorial Magazine",
    "category": "Graphic Design",
    "client": "To The End Sports Publication",
    "clientDescription": "Athletic performance and competitive racquet sports magazine spotlighting youth grit and training routines.",
    "shortDescription": "Dynamic sports magazine cover design and photorealistic print mockup built around high-velocity badminton action photography.",
    "threeWordDesc": "Athletic Editorial Cover",
    "descriptors": "Magazine Cover, Editorial, Sports",
    "isRealLife": true,
    "price": "₦280,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "August 2026",
    "duration": "1.5 Weeks",
    "featured": true,
    "description": "Editorial cover direction for \"TO THE END\", pairing dramatic stadium lighting and mid-air badminton smash photography with bold italic display typography (\"You fight to the end, that’s all that counts\") and callout badges.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806663/VDVC_Portfolio/graphic-design/vrxzn4whoaytctlefosi.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd5-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
        "caption": "To The End Magazine — Photorealistic print edition mockup.",
        "isAI": false
      },
      {
        "id": "gd5-g2",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806663/VDVC_Portfolio/graphic-design/vrxzn4whoaytctlefosi.jpg",
        "caption": "To The End Magazine Cover — Full-bleed typographic layout and athletic action composite.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd5-1",
        "name": "Phase 01: Editorial Cover Hierarchy & Print Mockup",
        "description": "Balanced dynamic subject masking with high-contrast white and crimson cover lines to capture competitive intensity.",
        "pictures": [
          {
            "id": "proc-gd5-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806663/VDVC_Portfolio/graphic-design/vrxzn4whoaytctlefosi.jpg",
            "caption": "Flat cover production artwork.",
            "type": "Final"
          },
          {
            "id": "proc-gd5-2",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806677/VDVC_Portfolio/graphic-design/bln0hrrh8iddzcu7mxxe.jpg",
            "caption": "3D glossy magazine presentation mockup.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Magazine Cover Artwork",
      "3D Print Presentation Mockup",
      "Typography & Cover Line System"
    ],
    "createdAt": 1712400000000
  },
  // GD 6 — Virtuoso Magazine — Menswear & Bespoke Style Cover
  {
    "id": "proj-gd-6",
    "title": "Virtuoso Magazine — Menswear & Bespoke Style Cover",
    "category": "Graphic Design",
    "client": "Virtuoso Fashion & Style",
    "clientDescription": "Contemporary African menswear, tailoring, and sartorial lifestyle publication.",
    "shortDescription": "Refined serif editorial cover design for Virtuoso Magazine celebrating crisp elegance and 64+ contemporary men’s styles.",
    "threeWordDesc": "Sartorial Magazine Cover",
    "descriptors": "Fashion Editorial, Magazine, Typography",
    "isRealLife": true,
    "price": "₦260,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "August 2026",
    "duration": "1 Week",
    "featured": true,
    "description": "Editorial cover design for VIRTUOSO Magazine (\"Crisp Elegance in Every Design and Style — No Room for Mediocre Looks\"), featuring classic high-contrast serif typography, angled folio callouts, and tactile stone-textured backdrop.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd6-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg",
        "caption": "Virtuoso Magazine Cover Mockup — Bespoke menswear issue featuring 64+ men styles.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd6-1",
        "name": "Phase 01: Sartorial Typography & Perspective Mockup",
        "description": "Paired full-length menswear portraiture with classic editorial serif masthead placement so the subject interacts naturally with the title.",
        "pictures": [
          {
            "id": "proc-gd6-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806691/VDVC_Portfolio/graphic-design/omhmlyclegknl3w7bijd.jpg",
            "caption": "Final Virtuoso Magazine cover presentation mockup.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Magazine Cover Layout",
      "Editorial Masthead Typography",
      "Print Mockup Presentation"
    ],
    "createdAt": 1712350000000
  },
  // GD 7 — Pete's Bakery — Peanut Roll Snack of the Week Campaign
  {
    "id": "proj-gd-7",
    "title": "Pete's Bakery — Peanut Roll Snack of the Week Campaign",
    "category": "Graphic Design",
    "client": "Pete's Bakery, Odena Plaza",
    "clientDescription": "Artisan neighborhood bakery and confectionery located at Odena Plaza offering fresh daily pastries and snacks.",
    "shortDescription": "Warm, appetite-driven promotional poster for Pete’s Bakery featuring their signature Peanut Roll at 30% off.",
    "threeWordDesc": "Artisan Bakery Promotion",
    "descriptors": "Food Advertising, Poster, Typography",
    "isRealLife": true,
    "price": "₦150,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "July 2026",
    "duration": "4 Days",
    "featured": false,
    "description": "Promotional graphic design for Pete’s Bakery spotlighting the \"Peanut Roll — Snack of the Week (30% off)\". Crafted with warm roasted-peanut tones, stacked macro pastry photography, and playful hand-lettered copy (\"In a nutshell, roll up stress and chill\").",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd7-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg",
        "caption": "Pete's Bakery Peanut Roll — Snack of the Week 30% off promotional poster.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd7-1",
        "name": "Phase 01: Appetite Color Grading & Promotional Copy",
        "description": "Combined close-up swirled pastry imagery with warm golden-brown textures and custom outlined script typography.",
        "pictures": [
          {
            "id": "proc-gd7-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806725/VDVC_Portfolio/graphic-design/b3ljkubdt9zzdvmd0jca.jpg",
            "caption": "Final Peanut Roll promotional banner.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Promotional Landscape Poster",
      "Social Media Ad Graphic",
      "Copywriting & Visual Direction"
    ],
    "createdAt": 1712300000000
  },
  // GD 8 — Pete's Kitchen — "Savor the Flavour" Culinary Ad
  {
    "id": "proj-gd-8",
    "title": "Pete's Kitchen — \"Savor the Flavour\" Culinary Ad",
    "category": "Graphic Design",
    "client": "Pete's Kitchen & Bakery",
    "clientDescription": "Vibrant culinary kitchen and dining spot celebrating simple ingredients and extraordinary taste.",
    "shortDescription": "Dynamic levitating pasta advertisement (\"Pro tip: Lick the plate. We won’t judge\") crafted with rich royal blue contrast.",
    "threeWordDesc": "Dynamic Culinary Advertising",
    "descriptors": "Culinary Ad, Levitation, Hospitality",
    "isRealLife": true,
    "price": "₦160,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "July 2026",
    "duration": "4 Days",
    "featured": false,
    "description": "Eye-catching culinary advertisement for Pete’s (\"Savor the Flavour! — Simple Ingredients, Extraordinary Taste\"), contrasting warm orange flying pasta, cherry tomatoes, and seared protein against a deep royal blue studio backdrop.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd8-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg",
        "caption": "Savor the Flavour at Pete’s — \"Pro tip: Lick the plate. We won’t judge\" promotional banner.",
        "isAI": true
      }
    ],
    "processSteps": [
      {
        "id": "step-gd8-1",
        "name": "Phase 01: High-Contrast Food Staging & Ribbon Badge",
        "description": "Paired a dynamic mid-air culinary illustration with a burgundy corner ribbon and bold complementary orange branding.",
        "pictures": [
          {
            "id": "proc-gd8-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806728/VDVC_Portfolio/graphic-design/pqtx232almuasc0alqvc.jpg",
            "caption": "Final \"Pro Tip\" culinary promotional banner.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Digital Billboard & Social Banner",
      "Generative Food Illustration",
      "Brand Typography"
    ],
    "createdAt": 1712250000000
  },
  // GD 9 — From Our Kitchen to Your Heart — Culinary Story Poster
  {
    "id": "proj-gd-9",
    "title": "From Our Kitchen to Your Heart — Culinary Story Poster",
    "category": "Graphic Design",
    "client": "Pete's Kitchen Collective",
    "clientDescription": "Artisan culinary collective celebrating authentic kitchen prep, fresh ingredients, and shared meals.",
    "shortDescription": "Overhead mise-en-place culinary poster celebrating kitchen craft (\"The kitchen is where magic happens — and the mess\").",
    "threeWordDesc": "Overhead Culinary Storytelling",
    "descriptors": "Culinary, Poster, Typography",
    "isRealLife": true,
    "price": "₦140,000",
    "currency": "NGN",
    "year": "2026",
    "monthYear": "June 2026",
    "duration": "3 Days",
    "featured": false,
    "description": "Warm overhead flat-lay poster capturing a chef’s chopping board surrounded by fresh mirepoix, herbs, and spices, engraved with wood-burned script typography (\"From our kitchen to your heart\") and lower-third editorial messaging.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg"
    ],
    "galleryPictures": [
      {
        "id": "gd9-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg",
        "caption": "From Our Kitchen to Your Heart — Overhead culinary prep poster.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd9-1",
        "name": "Phase 01: Wood-Burned Script Integration & Editorial Lower-Third",
        "description": "Blended warm golden-glow script directly onto the timber cutting board grain with legible serif & display lower-third copy.",
        "pictures": [
          {
            "id": "proc-gd9-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806731/VDVC_Portfolio/graphic-design/wosltzg00phrwmrtdeog.jpg",
            "caption": "Final culinary storytelling poster.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Wall & Social Poster Design",
      "Typographic Photo Compositing"
    ],
    "createdAt": 1712200000000
  },
  // GD 10 — De Padua Learning Academy — 9th Inter-House Sports Emblem
  {
    "id": "proj-gd-10",
    "title": "De Padua Learning Academy — 9th Inter-House Sports Emblem",
    "category": "Graphic Design",
    "client": "De Padua Learning Academy",
    "clientDescription": "Primary and secondary educational academy fostering academic excellence and athletic sportsmanship.",
    "shortDescription": "Commemorative circular medal and crest print artwork designed for the 9th Inter-House Sports Competition (2025).",
    "threeWordDesc": "Commemorative Sports Crest",
    "descriptors": "Emblem, Print Medal, Illustration",
    "isRealLife": true,
    "price": "₦120,000",
    "currency": "NGN",
    "year": "2025",
    "monthYear": "November 2025",
    "duration": "1 Week",
    "featured": false,
    "description": "Custom circular medal print emblem created for De Padua Learning Academy’s 9th Inter-House Sports (2025). Features twin growth trees symbolizing mentorship and youth development, arched academy lettering, and tactile vintage speckle texture.",
    "imageUrl": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png",
    "images": [
      "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png"
    ],
    "galleryPictures": [
      {
        "id": "gd10-g1",
        "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png",
        "caption": "De Padua Learning Academy — 9th Inter-House Sports 2025 circular medal print artwork.",
        "isAI": false
      }
    ],
    "processSteps": [
      {
        "id": "step-gd10-1",
        "name": "Phase 01: Circular Badge Vector & Print Preparation",
        "description": "Engineered a balanced circular crest for physical medal die-sublimation and event apparel printing.",
        "pictures": [
          {
            "id": "proc-gd10-1",
            "url": "https://res.cloudinary.com/dwo7oemds/image/upload/v1793806705/VDVC_Portfolio/graphic-design/pponvsxr4dd9cpb6gtbh.png",
            "caption": "Final medal print master artwork.",
            "type": "Final"
          }
        ]
      }
    ],
    "deliverables": [
      "Circular Medal Print Artwork",
      "Event Crest Illustration",
      "Print-Ready PNG Master"
    ],
    "createdAt": 1712150000000
  },
];

import { Project } from '../types/portfolio';

// High-fidelity SVG generator with soft snowy white aesthetic and light shades of blue
const createSnowyDesignSvg = (
  title: string,
  subtitle: string,
  accentBlue: string,
  patternType: 'poster' | 'ui' | 'packaging' | 'editorial' | 'identity' | 'web'
): string => {
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
      <text x="90" y="190" font-family="'Syne', sans-serif" font-weight="700" font-size="34" fill="#0f172a" letter-spacing="-1">${title}</text>
      <text x="90" y="220" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="#64748b">${subtitle}</text>
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
        <text x="320" y="70" font-family="'Syne', sans-serif" font-weight="800" font-size="30" fill="#0f172a" letter-spacing="-0.5">${title}</text>
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
        <text x="340" y="140" font-family="'Syne', sans-serif" font-weight="800" font-size="36" fill="#0f172a" letter-spacing="-1">${title}</text>
        <text x="340" y="175" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="${accentBlue}" letter-spacing="3">${subtitle}</text>
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
      <linearGradient id="snowGrad_${title.replace(/\W/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#f0f9ff"/>
      </linearGradient>
      <linearGradient id="snowGlow_${title.replace(/\W/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accentBlue}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <pattern id="softGrid_${title.replace(/\W/g, '')}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="0.8" stroke-opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="800" height="500" fill="url(#snowGrad_${title.replace(/\W/g, '')})"/>
    <rect width="800" height="500" fill="url(#softGrid_${title.replace(/\W/g, '')})"/>
    <circle cx="700" cy="110" r="290" fill="url(#snowGlow_${title.replace(/\W/g, '')})"/>
    ${innerArt}
    <g transform="translate(60, 470)">
      <text font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748b" letter-spacing="1.5">${title.toUpperCase()} // ${subtitle.toUpperCase()}</text>
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" width="600" height="420">
    <defs>
      <linearGradient id="bgGrad_${title.replace(/\W/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${isAI ? '#1e1138' : '#0f172a'}"/>
        <stop offset="100%" stop-color="${isAI ? '#130f30' : '#1e293b'}"/>
      </linearGradient>
      <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c084fc"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#8b5cf6"/>
      </linearGradient>
    </defs>
    <rect width="600" height="420" fill="url(#bgGrad_${title.replace(/\W/g, '')})"/>
    <g opacity="0.15">
      <path d="M 0,70 L 600,70 M 0,140 L 600,140 M 0,210 L 600,210 M 0,280 L 600,280 M 0,350 L 600,350" stroke="#a855f7" stroke-width="1"/>
      <path d="M 100,0 L 100,420 M 200,0 L 200,420 M 300,0 L 300,420 M 400,0 L 400,420 M 500,0 L 500,420" stroke="#a855f7" stroke-width="1"/>
    </g>
    <circle cx="480" cy="120" r="140" fill="${themeColor}" fill-opacity="${isAI ? '0.18' : '0.12'}"/>
    <rect x="50" y="50" width="500" height="320" rx="12" fill="none" stroke="${isAI ? 'url(#purpleGlow)' : '#334155'}" stroke-width="${isAI ? '2' : '1.5'}" stroke-dasharray="${isAI ? 'none' : '4 4'}"/>
    <text x="80" y="120" font-family="'Syne', sans-serif" font-weight="700" font-size="26" fill="#f8fafc">${title}</text>
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
];


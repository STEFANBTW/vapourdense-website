import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const urls = JSON.parse(fs.readFileSync(path.join(__dirname, 'uploaded-urls.json'), 'utf8'));

// Verify all 25 URLs exist
for (const [k, v] of Object.entries(urls)) {
  if (!v) throw new Error(`Missing Cloudinary URL for ${k}`);
}

export const newGraphicProjects = [
  // GD 1 — PIC Organics Zobo Tea Packaging
  {
    id: 'proj-gd-1',
    title: 'PIC Organics — Zobo Tea with Beetroot Packaging',
    category: 'Graphic Design',
    client: 'PIC Organics (Pharmacy Informatics Consult)',
    clientDescription: 'Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.',
    shortDescription: 'Stand-up pouch packaging design and 3D commercial product visualization for heart-friendly Zobo Tea with Beetroot.',
    threeWordDesc: 'Botanical Pouch Packaging',
    descriptors: 'Packaging, Product Visualization, FMCG',
    isRealLife: true,
    price: '₦450,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'October 2026',
    duration: '3 Weeks',
    featured: true,
    description: 'Complete front and back stand-up pouch packaging design for PIC Organics Zobo Tea with Beetroot, paired with high-impact commercial product renders amidst hibiscus petals and water splashes.',
    imageUrl: urls.zobo_hibiscus,
    images: [
      urls.zobo_hibiscus,
      urls.zobo_water,
      urls.zobo_fc,
      urls.zobo_bc,
    ],
    galleryPictures: [
      {
        id: 'gd1-g1',
        url: urls.zobo_hibiscus,
        caption: 'Zobo Tea with Beetroot — Commercial hero product visualization with hibiscus petals and botanical dust.',
        isAI: true,
      },
      {
        id: 'gd1-g2',
        url: urls.zobo_water,
        caption: 'Zobo Tea with Beetroot — Aquatic product staging on rippled water surface.',
        isAI: true,
      },
      {
        id: 'gd1-g3',
        url: urls.zobo_fc,
        caption: 'Front Pouch Master Artwork — Custom typography, botanical illustrations, and heart-friendly seal.',
        isAI: false,
      },
      {
        id: 'gd1-g4',
        url: urls.zobo_bc,
        caption: 'Back Pouch Master Artwork — Nutritional facts, brewing guide, NAFDAC compliance, and barcode layout.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd1-1',
        name: 'Phase 01: Pouch Die-Line & Print Master Layout',
        description: 'Developed the front and back print dielines incorporating rich burgundy hibiscus tones, clear preparation instructions, and regulatory labeling.',
        pictures: [
          {
            id: 'proc-gd1-1',
            url: urls.zobo_fc,
            caption: 'Final front cover print master (V22).',
            type: 'Final',
          },
          {
            id: 'proc-gd1-2',
            url: urls.zobo_bc,
            caption: 'Final back cover print master (V2).',
            type: 'Final',
          },
        ],
      },
      {
        id: 'step-gd1-2',
        name: 'Phase 02: AI-Assisted Commercial Product Staging',
        description: 'Composite product photography and generative environment lighting crafted to showcase the physical pouch in dynamic botanical and aquatic scenes.',
        pictures: [
          {
            id: 'proc-gd1-3',
            url: urls.zobo_hibiscus,
            caption: 'Hibiscus explosion commercial key visual.',
            type: 'AI',
          },
          {
            id: 'proc-gd1-4',
            url: urls.zobo_water,
            caption: 'Water surface reflection commercial render.',
            type: 'AI',
          },
        ],
      },
    ],
    deliverables: ['Front & Back Pouch Artwork', 'Print-Ready Die-Lines', 'Commercial 3D/AI Product Mockups'],
    createdAt: 1712600000000,
  },

  // GD 2 — PIC Organics Herbal Supplement Capsules Suite
  {
    id: 'proj-gd-2',
    title: 'PIC Organics — Herbal Supplement Capsules Suite',
    category: 'Graphic Design',
    client: 'PIC Organics (Pharmacy Informatics Consult)',
    clientDescription: 'Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.',
    shortDescription: 'Pharmaceutical-grade label system and 3D levitating bottle campaign for Garlic, Ginger, and NeemCal herbal capsules.',
    threeWordDesc: 'Herbal Supplement Packaging',
    descriptors: 'Pharmaceutical, Packaging, 3D Mockup',
    isRealLife: true,
    price: '₦680,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'September 2026',
    duration: '4 Weeks',
    featured: true,
    description: 'Comprehensive bottle label architecture and promotional product visualization for PIC Organics’ herbal capsule line—spanning Garlic, Ginger, and NeemCal formulations with cohesive botanical curves and dynamic levitating product shots.',
    imageUrl: urls.cap_lev4,
    images: [
      urls.cap_lev4,
      urls.cap_float,
      urls.cap_lev1,
      urls.cap_lev2,
      urls.cap_lev3,
      urls.cap_garlic,
      urls.cap_ginger,
      urls.cap_neemcal,
    ],
    galleryPictures: [
      {
        id: 'gd2-g1',
        url: urls.cap_lev4,
        caption: 'Levitating Supplement Bottle — Botanical studio staging with natural ingredients.',
        isAI: true,
      },
      {
        id: 'gd2-g2',
        url: urls.cap_float,
        caption: 'Floating Supplement Bottle — Soft fabric & botanical environment showcase.',
        isAI: true,
      },
      {
        id: 'gd2-g3',
        url: urls.cap_lev1,
        caption: 'Levitating Bottle Concept I — High-contrast atmospheric product presentation.',
        isAI: true,
      },
      {
        id: 'gd2-g4',
        url: urls.cap_lev2,
        caption: 'Levitating Bottle Concept II — Organic lighting and hero angle.',
        isAI: true,
      },
      {
        id: 'gd2-g5',
        url: urls.cap_lev3,
        caption: 'Levitating Bottle Concept III — Pedestal and natural shadow study.',
        isAI: true,
      },
      {
        id: 'gd2-g6',
        url: urls.cap_garlic,
        caption: 'Garlic Capsule Label — Final production wrap-around bottle label.',
        isAI: false,
      },
      {
        id: 'gd2-g7',
        url: urls.cap_ginger,
        caption: 'Ginger Capsule Label — Final production wrap-around bottle label.',
        isAI: false,
      },
      {
        id: 'gd2-g8',
        url: urls.cap_neemcal,
        caption: 'NeemCal Capsules (500mg x 30) — Full production label with dosage, ingredients, and NAFDAC specifications.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd2-1',
        name: 'Phase 01: Multi-SKU Label Architecture',
        description: 'Created a unified wrap-around label system across Garlic, Ginger, and NeemCal SKUs, balancing botanical illustration with clear dosage and regulatory data.',
        pictures: [
          {
            id: 'proc-gd2-1',
            url: urls.cap_neemcal,
            caption: 'NeemCal Capsule production print master (v2).',
            type: 'Final',
          },
          {
            id: 'proc-gd2-2',
            url: urls.cap_garlic,
            caption: 'Garlic Capsule final label master.',
            type: 'Final',
          },
          {
            id: 'proc-gd2-3',
            url: urls.cap_ginger,
            caption: 'Ginger Capsule final label master.',
            type: 'Final',
          },
        ],
      },
      {
        id: 'step-gd2-2',
        name: 'Phase 02: Levitating Bottle Campaign Visuals',
        description: 'Generated five distinct levitating and floating bottle scenes to power digital marketing and retail displays.',
        pictures: [
          {
            id: 'proc-gd2-4',
            url: urls.cap_lev4,
            caption: 'Levitating bottle hero visual.',
            type: 'AI',
          },
          {
            id: 'proc-gd2-5',
            url: urls.cap_float,
            caption: 'Floating bottle environment study.',
            type: 'AI',
          },
        ],
      },
    ],
    deliverables: ['3 SKU Production Labels (Garlic, Ginger, NeemCal)', '5 Commercial Bottle Renders', 'Print Production Prepress'],
    createdAt: 1712550000000,
  },

  // GD 3 — PIC Organics Ecumenical Trifold Brochure
  {
    id: 'proj-gd-3',
    title: 'PIC Organics — Ecumenical Product Catalog Trifold',
    category: 'Graphic Design',
    client: 'PIC Organics (Pharmacy Informatics Consult)',
    clientDescription: 'Natural herbal formulation and organic wellness product manufacturer based in Jos, Nigeria.',
    shortDescription: '6-panel trifold brochure and product shelf catalog designed in dual Light and Dark editorial themes.',
    threeWordDesc: 'Dual-Theme Trifold Catalog',
    descriptors: 'Brochure, Print Design, Editorial',
    isRealLife: true,
    price: '₦380,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'September 2026',
    duration: '2 Weeks',
    featured: true,
    description: 'An informative 6-panel trifold brochure cataloging PIC Organics’ curative cosmetics, vivifying herbal teas, natural food alternatives, capsules, and essential oils—delivered in both lush forest-dark and crisp botanical-light print editions.',
    imageUrl: urls.tri_dark_inside,
    images: [
      urls.tri_dark_inside,
      urls.tri_outside_light,
      urls.tri_inside_light,
      urls.tri_inside_dark,
    ],
    galleryPictures: [
      {
        id: 'gd3-g1',
        url: urls.tri_dark_inside,
        caption: '3D Trifold Brochure Mockup — Inside spread of the forest-dark edition on matte stock.',
        isAI: false,
      },
      {
        id: 'gd3-g2',
        url: urls.tri_outside_light,
        caption: 'Outside Spread (Light Edition) — Front cover, back cover, and introductory fold panel.',
        isAI: false,
      },
      {
        id: 'gd3-g3',
        url: urls.tri_inside_light,
        caption: 'Inside Spread (Light Edition) — Curative Cosmetics, Vivifying Cha, and complete shelf inventory.',
        isAI: false,
      },
      {
        id: 'gd3-g4',
        url: urls.tri_inside_dark,
        caption: 'Inside Spread (Dark Edition) — Deep forest green editorial variant with high-contrast typography.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd3-1',
        name: 'Phase 01: Information Architecture & Dual-Theme Layout',
        description: 'Structured over 35 herbal products across four categories (Capsules, Essential Oils, Foods, Herbal Tea) alongside instructional callouts and photography.',
        pictures: [
          {
            id: 'proc-gd3-1',
            url: urls.tri_outside_light,
            caption: 'Outside 3-panel master layout (Light theme).',
            type: 'Final',
          },
          {
            id: 'proc-gd3-2',
            url: urls.tri_inside_dark,
            caption: 'Inside 3-panel master layout (Dark theme).',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['6-Panel Trifold Layout (Light & Dark Editions)', '3D Print Presentation Mockup', 'Press-Ready CMYK Spreads'],
    createdAt: 1712500000000,
  },

  // GD 4 — Pamtronics Independence Day Flyer
  {
    id: 'proj-gd-4',
    title: 'Pamtronics Nig. Ltd. — Independence Day Solar Campaign',
    category: 'Graphic Design',
    client: 'Pamtronics Nig. Ltd.',
    clientDescription: 'Renewable energy and solar power solutions provider supplying inverters, lithium batteries, solar panels, and electric mobility in Nigeria.',
    shortDescription: 'Dual promotional campaign flyers celebrating Nigeria’s 66th Independence Day with clean solar energy solutions.',
    threeWordDesc: 'Solar Campaign Key-Visuals',
    descriptors: 'Campaign Flyer, Social Media, Energy',
    isRealLife: true,
    price: '₦220,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'October 2026',
    duration: '1 Week',
    featured: true,
    description: 'High-impact promotional flyer suite for Pamtronics Nig. Ltd. marking Nigeria’s 66th Independence Day ("Let the sun power your home today"), showcasing their flagship Lemax & Megarevo inverters, solar panels, and electric scooter range.',
    imageUrl: urls.pamtronics1,
    images: [
      urls.pamtronics1,
      urls.pamtronics2,
    ],
    galleryPictures: [
      {
        id: 'gd4-g1',
        url: urls.pamtronics1,
        caption: 'Pamtronics Independence Day Flyer I (v5) — Clean white & emerald "66" typographic composition with product lineup.',
        isAI: false,
      },
      {
        id: 'gd4-g2',
        url: urls.pamtronics2,
        caption: 'Pamtronics Independence Day Flyer II (v4) — Alternate campaign variation for social and print distribution.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd4-1',
        name: 'Phase 01: Campaign Typography & Product Compositing',
        description: 'Combined celebratory national green-and-gold numeral styling with crisp product cutouts and clear contact metadata.',
        pictures: [
          {
            id: 'proc-gd4-1',
            url: urls.pamtronics1,
            caption: 'Primary Independence Day key visual (v5).',
            type: 'Final',
          },
          {
            id: 'proc-gd4-2',
            url: urls.pamtronics2,
            caption: 'Secondary campaign variation (v4).',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['2 Campaign Flyer Variations', 'Social Media & Print Assets', 'Product Cutout Compositing'],
    createdAt: 1712450000000,
  },

  // GD 5 — To The End Magazine Cover
  {
    id: 'proj-gd-5',
    title: 'To The End — Sports & Badminton Editorial Magazine',
    category: 'Graphic Design',
    client: 'To The End Sports Publication',
    clientDescription: 'Athletic performance and competitive racquet sports magazine spotlighting youth grit and training routines.',
    shortDescription: 'Dynamic sports magazine cover design and photorealistic print mockup built around high-velocity badminton action photography.',
    threeWordDesc: 'Athletic Editorial Cover',
    descriptors: 'Magazine Cover, Editorial, Sports',
    isRealLife: true,
    price: '₦280,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'August 2026',
    duration: '1.5 Weeks',
    featured: true,
    description: 'Editorial cover direction for "TO THE END", pairing dramatic stadium lighting and mid-air badminton smash photography with bold italic display typography ("You fight to the end, that’s all that counts") and callout badges.',
    imageUrl: urls.tte_mockup,
    images: [
      urls.tte_mockup,
      urls.tte_cover,
    ],
    galleryPictures: [
      {
        id: 'gd5-g1',
        url: urls.tte_mockup,
        caption: 'To The End Magazine — Photorealistic print edition mockup.',
        isAI: false,
      },
      {
        id: 'gd5-g2',
        url: urls.tte_cover,
        caption: 'To The End Magazine Cover — Full-bleed typographic layout and athletic action composite.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd5-1',
        name: 'Phase 01: Editorial Cover Hierarchy & Print Mockup',
        description: 'Balanced dynamic subject masking with high-contrast white and crimson cover lines to capture competitive intensity.',
        pictures: [
          {
            id: 'proc-gd5-1',
            url: urls.tte_cover,
            caption: 'Flat cover production artwork.',
            type: 'Final',
          },
          {
            id: 'proc-gd5-2',
            url: urls.tte_mockup,
            caption: '3D glossy magazine presentation mockup.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Magazine Cover Artwork', '3D Print Presentation Mockup', 'Typography & Cover Line System'],
    createdAt: 1712400000000,
  },

  // GD 6 — Virtuoso Magazine Cover
  {
    id: 'proj-gd-6',
    title: 'Virtuoso Magazine — Menswear & Bespoke Style Cover',
    category: 'Graphic Design',
    client: 'Virtuoso Fashion & Style',
    clientDescription: 'Contemporary African menswear, tailoring, and sartorial lifestyle publication.',
    shortDescription: 'Refined serif editorial cover design for Virtuoso Magazine celebrating crisp elegance and 64+ contemporary men’s styles.',
    threeWordDesc: 'Sartorial Magazine Cover',
    descriptors: 'Fashion Editorial, Magazine, Typography',
    isRealLife: true,
    price: '₦260,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'August 2026',
    duration: '1 Week',
    featured: true,
    description: 'Editorial cover design for VIRTUOSO Magazine ("Crisp Elegance in Every Design and Style — No Room for Mediocre Looks"), featuring classic high-contrast serif typography, angled folio callouts, and tactile stone-textured backdrop.',
    imageUrl: urls.virtuoso,
    images: [
      urls.virtuoso,
    ],
    galleryPictures: [
      {
        id: 'gd6-g1',
        url: urls.virtuoso,
        caption: 'Virtuoso Magazine Cover Mockup — Bespoke menswear issue featuring 64+ men styles.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd6-1',
        name: 'Phase 01: Sartorial Typography & Perspective Mockup',
        description: 'Paired full-length menswear portraiture with classic editorial serif masthead placement so the subject interacts naturally with the title.',
        pictures: [
          {
            id: 'proc-gd6-1',
            url: urls.virtuoso,
            caption: 'Final Virtuoso Magazine cover presentation mockup.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Magazine Cover Layout', 'Editorial Masthead Typography', 'Print Mockup Presentation'],
    createdAt: 1712350000000,
  },

  // GD 7 — Pete's Bakery Peanut Roll Campaign
  {
    id: 'proj-gd-7',
    title: "Pete's Bakery — Peanut Roll Snack of the Week Campaign",
    category: 'Graphic Design',
    client: "Pete's Bakery, Odena Plaza",
    clientDescription: 'Artisan neighborhood bakery and confectionery located at Odena Plaza offering fresh daily pastries and snacks.',
    shortDescription: 'Warm, appetite-driven promotional poster for Pete’s Bakery featuring their signature Peanut Roll at 30% off.',
    threeWordDesc: 'Artisan Bakery Promotion',
    descriptors: 'Food Advertising, Poster, Typography',
    isRealLife: true,
    price: '₦150,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'July 2026',
    duration: '4 Days',
    featured: false,
    description: 'Promotional graphic design for Pete’s Bakery spotlighting the "Peanut Roll — Snack of the Week (30% off)". Crafted with warm roasted-peanut tones, stacked macro pastry photography, and playful hand-lettered copy ("In a nutshell, roll up stress and chill").',
    imageUrl: urls.peanut,
    images: [
      urls.peanut,
    ],
    galleryPictures: [
      {
        id: 'gd7-g1',
        url: urls.peanut,
        caption: "Pete's Bakery Peanut Roll — Snack of the Week 30% off promotional poster.",
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd7-1',
        name: 'Phase 01: Appetite Color Grading & Promotional Copy',
        description: 'Combined close-up swirled pastry imagery with warm golden-brown textures and custom outlined script typography.',
        pictures: [
          {
            id: 'proc-gd7-1',
            url: urls.peanut,
            caption: 'Final Peanut Roll promotional banner.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Promotional Landscape Poster', 'Social Media Ad Graphic', 'Copywriting & Visual Direction'],
    createdAt: 1712300000000,
  },

  // GD 8 — Pete's Restaurant "Savor the Flavour" Pro Tip Banner
  {
    id: 'proj-gd-8',
    title: "Pete's Kitchen — \"Savor the Flavour\" Culinary Ad",
    category: 'Graphic Design',
    client: "Pete's Kitchen & Bakery",
    clientDescription: 'Vibrant culinary kitchen and dining spot celebrating simple ingredients and extraordinary taste.',
    shortDescription: 'Dynamic levitating pasta advertisement ("Pro tip: Lick the plate. We won’t judge") crafted with rich royal blue contrast.',
    threeWordDesc: 'Dynamic Culinary Advertising',
    descriptors: 'Culinary Ad, Levitation, Hospitality',
    isRealLife: true,
    price: '₦160,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'July 2026',
    duration: '4 Days',
    featured: false,
    description: 'Eye-catching culinary advertisement for Pete’s ("Savor the Flavour! — Simple Ingredients, Extraordinary Taste"), contrasting warm orange flying pasta, cherry tomatoes, and seared protein against a deep royal blue studio backdrop.',
    imageUrl: urls.protip,
    images: [
      urls.protip,
    ],
    galleryPictures: [
      {
        id: 'gd8-g1',
        url: urls.protip,
        caption: 'Savor the Flavour at Pete’s — "Pro tip: Lick the plate. We won’t judge" promotional banner.',
        isAI: true,
      },
    ],
    processSteps: [
      {
        id: 'step-gd8-1',
        name: 'Phase 01: High-Contrast Food Staging & Ribbon Badge',
        description: 'Paired a dynamic mid-air culinary illustration with a burgundy corner ribbon and bold complementary orange branding.',
        pictures: [
          {
            id: 'proc-gd8-1',
            url: urls.protip,
            caption: 'Final "Pro Tip" culinary promotional banner.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Digital Billboard & Social Banner', 'Generative Food Illustration', 'Brand Typography'],
    createdAt: 1712250000000,
  },

  // GD 9 — From Our Kitchen to Your Heart
  {
    id: 'proj-gd-9',
    title: 'From Our Kitchen to Your Heart — Culinary Story Poster',
    category: 'Graphic Design',
    client: "Pete's Kitchen Collective",
    clientDescription: 'Artisan culinary collective celebrating authentic kitchen prep, fresh ingredients, and shared meals.',
    shortDescription: 'Overhead mise-en-place culinary poster celebrating kitchen craft ("The kitchen is where magic happens — and the mess").',
    threeWordDesc: 'Overhead Culinary Storytelling',
    descriptors: 'Culinary, Poster, Typography',
    isRealLife: true,
    price: '₦140,000',
    currency: 'NGN',
    year: '2026',
    monthYear: 'June 2026',
    duration: '3 Days',
    featured: false,
    description: 'Warm overhead flat-lay poster capturing a chef’s chopping board surrounded by fresh mirepoix, herbs, and spices, engraved with wood-burned script typography ("From our kitchen to your heart") and lower-third editorial messaging.',
    imageUrl: urls.to_hear,
    images: [
      urls.to_hear,
    ],
    galleryPictures: [
      {
        id: 'gd9-g1',
        url: urls.to_hear,
        caption: 'From Our Kitchen to Your Heart — Overhead culinary prep poster.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd9-1',
        name: 'Phase 01: Wood-Burned Script Integration & Editorial Lower-Third',
        description: 'Blended warm golden-glow script directly onto the timber cutting board grain with legible serif & display lower-third copy.',
        pictures: [
          {
            id: 'proc-gd9-1',
            url: urls.to_hear,
            caption: 'Final culinary storytelling poster.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Wall & Social Poster Design', 'Typographic Photo Compositing'],
    createdAt: 1712200000000,
  },

  // GD 10 — De Padua Learning Academy Medal Emblem
  {
    id: 'proj-gd-10',
    title: 'De Padua Learning Academy — 9th Inter-House Sports Emblem',
    category: 'Graphic Design',
    client: 'De Padua Learning Academy',
    clientDescription: 'Primary and secondary educational academy fostering academic excellence and athletic sportsmanship.',
    shortDescription: 'Commemorative circular medal and crest print artwork designed for the 9th Inter-House Sports Competition (2025).',
    threeWordDesc: 'Commemorative Sports Crest',
    descriptors: 'Emblem, Print Medal, Illustration',
    isRealLife: true,
    price: '₦120,000',
    currency: 'NGN',
    year: '2025',
    monthYear: 'November 2025',
    duration: '1 Week',
    featured: false,
    description: 'Custom circular medal print emblem created for De Padua Learning Academy’s 9th Inter-House Sports (2025). Features twin growth trees symbolizing mentorship and youth development, arched academy lettering, and tactile vintage speckle texture.',
    imageUrl: urls.medal,
    images: [
      urls.medal,
    ],
    galleryPictures: [
      {
        id: 'gd10-g1',
        url: urls.medal,
        caption: 'De Padua Learning Academy — 9th Inter-House Sports 2025 circular medal print artwork.',
        isAI: false,
      },
    ],
    processSteps: [
      {
        id: 'step-gd10-1',
        name: 'Phase 01: Circular Badge Vector & Print Preparation',
        description: 'Engineered a balanced circular crest for physical medal die-sublimation and event apparel printing.',
        pictures: [
          {
            id: 'proc-gd10-1',
            url: urls.medal,
            caption: 'Final medal print master artwork.',
            type: 'Final',
          },
        ],
      },
    ],
    deliverables: ['Circular Medal Print Artwork', 'Event Crest Illustration', 'Print-Ready PNG Master'],
    createdAt: 1712150000000,
  },
];

// Inject into src/data/initialProjects.ts
const initialProjectsPath = path.join(__dirname, '..', 'src', 'data', 'initialProjects.ts');
let content = fs.readFileSync(initialProjectsPath, 'utf8');

// Remove previous proj-gd-* if already injected
const marker = '  // GD 1 — PIC Organics Zobo Tea Packaging';
if (content.includes(marker)) {
  content = content.slice(0, content.indexOf(marker)) + '];\n';
}

const serializedProjects = newGraphicProjects
  .map((p, idx) => {
    const json = JSON.stringify(p, null, 2)
      .split('\n')
      .map((line, i) => (i === 0 ? `  ${line}` : `  ${line}`))
      .join('\n');
    return `  // GD ${idx + 1} — ${p.title}\n${json},`;
  })
  .join('\n');

const closingIndex = content.lastIndexOf('];');
if (closingIndex === -1) {
  throw new Error('Could not find closing ]; in initialProjects.ts');
}

const updatedContent =
  content.slice(0, closingIndex) +
  serializedProjects +
  '\n];\n';

fs.writeFileSync(initialProjectsPath, updatedContent, 'utf8');
console.log('✅ Injected 10 Graphic Design projects into src/data/initialProjects.ts');

import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join('scripts', 'cloudinary-cache.json');
const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));

const imagesList = [
  { file: 'blue/11-no-limits/01-desktop-hero.jpg', caption: 'No Limits Furniture — Raw Desktop Hero Viewport.', isThumbnail: true },
  { file: 'blue/11-no-limits/02-manifesto-living.jpg', caption: 'Slow Living Manifesto & Architectural Philosophy.' },
  { file: 'blue/11-no-limits/03-immersive-catalog-section.jpg', caption: 'Interactive 3D Catalog Experience Banner.' },
  { file: 'blue/11-no-limits/04-curated-collections.jpg', caption: 'Curated Architectural Furniture Collections.' },
  { file: 'blue/11-no-limits/05-product-showcase-homepage.jpg', caption: 'The Vanguard Lounge & Sculptural Stool Showcase.' },
  { file: 'blue/11-no-limits/06-product-sculpture-ottoman.jpg', caption: 'The Sculpture Ottoman — Product Detail Page.' },
  { file: 'blue/11-no-limits/07-product-3d-inline.jpg', caption: 'Real-time Interactive 3D Model Viewport (WebGL).' },
  { file: 'blue/11-no-limits/08-3d-scene-golden-front.jpg', caption: '3D Scene — Architectural Room (Golden Hour, Front).' },
  { file: 'blue/11-no-limits/09-3d-scene-golden-room.jpg', caption: '3D Scene — Full Architectural Room Perspective (Golden Hour).' },
  { file: 'blue/11-no-limits/10-3d-scene-golden-angle.jpg', caption: '3D Scene — Parquet & Cove Lighting Detail (Golden Hour, Angle).' },
  { file: 'blue/11-no-limits/11-3d-scene-golden-plan.jpg', caption: '3D Scene — Overhead Plan & Spatial Layout (Top-Down).' },
  { file: 'blue/11-no-limits/12-3d-scene-night-angle.jpg', caption: '3D Scene — Nocturne Atmosphere with Warm Ambient Cove Glow.' },
  { file: 'blue/11-no-limits/13-3d-scene-daylight-room.jpg', caption: '3D Scene — Crisp Daylight Natural Illumination & Soft Shadows.' },
  { file: 'blue/11-no-limits/14-curated-living-space.jpg', caption: 'The Living Space — Curated Spatial Editorial.' },
  { file: 'blue/11-no-limits/15-curated-dining-space.jpg', caption: 'The Dining Space — Architectural Gastronomy.' },
  { file: 'blue/11-no-limits/16-shop-catalog.jpg', caption: 'Curated Shop Catalog & Digital Filter Experience.' },
  { file: 'blue/11-no-limits/17-shop-grid.jpg', caption: 'Material-Filtered Artifact Collection Grid.' },
  { file: 'blue/11-no-limits/18-tablet-hero.jpg', caption: 'Responsive Tablet Viewport (iPad Pro).' },
  { file: 'blue/11-no-limits/19-mobile-hero.jpg', caption: 'Responsive Mobile Viewport (iPhone).' },
  { file: 'blue/11-no-limits/20-mobile-3d-product.jpg', caption: 'Mobile Interactive 3D Experience.' },
  { file: 'blue/11-no-limits/devices-comparison.jpg', caption: 'Multi-Device Responsive Ecosystem Showcase (Desktop, Tablet, Mobile).' },
  { file: 'blue/11-no-limits/desktop-mockup.jpg', caption: 'Studio Desktop Device Mockup.' },
  { file: 'blue/11-no-limits/phone-mockup.jpg', caption: 'Dual Mobile Device Studio Mockup.' },
];

const uploadedUrls = imagesList.map(item => cache[item.file]);
const thumbUrl = cache['blue/11-no-limits/01-desktop-hero.jpg'];

const galleryPictures = imagesList.map((item, idx) => ({
  id: `web11-g-${idx + 1}`,
  caption: item.caption,
  url: cache[item.file],
  isAI: false
}));

const projectSnippet = `  {
    id: 'proj-web-11',
    title: 'No Limits Furniture: Redefining Boundless Living',
    category: 'Web Design',
    client: 'No Limits Furniture',
    websiteUrl: 'https://no-limits-eight.vercel.app/',
    isRealLife: true,
    threeWordDesc: 'Architectural Luxury Living',
    price: '',
    duration: '',
    year: '',
    monthYear: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: '',
    featured: true,
    imageUrl: '${thumbUrl}',
    images: ${JSON.stringify(uploadedUrls, null, 10)},
    galleryPictures: ${JSON.stringify(galleryPictures, null, 10)},
    processSteps: [],
    deliverables: [],
  },
];`;

let fileContent = fs.readFileSync('src/data/initialProjects.ts', 'utf8');

// If proj-web-11 already exists, replace it, otherwise append before the closing ];
if (fileContent.includes("'proj-web-11'")) {
  console.log('proj-web-11 already in initialProjects.ts, updating...');
  const start = fileContent.indexOf("id: 'proj-web-11'");
  // find preceding {
  const openBrace = fileContent.lastIndexOf('{', start);
  const closingBrace = fileContent.indexOf('  },', start);
  fileContent = fileContent.slice(0, openBrace) + projectSnippet.slice(2, -3) + fileContent.slice(closingBrace + 4);
} else {
  console.log('Appending proj-web-11 to initialProjects.ts...');
  const lastIndex = fileContent.lastIndexOf('];');
  fileContent = fileContent.slice(0, lastIndex) + projectSnippet;
}

fs.writeFileSync('src/data/initialProjects.ts', fileContent, 'utf8');
console.log('Successfully updated src/data/initialProjects.ts!');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const uploaded = JSON.parse(fs.readFileSync(path.join(__dirname, 'uploaded-urls.json'), 'utf8'));
const firestoreDump = JSON.parse(fs.readFileSync(path.join(__dirname, 'firestore-dump.json'), 'utf8'));

const EMPTY_REMARK = {
  type: 'none',
  comment: '',
  clientAuthor: '',
  pictureUrl: '',
  voiceAudioUrl: '',
};

// Build the 10 Graphic Design projects with ONLY image URLs, title, category, and three-word remark
// (plus preserving the user's own manual edits on proj-gd-1 and proj-gd-2 for price/duration/imageScalePercent)
const gdProjects = [
  {
    id: 'proj-gd-1',
    title: 'PIC Organics — Zobo Tea with Beetroot Packaging',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Botanical Pouch Packaging',
    threeWordDesc: 'Botanical Pouch Packaging',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.zobo_hibiscus,
    images: [
      uploaded.zobo_hibiscus,
      uploaded.zobo_water,
      uploaded.zobo_fc,
      uploaded.zobo_bc,
    ],
    galleryPictures: [
      { id: 'gd1-g1', url: uploaded.zobo_hibiscus, caption: '', isAI: true },
      { id: 'gd1-g2', url: uploaded.zobo_water, caption: '', isAI: true },
      { id: 'gd1-g3', url: uploaded.zobo_fc, caption: '', isAI: false },
      { id: 'gd1-g4', url: uploaded.zobo_bc, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '4,000',
    currency: 'NGN',
    duration: '1 Weeks',
    imageScalePercent: 200,
    deliverables: [],
    featured: true,
    createdAt: 1712600000000,
  },
  {
    id: 'proj-gd-2',
    title: 'PIC Organics — Herbal Supplement Capsules Suite',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Herbal Supplement Packaging',
    threeWordDesc: 'Herbal Supplement Packaging',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.cap_lev4,
    images: [
      uploaded.cap_lev4,
      uploaded.cap_float,
      uploaded.cap_lev1,
      uploaded.cap_lev2,
      uploaded.cap_lev3,
      uploaded.cap_garlic,
      uploaded.cap_ginger,
      uploaded.cap_neemcal,
    ],
    galleryPictures: [
      { id: 'gd2-g1', url: uploaded.cap_lev4, caption: '', isAI: true },
      { id: 'gd2-g2', url: uploaded.cap_float, caption: '', isAI: true },
      { id: 'gd2-g3', url: uploaded.cap_lev1, caption: '', isAI: true },
      { id: 'gd2-g4', url: uploaded.cap_lev2, caption: '', isAI: true },
      { id: 'gd2-g5', url: uploaded.cap_lev3, caption: '', isAI: true },
      { id: 'gd2-g6', url: uploaded.cap_garlic, caption: '', isAI: false },
      { id: 'gd2-g7', url: uploaded.cap_ginger, caption: '', isAI: false },
      { id: 'gd2-g8', url: uploaded.cap_neemcal, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '9,000',
    currency: 'NGN',
    duration: '1 Weeks',
    imageScalePercent: 190,
    deliverables: [],
    featured: true,
    createdAt: 1712550000000,
  },
  {
    id: 'proj-gd-3',
    title: 'PIC Organics — Product Catalogue Tri-Fold Brochure',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Corporate Tri-Fold Brochure',
    threeWordDesc: 'Corporate Tri-Fold Brochure',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.tri_outside_light,
    images: [
      uploaded.tri_outside_light,
      uploaded.tri_inside_light,
      uploaded.tri_dark_inside,
      uploaded.tri_inside_dark,
    ],
    galleryPictures: [
      { id: 'gd3-g1', url: uploaded.tri_outside_light, caption: '', isAI: false },
      { id: 'gd3-g2', url: uploaded.tri_inside_light, caption: '', isAI: false },
      { id: 'gd3-g3', url: uploaded.tri_dark_inside, caption: '', isAI: false },
      { id: 'gd3-g4', url: uploaded.tri_inside_dark, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: false,
    createdAt: 1712500000000,
  },
  {
    id: 'proj-gd-4',
    title: 'Pamtronics — Brand & Promotional Campaign',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Commercial Promotional Campaign',
    threeWordDesc: 'Commercial Promotional Campaign',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.pamtronics1,
    images: [uploaded.pamtronics1, uploaded.pamtronics2],
    galleryPictures: [
      { id: 'gd4-g1', url: uploaded.pamtronics1, caption: '', isAI: false },
      { id: 'gd4-g2', url: uploaded.pamtronics2, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: false,
    createdAt: 1712450000000,
  },
  {
    id: 'proj-gd-5',
    title: 'To The End — Sports Magazine Cover',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Sports Editorial Cover',
    threeWordDesc: 'Sports Editorial Cover',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.tte_mockup,
    images: [uploaded.tte_mockup, uploaded.tte_cover],
    galleryPictures: [
      { id: 'gd5-g1', url: uploaded.tte_mockup, caption: '', isAI: false },
      { id: 'gd5-g2', url: uploaded.tte_cover, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: true,
    createdAt: 1712400000000,
  },
  {
    id: 'proj-gd-6',
    title: 'Virtuoso — Fashion Magazine Cover',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Vanguard Fashion Editorial',
    threeWordDesc: 'Vanguard Fashion Editorial',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.virtuoso,
    images: [uploaded.virtuoso],
    galleryPictures: [
      { id: 'gd6-g1', url: uploaded.virtuoso, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: true,
    createdAt: 1712350000000,
  },
  {
    id: 'proj-gd-7',
    title: "Pete's Kitchen — Roasted Peanut Butter Label",
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Artisan Food Packaging',
    threeWordDesc: 'Artisan Food Packaging',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.peanut,
    images: [uploaded.peanut],
    galleryPictures: [
      { id: 'gd7-g1', url: uploaded.peanut, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: false,
    createdAt: 1712300000000,
  },
  {
    id: 'proj-gd-8',
    title: 'ProTip — Premier League Matchday Graphic',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Matchday Sports Visual',
    threeWordDesc: 'Matchday Sports Visual',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.protip,
    images: [uploaded.protip],
    galleryPictures: [
      { id: 'gd8-g1', url: uploaded.protip, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: false,
    createdAt: 1712250000000,
  },
  {
    id: 'proj-gd-9',
    title: 'Something You Need To Hear — Podcast Cover Art',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Illustrated Podcast Identity',
    threeWordDesc: 'Illustrated Podcast Identity',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.to_hear,
    images: [uploaded.to_hear],
    galleryPictures: [
      { id: 'gd9-g1', url: uploaded.to_hear, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: false,
    createdAt: 1712200000000,
  },
  {
    id: 'proj-gd-10',
    title: 'De Padua Learning Academy — 9th Inter-House Sports Emblem',
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: 'Commemorative Sports Crest',
    threeWordDesc: 'Commemorative Sports Crest',
    category: 'Graphic Design',
    isRealLife: false,
    imageUrl: uploaded.medal,
    images: [uploaded.medal],
    galleryPictures: [
      { id: 'gd10-g1', url: uploaded.medal, caption: '', isAI: false },
    ],
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    currency: 'NGN',
    duration: '',
    imageScalePercent: 100,
    deliverables: [],
    featured: false,
    createdAt: 1712150000000,
  },
];

// Build the 8 Web Design projects from firestoreDump, preserving their Cloudinary images, websiteUrl, title, and three-word remark, while wiping all fabricated details
const webIds = [
  'proj-web-1',
  'proj-web-2',
  'proj-web-3',
  'proj-web-4',
  'proj-web-5',
  'proj-web-6',
  'proj-web-7',
  'proj-web-8',
];

const webProjects = webIds.map(id => {
  const existing = firestoreDump[id];
  if (!existing) {
    throw new Error(`Missing ${id} in firestore-dump.json`);
  }
  const threeWord = existing.threeWordDesc || '';
  const cleanedGallery = (existing.galleryPictures || []).map(pic => ({
    id: pic.id,
    url: pic.url,
    caption: '',
    isAI: false,
  }));

  return {
    id: existing.id,
    title: existing.title,
    client: '',
    clientDescription: '',
    shortDescription: '',
    description: '',
    descriptors: threeWord,
    threeWordDesc: threeWord,
    category: 'Web Design',
    isRealLife: false,
    websiteUrl: existing.websiteUrl || '',
    imageUrl: existing.imageUrl || (existing.images && existing.images[0]) || '',
    images: existing.images || [],
    galleryPictures: cleanedGallery,
    processSteps: [],
    clientRemark: { ...EMPTY_REMARK },
    year: '',
    monthYear: '',
    price: '',
    duration: '',
    imageScalePercent: existing.imageScalePercent || 100,
    deliverables: [],
    featured: Boolean(existing.featured),
    createdAt: existing.createdAt || 1711500000000,
  };
});

const allProjects = [...gdProjects, ...webProjects];

// 1. Write src/data/initialProjects.ts
const initialProjectsTsContent = `import { Project } from '../types/portfolio';

export const initialProjects: Project[] = ${JSON.stringify(allProjects, null, 2)};
`;

fs.writeFileSync(path.join(rootDir, 'src', 'data', 'initialProjects.ts'), initialProjectsTsContent, 'utf8');
console.log(`Wrote ${allProjects.length} clean unique projects to src/data/initialProjects.ts`);

// 2. Sync to Firestore and delete any legacy placeholder docs
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'firebase-applet-config.json'), 'utf8'));

const app = initializeApp(firebaseConfig);
const databaseId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;
const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

async function syncFirestore() {
  const validIds = new Set(allProjects.map(p => p.id));
  const snap = await getDocs(collection(db, 'projects'));
  const batch = writeBatch(db);

  // Delete any stray/legacy documents not in our 18 clean projects
  snap.forEach(d => {
    if (!validIds.has(d.id)) {
      console.log(`Deleting stray Firestore doc: ${d.id}`);
      batch.delete(d.ref);
    }
  });

  // Overwrite all 18 projects cleanly (without merge, so no stale fields survive)
  for (const proj of allProjects) {
    batch.set(doc(db, 'projects', proj.id), proj);
  }

  await batch.commit();
  console.log(`Successfully overwrote all ${allProjects.length} projects in Firestore.`);
  process.exit(0);
}

syncFirestore().catch(err => {
  console.error('Error syncing Firestore:', err);
  process.exit(1);
});

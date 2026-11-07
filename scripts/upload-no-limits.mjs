import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const CLOUD_NAME = 'dwo7oemds';
const UPLOAD_PRESET = 'VDVC_PORTFOLIO';
const CACHE_FILE = path.join('scripts', 'cloudinary-cache.json');

let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    cache = {};
  }
}

async function uploadFileToCloudinary(localPath, folder) {
  const normPath = localPath.replace(/\\/g, '/');
  if (cache[normPath]) {
    console.log(`  [Cache hit] ${normPath} -> ${cache[normPath]}`);
    return cache[normPath];
  }

  if (!fs.existsSync(localPath)) {
    throw new Error(`File does not exist: ${localPath}`);
  }

  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  const fileName = path.basename(localPath);

  const blob = new Blob([fileBuffer], { type: mime });
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  console.log(`  [Uploading] ${normPath} (${(fileBuffer.length / 1024).toFixed(0)} KB) to ${folder}...`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const url = data.secure_url;
  cache[normPath] = url;
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log(`  [Done] -> ${url}`);
  return url;
}

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
}, databaseId);

async function main() {
  console.log('=== UPLOADING NO LIMITS FURNITURE ASSETS TO CLOUDINARY ===\n');

  const folder = 'vdvc-portfolio/no-limits';
  const imagesToUpload = [
    { file: '01-desktop-hero.jpg', caption: 'No Limits Furniture — Raw Desktop Hero Viewport.', isThumbnail: true },
    { file: '02-manifesto-living.jpg', caption: 'Slow Living Manifesto & Architectural Philosophy.' },
    { file: '03-immersive-catalog-section.jpg', caption: 'Interactive 3D Catalog Experience Banner.' },
    { file: '04-curated-collections.jpg', caption: 'Curated Architectural Furniture Collections.' },
    { file: '05-product-showcase-homepage.jpg', caption: 'The Vanguard Lounge & Sculptural Stool Showcase.' },
    { file: '06-product-sculpture-ottoman.jpg', caption: 'The Sculpture Ottoman — Product Detail Page.' },
    { file: '07-product-3d-inline.jpg', caption: 'Real-time Interactive 3D Model Viewport (WebGL).' },
    { file: '08-3d-scene-golden-front.jpg', caption: '3D Scene — Architectural Room (Golden Hour, Front).' },
    { file: '09-3d-scene-golden-room.jpg', caption: '3D Scene — Full Architectural Room Perspective (Golden Hour).' },
    { file: '10-3d-scene-golden-angle.jpg', caption: '3D Scene — Parquet & Cove Lighting Detail (Golden Hour, Angle).' },
    { file: '11-3d-scene-golden-plan.jpg', caption: '3D Scene — Overhead Plan & Spatial Layout (Top-Down).' },
    { file: '12-3d-scene-night-angle.jpg', caption: '3D Scene — Nocturne Atmosphere with Warm Ambient Cove Glow.' },
    { file: '13-3d-scene-daylight-room.jpg', caption: '3D Scene — Crisp Daylight Natural Illumination & Soft Shadows.' },
    { file: '14-curated-living-space.jpg', caption: 'The Living Space — Curated Spatial Editorial.' },
    { file: '15-curated-dining-space.jpg', caption: 'The Dining Space — Architectural Gastronomy.' },
    { file: '16-shop-catalog.jpg', caption: 'Curated Shop Catalog & Digital Filter Experience.' },
    { file: '17-shop-grid.jpg', caption: 'Material-Filtered Artifact Collection Grid.' },
    { file: '18-tablet-hero.jpg', caption: 'Responsive Tablet Viewport (iPad Pro).' },
    { file: '19-mobile-hero.jpg', caption: 'Responsive Mobile Viewport (iPhone).' },
    { file: '20-mobile-3d-product.jpg', caption: 'Mobile Interactive 3D Experience.' },
    { file: 'devices-comparison.jpg', caption: 'Multi-Device Responsive Ecosystem Showcase (Desktop, Tablet, Mobile).' },
    { file: 'desktop-mockup.jpg', caption: 'Studio Desktop Device Mockup.' },
    { file: 'phone-mockup.jpg', caption: 'Dual Mobile Device Studio Mockup.' },
  ];

  const uploadedUrls = [];
  const galleryPictures = [];
  let thumbnailUrl = '';

  for (let i = 0; i < imagesToUpload.length; i++) {
    const item = imagesToUpload[i];
    const local = path.join('blue', '11-no-limits', item.file);
    const url = await uploadFileToCloudinary(local, folder);
    uploadedUrls.push(url);
    if (item.isThumbnail) {
      thumbnailUrl = url;
    }
    galleryPictures.push({
      id: `web11-g-${i + 1}`,
      caption: item.caption,
      url: url,
      isAI: false,
    });
  }

  console.log(`\nAll ${uploadedUrls.length} images uploaded to Cloudinary successfully!`);
  console.log(`Thumbnail URL: ${thumbnailUrl}`);

  const projectDoc = {
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
    imageUrl: thumbnailUrl,
    images: uploadedUrls,
    galleryPictures: galleryPictures,
    processSteps: [],
    deliverables: [],
  };

  console.log('\n--- Writing proj-web-11 directly to Firestore Database ---');
  const projectRef = doc(db, 'projects', 'proj-web-11');
  await setDoc(projectRef, projectDoc, { merge: true });
  console.log('Successfully saved proj-web-11 to Firestore!');

  // Verify read from Firestore
  const snap = await getDoc(projectRef);
  if (snap.exists()) {
    console.log('Verification: Read back from Firestore doc id:', snap.id);
    console.log('Doc title:', snap.data().title);
    console.log('Images count:', snap.data().images.length);
    console.log('Gallery pictures count:', snap.data().galleryPictures.length);
  } else {
    throw new Error('Document does not exist after writing!');
  }

  console.log('\n=== COMPLETE ===');
}

main().catch(console.error);

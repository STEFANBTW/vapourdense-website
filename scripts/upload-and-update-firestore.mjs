import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const CLOUD_NAME = 'dwo7oemds';
const UPLOAD_PRESET = 'VDVC_PORTFOLIO';

const sites = [
  {
    id: 'proj-web-1',
    slug: 'merona-media',
    name: 'Merona Media',
    dir: '01-merona-media',
    websiteUrl: 'https://merona-media.vercel.app/',
    rawExtras: ['mobile-2.jpeg'],
  },
  {
    id: 'proj-web-2',
    slug: 'stillwater-therapy',
    name: 'Stillwater Therapy Collective',
    dir: '02-stillwater-therapy',
    websiteUrl: 'https://stillwater-tau-six.vercel.app/',
    rawExtras: ['form-desktop.jpeg', 'form-mobile.jpeg'],
  },
  {
    id: 'proj-web-3',
    slug: 'oumera',
    name: 'OUMERA',
    dir: '03-oumera',
    websiteUrl: 'https://oumera-media.vercel.app/',
    rawExtras: ['form-desktop.jpeg', 'form-mobile.jpeg'],
  },
  {
    id: 'proj-web-4',
    slug: 'little-acorn',
    name: 'Little Acorn',
    dir: '04-little-acorn',
    websiteUrl: 'https://little-acorn.vercel.app/',
    rawExtras: ['form-desktop.jpeg', 'form-mobile.jpeg'],
  },
  {
    id: 'proj-web-5',
    slug: 'the-daily-knead',
    name: 'The Daily Knead',
    dir: '05-the-daily-knead',
    websiteUrl: 'https://the-daily-knead-2.vercel.app/',
    rawExtras: ['mobile-2.jpeg'],
  },
  {
    id: 'proj-web-6',
    slug: 'brasa',
    name: 'Brasa',
    dir: '06-brasa',
    websiteUrl: 'https://brasa-3.vercel.app/',
    rawExtras: ['mobile-2.jpeg'],
  },
  {
    id: 'proj-web-7',
    slug: 'kinetic-edge',
    name: 'Kinetic Edge',
    dir: '07-kinetic-edge',
    websiteUrl: 'https://kinetic-edge-mu.vercel.app/',
    rawExtras: ['form-desktop.jpeg', 'form-mobile.jpeg'],
  },
  {
    id: 'proj-web-8',
    slug: 'banjue-seat',
    name: 'Banjue Seat',
    dir: '08-banjue-seat',
    websiteUrl: 'https://banjue-seat-2-dun.vercel.app/',
    rawExtras: ['mobile-2.jpeg'],
  },
];

// Cache file to avoid re-uploading
const CACHE_FILE = 'scripts/cloudinary-cache.json';
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    cache = {};
  }
}

async function uploadFileToCloudinary(localPath, folder) {
  if (cache[localPath]) {
    console.log(`  [Cache hit] ${localPath} -> ${cache[localPath]}`);
    return cache[localPath];
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

  console.log(`  [Uploading] ${localPath} (${(fileBuffer.length / 1024).toFixed(0)} KB) to ${folder}...`);
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
  cache[localPath] = url;
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log(`  [Done] -> ${url}`);
  return url;
}

// Initialize Firestore
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
  console.log('=== STARTING CLOUDINARY UPLOAD & FIRESTORE DATABASE UPDATE ===\n');

  const projectUpdates = [];

  for (const s of sites) {
    console.log(`\n--- Processing ${s.name} (${s.id}) ---`);
    const folder = `vdvc-portfolio/${s.slug}`;

    // 1. Raw Desktop (The requested thumbnail!)
    const rawDesktopPath = path.join('blue', s.dir, 'desktop.jpeg');
    const rawDesktopUrl = await uploadFileToCloudinary(rawDesktopPath, folder);

    // 2. Mockups
    const cmpMockupPath = path.join('public', 'assets', 'projects', s.slug, 'devices-comparison.jpg');
    const cmpMockupUrl = await uploadFileToCloudinary(cmpMockupPath, folder);

    const deskMockupPath = path.join('public', 'assets', 'projects', s.slug, 'desktop-mockup.jpg');
    const deskMockupUrl = await uploadFileToCloudinary(deskMockupPath, folder);

    const phoneMockupPath = path.join('public', 'assets', 'projects', s.slug, 'phone-mockup.jpg');
    const phoneMockupUrl = await uploadFileToCloudinary(phoneMockupPath, folder);

    // 3. Raw Tablet & Mobile
    const rawTabletPath = path.join('blue', s.dir, 'tablet.jpeg');
    const rawTabletUrl = await uploadFileToCloudinary(rawTabletPath, folder);

    const rawMobilePath = path.join('blue', s.dir, 'mobile.jpeg');
    const rawMobileUrl = await uploadFileToCloudinary(rawMobilePath, folder);

    // 4. Raw Extras (forms, extra mobile views)
    const extraUrls = [];
    for (const extraName of (s.rawExtras || [])) {
      const extraPath = path.join('blue', s.dir, extraName);
      if (fs.existsSync(extraPath)) {
        const u = await uploadFileToCloudinary(extraPath, folder);
        extraUrls.push({ name: extraName, url: u });
      }
    }

    // Build the gallery pictures array
    // Thumbnail is strictly the Raw Desktop Screenshot as requested!
    const key = s.id.replace('proj-web-', 'web');
    const galleryPictures = [
      {
        id: `${key}-g-raw-desk`,
        url: rawDesktopUrl,
        caption: `${s.name} — Raw Live Desktop Screenshot.`,
        isAI: false,
      },
      {
        id: `${key}-g-mock-cmp`,
        url: cmpMockupUrl,
        caption: `${s.name} — Responsive Devices Comparison Showcase.`,
        isAI: false,
      },
      {
        id: `${key}-g-mock-desk`,
        url: deskMockupUrl,
        caption: `${s.name} — Desktop Studio Mockup.`,
        isAI: false,
      },
      {
        id: `${key}-g-mock-ph`,
        url: phoneMockupUrl,
        caption: `${s.name} — Mobile Studio Mockup.`,
        isAI: false,
      },
      {
        id: `${key}-g-raw-tab`,
        url: rawTabletUrl,
        caption: `${s.name} — Raw Live Tablet View.`,
        isAI: false,
      },
      {
        id: `${key}-g-raw-mob`,
        url: rawMobileUrl,
        caption: `${s.name} — Raw Live Mobile View.`,
        isAI: false,
      },
    ];

    extraUrls.forEach((ex, idx) => {
      let label = 'Detail';
      if (ex.name.includes('form')) label = 'Form & Booking Section';
      else if (ex.name.includes('mobile-2')) label = 'Scrolled Mobile Experience';
      else if (ex.name.includes('menu')) label = 'Menu Section';
      galleryPictures.push({
        id: `${key}-g-extra-${idx + 1}`,
        url: ex.url,
        caption: `${s.name} — Raw Live ${label}.`,
        isAI: false,
      });
    });

    const images = galleryPictures.map(g => g.url);
    const imageUrl = rawDesktopUrl; // Raw shot as thumbnail!

    projectUpdates.push({
      id: s.id,
      slug: s.slug,
      name: s.name,
      websiteUrl: s.websiteUrl,
      imageUrl,
      images,
      galleryPictures,
    });
  }

  // -------------------------------------------------------------
  // Step 2: Push updates directly to Firestore Database
  // -------------------------------------------------------------
  console.log('\n=== PUSHING UPDATES DIRECTLY TO FIRESTORE DATABASE ===');

  for (const upd of projectUpdates) {
    const docRef = doc(db, 'projects', upd.id);
    const existingSnap = await getDoc(docRef);
    let payload = {};

    if (existingSnap.exists()) {
      const current = existingSnap.data();
      payload = {
        ...current,
        imageUrl: upd.imageUrl,
        images: upd.images,
        galleryPictures: upd.galleryPictures,
        websiteUrl: upd.websiteUrl,
        updatedAt: Date.now(),
      };
    } else {
      payload = {
        id: upd.id,
        imageUrl: upd.imageUrl,
        images: upd.images,
        galleryPictures: upd.galleryPictures,
        websiteUrl: upd.websiteUrl,
        updatedAt: Date.now(),
      };
    }

    await setDoc(docRef, payload, { merge: true });
    console.log(`✓ Firestore updated for [${upd.id}] ${upd.name}:`);
    console.log(`   - Thumbnail (imageUrl): ${upd.imageUrl}`);
    console.log(`   - Total images: ${upd.images.length}`);
  }

  console.log('\n=== ALL FIRESTORE DOCUMENTS SUCCESSFULLY UPDATED! ===');

  // -------------------------------------------------------------
  // Step 3: Update src/data/initialProjects.ts so source code stays synchronized
  // -------------------------------------------------------------
  console.log('\n=== SYNCHRONIZING src/data/initialProjects.ts ===');
  let initialSrc = fs.readFileSync('src/data/initialProjects.ts', 'utf8');

  for (const upd of projectUpdates) {
    const start = initialSrc.indexOf(`id: '${upd.id}'`);
    if (start < 0) continue;

    const imgIdx = initialSrc.indexOf('    imageUrl:', start);
    const procIdx = initialSrc.indexOf('    processSteps: [', start);
    if (imgIdx < 0 || procIdx < 0) continue;

    const block = `    imageUrl: '${upd.imageUrl}',
    images: ${JSON.stringify(upd.images, null, 6).replace(/\n/g, '\n    ')},
    galleryPictures: ${JSON.stringify(upd.galleryPictures, null, 6).replace(/\n/g, '\n    ')},
`;

    initialSrc = initialSrc.slice(0, imgIdx) + block + initialSrc.slice(procIdx);
    console.log(`✓ Synchronized initialProjects.ts for ${upd.id}`);
  }

  fs.writeFileSync('src/data/initialProjects.ts', initialSrc, 'utf8');
  console.log('✓ Successfully wrote src/data/initialProjects.ts');

  process.exit(0);
}

main().catch(err => {
  console.error('\nFATAL ERROR:', err);
  process.exit(1);
});

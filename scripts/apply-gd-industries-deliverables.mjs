import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export const GD_PROJECT_METADATA = {
  'proj-gd-1': {
    industries: ['Agro-Processing & Packaging', 'Consumer Packaged Goods'],
    deliverables: ['Packaging', 'Pouch Packaging'],
  },
  'proj-gd-2': {
    industries: ['Pharmacies & Chemists', 'Consumer Packaged Goods'],
    deliverables: ['Packaging', 'Bottle Label'],
  },
  'proj-gd-3': {
    industries: ['Pharmacies & Chemists', 'Agro-Processing & Packaging'],
    deliverables: ['Brochure', 'Product Catalogue'],
  },
  'proj-gd-4': {
    industries: ['Solar & Renewable Energy', 'Electrical Manufacturing'],
    deliverables: ['Flyer', 'Banner'],
  },
  'proj-gd-5': {
    industries: ['Fitness & Gyms', 'Film & Broadcasting'],
    deliverables: ['Magazine Cover', 'Poster'],
  },
  'proj-gd-6': {
    industries: ['Fashion & Apparel', 'Garments & Textiles'],
    deliverables: ['Magazine Cover', 'Editorial Design'],
  },
  'proj-gd-7': {
    industries: ['Bakeries & Pastries', 'Cafes & Juice Bars'],
    deliverables: ['Flyer', 'Banner'],
  },
  'proj-gd-8': {
    industries: ['Catering & Cloud Kitchens', 'Cafes & Juice Bars'],
    deliverables: ['Banner', 'Social Media Graphics'],
  },
  'proj-gd-9': {
    industries: ['Catering & Cloud Kitchens', 'Cafes & Juice Bars'],
    deliverables: ['Banner', 'Poster'],
  },
  'proj-gd-10': {
    industries: ['Primary & Secondary Schools', 'Fitness & Gyms'],
    deliverables: ['Logo', 'Emblem'],
  },
};

// 1. Update src/data/initialProjects.ts
const initialProjectsPath = path.join(rootDir, 'src', 'data', 'initialProjects.ts');
let initialContent = fs.readFileSync(initialProjectsPath, 'utf8');

for (const [id, meta] of Object.entries(GD_PROJECT_METADATA)) {
  const formattedInds = JSON.stringify(meta.industries);
  const formattedDelivs = JSON.stringify(meta.deliverables);
  console.log(`Updating ${id} in initialProjects.ts -> industries: ${formattedInds}, deliverables: ${formattedDelivs}`);

  const idPatterns = [`"id": "${id}"`, `id: '${id}'`, `id: "${id}"`];
  let idIndex = -1;
  for (const pat of idPatterns) {
    idIndex = initialContent.indexOf(pat);
    if (idIndex !== -1) break;
  }

  if (idIndex === -1) {
    console.warn(`Could not find ${id} in initialProjects.ts`);
    continue;
  }

  const nextProj = initialContent.indexOf('},\n  {', idIndex);
  const endProj = nextProj !== -1 ? nextProj : initialContent.indexOf('},\n];', idIndex);
  let projBlock = initialContent.slice(idIndex, endProj);

  // Update or insert deliverables
  if (projBlock.includes('deliverables:')) {
    projBlock = projBlock.replace(/deliverables:\s*\[[^\]]*\],?/, `deliverables: ${formattedDelivs},`);
  } else if (projBlock.includes('"deliverables":')) {
    projBlock = projBlock.replace(/"deliverables":\s*\[[^\]]*\],?/, `"deliverables": ${formattedDelivs},`);
  } else {
    projBlock = projBlock.replace(/(category:[^\n]+)/, `$1\n    deliverables: ${formattedDelivs},`);
  }

  // Update or insert industries
  if (projBlock.includes('industries:')) {
    projBlock = projBlock.replace(/industries:\s*\[[^\]]*\],?/, `industries: ${formattedInds},`);
  } else if (projBlock.includes('"industries":')) {
    projBlock = projBlock.replace(/"industries":\s*\[[^\]]*\],?/, `"industries": ${formattedInds},`);
  } else {
    if (projBlock.includes('deliverables:')) {
      projBlock = projBlock.replace(/(deliverables:[^\n]+)/, `$1\n    industries: ${formattedInds},`);
    } else if (projBlock.includes('"deliverables":')) {
      projBlock = projBlock.replace(/("deliverables":[^\n]+)/, `$1\n    "industries": ${formattedInds},`);
    }
  }

  // Update or insert industry (alias)
  if (projBlock.includes('industry:')) {
    projBlock = projBlock.replace(/industry:\s*\[[^\]]*\],?/, `industry: ${formattedInds},`);
  } else if (projBlock.includes('"industry":')) {
    projBlock = projBlock.replace(/"industry":\s*\[[^\]]*\],?/, `"industry": ${formattedInds},`);
  } else {
    if (projBlock.includes('industries:')) {
      projBlock = projBlock.replace(/(industries:[^\n]+)/, `$1\n    industry: ${formattedInds},`);
    } else if (projBlock.includes('"industries":')) {
      projBlock = projBlock.replace(/("industries":[^\n]+)/, `$1\n    "industry": ${formattedInds},`);
    }
  }

  initialContent = initialContent.slice(0, idIndex) + projBlock + initialContent.slice(endProj);
}

fs.writeFileSync(initialProjectsPath, initialContent, 'utf8');
console.log('Successfully updated src/data/initialProjects.ts!\n');

// 2. Update Firestore with merge: true to preserve any user edits
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'firebase-applet-config.json'), 'utf8'));
const app = initializeApp(firebaseConfig);
const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
}, databaseId);

async function updateFirestore() {
  console.log('=== UPDATING FIRESTORE GRAPHIC DESIGN PROJECTS ===\n');

  for (const [id, meta] of Object.entries(GD_PROJECT_METADATA)) {
    const docRef = doc(db, 'projects', id);
    const existingSnap = await getDoc(docRef);

    if (!existingSnap.exists()) {
      console.warn(`Doc ${id} does not exist in Firestore!`);
      continue;
    }

    console.log(`Writing industries & deliverables to Firestore doc ${id}:`, meta);
    await setDoc(docRef, {
      industries: meta.industries,
      industry: meta.industries,
      deliverables: meta.deliverables,
    }, { merge: true });

    // Verify
    const updatedSnap = await getDoc(docRef);
    const data = updatedSnap.data();
    console.log(`  [Verified] ${id} industries:`, JSON.stringify(data.industries), 'deliverables:', JSON.stringify(data.deliverables));
  }

  console.log('\n=== ALL FIRESTORE GD DOCUMENTS SUCCESSFULLY UPDATED & VERIFIED ===');
  process.exit(0);
}

updateFirestore().catch((err) => {
  console.error('Error updating Firestore:', err);
  process.exit(1);
});

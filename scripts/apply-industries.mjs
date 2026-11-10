import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const WEBSITE_INDUSTRIES = {
  'proj-web-1': ['Graphic Design Studios', 'Digital Marketing & SEO'],
  'proj-web-2': ['Mental Health Counseling', 'Hospitals & Clinics'],
  'proj-web-3': ['Content Creators & Influencers', 'Photography & Videography'],
  'proj-web-4': ['Primary & Secondary Schools', 'Tutoring & Coaching'],
  'proj-web-5': ['Bakeries & Pastries', 'Cafes & Juice Bars'],
  'proj-web-6': ['Bars & Nightclubs', 'Catering & Cloud Kitchens'],
  'proj-web-7': ['Fitness & Gyms', 'Hospitals & Clinics'],
  'proj-web-8': ['Auto Spare Parts', 'Auto Body & Detailing'],
  'proj-web-9': ['Event Venues', 'Event Planning'],
  'proj-web-10': ['Bars & Nightclubs', 'General Merchandise'],
  'proj-web-11': ['Home & Furniture', 'Architecture & Interior Design'],
};

// 1. Update src/data/initialProjects.ts
let initialContent = fs.readFileSync('src/data/initialProjects.ts', 'utf8');

for (const [id, inds] of Object.entries(WEBSITE_INDUSTRIES)) {
  const formattedInds = JSON.stringify(inds);
  console.log(`Updating ${id} in initialProjects.ts -> ${formattedInds}`);

  // Find id occurrence
  const idPatterns = [
    `"id": "${id}"`,
    `id: '${id}'`,
    `id: "${id}"`
  ];
  let idIndex = -1;
  for (const pat of idPatterns) {
    idIndex = initialContent.indexOf(pat);
    if (idIndex !== -1) break;
  }

  if (idIndex === -1) {
    console.warn(`Could not find ${id} in initialProjects.ts`);
    continue;
  }

  // Find the closing of this project object (next `},\n  {` or `},\n];`)
  const nextProj = initialContent.indexOf('},\n  {', idIndex);
  const endProj = nextProj !== -1 ? nextProj : initialContent.indexOf('},\n];', idIndex);
  const projBlock = initialContent.slice(idIndex, endProj);

  let newProjBlock = projBlock;
  // If industries field exists, replace it; else insert before deliverables or galleryPictures
  if (newProjBlock.includes('industries:')) {
    newProjBlock = newProjBlock.replace(/industries:\s*\[[^\]]*\],?/, `industries: ${formattedInds},`);
  } else if (newProjBlock.includes('"industries":')) {
    newProjBlock = newProjBlock.replace(/"industries":\s*\[[^\]]*\],?/, `"industries": ${formattedInds},`);
  } else {
    // Insert after deliverables or websiteUrl
    if (newProjBlock.includes('deliverables:')) {
      newProjBlock = newProjBlock.replace(/deliverables:\s*\[[^\]]*\],?/, match => `${match}\n    industries: ${formattedInds},`);
    } else if (newProjBlock.includes('"deliverables":')) {
      newProjBlock = newProjBlock.replace(/"deliverables":\s*\[[^\]]*\],?/, match => `${match}\n    "industries": ${formattedInds},`);
    } else if (newProjBlock.includes('websiteUrl:')) {
      newProjBlock = newProjBlock.replace(/(websiteUrl:[^\n]+)/, `$1\n    industries: ${formattedInds},`);
    } else if (newProjBlock.includes('"websiteUrl":')) {
      newProjBlock = newProjBlock.replace(/("websiteUrl":[^\n]+)/, `$1\n    "industries": ${formattedInds},`);
    }
  }

  // Also ensure industry field is present
  if (newProjBlock.includes('industry:')) {
    newProjBlock = newProjBlock.replace(/industry:\s*\[[^\]]*\],?/, `industry: ${formattedInds},`);
  } else if (newProjBlock.includes('"industry":')) {
    newProjBlock = newProjBlock.replace(/"industry":\s*\[[^\]]*\],?/, `"industry": ${formattedInds},`);
  } else {
    if (newProjBlock.includes('industries:')) {
      newProjBlock = newProjBlock.replace(/(industries:[^\n]+)/, `$1\n    industry: ${formattedInds},`);
    } else if (newProjBlock.includes('"industries":')) {
      newProjBlock = newProjBlock.replace(/("industries":[^\n]+)/, `$1\n    "industry": ${formattedInds},`);
    }
  }

  initialContent = initialContent.slice(0, idIndex) + newProjBlock + initialContent.slice(endProj);
}

fs.writeFileSync('src/data/initialProjects.ts', initialContent, 'utf8');
console.log('Successfully updated src/data/initialProjects.ts!\n');

// 2. Update Firestore Database directly
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
}, databaseId);

async function updateFirestore() {
  console.log('=== UPDATING FIRESTORE DATABASE DIRECTLY ===\n');

  for (const [id, inds] of Object.entries(WEBSITE_INDUSTRIES)) {
    const docRef = doc(db, 'projects', id);
    const existingSnap = await getDoc(docRef);

    if (!existingSnap.exists()) {
      console.warn(`Doc ${id} does not exist in Firestore!`);
      continue;
    }

    console.log(`Writing industries to Firestore doc ${id}: ${JSON.stringify(inds)}`);
    await setDoc(docRef, {
      industries: inds,
      industry: inds,
    }, { merge: true });

    // Verify
    const updatedSnap = await getDoc(docRef);
    const data = updatedSnap.data();
    console.log(`  [Verified] ${id} industries:`, JSON.stringify(data.industries), 'industry:', JSON.stringify(data.industry));
  }

  console.log('\n=== ALL FIRESTORE DOCUMENTS SUCCESSFULLY UPDATED & VERIFIED ===');
  process.exit(0);
}

updateFirestore().catch((err) => {
  console.error('Error updating Firestore:', err);
  process.exit(1);
});

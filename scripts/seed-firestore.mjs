import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import { newGraphicProjects } from './inject-projects.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Update src/hooks/usePortfolioStorage.ts
const hookPath = path.join(__dirname, '..', 'src', 'hooks', 'usePortfolioStorage.ts');
let hookSrc = fs.readFileSync(hookPath, 'utf8');

hookSrc = hookSrc
  .replace(/const STORAGE_KEY = 'vdvc_portfolio_projects_v\d+';/, "const STORAGE_KEY = 'vdvc_portfolio_projects_v11';")
  .replace(/const SEEDED_WEB_KEY = '[^']+';/, "const SEEDED_WEB_KEY = 'vdvc_seeded_projects_v3';")
  .replace(
    "p => p.id.startsWith('proj-web-') && !existingIds.has(p.id)",
    "p => (p.id.startsWith('proj-web-') || p.id.startsWith('proj-gd-')) && !existingIds.has(p.id)"
  );

fs.writeFileSync(hookPath, hookSrc, 'utf8');
console.log('✅ Updated src/hooks/usePortfolioStorage.ts');

// 2. Seed directly into Firestore
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'firebase-applet-config.json'), 'utf8')
);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seedFirestore() {
  console.log('🚀 Writing 10 Graphic Design projects to Firestore…');
  const batch = writeBatch(db);
  for (const proj of newGraphicProjects) {
    batch.set(doc(db, 'projects', proj.id), proj);
  }
  await batch.commit();
  console.log('✅ Successfully seeded all 10 Graphic Design projects into Firestore!');
  process.exit(0);
}

seedFirestore().catch(err => {
  console.error('⚠️ Firestore direct seed warning (will auto-seed on browser load):', err.message);
  process.exit(0);
});

/**
 * upload-and-seed-projects.mjs
 *
 * Uploads all images from the DIve Studio portfolio folder to Cloudinary,
 * then appends the new Project entries to src/data/initialProjects.ts.
 *
 * Usage:  node scripts/upload-and-seed-projects.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Cloudinary config (matches .env.local) ───────────────────────────────
const CLOUD_NAME   = 'dwo7oemds';
const UPLOAD_PRESET = 'VDVC_PORTFOLIO';
const FOLDER       = 'VDVC_Portfolio/graphic-design';

// ─── Source images ──────────────────────────────────────────────────────────
const BASE = 'C:\\Users\\saade\\Documents\\SoriKyo\\DIve Studio\\Portfolio\\for_the_website';

const FILES = {
  // ── PIC Zobo Tea ──────────────────────────────────────────────────────────
  zobo_bc:     path.join(BASE, 'PIC Zobo Te', 'Zobo Tea BC V2.png'),
  zobo_fc:     path.join(BASE, 'PIC Zobo Te', 'ZoboTea FC V22.png'),
  zobo_water:  path.join(BASE, 'PIC Zobo Te', 'ZOBO_tea_packaging_on_water_1de55077.jpg'),
  zobo_hibiscus: path.join(BASE, 'PIC Zobo Te', 'ZOBO_tea_packaging_with_hibiscus_a4a5eae4.jpg'),

  // ── PIC Capsules ──────────────────────────────────────────────────────────
  cap_garlic:   path.join(BASE, 'PIC Capsules', 'Garlic Capsule - Final Version.png'),
  cap_ginger:   path.join(BASE, 'PIC Capsules', 'Ginger Capsule - Finsl Version.png'),
  cap_neemcal:  path.join(BASE, 'PIC Capsules', 'PIC NeemCal Capsule-PRODUCTION-v2.jpg'),
  cap_float:    path.join(BASE, 'PIC Capsules', 'Supplement_bottle_floating_on_fa._a93c1e4a.jpg'),
  cap_lev1:     path.join(BASE, 'PIC Capsules', 'Supplement_bottle_levitating_abo._583cc81e.jpg'),
  cap_lev2:     path.join(BASE, 'PIC Capsules', 'Supplement_bottle_levitating_abo._86c7b59f.jpg'),
  cap_lev3:     path.join(BASE, 'PIC Capsules', 'Supplement_bottle_levitating_on_._67341c9a.jpg'),
  cap_lev4:     path.join(BASE, 'PIC Capsules', 'Supplement_bottle_levitating_wit._89c7b951.jpg'),

  // ── PIC Trifold ───────────────────────────────────────────────────────────
  tri_dark_inside:   path.join(BASE, 'PIC Trifold', 'Dark-mockup-INSIDE.png'),
  tri_inside_dark:   path.join(BASE, 'PIC Trifold', 'PIC Ecumenical Trifold Brochure - Inside - Dark.png'),
  tri_inside_light:  path.join(BASE, 'PIC Trifold', 'PIC Ecumenical Trifold Brochure - Inside - Light.png'),
  tri_outside_light: path.join(BASE, 'PIC Trifold', 'PIC Ecumenical Trifold Brochure - Outside - Light.png'),

  // ── Pamtronics ────────────────────────────────────────────────────────────
  pamtronics1: path.join(BASE, 'Pamtronics Independence Day Flyer', 'Pamtronics Independence Flyer - v5.jpg'),
  pamtronics2: path.join(BASE, 'Pamtronics Independence Day Flyer', 'Pamtronics Independence Flyer 2 - v4.jpg'),

  // ── To The End Magazine ───────────────────────────────────────────────────
  tte_cover:   path.join(BASE, 'To The End Magazine Cover.jpg'),
  tte_mockup:  path.join(BASE, 'To-The_End_Mockup_4.jpg'),

  // ── Virtuoso Magazine ─────────────────────────────────────────────────────
  virtuoso:    path.join(BASE, 'Virtuoso Magazine Cover MockUp 2.jpg'),

  // ── Standalone pieces ─────────────────────────────────────────────────────
  medal:       path.join(BASE, 'Medal Print paint-Recovered.png'),
  peanut:      path.join(BASE, 'Peanut Roll.jpg'),
  protip:      path.join(BASE, 'PRO TIP.jpg'),
  to_hear:     path.join(BASE, 'To Hear 2t.jpg'),
};

// ─── Upload a single file to Cloudinary ────────────────────────────────────
async function uploadFile(localPath) {
  const fileName = path.basename(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const mimeMap = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png',  '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  const mime = mimeMap[ext] || 'application/octet-stream';

  const buffer = fs.readFileSync(localPath);
  const blob = new globalThis.Blob([buffer], { type: mime });

  const form = new globalThis.FormData();
  form.set('file', blob, fileName);
  form.set('upload_preset', UPLOAD_PRESET);
  form.set('folder', FOLDER);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upload failed for "${fileName}": ${res.status} ${body}`);
  }
  const data = await res.json();
  return data.secure_url;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting Cloudinary uploads…\n');

  const urls = {};
  const keys = Object.keys(FILES);

  for (const key of keys) {
    const localPath = FILES[key];
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️  File not found, skipping: ${localPath}`);
      urls[key] = null;
      continue;
    }
    process.stdout.write(`  ⬆  Uploading ${path.basename(localPath)}…`);
    try {
      const secureUrl = await uploadFile(localPath);
      urls[key] = secureUrl;
      console.log(` ✅`);
    } catch (err) {
      console.log(` ❌  ${err.message}`);
      urls[key] = null;
    }
  }

  console.log('\n📋 All Cloudinary URLs:');
  for (const [key, url] of Object.entries(urls)) {
    console.log(`  ${key}: ${url ?? '(failed)'}`);
  }

  // ─── Write URL map to a JSON file so we can use it in the next step ───────
  const outPath = path.join(__dirname, 'uploaded-urls.json');
  fs.writeFileSync(outPath, JSON.stringify(urls, null, 2));
  console.log(`\n✅ URLs saved to ${outPath}`);
  console.log('\n🎉 Upload complete! Now run: node scripts/inject-projects.mjs');
}

main().catch(err => { console.error(err); process.exit(1); });

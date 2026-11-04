import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLOUD_NAME    = 'dwo7oemds';
const UPLOAD_PRESET = 'VDVC_PORTFOLIO';
const FOLDER        = 'VDVC_Portfolio/graphic-design';

const BASE = 'C:\\Users\\saade\\Documents\\SoriKyo\\DIve Studio\\Portfolio\\for_the_website\\PIC Capsules';

const allFiles = fs.readdirSync(BASE);

function findFile(substr) {
  const match = allFiles.find(f => f.includes(substr));
  return match ? path.join(BASE, match) : null;
}

const FILES = {
  cap_float: findFile('a93c1e4a'),
  cap_lev1:  findFile('583cc81e'),
  cap_lev2:  findFile('86c7b59f'),
  cap_lev3:  findFile('67341c9a'),
  cap_lev4:  findFile('89c7b951'),
};

async function uploadFile(localPath) {
  const fileName = path.basename(localPath);
  const buffer = fs.readFileSync(localPath);
  const blob = new globalThis.Blob([buffer], { type: 'image/jpeg' });

  const form = new globalThis.FormData();
  form.set('file', blob, 'supplement_bottle.jpg');
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

async function main() {
  console.log('🚀 Uploading PIC Capsules AI mockups…\n');

  const urlsPath = path.join(__dirname, 'uploaded-urls.json');
  const urls = fs.existsSync(urlsPath) ? JSON.parse(fs.readFileSync(urlsPath, 'utf8')) : {};

  for (const [key, localPath] of Object.entries(FILES)) {
    if (!localPath || !fs.existsSync(localPath)) {
      console.warn(`  ⚠️  File not found for key: ${key}`);
      urls[key] = null;
      continue;
    }
    process.stdout.write(`  ⬆  Uploading ${path.basename(localPath)}…`);
    try {
      const secureUrl = await uploadFile(localPath);
      urls[key] = secureUrl;
      console.log(' ✅', secureUrl);
    } catch (err) {
      console.log(` ❌  ${err.message}`);
      urls[key] = null;
    }
  }

  fs.writeFileSync(urlsPath, JSON.stringify(urls, null, 2));
  console.log(`\n✅ Merged URLs saved to ${urlsPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });

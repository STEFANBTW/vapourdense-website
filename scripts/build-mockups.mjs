// Builds desktop / phone / comparison device mockups from the real site screenshots.
// Output: public/assets/projects/<slug>/{desktop-mockup,phone-mockup,devices-comparison}.jpg  (2400x1500)
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const root = process.cwd();
const blue = (d, f) => pathToFileURL(path.join(root, 'blue', d, f)).href;

const sites = [
  { slug: 'merona-media', dir: '01-merona-media', phone2: 'mobile-2.jpeg', bg: ['#2a3350', '#0b0f1e'], dark: true },
  { slug: 'stillwater-therapy', dir: '02-stillwater-therapy', phone2: 'form-mobile.jpeg', bg: ['#f1ebf3', '#c9d6cd'], dark: false },
  { slug: 'oumera', dir: '03-oumera', phone2: 'form-mobile.jpeg', bg: ['#3a3532', '#0a0a0b'], dark: true },
  { slug: 'little-acorn', dir: '04-little-acorn', phone2: 'form-mobile.jpeg', bg: ['#fff6d6', '#bcd9f2'], dark: false },
  { slug: 'the-daily-knead', dir: '05-the-daily-knead', phone2: 'mobile-2.jpeg', bg: ['#f3ede4', '#d9c9b6'], dark: false },
  { slug: 'brasa', dir: '06-brasa', phone2: 'mobile-2.jpeg', bg: ['#4a2417', '#0c0907'], dark: true },
  { slug: 'kinetic-edge', dir: '07-kinetic-edge', phone2: 'form-mobile.jpeg', bg: ['#e6f6fa', '#b9d3dc'], dark: false },
  { slug: 'banjue-seat', dir: '08-banjue-seat', phone2: 'mobile-2.jpeg', bg: ['#6a3a26', '#1c1210'], dark: true },
];

const W = 2400;
const H = 1500;

const css = (s) => `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{position:relative;background:radial-gradient(ellipse at 50% 38%, ${s.bg[0]} 0%, ${s.bg[1]} 100%)}
.floor{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(to bottom,transparent,${s.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.08)'})}
.dev{position:absolute;background:#0d0d0f;box-shadow:0 0 0 2px #3a3a3f inset,0 60px 90px -20px rgba(0,0,0,.55),0 20px 40px -10px rgba(0,0,0,.35)}
.dev img{position:absolute;display:block;object-fit:cover;object-position:top center}
.mon{border-radius:26px}
.mon img{border-radius:6px}
.stand-neck{position:absolute;background:linear-gradient(90deg,#8d8f94,#d8d9dc 50%,#8d8f94)}
.stand-base{position:absolute;border-radius:10px;background:linear-gradient(90deg,#8d8f94,#e3e4e6 50%,#8d8f94);box-shadow:0 30px 40px -8px rgba(0,0,0,.5)}
.tab{border-radius:46px}
.tab img{border-radius:30px}
.ph{border-radius:70px}
.ph img{border-radius:58px}
.ph .isl{position:absolute;left:50%;transform:translateX(-50%);background:#000;border-radius:30px;z-index:3}
.glare{position:absolute;inset:0;border-radius:inherit;background:linear-gradient(115deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,0) 32%);pointer-events:none;z-index:4}
`;

// ---- component builders (absolute px, all coordinates in the 2400x1500 canvas) ----
function monitor(img, cx, top, sw) {
  const sh = Math.round((sw * 9) / 16);
  const b = 16, chin = 34;
  const w = sw + b * 2, h = sh + b + chin;
  const left = Math.round(cx - w / 2);
  const neckW = Math.round(w * 0.12), neckH = Math.round(sh * 0.13);
  const baseW = Math.round(w * 0.3);
  return `
  <div class="dev mon" style="left:${left}px;top:${top}px;width:${w}px;height:${h}px">
    <img src="${img}" style="left:${b}px;top:${b}px;width:${sw}px;height:${sh}px"/>
    <div class="glare"></div>
  </div>
  <div class="stand-neck" style="left:${Math.round(cx - neckW / 2)}px;top:${top + h - 2}px;width:${neckW}px;height:${neckH}px"></div>
  <div class="stand-base" style="left:${Math.round(cx - baseW / 2)}px;top:${top + h + neckH - 4}px;width:${baseW}px;height:22px"></div>`;
}
function tablet(img, left, top, sw) {
  const sh = Math.round(sw / (1640 / 2360));
  const b = 18;
  return `
  <div class="dev tab" style="left:${left}px;top:${top}px;width:${sw + b * 2}px;height:${sh + b * 2}px">
    <img src="${img}" style="left:${b}px;top:${b}px;width:${sw}px;height:${sh}px"/>
    <div class="glare"></div>
  </div>`;
}
function phone(img, left, top, sw, rot = 0) {
  const sh = Math.round(sw / (1170 / 2532));
  const b = Math.max(10, Math.round(sw * 0.035));
  const radius = Math.round(sw * 0.17);
  return `
  <div class="dev ph" style="left:${left}px;top:${top}px;width:${sw + b * 2}px;height:${sh + b * 2}px;border-radius:${radius + b}px;transform:rotate(${rot}deg)">
    <img src="${img}" style="left:${b}px;top:${b}px;width:${sw}px;height:${sh}px;border-radius:${radius}px"/>
    <div class="isl" style="top:${b + Math.round(sw * 0.035)}px;width:${Math.round(sw * 0.045)}px;height:${Math.round(sw * 0.045)}px;border-radius:50%"></div>
    <div class="glare"></div>
  </div>`;
}

function pages(s) {
  const d = blue(s.dir, 'desktop.jpeg');
  const t = blue(s.dir, 'tablet.jpeg');
  const m = blue(s.dir, 'mobile.jpeg');
  const m2 = blue(s.dir, s.phone2);

  // 1) desktop: big centred monitor
  const desktop = monitor(d, W / 2, 230, 1500);

  // 2) phones: two phones, slight overlap
  const phoneSw = 480;
  const phoneSh = Math.round(phoneSw / (1170 / 2532));
  const top = Math.round((H - phoneSh) / 2) - 30;
  const phones =
    phone(m, 1200 - phoneSw - 40, top + 40, phoneSw, -4) +
    phone(m2, 1200 + 10, top - 20, phoneSw, 4);

  // 3) comparison: monitor + tablet + phone, kept inside the central ~60% (x 480..1920)
  // widths: monitor 792 + tablet 376 + phone ~210 (+gaps) = ~1400, inside x 480..1920
  const cmp =
    monitor(d, 876, 420, 760) +
    tablet(t, 1286, 355, 340) +
    phone(m, 1680, 452, 190, 0);

  return { 'desktop-mockup': desktop, 'phone-mockup': phones, 'devices-comparison': cmp };
}

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
  args: ['--no-sandbox', '--allow-file-access-from-files'],
});

for (const s of sites) {
  const outDir = path.join(root, 'public', 'assets', 'projects', s.slug);
  fs.mkdirSync(outDir, { recursive: true });
  const set = pages(s);
  for (const [name, body] of Object.entries(set)) {
    const html = `<!doctype html><meta charset="utf-8"><style>${css(s)}</style><body><div class="floor"></div>${body}</body>`;
    const tmp = path.join(root, 'blue', s.dir, `__${name}.html`);
    fs.writeFileSync(tmp, html);
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
    const out = path.join(outDir, `${name}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
    await page.close();
    fs.unlinkSync(tmp);
    console.log('built', path.relative(root, out));
  }
}
await browser.close();

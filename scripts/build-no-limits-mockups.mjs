import fs from 'fs';
import path from 'path';

const root = process.cwd();

// Theme styling for No Limits: refined architectural dark luxury
const s = {
  slug: 'no-limits',
  dir: '11-no-limits',
  bg: ['#2e251e', '#12100e'], // Warm rich espresso / dark bronze obsidian
  dark: true,
};

const W = 2400;
const H = 1500;

const css = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#12100e}
body{position:relative;background:radial-gradient(ellipse at 50% 38%, ${s.bg[0]} 0%, ${s.bg[1]} 100%)}
.floor{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(to bottom,transparent,rgba(0,0,0,.45))}
.dev{position:absolute;background:#0d0d0f;box-shadow:0 0 0 2px #3a3a3f inset,0 60px 90px -20px rgba(0,0,0,.65),0 20px 40px -10px rgba(0,0,0,.45)}
.dev img{position:absolute;display:block;object-fit:cover;object-position:top center}
.mon{border-radius:26px}
.mon img{border-radius:6px}
.stand-neck{position:absolute;background:linear-gradient(90deg,#6d6f74,#c8c9cc 50%,#6d6f74)}
.stand-base{position:absolute;border-radius:10px;background:linear-gradient(90deg,#6d6f74,#d3d4d6 50%,#6d6f74);box-shadow:0 30px 40px -8px rgba(0,0,0,.6)}
.tab{border-radius:46px}
.tab img{border-radius:30px}
.ph{border-radius:70px}
.ph img{border-radius:58px}
.ph .isl{position:absolute;left:50%;transform:translateX(-50%);background:#000;border-radius:30px;z-index:3}
.glare{position:absolute;inset:0;border-radius:inherit;background:linear-gradient(115deg,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 32%);pointer-events:none;z-index:4}
`;

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

// Convert images to base64 data URIs so they load instantly without file scheme restrictions
function toDataUrl(p) {
  const full = path.join(root, p);
  const data = fs.readFileSync(full).toString('base64');
  return `data:image/jpeg;base64,${data}`;
}

const d = toDataUrl('blue/11-no-limits/01-desktop-hero.jpg');
const t = toDataUrl('blue/11-no-limits/18-tablet-hero.jpg');
const m = toDataUrl('blue/11-no-limits/19-mobile-hero.jpg');
const m2 = toDataUrl('blue/11-no-limits/20-mobile-3d-product.jpg');

// 1) desktop: big centred monitor
const desktop = monitor(d, W / 2, 230, 1500);

// 2) phones: two phones (mobile hero + mobile 3D model)
const phoneSw = 480;
const phoneSh = Math.round(phoneSw / (1170 / 2532));
const top = Math.round((H - phoneSh) / 2) - 30;
const phones =
  phone(m, 1200 - phoneSw - 40, top + 40, phoneSw, -4) +
  phone(m2, 1200 + 10, top - 20, phoneSw, 4);

// 3) comparison: monitor + tablet + phone
const cmp =
  monitor(d, 876, 420, 760) +
  tablet(t, 1286, 355, 340) +
  phone(m, 1680, 452, 190, 0);

const mockups = {
  'desktop-mockup': desktop,
  'phone-mockup': phones,
  'devices-comparison': cmp,
};

for (const [name, body] of Object.entries(mockups)) {
  const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><body><div class="floor"></div>${body}</body>`;
  fs.writeFileSync(path.join(root, 'blue', '11-no-limits', `${name}.html`), html);
  console.log(`Generated blue/11-no-limits/${name}.html`);
}

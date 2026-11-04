// Replaces the placeholder SVG images/galleryPictures of proj-web-1..8 with the generated mockups.
import fs from 'fs';

const file = 'src/data/initialProjects.ts';
let src = fs.readFileSync(file, 'utf8');

const sites = [
  { id: 'proj-web-1', slug: 'merona-media', name: 'Merona Media' },
  { id: 'proj-web-2', slug: 'stillwater-therapy', name: 'Stillwater Therapy Collective' },
  { id: 'proj-web-3', slug: 'oumera', name: 'OUMERA' },
  { id: 'proj-web-4', slug: 'little-acorn', name: 'Little Acorn' },
  { id: 'proj-web-5', slug: 'the-daily-knead', name: 'The Daily Knead' },
  { id: 'proj-web-6', slug: 'brasa', name: 'Brasa' },
  { id: 'proj-web-7', slug: 'kinetic-edge', name: 'Kinetic Edge' },
  { id: 'proj-web-8', slug: 'banjue-seat', name: 'Banjue Seat' },
];

for (const s of sites) {
  const base = `/assets/projects/${s.slug}`;
  const cmp = `${base}/devices-comparison.jpg`;
  const desk = `${base}/desktop-mockup.jpg`;
  const phone = `${base}/phone-mockup.jpg`;
  const key = s.id.replace('proj-web-', 'web');

  const block = `    imageUrl: '${cmp}',
    images: [
      '${cmp}',
      '${desk}',
      '${phone}',
    ],
    galleryPictures: [
      {
        id: '${key}-g1',
        url: '${cmp}',
        caption: '${s.name} \u2014 responsive comparison across desktop, tablet and mobile.',
        isAI: false,
      },
      {
        id: '${key}-g2',
        url: '${desk}',
        caption: '${s.name} \u2014 desktop mockup.',
        isAI: false,
      },
      {
        id: '${key}-g3',
        url: '${phone}',
        caption: '${s.name} \u2014 mobile mockup.',
        isAI: false,
      },
    ],
`;

  const start = src.indexOf(`id: '${s.id}'`);
  if (start < 0) throw new Error(`missing ${s.id}`);
  const imgIdx = src.indexOf('    images: [', start);
  const procIdx = src.indexOf('    processSteps: [', imgIdx);
  if (imgIdx < 0 || procIdx < 0) throw new Error(`anchors missing for ${s.id}`);
  src = src.slice(0, imgIdx) + block + src.slice(procIdx);
  console.log('wired', s.id);
}

fs.writeFileSync(file, src);


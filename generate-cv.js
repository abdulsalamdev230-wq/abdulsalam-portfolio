/*
================================================================
  CV GENERATOR - Website ke "Download CV" button ke liye PDF banata hai
  ----------------------------------------------------------------
  Istemaal:  node generate-cv.js
  Yeh script assets/cv.pdf banati hai jisme:
    - Skills (progress bars ke sath)
    - Experience & Education timeline
    - Projects
  Apni details update karni hon to sirf neeche CV_DATA edit karein.
  (PDF engine pdfkit use karta hai - npm install pdfkit)
================================================================
*/

const fs = require('fs');
const path = require('path');

// Try to load pdfkit; if missing, fall back to a clean text-based PDF
let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch (e) {
  console.error('pdfkit missing. Run:  npm install pdfkit');
  process.exit(1);
}

/* ============================================================
  CV DATA - YAHAN APNI DETAILS EDIT KAREIN
============================================================ */
const CV_DATA = {
  name: 'Abdul Salam',
  title: 'Flutter Developer & Frontend Web Developer',
  email: 'abdulshooter4303m@email.com',
  phone: '+92 329 3042100',
  location: 'Karachi, Pakistan',
  website: 'github.com/abdulsalam', // apna GitHub username daalein
  summary:
    'Passionate software engineer specializing in cross-platform mobile app development with Flutter & Dart, alongside modern frontend web engineering. I write clean, modular, maintainable code that delivers outstanding performance.',

  skills: [
    { name: 'Flutter', level: 0.95 },
    { name: 'Dart', level: 0.90 },
    { name: 'HTML5', level: 0.95 },
    { name: 'CSS3 / Modern Styling', level: 0.90 },
    { name: 'JavaScript', level: 0.85 },
    { name: 'React', level: 0.80 },
    { name: 'Firebase', level: 0.85 },
    { name: 'Git & Version Control', level: 0.90 },
    { name: 'GitHub', level: 0.90 },
  ],

  services: [
    'Cross-Platform App Development (Flutter, Clean Architecture, Bloc/Provider)',
    'Creative Frontend Engineering (HTML, CSS, JavaScript, React)',
    '3D Web Integrations (Three.js, GSAP, ScrollTrigger)',
  ],

  experience: [
    {
      period: '2024 - Present',
      role: 'Senior Flutter & Web Developer',
      company: 'Appic Solutions',
      detail:
        'Leading the mobile app engineering division. Built and shipped 10+ cross-platform Flutter applications on iOS App Store & Google Play. Established standard styling and reusable UI modules.',
    },
    {
      period: '2022 - 2024',
      role: 'Mobile App Engineer',
      company: 'Devsync Technologies',
      detail:
        'Collaborated with designers to build custom UI, connect REST APIs, add animations, state caching, and responsive frontend screens using HTML, CSS, JavaScript, and React.',
    },
  ],

  education: [
    {
      period: '2019 - 2023',
      degree: 'BS Computer Science',
      institute: 'University of Central Punjab',
      detail:
        'Software architectures, database design, computer networks, HCI, and OOP. Graduated with honors.',
    },
  ],

  projects: [
    {
      name: 'Flutter E-Commerce Shopping App',
      tech: 'Flutter, Dart, Stripe',
      detail: 'Interactive product grids, category filtering, cart state system, simulated secure payments.',
    },
    {
      name: 'SaaS Financial Analytics Dashboard',
      tech: 'React, Chart.js, Tailwind',
      detail: 'Rich charts tracking sales, margins, retention; light/dark mode, glassmorphism.',
    },
    {
      name: 'Flutter Real-Time Messaging App',
      tech: 'Flutter, Firebase, WebSockets',
      detail: 'Secure chat with instant sync, offline caching, push notifications, media uploads.',
    },
    {
      name: 'AI SaaS Startup Landing Page',
      tech: 'React, GSAP, Three.js',
      detail: 'Award-style promo site with pricing cards, magnetic cursor, scroll reveals, particles.',
    },
    {
      name: 'Flutter Weather Neomorphic App',
      tech: 'Flutter, REST API',
      detail: 'API-driven weather app with location tracking and animated climate states.',
    },
    {
      name: 'Kanban Project Manager Web App',
      tech: 'React, Node.js, MongoDB',
      detail: 'Collaborative board with HTML5 drag-and-drop, ticket comments, task categories.',
    },
  ],

  stats: [
    ['3+', 'Years Experience'],
    ['30+', 'Projects Completed'],
    ['15+', 'Happy Clients'],
    ['100%', 'Client Satisfaction'],
  ],
};

/* ============================================================
  PDF RENDERING
============================================================ */
const PURPLE = '#7c3aed';
const CYAN = '#0891b2';
const DARK = '#1e293b';
const MUTED = '#475569';
const LIGHT = '#64748b';

const doc = new PDFDocument({ size: 'A4', margins: { top: 45, bottom: 45, left: 50, right: 50 } });
const outPath = path.join(__dirname, 'assets', 'cv.pdf');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
doc.pipe(fs.createWriteStream(outPath));

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 50;
const CONTENT_W = PAGE_W - M * 2;

let y = 45;

function ensureSpace(needed) {
  if (y + needed > PAGE_H - 50) {
    doc.addPage();
    y = 50;
  }
}

function heading(text) {
  ensureSpace(60);
  y += 14;
  doc.moveTo(M, y).lineTo(M + CONTENT_W, y).lineWidth(0.7).strokeColor('#e2e8f0').stroke();
  y += 16;
  doc.fontSize(11.5).fillColor(PURPLE).font('Helvetica-Bold').text(text, M, y, { characterSpacing: 1 });
  y += doc.heightOfString(text, { width: CONTENT_W, fontSize: 11.5 }) + 8;
}

function skillBar(label, fraction) {
  ensureSpace(30);
  doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text(label, M, y);
  const pct = Math.round(fraction * 100) + '%';
  doc.fontSize(8.5).fillColor(LIGHT).font('Helvetica').text(pct, M + CONTENT_W - 30, y, { width: 30, align: 'right' });
  y += 12;
  const barW = CONTENT_W;
  const barH = 4.5;
  doc.roundedRect(M, y, barW, barH, 2).fillColor('#e2e8f0').fill();
  doc.roundedRect(M, y, Math.max(barW * fraction, 8), barH, 2).fillColor(PURPLE).fill();
  y += barH + 10;
}

function entry(period, title, org, detail) {
  doc.fontSize(9.5).fillColor(CYAN).font('Helvetica-Bold').text(period, M, y);
  y += 13;
  ensureSpace(40);
  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(title, M, y);
  y += 14;
  doc.fontSize(9.5).fillColor(PURPLE).font('Helvetica-Bold').text(org, M, y);
  y += 13;
  doc.fontSize(9).fillColor(MUTED).font('Helvetica').text(detail, M, y, { width: CONTENT_W, lineGap: 1.5 });
  y += doc.heightOfString(detail, { width: CONTENT_W, fontSize: 9 }) + 14;
}

// ---------- HEADER ----------
doc.rect(0, 0, PAGE_W, 150).fill('#0f0a1e');
doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text(CV_DATA.name, M, 40);
doc.fontSize(12).fillColor('#c4b5fd').font('Helvetica').text(CV_DATA.title, M, 70);

const contactLine = `${CV_DATA.email}   |   ${CV_DATA.phone}   |   ${CV_DATA.location}`;
doc.fontSize(8.5).fillColor('#94a3b8').font('Helvetica').text(contactLine, M, 95, { width: CONTENT_W });
if (CV_DATA.website) {
  doc.fontSize(8.5).fillColor('#67e8f9').text(CV_DATA.website, M, 108, { width: CONTENT_W });
}

// header decorative line
doc.moveTo(M, 132).lineTo(PAGE_W - M, 132).lineWidth(2).strokeColor(PURPLE).stroke();
doc.moveTo(M, 136).lineTo(PAGE_W - M, 136).lineWidth(2).strokeColor(CYAN).stroke();

y = 158;

// ---------- SUMMARY ----------
doc.fontSize(9.5).fillColor(MUTED).font('Helvetica').text(CV_DATA.summary, M, y, { width: CONTENT_W, lineGap: 2 });
y += doc.heightOfString(CV_DATA.summary, { width: CONTENT_W, fontSize: 9.5 }) + 4;

// ---------- STATS ROW ----------
const statW = CONTENT_W / 4;
CV_DATA.stats.forEach(([num, label], i) => {
  const sx = M + i * statW;
  doc.fontSize(15).fillColor(PURPLE).font('Helvetica-Bold').text(num, sx, y + 6, { width: statW, align: 'center' });
  doc.fontSize(7.5).fillColor(LIGHT).font('Helvetica').text(label, sx, y + 26, { width: statW, align: 'center' });
});
y += 52;

// ---------- SKILLS ----------
heading('TECHNICAL SKILLS');
CV_DATA.skills.forEach((s, i) => {
  // two columns of bars
  const col = i % 2;
  const colW = CONTENT_W / 2 - 15;
  const cx = M + col * (CONTENT_W / 2 + 10);
  if (col === 0) ensureSpace(30);
  const barY = y;
  doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text(s.name, cx, barY);
  doc.fontSize(8.5).fillColor(LIGHT).font('Helvetica').text(Math.round(s.level * 100) + '%', cx + colW - 30, barY, { width: 30, align: 'right' });
  const barY2 = barY + 12;
  doc.roundedRect(cx, barY2, colW, 4.5, 2).fillColor('#e2e8f0').fill();
  doc.roundedRect(cx, barY2, Math.max(colW * s.level, 8), 4.5, 2).fillColor(col % 2 === 0 ? PURPLE : CYAN).fill();
  if (col === 1) y = barY2 + 16;
});

if (CV_DATA.skills.length % 2 === 1) y += 16;

// ---------- SERVICES ----------
heading('SERVICES');
CV_DATA.services.forEach((s) => {
  ensureSpace(24);
  doc.circle(M + 3, y + 4, 1.6).fillColor(CYAN).fill();
  doc.fontSize(9.5).fillColor(MUTED).font('Helvetica').text(s, M + 12, y, { width: CONTENT_W - 12 });
  y += doc.heightOfString(s, { width: CONTENT_W - 12, fontSize: 9.5 }) + 6;
});

// ---------- EXPERIENCE ----------
heading('EXPERIENCE');
CV_DATA.experience.forEach((e) => entry(e.period, e.role, e.company, e.detail));

// ---------- EDUCATION ----------
heading('EDUCATION');
CV_DATA.education.forEach((e) => entry(e.period, e.degree, e.institute, e.detail));

// ---------- PROJECTS ----------
heading('FEATURED PROJECTS');
CV_DATA.projects.forEach((p) => {
  ensureSpace(46);
  doc.fontSize(10.5).fillColor(DARK).font('Helvetica-Bold').text(p.name, M, y);
  y += 13;
  doc.fontSize(8.5).fillColor(CYAN).font('Helvetica-Bold').text(p.tech, M, y);
  y += 11;
  doc.fontSize(9).fillColor(MUTED).font('Helvetica').text(p.detail, M, y, { width: CONTENT_W, lineGap: 1.5 });
  y += doc.heightOfString(p.detail, { width: CONTENT_W, fontSize: 9 }) + 10;
});

// ---------- FOOTER on each page ----------
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(7.5).fillColor('#94a3b8').font('Helvetica').text(
    `${CV_DATA.name}  -  CV generated from portfolio  -  Page ${i + 1} of ${range.count}`,
    M, PAGE_H - 32, { width: CONTENT_W, align: 'center', lineBreak: false }
  );
}

doc.end();
console.log('CV generated: ' + outPath);

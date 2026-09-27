# VapourDense Virtual Cafe (VDVC) — Complete System Documentation & Developer Manual

Welcome to the comprehensive technical documentation for the **VapourDense Virtual Cafe (VDVC)** portfolio and client brief engine. This manual explains the entire architecture, directory organization, technologies, state flows, and exact instructions on how to find and modify every component, style, dropdown, and data store across the codebase.

---

## 1. Technology Stack & Exact Versions

This project is built as a modern, high-performance Full-Stack React Single Page Application (SPA) powered by Vite, TypeScript, Tailwind CSS v4, Motion, and Firebase Firestore.

| Technology / Library | Version | Purpose & Description |
| :--- | :--- | :--- |
| **React** | `^19.0.1` | Modern React with functional components, hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useMemo`). |
| **React DOM** | `^19.0.1` | React DOM renderer. |
| **Vite** | `^8.3.0` | Next-generation frontend build tool and development server running on port 3000. |
| **@vitejs/plugin-react** | `^6.1.1` | Official Vite plugin providing Fast Refresh and JSX support. |
| **TypeScript** | `^7.0.2` | Strongly typed JavaScript with strict typing across portfolio interfaces and event handlers. |
| **Tailwind CSS** | `^4.3.3` | Utility-first styling engine imported via `@import "tailwindcss";` in `src/index.css`. |
| **@tailwindcss/vite** | `^4.3.3` | Vite integration plugin for Tailwind CSS v4. |
| **Motion (`motion/react`)** | `^12.23.24` | Animation and gesture library (formerly Framer Motion) powering transitions and modals. |
| **Firebase SDK** | `^12.19.0` | Cloud Firestore for persistent real-time portfolio data storage and syncing. |
| **jsPDF** | `^4.2.1` | Client-side vector PDF generation for styled client project briefs. |
| **Lucide React** | `^0.546.0` | Pixel-perfect, modern vector icon set. |
| **@google/genai** | `^2.4.0` | Google GenAI SDK for AI features. |
| **Express** | `^4.21.2` | Production Node.js server capability. |

---

## 2. Directory Structure & File Map

```
/
├── .env.example                     # Environment variable templates
├── firebase-applet-config.json      # Firestore cloud connection configuration
├── firebase-blueprint.json          # Firestore schema definition
├── firestore.rules                  # Firestore database security rules
├── index.html                       # HTML5 entry point & Google Fonts imports
├── metadata.json                    # Application metadata and runtime permissions
├── package.json                     # NPM dependencies, scripts, and versions
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite configuration with Tailwind CSS plugin
├── DOCUMENTATION.md                 # This complete system manual
│
└── src/
    ├── main.tsx                     # React application root mounting point
    ├── App.tsx                      # Master application controller, navigation state & routing
    ├── index.css                    # Global typography, custom @font-face rules & Tailwind CSS
    │
    ├── components/
    │   ├── Navbar.tsx               # Top navigation bar with logo, links, and admin trigger
    │   ├── GallerySection.tsx       # Front-end 4-project curated showcase grid
    │   ├── ProjectBlogView.tsx      # Full-Screen Project Show & CMS Editor (70/30 Dark Layout)
    │   ├── BookingSection.tsx       # 8-Step interactive client brief engine & PDF generator
    │   ├── CustomSelect.tsx         # Full-screen backdrop-blur 90vh search & semantic selector
    │   ├── AboutSection.tsx         # Philosophy, capabilities, and bio section
    │   ├── DashboardView.tsx        # Admin CMS dashboard for managing projects and about copy
    │   ├── LoginPage.tsx            # Protected authentication page for portfolio admin
    │   ├── CaseStudyModal.tsx       # Supplementary modal container
    │   └── VDVCLogo.tsx             # Interactive, animated VDVC brand vector logo
    │
    ├── data/
    │   └── initialProjects.ts       # 4 default seed projects with rich SVGs, specs, and remarks
    │
    ├── hooks/
    │   └── usePortfolioStorage.ts   # Dual-layer state manager (Firestore sync + LocalStorage fallback)
    │
    ├── lib/
    │   └── firebase.ts              # Firebase app initialization & Firestore client export
    │
    ├── types/
    │   └── portfolio.ts             # TypeScript interfaces for Projects, Processes, Remarks & Briefs
    │
    └── utils/
        └── generateBriefPdf.ts      # Custom jsPDF brief document generator with royal styling
```

---

## 3. Core Typography & Font System

The application uses a distinctive typographic hierarchy specified in `src/index.css`:

1. **Moon 2.0 Light All Caps (`.font-vapour`)**:
   - Used for main project headings, Client Name, Designer's Remark, Valuation numbers, Timeline dates, and brand logos.
   - CSS definition:
     ```css
     .font-vapour {
       font-family: 'Moon 2.0 Light All Caps', 'Moon 2.0', 'Moon', 'Syne', sans-serif;
       text-transform: uppercase;
       font-weight: 300;
       letter-spacing: 0.07em;
     }
     ```
2. **Waxe Regular (`.font-dense`)**:
   - Used for primary section titles like `Gallery`, `Process`, and the `DENSE` part of `VAPOURDENSE`.
   - CSS definition:
     ```css
     .font-dense {
       font-family: 'Waxe Regular', 'Waxe', 'Syne', sans-serif;
       font-weight: 400;
       letter-spacing: 0.02em;
     }
     ```
3. **Phenomena (`.font-phenomena`, `.font-phenomena-bold`, `.font-virtual-cafe`)**:
   - Used for big hero headlines, booking questions, and `VIRTUAL CAFE` brand accents.
   - Loaded via CDN in `src/index.css`:
     ```css
     @import url('https://fonts.cdnfonts.com/css/phenomena');
     ```
4. **Uni Sans Family**:
   - `.font-unisans-thin-caps`: Used for the small uppercase top labels in the right details panel (`CLIENT NAME`, `TIMELINE DATE`, `DELIVERABLES`, etc.).
   - `.font-unisans-regular`: Used for all body prose, client profiles, process phase narratives, and deliverables pills.
   - `.font-body-copy`: Light weight general body copy.

---

## 4. Brand Color Palette & Accent Guide

The palette features a clean contrast between the minimalist **Light Grey (`#d9d9d9`)** portfolio canvas and the **Deep Navy Blue / Midnight (`#130f30`)** full-screen project showcase.

| Color Name | Hex Code | Usage Location |
| :--- | :--- | :--- |
| **Deep Navy Accent** | `#003663` | Primary action buttons (`Next →`, `Save Changes`), active pills, waveforms. |
| **Luminous Sky Blue** | `#38bdf8` | Highlights on dark backgrounds, active borders, timeline dates, valuation text. |
| **Project Show Background** | `#130f30` | Full-screen Project Show overlay, Booking section, and industry modal dialog. |
| **Light Portfolio Canvas** | `#d9d9d9` | Main front-end portfolio background and footer background. |
| **Pure White** | `#ffffff` | Primary text, navigation links, and crisp headers. |
| **Muted Slate** | `#94a3b8` / `#cbd5e1` | Secondary captions, subheadings, and placeholders. |

---

## 5. How to Change Everything: Where to Find & Modify

### 5.1 Changing Brand Name, Logo, & Navbar Links
- **File**: `src/components/Navbar.tsx`
- **What you can change**:
  - Logo title text: `<span className="font-vapour">VAPOUR</span><span className="font-dense">DENSE</span>`
  - Navigation links: `Gallery`, `Book`, `About`
  - Admin login trigger: The glasses icon button in the top right (`onOpenLogin`)
  - Target smooth-scroll IDs: `#gallery`, `#booking`, `#about`

### 5.2 Changing Default Projects & Case Studies
- **File**: `src/data/initialProjects.ts`
- **What you can change**:
  - The 4 seed projects (`monolith-zurich`, `dive-packaging`, `alps-monograph`, `apex-identity`).
  - Title, client name, description, duration, valuation (`$24,500 USD` or `₦9,200 EUR`), category (`Graphic Design`, `Web Design`, `Other`), and real-life deployment flag (`isRealLife: true`).
  - Gallery pictures array (`galleryPictures`) and Process steps array (`processSteps`).
  - Client remark audio/text quote/picture document.

### 5.3 Modifying the Full-Screen Project Show & Editor
- **File**: `src/components/ProjectBlogView.tsx`
- **Key Sections in this file**:
  - **Lines 50–120**: State management for `currentProject`, `hasUnsavedChanges`, and image sizing.
  - **Lines 260–275**: Image size calculations (currently configured at 200% base size: `360px` for gallery, `280px` for process).
  - **Lines 310–360**: Top utility bar with project counter (`02 / 04`) and explicit **"Save Changes"** button (`handleSaveChanges`).
  - **Lines 380–520**: **Gallery Section** displaying images horizontally with natural 16:10 aspect ratios, hover zoom, and AI badges.
  - **Lines 530–750**: **Process Section** showing iterative phases (Phase 01, Phase 02), AI/Final tags, and narrative descriptions.
  - **Lines 760–1050**: **Right Details Panel (30% split)** with:
    - `PROJECT TITLE`: `font-vapour`
    - `TIMELINE DATE`: `font-vapour text-[#38bdf8]`
    - `CLIENT'S REMARK`: Audio Memo waveform player with play/pause simulation, or Text Quote, or Document.
    - `CLIENT NAME`: `font-vapour`
    - `CLIENT PROFILE`: `font-unisans-regular`
    - `PROJECT SCOPE`: `font-unisans-regular`
    - `VALUATION / INVESTMENT`: `font-vapour text-[#38bdf8]`
    - `BUILD DURATION`: `font-vapour`
    - `DESIGNER'S REMARK`: `font-vapour`
    - `CATEGORY`: Displays `Graphic Design` / `Web Design` alongside `Real-Life Project` styled identically in frosted pills.
    - `DELIVERABLES`: Pill tags with optional delete `[X]` in edit mode.

### 5.4 Modifying the Booking / Client Brief Engine
- **File**: `src/components/BookingSection.tsx` & `src/utils/generateBriefPdf.ts`
- **What you can change**:
  - **Category 1 Path ("I have an idea / Exploring")**: `who` → `service` → `business` → `goals` → `feel` → `timeline` → `budget` → `contact` → `confirmation`.
  - **Category 2 Path ("I know exactly what I want / Prepared")**:
    - **Website / Web App**: `who` → `service` → `projectType` (Informational, Web App, E-commerce, Landing page, Portfolio, Something else) → `business` → `goals` → `feel` (Design direction references/link/general idea) → `scope` (1–3, 4–7, 8+ pages) → `timeline` (1–8 weeks) → `budget` (Exact slider up to ₦10M+) → `contact`.
    - **Graphic Design**: `who` → `service` → `projectType` (Logo, Flyer, Card, Social, Brand Kit, Packaging, Custom) → `business` → `feel` (References/surprise me) → `brandAssets` (Logo & colors) → `quantity` (1 piece, 2–5, ongoing) → `timeline` → `budget` → `contact`.
    - **Backend / Systems**: `who` → `service` → `projectType` (REST API, Admin dashboard, Database, 3rd-party, Automation) → `business` → `goals` → `techPreferences` (Preferred stack, Existing codebase) → `currentState` (Brand new, Existing improvement, Maintain) → `timeline` → `budget` → `contact`.
  - **Target Email**: Currently configured to send completed briefs to `vapourdense@gmail.com`.
  - **Button text & styling**: Styled with solid `#003663` and labeled `"Next →"`. Sharp corners (`rounded-none`).
  - **Privacy subtext**: Configured on lines ~960 to display *"Your information is private. We will never share it to anyone."* in high-visibility white text.

### 5.5 Modifying the Industry Dropdown & Contextual Search
- **File**: `src/components/CustomSelect.tsx`
- **What you can change**:
  - **90+ Industry List**: The `BUSINESS_INDUSTRIES` array in `BookingSection.tsx`.
  - **Contextual Synonyms Dictionary**: `CONTEXTUAL_KEYWORD_MAP` in `CustomSelect.tsx` (maps terms like `food`, `cake`, `beer`, `car`, `mechanic`, `cloth`, `law`, `crypto`, `doctor`, `hospital` to relevant industries).
  - **Dropdown layout**: Configured with `z-[9999]`, full-screen `backdrop-blur-xl`, and a centered `90vh` modal that overlays on top of the navigation bar.

### 5.6 Changing the About Section & Footer Content
- **Files**: `src/components/AboutSection.tsx` & `src/App.tsx` (Footer at bottom)
- **What you can change**:
  - About headline, story prose, capabilities tags, and social links.
  - Footer tagline: `"a flexible system for your paper workloads"`.
  - Footer location: `"Jos, Plateau State // UNIJOS"`.

### 5.7 Changing Database & Persistence Logic
- **File**: `src/hooks/usePortfolioStorage.ts`
- **Architecture**:
  - **Firestore sync**: Automatically fetches from the Firestore collection `'projects'` and document `'portfolio_settings/about'`.
  - **LocalStorage fallback**: Automatically mirrors data locally under key `'vdvc_portfolio_projects_v2'` so the site works offline seamlessly.
  - **Admin Authentication**: Hardcoded admin credentials for development / demonstration:
    - Username: `admin` (or `vdvc`)
    - Password: `admin` (or `virtualcafe2026`)
    - Configured in `login` function inside `usePortfolioStorage.ts`.

### 5.8 Customizing the PDF Brief Output
- **File**: `src/utils/generateBriefPdf.ts`
- **What you can change**:
  - The vector layout of the generated PDF download.
  - Studio header title, fonts, borders, section colors, and footer sign-off.

---

## 6. How to Build, Run, and Deploy

### 6.1 Development Mode
Runs the local dev server on `http://localhost:3000`:
```bash
npm run dev
```

### 6.2 TypeScript Compilation & Lint Check
Runs TypeScript type-checking without emitting files:
```bash
npm run lint
```

### 6.3 Production Build
Builds the optimized production assets into the `dist/` directory:
```bash
npm run build
```

---

## 7. Summary of Architecture Rules
1. **Separation of Presentation vs CMS**:
   - Clicking a project from the front-end gallery opens it in **Read-Only / Presentation Mode** (`isEditable = false`).
   - Clicking **"Edit"** from the Admin Dashboard opens the CMS Editor (`isEditable = true`) where you can modify captions, upload device pictures, add links, reorder phases, and click **"Save Changes"**.
2. **Explicit Saving**:
   - Changes made in the editor do not overwrite data in the background until the user explicitly clicks the **"Save Changes"** button in the top bar.
3. **Responsive Viewport Support**:
   - The entire layout is responsive across mobile phones (375px+), tablets, laptops, and ultra-wide desktop monitors.

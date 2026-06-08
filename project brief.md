# Through & Through — Project Brief

## Overview

**Through & Through** is an art portfolio website for Veronica Hermez. It presents her work as an immersive, scroll-driven experience with a WebGL warp background, an editorial portfolio gallery with a fisheye magnifier lens, and a cinematic first-visit intro animation.

The site was migrated from a deprecated Create React App setup to **Vite 6 + React 18 + TypeScript**, restoring and evolving the original FLUX-inspired visual system.

**Repository:** `through-and-through` (GitHub slug; display name “Through & Through”)  
**GitHub Pages:** `https://reemsalti.github.io/through-and-through/`

---

## Goals

- Showcase Veronica’s paintings with clarity, warmth, and presence
- Feel innovative and fluid without overwhelming the artwork
- Keep navigation minimal; let scroll and atmosphere do the work
- Preserve the original logo and warp aesthetic while modernizing typography and layout

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build | Vite 6, TypeScript |
| UI | React 18, React Router (HashRouter) |
| Styling | CSS variables, component CSS, styled-components (navbar only) |
| 3D / FX | React Three Fiber, Three.js, custom distortion/ripple passes |
| Fonts | **Fraunces** (display), **Inter** (body) — Google Fonts |
| Contact | EmailJS, react-toastify |
| Deploy | GitHub Pages via `gh-pages` |

**Removed / not used:** Leva debug panel, Sidebar/mobile overlay, old WebGL page shells (`GalleryCanvas`, `ShopCanvas`, `ContactCanvas`), legacy local fonts in `src/fonts/`, JS wheel-scroll hijacking (replaced by native CSS scroll snap).

---

## Site Structure

### Routes

- **`/`** — Home: hero, artist statement, portfolio gallery
- **`/shop`** — “Coming Soon” with warp background
- **`/contact`** — Contact details + form with warp background

### Home page scroll sections (7 total)

Each section uses `data-scroll-section` and native CSS scroll snap (`scroll-snap-align: center`, `scroll-snap-stop: always`).

| # | Section | Element | Content |
|---|---|---|---|
| 1 | Hero | `.hero` | Title, slogan, byline |
| 2 | Artist statement | `.statement` | Portrait + editorial text |
| 3–7 | Gallery pieces | `.gallery__piece` | Artwork + caption (first includes “Portfolio” heading) |

---

## Visual Design

### Palette (from the art)

- Background: `#0e0d0c`
- Text: `#f1ece2`
- Muted: `rgba(241, 236, 226, 0.62)`
- Accents: `#e0683f`, `#e6a24c`

### Typography

- Headlines / titles: Fraunces (serif, italic where appropriate)
- UI / nav / hints: Inter, uppercase tracking on nav links

### Global UX

- **`user-select: none`** site-wide (inputs/textareas exempt)
- Soft `drop-shadow` / glow on low-contrast text (Shop “Coming Soon”, Contact icons)

### Logo

- Asset: `src/components/images/logo1.png`
- Nested arch / doorway motif — inner arch is the conceptual “portal” for the intro animation

---

## Key Features

### 1. Warp background (site-wide)

- **Files:** `WarpBackground.tsx`, `TCanvas.tsx`, `WarpBackground.css`, `Effect.tsx`, postprocessing passes
- Full-screen flux texture (`public/assets/images/fluxcolors.jpg`) with distortion + ripple postprocessing
- Runs on **all routes**; **pauses** when tab is hidden or `body.gallery-focus` is active
- Dual scrim layers crossfade home vs inner pages
- **`body.gallery-focus`** dims warp and applies a **scroll-linked color wash** driven by `--gallery-tone-rgb`

**Performance notes:**

- Leva removed; shader params hardcoded in `Effect.tsx`
- Ripple render target at half resolution; max ripples reduced (40)
- Canvas DPR capped at 1.5

### 2. Portfolio gallery (editorial scroll + fisheye lens)

- **Files:** `gallery/GalleryExperience.tsx`, `gallery/GalleryExperience.css`, `gallery/GalleryFisheyeLens.tsx`, `utils/fisheyeMap.ts`, `data/portfolio.ts`, `utils/color.ts`
- **Not a carousel** — calm vertical flow of full-viewport pieces
- Each piece: centered image (up to **95% viewport height**) + caption (index + italic title)
- Unified stage height from hi-res dimensions + per-piece `crop`; width follows aspect ratio
- White borders trimmed via `clip-path: inset()` per piece
- Scroll reveal: each piece fades/slides in via `IntersectionObserver` (`.is-inview`)
- **Background tone shift:** per-piece `tone` hex; scroll interpolates into `--gallery-tone-rgb` for warp scrim
- **Portfolio title** lives inside the first gallery piece (not a separate full-screen section)
- **Fisheye magnifier lens** (desktop pointer only):
  - Follows cursor anywhere in the gallery section
  - Clones portfolio DOM for a live magnified view
  - Barrel fisheye distortion + subtle liquid warp (SVG displacement map)
  - No magnifying-glass border/outline; soft drop shadow only
  - Disabled on touch / `prefers-reduced-motion`

### 3. Artist statement

- **Files:** `Home.tsx`, `Home.css`
- Full-width layout: artist photo left, vertical rule, text right (stacks on mobile)
- Photo: `public/assets/images/artist.png`
- Fixed `100dvh` section; scroll reveal animates photo/text in and out (`is-inview`)

### 4. First-visit intro animation

- **Files:** `intro/IntroOverlay.tsx`, `intro/IntroOverlay.css`
- Plays once per session on home (`sessionStorage intro-seen`)
- **Three beats (~3.8s total):** logo on black → door zoom with warp → hero text in
- Respects `prefers-reduced-motion`
- **Replay:** `sessionStorage.removeItem('intro-seen')` then reload

### 5. Navigation

- Transparent fixed nav; links inline on all screen sizes
- Hides on scroll down on home (after ~100px)
- Hidden during intro animation

### 6. Shop & Contact

- Warp background with page scrim
- Shop: centered “Shop” / “Coming Soon” with soft text glow
- Contact: Instagram + email links, EmailJS form

---

## Scroll Behavior

| Setting | Value |
|---|---|
| `scroll-snap-type` | `y mandatory` on `html` |
| Section align | `center` on all `[data-scroll-section]` |
| `scroll-snap-stop` | `always` (one section per gesture) |
| `overflow-anchor` | `none` (prevents gallery layout shifts from pulling scroll) |
| JS scroll hijacking | **Removed** — native CSS snap only (`useScrollSections` is a no-op hook) |

**History:** JS wheel hijacking caused double-scroll, stuck sections, and random jumps; replaced with native mandatory center snap after fixed `100dvh` section heights stabilized layout.

---

## Architecture

```
App.tsx
├── IntroOverlay (first visit, home only)
├── WarpBackground (+ ScrollToTop)
├── Navbar
└── Routes
    ├── Home (hero, statement, GalleryExperience)
    ├── Shop
    └── Contact
```

### Z-index layering

- Warp background `z-index: 0`
- Main content `z-index: 2`
- Gallery fisheye lens `z-index: 12`
- Intro overlay `z-index: 10000`
- Nav `z-index: 100`

### Body classes

| Class | Purpose |
|---|---|
| `intro-active` | Intro running; hides hero text, statement, gallery |
| `intro-text-in` | Beat 3; hero text animates in, nav fades in |
| `gallery-focus` | User in portfolio; dims warp, applies tone wash, pauses WebGL |
| `gallery--fisheye-active` | Fisheye lens visible; hides cursor in gallery |

### Important pitfalls

- `.app { overflow-x: clip }` breaks intro `box-shadow` veil → `body.intro-active .app { overflow: visible }`
- Do **not** use `mix-blend-mode: screen` on intro logo (homepage bleeds through)
- Gallery images must use `public/assets/images/` hi-res paths (not `src/components/images/`)
- Do **not** reintroduce JS wheel scroll locks without gesture-tail handling — causes stuck/random scroll
- Gallery `measureLayout` on mount is required for correct aspect ratios (placeholder dims stretch images)
- Fisheye lens clones `gallery__clone-source` — do not clone the fisheye overlay itself

---

## Portfolio Data

**File:** `src/data/portfolio.ts`

```ts
type PortfolioPiece = {
  src: string;      // publicPath('/assets/images/...')
  title: string;
  crop: number;     // % inset per edge (8–10 typical)
  tone: string;     // hex — gallery background wash
};
```

**Hi-res assets:** `public/assets/images/` (2880×2160 up to 5760×4332)

---

## Development

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build
npm run preview
npm run deploy   # GitHub Pages → /through-and-through/
```

**Node:** >= 20

---

## File Map

| Path | Role |
|---|---|
| `src/main.tsx` | Entry, HashRouter |
| `src/components/App.tsx` | Layout, intro gate, routes |
| `src/components/Home.tsx` | Hero, statement, gallery mount |
| `src/components/Home.css` | Hero, statement layout + scroll reveal |
| `src/components/gallery/GalleryExperience.*` | Editorial gallery + tone scroll + fisheye mount |
| `src/components/gallery/GalleryFisheyeLens.tsx` | Section-wide fisheye magnifier lens |
| `src/utils/fisheyeMap.ts` | Generates SVG displacement map for fisheye |
| `src/utils/useScrollSections.ts` | No-op hook (CSS snap handles scroll) |
| `src/data/portfolio.ts` | Pieces, crops, tones |
| `src/utils/color.ts` | RGB lerp for gallery tone wash |
| `src/utils/file.ts` | `publicPath()` helper |
| `src/components/WarpBackground.*` | Site-wide warp + scrims |
| `src/components/TCanvas.tsx` | WebGL canvas |
| `src/components/Effect.tsx` | Distortion + ripple composer |
| `src/components/intro/IntroOverlay.*` | Door intro animation |
| `src/components/Navbar/` | Fixed nav (styled-components) |
| `src/index.css` | Theme variables, scroll snap, overflow-anchor |
| `public/assets/images/` | Hi-res artwork + artist photo |

---

## Session History (chronological decisions)

### Foundation
- Migrated CRA → Vite; restored full app (Home, Shop, Contact)
- Restyled with Fraunces + Inter and warm palette from the paintings
- Fixed warp visibility (transparent app shell, z-index layering)
- Fixed gallery image quality → `public/assets/images/` hi-res paths

### Gallery evolution
- Removed sticky snap carousel → editorial vertical flow
- Merged “Portfolio” title into first gallery piece
- Per-piece scroll reveal + scroll-linked background tone colors
- Enlarged images to **95% viewport height** with fixed `100dvh` snap sections
- Added **section-wide fisheye magnifier lens** (barrel distortion, no glass outline)

### Scroll evolution
- Tried JS wheel hijacking for one-swipe-one-section — caused overshoot, random jumps, stuck sections
- **Current:** native CSS `scroll-snap-type: y mandatory` + `scroll-snap-stop: always` + fixed section heights
- `overflow-anchor: none` prevents gallery image load from pulling scroll position

### Intro evolution
- Final: ~3.8s, three beats, warp through arch, staggered hero text, `intro-seen` in sessionStorage

### UX / polish
- Removed Sidebar; nav links always visible
- Disabled text selection site-wide
- Performance cleanup: removed Leva, dead canvas files, lighter ripple
- Artist statement: editorial layout with photo, scroll in/out animation
- Shop/Contact: soft glow shadows; warp on all routes

---

## Open / Future

- Fine-tune intro door ↔ logo alignment on target devices
- Tune fisheye strength / lens size if too strong or subtle on some displays
- Adjust per-piece `tone` values if background wash doesn’t match art closely enough
- Optional: extract dominant colors from images at runtime instead of manual `tone` hex
- Optional: replay intro via UI or query param
- Optional: code-split Three.js bundle (currently ~1MB+ JS)

---

## Quick Debug

```js
// Replay intro
sessionStorage.removeItem('intro-seen')
location.reload()

// Check gallery tone variable (while scrolling portfolio)
getComputedStyle(document.documentElement).getPropertyValue('--gallery-tone-rgb')
```

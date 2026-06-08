# Through & Through

**Live demo → [reemsalti.github.io/through-and-through](https://reemsalti.github.io/through-and-through/)**

No install required — open the link in any modern browser (Chrome, Firefox, Safari, Edge). Best experienced on desktop with a mouse for the gallery fisheye lens.

Art portfolio for painter **Veronica Hermez**. A scroll-driven, atmosphere-first experience built to put the work center stage while still feeling alive.

---

## UX / UI — design decisions worth noting

This is not a template portfolio. Every interaction was chosen to serve the art, not compete with it.

### First impression: the intro as a doorway

On a first visit, the homepage opens on black. The logo appears — an arch within an arch — then **zooms through the inner doorway** as the WebGL warp background wakes up behind it. Hero text fades in. The nav arrives last.

- Plays **once per session** (`sessionStorage`) so return visits skip straight to the work
- Respects **`prefers-reduced-motion`** — intro is skipped entirely for users who need it
- The logo motif isn't decoration; it's the conceptual frame for the whole site

### Scroll as navigation — one gesture, one section

The home page is seven full-viewport sections: hero → artist statement → five gallery pieces. Scroll uses **native CSS snap** (`scroll-snap-type: y mandatory`, `scroll-snap-align: center`, `scroll-snap-stop: always`) — not JavaScript wheel hijacking.

Why that matters: earlier JS scroll-lock prototypes caused double-scrolls, stuck sections, and random jumps. Moving to native snap gave predictable, tactile section-to-section movement with zero scroll-jank logic to maintain.

### The warp background — atmosphere without distraction

A full-screen **Three.js** flux texture runs behind every page with custom distortion and ripple postprocessing. It breathes. It responds to pointer movement. But it knows when to step back:

- **Pauses** when the browser tab is hidden (battery + GPU)
- **Dims and color-washes** when the user enters the portfolio (`gallery-focus`), driven by each painting's dominant tone
- **Dual scrim layers** crossfade between home and inner routes (Shop, Contact)

The background adds depth; it never steals focus from the paintings.

### Portfolio gallery — editorial, not a carousel

The gallery is a **vertical editorial flow**, not a slider or lightbox:

- Each piece fills up to **95% of the viewport height**, centered with generous breathing room
- Captions sit below: index number + italic title in Fraunces
- Pieces **reveal on scroll** via `IntersectionObserver` — a soft fade/slide as each work enters view
- Per-piece **`clip-path` crops** trim baked-in white borders from the source photos
- **Background tone interpolation**: as you scroll between works, the warp scrim shifts color to match each painting's palette — the page literally absorbs the mood of the art

### Fisheye magnifier lens — curiosity without leaving context

On desktop, moving the cursor over the portfolio activates a **250px fisheye lens** that follows the pointer anywhere in the section:

- Clones the live gallery DOM for a real-time magnified view (not a static zoom image)
- Barrel distortion + liquid warp via an SVG displacement map
- No magnifying-glass chrome or outline — just a soft shadow and the warped view
- Disabled on touch devices and reduced-motion — no broken mobile UX

It's an invitation to look closer, not a mode switch.

### Artist statement — portrait as presence

A fixed full-viewport section: artist photo on the left, vertical rule, statement text on the right. On mobile, it stacks gracefully. Scroll reveal animates photo and copy in together — the artist is introduced before the work speaks for itself.

### Navigation — minimal, deferential

Fixed transparent nav with uppercase Inter links. On the home page, it **hides on scroll down** after ~100px so the hero stays clean. It **disappears entirely during the intro**. Three routes only: Home, Shop (coming soon), Contact.

### Accessibility & performance choices

| Concern | Approach |
|---|---|
| Motion sensitivity | `prefers-reduced-motion` skips intro, gallery reveals, and fisheye |
| Touch devices | Fisheye lens disabled; scroll snap still works natively |
| GPU load | Canvas DPR capped at 1.5; ripple pass at half resolution; warp pauses off-tab |
| Deploy size | Portfolio images converted to **WebP @ q85** (~35 MB → ~14 MB); unused assets removed |
| Text selection | Disabled site-wide except inputs — intentional gallery feel; form fields remain selectable |

### Typography & color

Palette pulled from the paintings themselves: warm near-black canvas (`#0e0d0c`), off-white ink (`#f1ece2`), accent oranges from the work. **Fraunces** for display and titles, **Inter** for UI — serif warmth meets clean navigation.

---

## Stack

| Layer | Tools |
|---|---|
| Build | Vite 6, TypeScript |
| UI | React 18, React Router (HashRouter) |
| Styling | CSS variables, component CSS, styled-components (navbar) |
| 3D / FX | React Three Fiber, Three.js, custom distortion + ripple passes |
| Fonts | Fraunces + Inter (Google Fonts) |
| Contact | EmailJS, react-toastify |
| Deploy | GitHub Pages (`gh-pages` branch) |

---

## Viewing the site

### In the browser (recommended for reviewers)

**[https://reemsalti.github.io/through-and-through/](https://reemsalti.github.io/through-and-through/)**

Works on GitHub Pages via HashRouter — no server-side routing needed. To replay the intro animation: open DevTools → Application → Session Storage → delete `intro-seen` → reload.

### Running locally

Requires Node.js 20+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview production build locally
npm run deploy   # build + publish to GitHub Pages
```

---

## Repo

[github.com/reemsalti/through-and-through](https://github.com/reemsalti/through-and-through)

See [`project brief.md`](project brief.md) for full architecture notes, scroll behavior history, and file map.

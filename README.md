# Through & Through

Portfolio site for painter Veronica Hermez.

**Live site:** https://reemsalti.github.io/through-and-through/

Open that in a browser — nothing to install. Desktop with a mouse is ideal (there's a fisheye lens in the gallery). Mobile works fine otherwise.

---

## What it is

A single-page scroll through the work: hero, artist statement, then five paintings one at a time. There's a WebGL warp running in the background on every page, an intro animation on first visit, and a contact form. Shop is a placeholder for now.

The site started as an older Create React App project and got rebuilt on Vite + TypeScript. Same visual idea, cleaner codebase.

---

## How it feels to use

**Intro.** First time you land on home, you get a short animation — logo on black, then a zoom through the arch in the logo while the warp background fades in behind it. After that, the hero text and nav appear. It only runs once per session. If you have reduced motion on, it skips straight to the content.

**Scroll.** Seven sections, each roughly full screen. One scroll gesture, one section — that's handled with CSS scroll snap, not JavaScript. I tried wheel hijacking early on and it kept breaking (double scrolls, getting stuck between sections, random jumps). Native snap fixed all of that.

**Gallery.** Paintings stack vertically like a magazine spread, not a carousel. Each one takes up most of the viewport. Captions sit underneath — a number and the title in italic. As you scroll, pieces fade in and the background tint shifts to match each painting's colors. The photos had white borders baked in, so each one gets a slightly different crop via clip-path.

**Fisheye lens.** On desktop, hover anywhere in the gallery and a lens follows your cursor — magnified, slightly warped, no border around it. It clones the actual DOM so you're looking at the real layout, not a separate zoom image. Turned off on touch and reduced motion.

**Statement.** Full-screen section with Veronica's photo on one side and her artist statement on the other. Stacks on small screens.

**Nav.** Fixed, transparent, three links. Hides when you scroll down on the home page. Gone during the intro.

---

## Under the hood

React 18, TypeScript, Vite. Three.js via React Three Fiber for the background — custom distortion and ripple shaders. React Router with a hash router so GitHub Pages doesn't need server config. Fraunces for headings, Inter for UI. EmailJS on the contact form.

A few things I cared about while building:

- Warp canvas pauses when the tab isn't visible
- Gallery images are WebP now (~14 MB total instead of ~35 MB as JPEGs)
- DPR capped at 1.5, ripple pass at half res — the background shouldn't melt a laptop
- `prefers-reduced-motion` respected for intro, reveals, and the lens

More detail in [`project brief.md`](project brief.md) if you want the full file map and scroll history.

---

## Run it locally

Node 20+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
npm run deploy   # publishes to GitHub Pages
```

To replay the intro: DevTools → Application → Session Storage → delete `intro-seen` → reload.

---

## Repo

https://github.com/reemsalti/through-and-through

# Through & Through

Art portfolio site for Veronica Hermez — immersive scroll experience with WebGL warp background, editorial gallery, and fisheye magnifier lens.

## Stack

- [Vite](https://vite.dev/) + React 18 + TypeScript
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei)
- React Router (HashRouter), EmailJS, styled-components (navbar)

## Requirements

- Node.js 20+ (see `.nvmrc`)

## Development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages

```bash
npm run deploy
```

This builds with `base` set to `/through-and-through/` and publishes `dist/` via `gh-pages`. Enable Pages on the repo (branch `gh-pages`, root `/`).

## Repo

https://github.com/reemsalti/through-and-through

See `project brief.md` for full architecture, scroll behavior, and feature notes.

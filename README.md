# FLUX Website

Immersive “coming soon” landing page built with React, React Three Fiber, and custom post-processing shaders.

## Stack

- [Vite](https://vite.dev/) + React 18 + TypeScript
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei)
- [Leva](https://github.com/pmndrs/leva) for live effect tuning in development

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

This builds with `base` set to `/flux-website2/` and publishes `dist/` via `gh-pages`. Enable Pages on the repo (branch `gh-pages`, root `/`).

## Repo

https://github.com/reemsalti/flux-website2

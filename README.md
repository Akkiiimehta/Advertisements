# Advertising Portfolio — Infinite Grid

An original, from-scratch implementation of a Phantom.land-style infinite
draggable tile grid, built for a personal advertising/production portfolio.
Next.js (App Router) + React + Framer Motion + hand-rolled CSS 3D fisheye
distortion. No code, copy, or assets copied from any existing site.

## What's inside

- **Intro** — a one-second `LIGHTS. / CAMERA. / ACTION.` sequence, plays
  once per browser session, skippable by click or keypress.
  (`components/IntroAnimation.tsx`)
- **Infinite grid** — a 14×12 (168-cell, 9×9/81-cell on mobile) virtual
  grid of tiles, freely draggable in any direction with momentum, wheel/
  trackpad panning, and true infinite wraparound (see "How the infinite
  drag works" below). (`components/InfiniteGrid.tsx`, `components/Tile.tsx`)
- **Fisheye distortion** — every tile has its own fixed "resting" jitter
  (±2–4° on X/Y/Z, seeded by tile index so it's stable across renders),
  plus a distance-from-center curve that increases rotation and shrinks
  scale toward the edges. Built with CSS 3D transforms driven entirely by
  Framer Motion `useTransform`/`useMotionValue` — no per-frame React state,
  no WebGL. (`lib/grid.ts`)
- **Click-to-expand** — a Framer Motion `layoutId` shared transition morphs
  a tile into a full-screen detail view with an embedded, autoplaying
  YouTube video, title, brand, role, production house, description, tags,
  and an expandable credits list. Closing reverses the animation back into
  the grid. (`components/ProjectModal.tsx`)
- **Site chrome** — wordmark, tagline, "Let's talk" CTA, grid/list toggle,
  Work/About/Contact nav, and a category filter panel — all translucent,
  blurred, fixed to the four corners. (`components/SiteChrome.tsx`,
  `components/FilterPanel.tsx`, `components/InfoOverlay.tsx`)
- **List view** — a simple, fully accessible scrollable text list of every
  project, as a fallback to the draggable canvas. (`components/ListView.tsx`)

### Why CSS 3D instead of WebGL

The brief allows falling back to a `react-three-fiber` barrel-distortion
shader if CSS 3D isn't convincing enough. CSS 3D transforms were used
instead because:

1. With 150+ tiles on screen, a CSS `transform` driven by Framer Motion's
   `useTransform` stays off the React render path and is composited on the
   GPU — no WebGL context, shader compilation, or texture upload overhead.
2. It keeps the DOM as the single source of truth for tile content (text,
   images, click targets, focus order), so accessibility and SEO aren't
   fighting a canvas.
3. The combination of per-tile jitter + distance-based curve is easily
   convincing at the scale this grid runs at — real 3D perspective, not a
   flat 2D fake.

If you want to push the distortion further than CSS transforms can
credibly go (true lens-like pixel bending, not just per-tile rotation),
`lib/grid.ts` is where the math lives — swap the `fisheyeCurve` output
into a Three.js plane's vertex shader without touching anything else.

### How the infinite drag works

Instead of duplicating the tile array into a giant grid and resetting the
scroll position when you hit an edge (which causes a visible snap), each
tile continuously computes its own on-screen position as the *nearest*
periodic copy of itself to the viewport center:

```
wrapped = (base + dragOffset) - gridSpan * round((base + dragOffset) / gridSpan)
```

Because the virtual grid (`cols * tileW`, `rows * tileH`) is always bigger
than the viewport, this guarantees full coverage no matter how far or how
long you drag — no reset, no snap, no seam. See `wrapToNearest` in
`lib/grid.ts`.

## Local setup

Requires Node 18.18+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # static export → ./out
npm run lint
```

## Adding a new project

Everything reads from **`data/projects.json`**. To add a project, copy the
`_template` object at the top of the file into the `projects` array and
fill it in:

```json
{
  "id": "unique-slug-here",
  "youtubeId": "XXXXXXXXXXX",
  "title": "Project / Campaign Title",
  "brand": "Client or Brand Name",
  "role": "Your role on the project",
  "productionHouse": "Production house / studio",
  "description": "Two to three lines describing the concept, the shoot, or the outcome.",
  "credits": ["Director — Name", "DOP — Name", "Editor — Name"],
  "tags": ["FMCG", "TVC"],
  "year": 2026,
  "tintColor": "#D6FF3F"
}
```

`tintColor` is optional — if you leave it out, one is auto-assigned from
the accent palette in `lib/projects.ts`. The grid, filter tags, and
duplication pattern all read dynamically from the array, so nothing else
needs to change.

**The current file ships with placeholder entries** (dummy YouTube ID
`dQw4w9WgXcQ`, invented credits/descriptions) so the site is fully
functional out of the box. Swap in your real 15–20 ads — YouTube link,
brand, role, production house — and it's live.

## Deployment — Netlify

The site is a static export (`output: 'export'` in `next.config.js`) —
everything is client-side interaction plus one static JSON file, so no
Node server is needed at runtime.

`netlify.toml` is already configured:

```toml
[build]
  command = "npm run build"
  publish = "out"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Connect the repo in Netlify and it will build and deploy automatically —
no environment variables or secrets required, since YouTube video IDs and
all other project data are public and live in `data/projects.json`.

## Project structure

```
app/
  layout.tsx          Root layout, metadata
  page.tsx             Top-level state: intro, view mode, filters, modal
  globals.css          All styling — design tokens, grid, chrome, modal
components/
  IntroAnimation.tsx   LIGHTS/CAMERA/ACTION sequence
  InfiniteGrid.tsx      Drag/wheel gesture capture + tile layout
  Tile.tsx              Single tile: jitter, fisheye, hover, click-to-open
  ProjectModal.tsx       Full-screen detail view (shared layout transition)
  SiteChrome.tsx         Fixed corner UI (logo, tagline, CTA, nav, filter)
  FilterPanel.tsx         Category filter popover
  ListView.tsx            Accessible list fallback view
  InfoOverlay.tsx          About / Contact panels
  types.ts                  Shared view/nav types
lib/
  projects.ts           Typed project data + derived tag list
  grid.ts                Grid math: jitter, fisheye curve, wraparound
hooks/
  useGridConfig.ts        Responsive grid density (desktop vs. mobile)
data/
  projects.json           All project content — the only file you edit
                           to add new work
```

## Git history

Commits are structured by system, matching how the site was built:
intro animation → grid + drag → fisheye distortion → hover state →
click-to-expand → site chrome → filter/list view → deployment config.

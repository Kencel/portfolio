# RAMENNAGI — Persona 5 Royal–Styled Portfolio

A personal portfolio site styled after the Persona 5 Royal UI — bold diagonal
cuts, high-contrast red/ink/bone palette, and a keyboard-navigable radial
menu. Built with Next.js and shipped as a static export. Codename:
**RAMENNAGI**.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # produce a static production build in out/
npm test         # run the test suite (vitest)
```

`npm run build` uses Next.js's static export (`output: 'export'`), so the
result is a plain `out/` directory of HTML/CSS/JS that can be hosted
anywhere — no Node server required.

## Adding your real images

The site ships with styled placeholders so it works out of the box. To swap
in real images, drop these files into `public/`:

- `avatar.jpg` — shown in the hexagon avatar slot on the main menu.
- `sinag.jpg` — shown on the Project SINAG card in the Projects section.

Both are picked up automatically once present. If your file is a different
format (`.png`, `.webp`, etc.) instead of `.jpg`, update the `src` extension
in the corresponding component:

- Avatar: `components/MenuView.tsx`
- Project SINAG: `components/sections/Projects.tsx`

Until an image is added, a styled placeholder is shown in its place.

## Live Codeforces data

The Contact/stats areas fetch rating, peak rating, and rank live from the
public Codeforces API for handle `RamenNagi`. If the API is unreachable
(e.g. offline), the site falls back to baked-in default values so the layout
never breaks.

"Problems solved" (currently `472`) is **not** fetched live — it's a manual
constant kept in `lib/data.ts`. Update it there when it changes.

## Deploying

The build output (`out/`) is a fully static site, so it can be deployed to
any static host:

- **GitHub Pages / Netlify / any static host** — upload the contents of
  `out/` after running `npm run build`.
- **Vercel** — connect the repository directly; Vercel will run
  `npm run build` and serve the static export automatically.

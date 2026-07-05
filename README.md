# Kenaz · RamenNagi

Hi! I'm Kenaz, a computer science student who spends most of his free time on
competitive programming. This repo is my personal portfolio site —
**[ramennagi.vercel.app](https://ramennagi.vercel.app)** — styled after the
Persona 5 Royal menu UI.

## About me

- 🎓 3rd-year Computer Science student at the **Ateneo de Manila University**
- ⚔️ Competitive programmer — in it for the problem-solving. C++ and Python.
  Codeforces: [RamenNagi](https://codeforces.com/profile/RamenNagi)
- 🤖 Interested in **AI/ML and data science**
- 🌐 Builds web things with **Next.js / React** — this site is my first
  passion project

## About this site

A Persona 5 Royal–inspired interface built from scratch — no game assets,
just the vibe: bold diagonal cuts, a high-contrast red/ink/bone palette, and
a keyboard-navigable menu.

- **Keyboard-first navigation** — arrow keys + Enter drive the whole menu,
  complete with synthesized UI blips
- **Live Codeforces stats** — rating and rank fetched from the public
  Codeforces API, with offline fallbacks so the layout never breaks
- **Hand-built SVG visuals** — like the hexagonal attributes radar, drawn
  from scratch instead of pulling in a charting library
- **Fully static** — Next.js static export, deployed on Vercel, tested with
  Vitest

## Run it locally

```bash
npm install
npm run dev    # dev server at http://localhost:3000
npm run build  # static export in out/
npm test       # vitest
```
# Kenaz · RamenNagi

I'm Kenaz. I study computer science and spend most of my free time on
competitive programming. This repo is my personal portfolio site,
[kenazc.com](https://www.kenazc.com), styled after the Persona 5 Royal menu UI.

## About me

- 3rd-year Computer Science student at the Ateneo de Manila University
- Competitive programmer, in it for the problem-solving. C++ and Python.
  Codeforces: [RamenNagi](https://codeforces.com/profile/RamenNagi)
- Interested in AI/ML and data science
- I build web things with Next.js and React. This site is my first passion
  project.

## About this site

A Persona 5 Royal-inspired interface built from scratch, with no game assets.
The look comes from bold diagonal cuts and a high-contrast red/ink/bone
palette, and the whole menu can be driven from the keyboard.

- Arrow keys and Enter run the entire menu. The UI blips are synthesized in
  the browser, so there are no audio files in the repo.
- Codeforces and AtCoder ratings, contest history, and solved-problem counts
  are fetched from the platforms' public APIs. If either API is unreachable
  the section falls back to static content rather than breaking the layout.
- The hexagonal attributes radar, the rating line charts, and the difficulty
  histograms are hand-drawn SVG instead of a charting dependency.
- Projects and contest results live in Neon Postgres. Adding a row puts it on
  the site within a minute, without a deploy (Next.js ISR).
- Built on the Next.js App Router, tested with Vitest, deployed on Vercel.

## Run it locally

```bash
npm install
npm run dev    # dev server at http://localhost:3000
npm run build  # production build
npm test       # vitest
```

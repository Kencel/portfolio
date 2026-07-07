# Portfolio database

The PROJECTS section is read from a Neon Postgres table (`projects`) at most
once per minute (ISR). **To add a project, insert a row — no code, no deploy.**

## Adding a project (Neon dashboard)

Vercel dashboard → Storage → the Neon database → *Open in Neon* → Tables →
`projects` → Add record. Columns:

| column        | required | notes                                                        |
|---------------|----------|--------------------------------------------------------------|
| `title`       | yes      | Displayed uppercase-style, e.g. `PROJECT SINAG`              |
| `description` | yes      | 1–3 sentences                                                |
| `image_url`   | no       | `/file.jpg` for files committed to `public/`, or any full URL. Empty → placeholder art |
| `link_url`    | no       | Full URL. Empty → no VISIT SITE button                       |
| `year`        | yes      | Just the year, e.g. `2025` — used for NEWEST sorting         |
| `tags`        | yes      | Uppercase, exactly as they should display, e.g. `{HACKATHON,NEXT.JS}`. Filter chips derive from these |

Leave `id` and `created_at` alone (auto-filled). Changes appear on the live
site within ~60 seconds.

## Competitions table

The COMPETITIONS tab of the COMP. PROG section reads from `competitions`
(same ISR cadence — changes live within ~60s). Columns:

| column           | required | notes                                                       |
|------------------|----------|-------------------------------------------------------------|
| `name`           | yes      | e.g. `UP ACM Algolympics 2026`                              |
| `event_date`     | yes      | Any day in the right month — rendered as `MAY 2026`, sorts newest-first |
| `team`           | no       | e.g. `Team KMP`; empty for solo contests                    |
| `result`         | yes      | e.g. `10/13 problems`, `60 points`, `Finalist`              |
| `placement`      | no       | e.g. `1st place`, `Top 30 of 71`, `Top 25%`                 |
| `note`           | no       | e.g. `Certificate of Distinction, Junior Division`          |
| `cert_image_url` | no       | `/file.jpg` in `public/` or a full URL; empty → no thumbnail |

Leave `id` and `created_at` alone (auto-filled).

## Local setup / re-seeding

`npm run db:apply -- schema seed` — applies `db/schema.sql` then `db/seed.sql`
using `DATABASE_URL` from `.env.local`. The Neon env vars are marked
*Sensitive* on Vercel, so `vercel env pull` writes them back **empty** — copy
the connection string from the Neon console instead and paste it into
`.env.local` yourself (re-paste after any future `env pull`, which blanks it
again). Both files are idempotent: the schema is `create table if not
exists`, the seed only inserts into an empty table.

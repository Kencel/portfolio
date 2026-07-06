# Projects database

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

## Local setup / re-seeding

`npm run db:apply -- schema seed` — applies `db/schema.sql` then `db/seed.sql`
using `DATABASE_URL` from `.env.local`. The Neon env vars are marked
*Sensitive* on Vercel, so `vercel env pull` writes them back **empty** — copy
the connection string from the Neon console instead and paste it into
`.env.local` yourself (re-paste after any future `env pull`, which blanks it
again). Both files are idempotent: the schema is `create table if not
exists`, the seed only inserts into an empty table.

// Runs db/<name>.sql files against DATABASE_URL, one file = one statement.
// Usage: npm run db:apply -- schema seed
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL is not set (run via npm run db:apply)'); process.exit(1); }
const names = process.argv.slice(2);
if (names.length === 0) { console.error('usage: npm run db:apply -- <name>... (runs db/<name>.sql)'); process.exit(1); }

const sql = neon(url);
for (const name of names) {
  const text = readFileSync(new URL(`./${name}.sql`, import.meta.url), 'utf8');
  await sql.query(text);
  console.log(`applied db/${name}.sql`);
}

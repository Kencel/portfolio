// Runs db/<name>.sql files against DATABASE_URL. Neon's HTTP driver rejects
// multi-statement queries, so files hold one statement per blank-line-separated
// block (terminating semicolon, then an empty line — the existing formatting).
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
  const statements = text.split(/;\s*(?:\r?\n\s*\r?\n|\s*$)/).map(s => s.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  console.log(`applied db/${name}.sql (${statements.length} statement${statements.length === 1 ? '' : 's'})`);
}

// Replaces public/resume.pdf (served at resume.kenazc.com) with the given PDF,
// commits only that file, and pushes main — Vercel redeploys from there.
// Usage: pnpm resume ~/Downloads/resume.pdf
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET = 'public/resume.pdf';
const root = fileURLToPath(new URL('..', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const fail = (msg) => { console.error(msg); process.exit(1); };

if (!process.argv[2]) fail('usage: pnpm resume <path-to.pdf>');
// pnpm runs scripts from the package root; resolve against where it was invoked.
const src = resolve(process.env.INIT_CWD ?? process.cwd(), process.argv[2]);
if (!existsSync(src)) fail(`no such file: ${src}`);
if (readFileSync(src).subarray(0, 5).toString('latin1') !== '%PDF-') fail(`not a PDF: ${src}`);

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== 'main') fail(`on branch ${branch} — switch to main first (this pushes to production)`);

copyFileSync(src, new URL(`../${TARGET}`, import.meta.url));
if (git('status', '--porcelain', '--', TARGET) === '') {
  console.log('resume is unchanged — nothing to commit');
  process.exit(0);
}

// Pathspec commit: anything else already staged stays out of this commit.
git('commit', '-q', '-m', 'feat: updated resume', '--', TARGET);
console.log(`committed ${git('log', '--oneline', '-1')}`);
execFileSync('git', ['push', 'origin', 'main'], { cwd: root, stdio: 'inherit' });

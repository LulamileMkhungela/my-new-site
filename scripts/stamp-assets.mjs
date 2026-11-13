#!/usr/bin/env node
/**
 * Stamp every local CSS/JS reference with a content hash: `site.css?v=ab12cd34`.
 *
 * The site is plain static files with no build step, so a browser that has
 * already cached `assets/css/site.css` will keep using it even after the file
 * changes — the URL is identical and static hosts send no cache headers. That
 * is exactly how a restyle can look like it "didn't apply": the HTML updates,
 * the stylesheet and scripts do not.
 *
 * Stamping the query with a hash of the file's own bytes makes every deploy a
 * new URL, so a changed file is always re-fetched and an unchanged one stays
 * cached. Run this after touching any CSS or JS:
 *
 *   node scripts/stamp-assets.mjs          # rewrite the ?v= stamps
 *   node scripts/stamp-assets.mjs --check  # fail if a stamp is stale
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

/** Content hash of a local asset, or null when the file does not exist. */
const hashes = new Map();
async function hashOf(relPath) {
  const clean = relPath.split('?')[0].split('#')[0];
  if (hashes.has(clean)) return hashes.get(clean);
  let hash = null;
  try {
    hash = createHash('sha1').update(await readFile(join(ROOT, clean))).digest('hex').slice(0, 8);
  } catch {
    hash = null;
  }
  hashes.set(clean, hash);
  return hash;
}

const pages = (await readdir(ROOT)).filter((name) => name.endsWith('.html'));
let stale = 0;
let stamped = 0;

for (const page of pages) {
  const file = join(ROOT, page);
  const before = await readFile(file, 'utf8');

  // Any local stylesheet or script reference, with or without an existing ?v=.
  const pattern = /(href|src)="(assets\/(?:css|js)\/[^"?#]+\.(?:css|js))(?:\?v=[^"#]*)?"/g;
  let after = '';
  let last = 0;
  for (const match of before.matchAll(pattern)) {
    const whole = match[0];
    const path = match[2];
    const hash = await hashOf(path);
    if (!hash) continue; // missing file: leave it alone, check-links reports it
    const wanted = `?v=${hash}`;
    if (!whole.includes(wanted)) {
      if (CHECK) {
        stale += 1;
        continue;
      }
      stamped += 1;
    }
    const attr = match[1];
    after += before.slice(last, match.index) + `${attr}="${path}${wanted}"`;
    last = match.index + whole.length;
  }
  after += before.slice(last);

  if (!CHECK && after !== before) await writeFile(file, after);
}

if (CHECK) {
  if (stale) {
    console.error(`${stale} stale asset stamp(s) — run: node scripts/stamp-assets.mjs`);
    process.exit(1);
  }
  console.log('asset stamps up to date');
} else {
  console.log(`${stamped} asset reference(s) stamped across ${pages.length} pages`);
}

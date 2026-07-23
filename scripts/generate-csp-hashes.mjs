// scripts/generate-csp-hashes.mjs
//
// Runs automatically after every `astro build` (see package.json's "build" script).
//
// Why this exists: our CSP removes 'unsafe-inline' from script-src for security
// (see PR that introduced this file). Some pages have inline <script> blocks that
// Astro can't extract to external files (usually because they contain per-page
// templated data), plus two shared `onload="..."` attributes used for the
// non-blocking-CSS-load trick in BaseLayout.astro/index.astro. CSP allows this
// WITHOUT 'unsafe-inline' by allow-listing the exact SHA-256 hash of each inline
// script/handler instead.
//
// Hardcoding those hashes by hand is fragile -- any future edit to any inline
// script (or any new page with its own inline script) silently invalidates the
// hash and breaks that page (the browser just blocks the script, no visible
// error to the site owner). This script removes that fragility entirely: it
// scans the REAL build output every time, computes the actual hashes that
// exist right now, and writes them into dist/_headers before deployment.
// Nothing needs to be updated by hand when scripts change.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { glob } from 'node:fs/promises';

const DIST_DIR = 'dist';
const HEADERS_PATH = `${DIST_DIR}/_headers`;
const PLACEHOLDER = '__CSP_SCRIPT_HASHES__';

function sha256Csp(text) {
  const hash = createHash('sha256').update(text, 'utf8').digest('base64');
  return `'sha256-${hash}'`;
}

async function main() {
  if (!existsSync(HEADERS_PATH)) {
    console.log('[csp-hashes] No dist/_headers found, skipping (nothing to do).');
    return;
  }

  const scriptTagRe = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")(?:\s[^>]*)?>([\s\S]*?)<\/script>/g;
  const onloadAttrRe = /\bonload="([^"]*)"/g;

  const hashes = new Set();
  let pageCount = 0;
  let scriptCount = 0;

  for await (const file of glob(`${DIST_DIR}/**/*.html`)) {
    pageCount++;
    const html = readFileSync(file, 'utf8');

    for (const match of html.matchAll(scriptTagRe)) {
      const body = match[1];
      if (body.trim().length === 0) continue; // skip genuinely empty <script></script>
      hashes.add(sha256Csp(body));
      scriptCount++;
    }
    for (const match of html.matchAll(onloadAttrRe)) {
      hashes.add(sha256Csp(match[1]));
      scriptCount++;
    }
  }

  if (hashes.size === 0) {
    console.warn('[csp-hashes] WARNING: found zero inline scripts across the whole build. ' +
      'That is unexpected (there should be at least the shared BaseLayout script) -- ' +
      'check that the placeholder replacement below is not accidentally leaving pages broken.');
  }

  const hashList = [...hashes].sort().join(' ');
  let headers = readFileSync(HEADERS_PATH, 'utf8');
  const placeholderCount = headers.split(PLACEHOLDER).length - 1;

  if (placeholderCount === 0) {
    console.error(`[csp-hashes] ERROR: no "${PLACEHOLDER}" placeholder found in ${HEADERS_PATH}. ` +
      `If the CSP in public/_headers was rewritten without the placeholder, this script can't do anything ` +
      `-- either restore the placeholder or update this script to match the new structure. Failing the build.`);
    process.exitCode = 1;
    return;
  }

  headers = headers.split(PLACEHOLDER).join(hashList);
  writeFileSync(HEADERS_PATH, headers);

  console.log(`[csp-hashes] Scanned ${pageCount} pages, found ${scriptCount} inline script/onload occurrences, ` +
    `${hashes.size} unique hashes. Replaced ${placeholderCount} placeholder(s) in ${HEADERS_PATH}.`);
}

main().catch((err) => {
  console.error('[csp-hashes] Failed:', err);
  process.exitCode = 1;
});

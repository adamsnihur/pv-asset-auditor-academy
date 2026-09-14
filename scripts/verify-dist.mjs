import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const base = '/pv-asset-auditor-academy/';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = join(directory.pathname, entry.name);
    if (entry.isDirectory()) files.push(...await walk(new URL(`${entry.name}/`, directory)));
    else files.push(absolute);
  }
  return files;
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => extname(file) === '.html');
assert.equal(htmlFiles.length, 1, `expected one course page, found ${htmlFiles.length}`);
assert.ok(htmlFiles[0].endsWith('/dist/index.html'));

const html = await readFile(new URL('index.html', dist), 'utf8');
assert.match(html, /PV Asset Auditor Academy/);
assert.doesNotMatch(html, new RegExp(['Aer', 'field'].join(''), 'i'));
assert.doesNotMatch(html, /(?:src|href)="\/assets\//);

const localReferences = [...html.matchAll(/(?:src|href)="(\/pv-asset-auditor-academy\/[^"#?]+)/g)]
  .map((match) => match[1]);
assert.ok(localReferences.length >= 10, 'expected bundled scripts, styles, fonts, and course images');

for (const reference of new Set(localReferences)) {
  const relative = reference.slice(base.length);
  await access(new URL(relative, dist));
}

console.log(`Verified standalone Pages artifact: ${files.length} files, ${new Set(localReferences).size} local references.`);

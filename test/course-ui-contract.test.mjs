import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('academy page exposes the complete learning shell and seven stage panels', async () => {
  const page = await read('src/pages/index.astro');
  assert.match(page, /PV Asset Auditor/);
  assert.match(page, /courseStages\.map/);
  assert.match(page, /data-course-stage/);
  assert.match(page, /data-quiz/);
  assert.match(page, /data-progress-ring/);
  assert.match(page, /data-certificate/);
  assert.match(page, /Zacznij naukę/);
  assert.match(page, /Podręcznik do pogłębienia wiedzy/);
  assert.match(page, /PvSystemLab/);
  assert.doesNotMatch(page, /\son[a-z]+=/i);
  assert.match(page, /data-print-certificate/);
});

test('course client persists progress, supports keyboard-safe navigation and renders quiz feedback', async () => {
  const client = await read('src/lib/course-client.mjs');
  assert.match(client, /pv-asset-auditor-academy\.progress\.v1/);
  assert.doesNotMatch(client, new RegExp(['aer', 'field'].join(''), 'i'));
  assert.match(client, /localStorage/);
  assert.match(client, /aria-current/);
  assert.match(client, /aria-live/);
  assert.match(client, /CustomEvent\('course:stage-change'/);
  assert.match(client, /prefers-reduced-motion/);
  assert.match(client, /window\.print/);
});

test('standalone shell and deployment configuration contain no external-brand coupling', async () => {
  const [page, layout, config, readme] = await Promise.all([
    read('src/pages/index.astro'),
    read('src/layouts/CourseLayout.astro'),
    read('astro.config.mjs'),
    read('README.md'),
  ]);
  const forbiddenBrand = new RegExp(['Aer', 'field'].join(''), 'i');
  assert.doesNotMatch(page, forbiddenBrand);
  assert.doesNotMatch(layout, forbiddenBrand);
  assert.doesNotMatch(config, forbiddenBrand);
  assert.match(config, /base: '\/pv-asset-auditor-academy'/);
  assert.match(readme, /samodzielnym produktem edukacyjnym/i);
});

test('course styles include responsive, print and reduced-motion modes', async () => {
  const styles = await read('src/styles/course.css');
  assert.match(styles, /@media \(max-width: 900px\)/);
  assert.match(styles, /@media print/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /\.course-shell/);
  assert.match(styles, /\.quiz-option/);
  assert.match(styles, /\.evidence-chain/);
});

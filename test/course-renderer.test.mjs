import assert from 'node:assert/strict';
import test from 'node:test';

import { renderCourseMarkdown } from '../src/lib/course-renderer.mjs';

test('course renderer supports headings, GFM tables and task lists', () => {
  const html = renderCourseMarkdown(`# Lekcja\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n- [ ] krok`);
  assert.match(html, /<h1[^>]*>Lekcja<\/h1>/);
  assert.match(html, /<table>/);
  assert.match(html, /type="checkbox"/);
});

test('course renderer typesets inline and display mathematics', () => {
  const html = renderCourseMarkdown('Moc $P=VI$.\n\n$$E=Pt$$');
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /\$P=VI\$/);
});

test('course renderer hardens external links without changing local anchors', () => {
  const html = renderCourseMarkdown('[źródło](https://example.com) i [sekcja](#modul)');
  assert.match(html, /href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="#modul"/);
});

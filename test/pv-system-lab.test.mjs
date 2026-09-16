import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { electricalGlossary, getSystemMode, systemModes } from '../src/lib/pv-system-lab.mjs';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('PV laboratory models micro and utility installations as distinct energy paths', () => {
  assert.deepEqual(systemModes.map(({ id }) => id), ['micro', 'utility']);
  assert.equal(getSystemMode('micro').powerRange, '3–50 kW');
  assert.equal(getSystemMode('utility').powerRange, '>1 MW');

  const microIds = getSystemMode('micro').components.map(({ id }) => id);
  const utilityIds = getSystemMode('utility').components.map(({ id }) => id);
  for (const id of ['sun', 'panel', 'dc-protection', 'inverter', 'ac-switchboard', 'meter', 'grid']) {
    assert.ok(microIds.includes(id), `microinstallation is missing ${id}`);
  }
  for (const id of ['sun', 'panel', 'string', 'combiner', 'inverter', 'lv-switchboard', 'transformer', 'mv-switchgear', 'poi', 'scada']) {
    assert.ok(utilityIds.includes(id), `utility installation is missing ${id}`);
  }
});

test('every clickable component teaches operation, inspection evidence and safety boundaries', () => {
  for (const mode of systemModes) {
    assert.ok(mode.flow.length >= 5);
    for (const component of mode.components) {
      assert.ok(component.title);
      assert.ok(component.role.length >= 40, `${mode.id}/${component.id} needs a plain-language role`);
      assert.ok(component.inside.length >= 2, `${mode.id}/${component.id} needs internal process steps`);
      assert.ok(component.inspect.length >= 2, `${mode.id}/${component.id} needs inspection checks`);
      assert.ok(component.safety, `${mode.id}/${component.id} needs a safety boundary`);
    }
  }
});

test('electrical glossary covers the minimum vocabulary an inspector must understand', () => {
  const terms = new Set(electricalGlossary.map(({ term }) => term));
  for (const term of [
    'Prąd', 'Napięcie', 'Rezystancja', 'Moc', 'Energia', 'DC', 'AC', 'Połączenie szeregowe',
    'Połączenie równoległe', 'String', 'MPPT', 'Falownik', 'Transformator', 'Rozdzielnica',
    'Bezpiecznik', 'Wyłącznik', 'SPD', 'RCD', 'Uziemienie', 'Rezystancja izolacji', 'Moc bierna',
    'SCADA', 'POI', 'kWp', 'kWh',
  ]) assert.ok(terms.has(term), `glossary is missing ${term}`);
});

test('academy integrates an accessible WebGL laboratory with a text fallback', async () => {
  const [page, component, client, styles] = await Promise.all([
    read('src/pages/index.astro'),
    read('src/components/PvSystemLab.astro'),
    read('src/lib/pv-system-lab-client.mjs'),
    read('src/styles/pv-system-lab.css'),
  ]);

  assert.match(page, /PvSystemLab/);
  assert.match(component, /data-pv-lab/);
  assert.match(component, /data-pv-canvas/);
  assert.match(component, /data-system-mode="micro"/);
  assert.match(component, /data-system-mode="utility"/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /role="group" aria-label={`Komponenty:/);
  assert.doesNotMatch(component, /role="listitem"/);
  assert.match(component, /Otwórz pełny słownik/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /import\('\.\.\/lib\/pv-system-lab-client\.mjs'\)/);
  assert.doesNotMatch(component, /\son[a-z]+=/i);
  assert.match(client, /Raycaster/);
  assert.match(client, /OrbitControls/);
  assert.match(client, /prefers-reduced-motion/);
  assert.match(client, /webgl-fallback/);
  assert.match(client, /PCFShadowMap/);
  assert.doesNotMatch(client, /PCFSoftShadowMap/);
  assert.match(client, /dot\.position\.copy\(curve\.getPoint\(offset\)\)/);
  assert.match(client, /disposeSceneObject/);
  assert.match(client, /resizeObserver\.disconnect\(\)/);
  assert.match(client, /visibilityObserver\.disconnect\(\)/);
  assert.match(styles, /\.academy \.pv-lab__detail h3/);
  assert.match(styles, /scroll-margin-top:/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(max-width: 720px\)/);
});

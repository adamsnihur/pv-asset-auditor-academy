import test from 'node:test';
import assert from 'node:assert/strict';
import { equipmentAnatomies, getEquipmentAnatomy } from '../src/lib/pv-equipment-anatomy.mjs';

const expectedParts = {
  switchboard: ['busbars', 'breaker', 'rcd', 'spd', 'neutral', 'earth', 'terminals'],
  mv: ['busbars', 'breaker', 'disconnector', 'earthing', 'ct', 'relay', 'cables'],
  transformer: ['core', 'lv-winding', 'mv-winding', 'insulation', 'bushings', 'cooling', 'taps'],
  inverter: ['input', 'mppt', 'dc-link', 'bridge', 'filter', 'controller', 'cooling'],
  dc: ['inputs', 'fuses', 'busbars', 'spd', 'isolator', 'monitor', 'earth'],
  metering: ['voltage', 'current', 'processor', 'registers', 'communications'],
};

test('all six geometry families expose their complete, unique part contract', () => {
  assert.deepEqual(equipmentAnatomies.map(({ id }) => id).sort(), Object.keys(expectedParts).sort());
  for (const anatomy of equipmentAnatomies) {
    assert.deepEqual(anatomy.parts.map(({ id }) => id).sort(), [...expectedParts[anatomy.id]].sort());
    for (const field of ['title', 'intro', 'principle', 'scope']) assert.ok(anatomy[field]?.trim(), `${anatomy.id}.${field}`);
    for (const part of anatomy.parts) {
      for (const field of ['name', 'role', 'mechanism', 'observation', 'misconception']) {
        assert.equal(typeof part[field], 'string');
        assert.ok(part[field].trim(), `${anatomy.id}.${part.id}.${field}`);
      }
    }
  }
});

test('process navigation only selects existing parts and covers the whole anatomy', () => {
  for (const anatomy of equipmentAnatomies) {
    const known = new Set(anatomy.parts.map(({ id }) => id));
    const visited = new Set();
    assert.ok(anatomy.process.length >= 3 && anatomy.process.length <= 5);
    for (const step of anatomy.process) {
      assert.ok(step.title && step.description && step.partIds.length);
      for (const id of step.partIds) {
        assert.ok(known.has(id), `${anatomy.id}: unknown process part ${id}`);
        visited.add(id);
      }
    }
    assert.deepEqual([...visited].sort(), [...known].sort());
  }
});

test('every anatomy includes a worked example and attributable primary source links', () => {
  const domains = ['electrical-installation.org', 'abb.com', 'sma.de', 'hitachienergy.com', 'ti.com', 'phoenixcontact.com', 'janitza.com'];
  for (const anatomy of equipmentAnatomies) {
    for (const key of ['question', 'working', 'answer']) assert.ok(anatomy.example[key]?.trim());
    assert.ok(anatomy.sources.length >= 3);
    for (const source of anatomy.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(domains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)), url.hostname);
      assert.ok(source.title.trim());
    }
  }
});

test('all scene aliases resolve in both modes while unknown components return null', () => {
  const aliases = {
    'ac-switchboard': 'switchboard', 'lv-switchboard': 'switchboard', 'mv-switchgear': 'mv',
    transformer: 'transformer', 'grid-transformer': 'transformer', inverter: 'inverter',
    'dc-protection': 'dc', combiner: 'dc', meter: 'metering', poi: 'metering',
  };
  for (const [component, family] of Object.entries(aliases)) {
    for (const mode of [undefined, 'micro', 'utility', 'unknown']) assert.equal(getEquipmentAnatomy(component, mode)?.id, family);
  }
  for (const id of ['sun', 'panel', 'grid', 'string', 'scada', 'toString', '__proto__', '', null, undefined]) {
    assert.equal(getEquipmentAnatomy(id, 'micro'), null);
  }
});

test('mode context is added without mutating the shared catalog', () => {
  const original = getEquipmentAnatomy('inverter').scope;
  assert.match(getEquipmentAnatomy('inverter', 'micro').scope, /mikroinstalacji/);
  assert.match(getEquipmentAnatomy('inverter', 'utility').scope, /Kontekst farmy/);
  assert.equal(getEquipmentAnatomy('inverter').scope, original);
});

test('worked numerical results agree with their stated physical assumptions', () => {
  const calculations = [
    ['switchboard', 10000 / (Math.sqrt(3) * 400), 14.4, 0.05, '14,4 A'],
    ['mv', 2.5 * (200 / 5), 100, 0, '100 A'],
    ['transformer', 1e6 / (Math.sqrt(3) * 800), 722, 0.5, '722 A'],
    ['transformer', 1e6 / (Math.sqrt(3) * 20000), 28.9, 0.05, '28,9 A'],
    ['inverter', 10 * 0.98, 9.8, 0.0001, '9,8 kW'],
    ['dc', 600 * (4 * 10) / 1000, 24, 0, '24 kW'],
    ['metering', (5 - 2) * 2, 6, 0, '6 kWh'],
  ];
  for (const [family, actual, expected, tolerance, label] of calculations) {
    assert.ok(Number.isFinite(actual));
    assert.ok(Math.abs(actual - expected) <= tolerance);
    assert.ok(equipmentAnatomies.find(({ id }) => id === family).example.working.includes(label), `${family}: ${label}`);
  }
});

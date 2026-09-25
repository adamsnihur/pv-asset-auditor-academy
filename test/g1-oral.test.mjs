import test from 'node:test';
import assert from 'node:assert/strict';
import { balancedOralSet, emptyOralRecord, oralVerdict, normalizeOralState, loadOralState,
  saveOralState, oralSummary, exportOralNotes, ORAL_STORAGE_KEY } from '../src/lib/g1-oral.mjs';

const bank = ['G13', 'G14', 'G15'].flatMap((lessonId) => [1, 2].map((n) => ({
  id: `${lessonId}-O${n}`, lessonId, lessonTitle: lessonId, prompt: 'Wyjaśnij przypadek', keyPoints: ['Mechanizm', 'Warunek'], critical: n === 1,
})));
const ready = (item) => ({ ...emptyOralRecord(item), answer: 'Własne uzasadnienie z obliczeniem i warunkami. '.repeat(4), revealed: true, criteria: [true, true], safe: true, evaluated: true });

test('mock oral set covers every lesson exactly once at both random boundaries', () => {
  for (const random of [() => 0, () => .99999]) {
    const ids = balancedOralSet(bank, random);
    assert.equal(ids.length, 3);
    assert.equal(new Set(ids.map((id) => id.split('-')[0])).size, 3);
    assert.ok(ids.every((id) => bank.some((item) => item.id === id)));
  }
});

test('self-assessment cannot substitute empty answers or average away critical omissions', () => {
  const item = bank[0];
  assert.equal(oralVerdict(item, ready(item)), 'self-confirmed');
  for (const change of [{ answer: 'krótko' }, { revealed: false }, { evaluated: false }])
    assert.equal(oralVerdict(item, { ...ready(item), ...change }), 'pending');
  for (const change of [{ safe: false }, { criteria: [true, false] }, { criteria: [] }])
    assert.equal(oralVerdict(item, { ...ready(item), ...change }), 'review');
  const summary = oralSummary(bank.slice(0, 2), { [item.id]: { ...ready(item), safe: false }, [bank[1].id]: ready(bank[1]) });
  assert.equal(summary.criticalReview, 1);
  assert.equal(summary.confirmed, 1);
});

test('storage only accepts known questions and complete balanced sessions', () => {
  const raw = { version: 1, records: { bad: ready(bank[0]), [bank[0].id]: { ...ready(bank[0]), criteria: ['yes', true] } }, session: { ids: [bank[0].id, bank[1].id, bank[2].id], records: {} } };
  const state = normalizeOralState(raw, bank);
  assert.equal(state.records.bad, undefined);
  assert.equal(state.records[bank[0].id].criteria[0], false);
  assert.equal(state.session, null);
  raw.session.ids = balancedOralSet(bank, () => 0);
  assert.equal(normalizeOralState(raw, bank).session.ids.length, 3);
});

test('oral notes survive round trip in their own key and export remains plain text', () => {
  const values = new Map([['pv-asset-auditor-g1:v1', 'existing']]);
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const state = normalizeOralState(null, bank);
  state.records[bank[0].id] = { ...ready(bank[0]), answer: '<img src=x onerror=alert(1)>'.repeat(5) };
  assert.equal(saveOralState(storage, state), true);
  assert.equal(values.get('pv-asset-auditor-g1:v1'), 'existing');
  assert.ok(values.has(ORAL_STORAGE_KEY));
  assert.equal(loadOralState(storage, bank).records[bank[0].id].answer, state.records[bank[0].id].answer);
  assert.match(exportOralNotes(bank, state.records, 'Trening'), /<img/);
  assert.match(exportOralNotes(bank, state.records, 'Trening'), /Nie jest wynikiem egzaminu/);
  assert.deepEqual(loadOralState({ getItem: () => '{' }, bank).records, {});
  assert.equal(saveOralState({ setItem: () => { throw Error('denied'); } }, state), false);
});

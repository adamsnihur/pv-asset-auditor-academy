import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeQuestions, canCompleteLesson, emptyGuidedState, normalizeGuidedState, isLessonUnlocked,
  loadGuidedState, saveGuidedState, exportGuidedNotes, flattenCatalogs } from '../src/lib/guided-course.mjs';

const questions = Array.from({ length: 6 }, (_, index) => ({ prompt: `Pytanie ${index}`, options: ['A', 'B'], answer: 0, critical: index === 0 }));
const lessons = ['a', 'b', 'c'].map((id) => ({ id, title: id, questions, activity: { deliverable: 'Obliczenia' } }));
const complete = () => ({ answers: [0, 0, 0, 0, 0, 0], graded: true, notes: 'Obliczenia i ograniczenia', review: [true, true, true], completed: true });

test('all critical answers plus 80% general are required independently', () => {
  assert.equal(gradeQuestions(questions, [1, 0, 0, 0, 0, 0]).passed, false);
  assert.equal(gradeQuestions(questions, [0, 1, 0, 0, 0, 0]).passed, true);
  assert.equal(gradeQuestions(questions, [0, 1, 1, 0, 0, 0]).passed, false);
  assert.equal(gradeQuestions(questions, [0, 0, 0, 0, 0]).passed, false);
  assert.equal(gradeQuestions(questions, ['0', 0, 0, 0, 0, 0]).passed, false);
  assert.equal(gradeQuestions([], []).passed, false);
});

test('quiz cannot complete a lesson without artifact and all self-review checks', () => {
  const record = complete();
  assert.equal(canCompleteLesson(lessons[0], record), true);
  for (const change of [{ notes: '  ' }, { graded: false }, { review: [true, false, true] }, { answers: [] }]) {
    assert.equal(canCompleteLesson(lessons[0], { ...record, ...change }), false);
  }
});

test('progression rejects unknown lessons and a completed descendant with missing prerequisites', () => {
  const state = normalizeGuidedState({ version: 1, current: 'c', records: { a: complete(), c: complete() } }, lessons);
  assert.equal(isLessonUnlocked(lessons, state, 'a'), true);
  assert.equal(isLessonUnlocked(lessons, state, 'b'), true);
  assert.equal(isLessonUnlocked(lessons, state, 'c'), false);
  assert.equal(isLessonUnlocked(lessons, state, 'unknown'), false);
  assert.equal(state.records.c.completed, false);
  assert.equal(state.current, 'a');
});

test('valid progress resumes by lesson and changing evidence revokes downstream completion', () => {
  const raw = { version: 1, current: 'c', records: { a: complete(), b: complete(), c: complete() } };
  assert.equal(normalizeGuidedState(raw, lessons).current, 'c');
  raw.records.a.notes = '';
  const state = normalizeGuidedState(raw, lessons);
  assert.equal(state.records.a.completed, false);
  assert.equal(state.records.b.completed, false);
  assert.equal(state.records.c.completed, false);
});

test('corrupt or unavailable browser storage falls back without throwing', () => {
  for (const raw of ['{broken', 'null', '[]', '{"version":8,"records":{}}']) {
    assert.deepEqual(loadGuidedState({ getItem: () => raw }, lessons), emptyGuidedState(lessons));
  }
  const denied = { getItem() { throw Error('denied'); }, setItem() { throw Error('quota'); } };
  assert.deepEqual(loadGuidedState(denied, lessons), emptyGuidedState(lessons));
  assert.equal(saveGuidedState(denied, emptyGuidedState(lessons)), false);
  assert.equal(saveGuidedState(null, emptyGuidedState(lessons)), false);
});

test('storage normalizes malformed answer and review values without trusting completion flag', () => {
  const state = normalizeGuidedState({ version: 1, current: 'a', records: {
    a: { ...complete(), answers: [500, '0', null], review: ['true', true, true] },
    injected: complete(),
  } }, lessons);
  assert.equal(state.records.a.completed, false);
  assert.deepEqual(state.records.a.answers, [null, null, null, null, null, null]);
  assert.equal(state.records.injected, undefined);
});

test('export preserves learner notes as plain text and states self-study limitation', () => {
  const state = { records: { a: { ...complete(), notes: '<script>learner text</script>' } } };
  const text = exportGuidedNotes(lessons, state);
  assert.match(text, /<script>learner text<\/script>/);
  assert.match(text, /Nie potwierdza kwalifikacji/);
  assert.match(text, /Obliczenia/);
});

test('catalog order stays electrical, field, mapping and missing catalogs are accepted', () => {
  assert.deepEqual(flattenCatalogs([{ id: 'mapping', lessons: [{ id: 'm' }] }, { id: 'electrical', lessons: [{ id: 'e' }] }]).map((item) => item.id), ['e', 'm']);
  assert.deepEqual(flattenCatalogs([]), []);
});

test('local save and reload preserves notes, quiz feedback and the current unlocked lesson', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const original = normalizeGuidedState({ version: 1, current: 'b', records: { a: complete(), b: { ...complete(), completed: false } } }, lessons);
  assert.equal(saveGuidedState(storage, original), true);
  assert.deepEqual(loadGuidedState(storage, lessons), original);
  assert.equal(loadGuidedState(storage, lessons).records.b.graded, true);
});

test('all-critical quizzes and all-general quizzes retain their respective gates', () => {
  const critical = questions.slice(0, 1);
  assert.equal(gradeQuestions(critical, [0]).passed, true);
  assert.equal(gradeQuestions(critical, [1]).passed, false);
  const general = questions.slice(1);
  assert.equal(gradeQuestions(general, [0, 0, 0, 0, 1]).passed, true);
  assert.equal(gradeQuestions(general, [0, 0, 0, 1, 1]).passed, false);
});

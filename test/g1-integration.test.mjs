import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gradeQuestions } from '../src/lib/guided-course.mjs';
import { GUIDED_STORAGE_KEY, loadGuidedState, saveGuidedState } from '../src/lib/guided-course.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const fragments = ['engineering', 'safety', 'governance'].map((name) => JSON.parse(read(`../src/content/g1-course/${name}.json`)));
const lessons = fragments.flatMap((fragment) => fragment.lessons);

test('G1 delivers twelve complete lessons and every critical mistake blocks progression', () => {
  assert.deepEqual(lessons.map((lesson) => lesson.id).sort(), Array.from({ length: 12 }, (_, i) => `G${String(i + 1).padStart(2, '0')}`));
  for (const lesson of lessons) {
    assert.ok(read(`../src/content/g1-course/${lesson.file}`).split(/\s+/).length >= 650, lesson.id);
    assert.equal(lesson.minutes, 25);
    assert.equal(lesson.activity.steps.reduce((sum, step) => sum + step.minutes, 0), 15);
    assert.ok(lesson.questions.length >= 4);
    const answers = lesson.questions.map((question) => question.answer);
    assert.equal(gradeQuestions(lesson.questions, answers).passed, true);
    assert.equal(gradeQuestions(lesson.questions, []).passed, false);
    lesson.questions.forEach((question, index) => {
      assert.ok(question.options[question.answer] && question.explanation);
      if (!question.critical) return;
      question.options.forEach((_, alternative) => {
        if (alternative === question.answer) return;
        const wrong = [...answers];
        wrong[index] = alternative;
        assert.equal(gradeQuestions(lesson.questions, wrong).passed, false, `${lesson.id}: ${question.prompt}`);
      });
    });
  }
});

test('coverage and source evidence resolve to delivered lessons', () => {
  const coverage = JSON.parse(read('../src/content/g1-coverage.json'));
  const ids = new Set(lessons.map((lesson) => lesson.id));
  assert.equal(coverage.requirements.length, 30);
  assert.equal(new Set(coverage.requirements.map((item) => item.id)).size, 30);
  for (const item of coverage.requirements) {
    assert.ok(item.level && item.before && item.lessons.length);
    item.lessons.forEach((id) => assert.ok(ids.has(id), id));
  }
  for (const fragment of fragments) {
    assert.ok(fragment.sources.length && fragment.claims.length);
    const sources = new Set(fragment.sources.map((source) => source.id));
    for (const claim of fragment.claims) {
      claim.source_ids.forEach((id) => assert.ok(sources.has(id), id));
      claim.lesson_ids.forEach((id) => assert.ok(ids.has(id), id));
    }
    fragment.lessons.forEach((lesson) => assert.ok(fragment.claims.some((claim) => claim.lesson_ids.includes(lesson.id)), lesson.id));
  }
});

test('G1 progress and reset remain isolated from the original learning journey', () => {
  const entries = new Map();
  const storage = { getItem: (key) => entries.get(key), setItem: (key, value) => entries.set(key, value), removeItem: (key) => entries.delete(key) };
  const base = [{ id: 'E01', questions: [{ answer: 0, options: ['a', 'b'] }] }];
  const g1 = [{ id: 'G01', questions: [{ answer: 0, options: ['a', 'b'] }] }];
  const key = 'pv-asset-auditor-g1:v1';
  const original = { version: 1, current: 'E01', records: { E01: { notes: 'Existing work', answers: [0], graded: true, review: [true, true, true], completed: true } } };
  saveGuidedState(storage, original);
  const before = storage.getItem(GUIDED_STORAGE_KEY);
  const extra = loadGuidedState(storage, g1, key);
  extra.records.G01 = { notes: 'G1 work', answers: [0], review: [false, false, false], graded: true };
  saveGuidedState(storage, extra, key);
  assert.equal(loadGuidedState(storage, g1, key).records.G01.notes, 'G1 work');
  assert.equal(storage.getItem(GUIDED_STORAGE_KEY), before);
  storage.removeItem(key);
  assert.equal(loadGuidedState(storage, base).records.E01.completed, true);
  assert.deepEqual(loadGuidedState(storage, g1, key).records, {});
});

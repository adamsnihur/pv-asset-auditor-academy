import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { flattenCatalogs, gradeQuestions } from '../src/lib/guided-course.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const catalogs = ['electrical', 'field', 'mapping'].map((group) =>
  JSON.parse(read(`src/content/field-course/${group}/catalog.json`)));
const lessons = flattenCatalogs(catalogs);
const plan = JSON.parse(read('course-plan.json'));

test('the delivered journey contains all 18 lessons with resolvable evidence and assessments', () => {
  assert.equal(lessons.length, 18);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, 18);
  assert.deepEqual(plan.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)), lessons.map((lesson) => lesson.id));
  for (const catalog of catalogs) {
    const sources = new Set(catalog.sources.map((source) => source.id));
    for (const claim of catalog.claims) {
      assert.ok(claim.source_ids.length > 0);
      assert.ok(claim.source_ids.every((id) => sources.has(id)), claim.id);
      assert.ok(claim.lesson_ids.every((id) => catalog.lessons.some((lesson) => lesson.id === id)), claim.id);
    }
    for (const lesson of catalog.lessons) {
      assert.ok(read(`src/content/field-course/${catalog.id}/${lesson.file}`).length > 1000, lesson.id);
      assert.ok(lesson.questions.length >= 3);
      assert.equal(lesson.activity.steps.reduce((sum, step) => sum + step.minutes, 0), lesson.activity.minutes);
      for (const question of lesson.questions) {
        assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
        assert.ok(question.explanation.length > 30);
      }
      const answers = lesson.questions.map((question) => question.answer);
      assert.ok(gradeQuestions(lesson.questions, answers).passed);
      lesson.questions.forEach((question, index) => {
        if (!question.critical) return;
        const incorrect = [...answers];
        incorrect[index] = (question.answer + 1) % question.options.length;
        assert.equal(gradeQuestions(lesson.questions, incorrect).passed, false, lesson.id);
      });
    }
  }
});

test('downloadable checkpoint and raster data reproduce the capstone reference results', () => {
  const points = read('public/assets/practice/m06-checkpoints.csv').trim().split('\n').slice(1).map((line) => line.split(',').slice(1).map(Number));
  const horizontal = Math.sqrt(points.reduce((sum, [x, y]) => sum + x*x + y*y, 0) / points.length);
  const vertical = Math.sqrt(points.reduce((sum, [, , z]) => sum + z*z, 0) / points.length);
  assert.ok(Math.abs(horizontal - 0.07905694) < 1e-8);
  assert.ok(Math.abs(vertical - 0.06324555) < 1e-8);
  const raster = read('public/assets/practice/m06-stockpile.asc').trim().split('\n');
  const heights = raster.slice(6).join(' ').split(/\s+/).map(Number);
  assert.equal(heights.length, 4);
  assert.equal(heights.reduce((sum, height) => sum + (height - 100) * 25, 0), 200);
  assert.ok(Math.abs(heights.reduce((sum, height) => sum + (height - 100.2) * 25, 0) - 180) < 1e-8);
});

import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  COURSE_HOURS,
  courseStages,
  quizzes,
  scoreQuiz,
  splitCourseContent,
  unlockedStageIds,
} from '../src/lib/course.mjs';

const snapshotUrl = new URL('../src/content/pv-asset-auditor.md', import.meta.url);

test('course maps the 220-hour curriculum into seven ordered stages', () => {
  assert.equal(COURSE_HOURS, 220);
  assert.deepEqual(courseStages.map(({ id }) => id), ['0', '1', '2', '3', '4', '5', '6']);
  assert.equal(courseStages.reduce((sum, stage) => sum + stage.hours, 0), COURSE_HOURS);
  assert.equal(courseStages.at(-1).kind, 'capstone');
});

test('every stage image is owned by the standalone course project', async () => {
  for (const stage of courseStages) {
    assert.match(stage.image, /^assets\/course\/[a-z0-9-]+\.webp$/);
    await access(new URL(`../public/${stage.image}`, import.meta.url));
  }
});

test('every stage has a five-question knowledge check with source-aligned thresholds', () => {
  for (const stage of courseStages) {
    const quiz = quizzes[stage.id];
    assert.ok(quiz, `missing quiz for stage ${stage.id}`);
    assert.equal(quiz.questions.length, 5);
    assert.ok(quiz.questions.every((question) => question.options.length >= 3));
    assert.ok(quiz.questions.every((question) => Number.isInteger(question.answer)));
  }
  assert.equal(quizzes['0'].passingScore, 1);
  assert.equal(quizzes['1'].passingScore, 0.8);
  assert.equal(quizzes['6'].passingScore, 0.8);
});

test('quiz scoring requires every critical safety answer and accepts 80 percent elsewhere', () => {
  const safetyAnswers = quizzes['0'].questions.map((question) => question.answer);
  assert.equal(scoreQuiz('0', safetyAnswers).passed, true);
  safetyAnswers[0] = (safetyAnswers[0] + 1) % quizzes['0'].questions[0].options.length;
  assert.equal(scoreQuiz('0', safetyAnswers).passed, false);

  const moduleAnswers = quizzes['3'].questions.map((question) => question.answer);
  moduleAnswers[0] = (moduleAnswers[0] + 1) % quizzes['3'].questions[0].options.length;
  assert.deepEqual(scoreQuiz('3', moduleAnswers), {
    correct: 4,
    total: 5,
    score: 0.8,
    passed: true,
  });
});

test('unlocking follows the curriculum order and never skips a prerequisite', () => {
  assert.deepEqual(unlockedStageIds([]), ['0']);
  assert.deepEqual(unlockedStageIds(['0']), ['0', '1']);
  assert.deepEqual(unlockedStageIds(['0', '1', '2']), ['0', '1', '2', '3']);
  assert.deepEqual(unlockedStageIds(['2', '5']), ['0']);
  assert.deepEqual(unlockedStageIds(courseStages.map(({ id }) => id)), courseStages.map(({ id }) => id));
});

test('course contains the complete standalone curriculum snapshot without external brand coupling', async () => {
  const source = await readFile(snapshotUrl, 'utf8');
  assert.ok(source.length > 100_000, 'course source is unexpectedly short');
  assert.match(source, /Granice kompetencji i bezpieczeństwa/);
  assert.match(source, /Radiometryczna termografia BSP/);
  assert.match(source, /Audyt końcowy farmy 80 MWp/);
  assert.match(source, /Źródła techniczne i naukowe/);
  assert.doesNotMatch(source, new RegExp(['Aer', 'field'].join(''), 'i'));
});

test('source content is split into orientation, five modules and the capstone without loss', async () => {
  const source = await readFile(snapshotUrl, 'utf8');
  const sections = splitCourseContent(source);
  assert.deepEqual(sections.map(({ id }) => id), courseStages.map(({ id }) => id));
  assert.match(sections[0].markdown, /Granice kompetencji i bezpieczeństwa/);
  assert.match(sections[3].markdown, /Radiometryczna termografia BSP/);
  assert.match(sections[6].markdown, /Audyt końcowy farmy 80 MWp/);
  assert.match(sections[6].markdown, /Źródła techniczne i naukowe/);
  assert.equal(sections.map(({ markdown }) => markdown).join('\n'), source.replace(/^---[\s\S]*?---\s*/, ''));
});

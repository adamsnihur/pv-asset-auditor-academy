import test from 'node:test';
import assert from 'node:assert/strict';
import {
  thermalSources, thermalTopics, thermalMissionSteps, thermalQuestions, thermalGlossary,
} from '../src/lib/thermal-content.mjs';

const nonempty = (value, label) => {
  assert.equal(typeof value, 'string', label);
  assert.ok(value.trim().length > 0, label);
};
const unique = (items, key) => assert.equal(new Set(items.map(item => item[key])).size, items.length);

test('thermal workshop covers the eight curriculum topics with substantial teaching and exercises', () => {
  assert.deepEqual(thermalTopics.map(topic => topic.id), [
    'physics', 'emissivity', 'camera', 'acquisition', 'pv', 'buildings', 'uav', 'reporting',
  ]);
  unique(thermalTopics, 'id');
  for (const topic of thermalTopics) {
    for (const key of ['kicker', 'title', 'lead']) nonempty(topic[key], `${topic.id}.${key}`);
    assert.ok(topic.paragraphs.length >= 3, `${topic.id}: paragraphs`);
    topic.paragraphs.forEach(paragraph => nonempty(paragraph, topic.id));
    const words = [topic.lead, ...topic.paragraphs].join(' ').split(/\s+/u).length;
    assert.ok(words >= 200 && words <= 300, `${topic.id}: ${words} words`);
    assert.ok(topic.takeaways.length >= 2);
    topic.takeaways.forEach(takeaway => nonempty(takeaway, topic.id));
    nonempty(topic.exercise.task, `${topic.id}: exercise`);
    nonempty(topic.exercise.answer, `${topic.id}: solution`);
  }
});

test('every topic has resolvable primary HTTPS sources with no orphan source', () => {
  unique(thermalSources, 'id');
  unique(thermalSources, 'url');
  const ids = new Set(thermalSources.map(source => source.id));
  const used = new Set();
  const officialHosts = new Set([
    'www.flir.com', 'support.flir.com', 'docs.flir.com', 'www.osha.gov', 'iea-pvps.org', 'webstore.iec.ch',
    'enterprise-insights.dji.com', 'research-hub.nlr.gov', 'www.easa.europa.eu', 'www.pansa.pl',
  ]);
  for (const source of thermalSources) {
    nonempty(source.title, source.id);
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(officialHosts.has(url.hostname), source.url);
  }
  for (const topic of thermalTopics) {
    assert.ok(topic.sourceIds.length >= 1, topic.id);
    assert.equal(new Set(topic.sourceIds).size, topic.sourceIds.length);
    for (const id of topic.sourceIds) {
      assert.ok(ids.has(id), `${topic.id}: missing ${id}`);
      used.add(id);
    }
  }
  assert.deepEqual([...used].sort(), [...ids].sort());
});

test('assessment has twelve unique questions with distinct options, valid answers and explanations', () => {
  assert.equal(thermalQuestions.length, 12);
  unique(thermalQuestions, 'id');
  unique(thermalQuestions, 'prompt');
  for (const question of thermalQuestions) {
    nonempty(question.prompt, question.id);
    assert.ok(question.options.length >= 3, question.id);
    assert.equal(new Set(question.options).size, question.options.length, question.id);
    question.options.forEach(option => nonempty(option, question.id));
    assert.ok(Number.isInteger(question.answerIndex));
    assert.ok(question.answerIndex >= 0 && question.answerIndex < question.options.length);
    nonempty(question.explanation, question.id);
    assert.ok(question.explanation.length >= 70, `${question.id}: substantive explanation`);
  }
});

test('six mission steps each produce reviewable evidence and glossary definitions are complete', () => {
  assert.equal(thermalMissionSteps.length, 6);
  unique(thermalMissionSteps, 'title');
  for (const step of thermalMissionSteps) {
    for (const key of ['title', 'body', 'evidence']) nonempty(step[key], key);
    assert.ok(step.evidence.length >= 70);
  }
  assert.ok(thermalGlossary.length >= 8);
  unique(thermalGlossary, 'term');
  for (const entry of thermalGlossary) {
    nonempty(entry.term, 'term');
    nonempty(entry.definition, entry.term);
  }
});

test('teaching retains measurement, diagnostic and flight limitations', () => {
  const contents = Object.fromEntries(thermalTopics.map(topic => [topic.id, topic.paragraphs.join(' ')]));
  assert.match(contents.physics, /nieprzezroczyste/u);
  assert.match(contents.emissivity, /Nie jest automatycznie temperaturą powietrza/u);
  assert.match(contents.camera, /Nie jest dokładnością/u);
  assert.match(contents.camera, /Nie zastępuje wzorcowania/u);
  assert.match(contents.acquisition, /nie narzuca uniwersalnego progu/u);
  assert.match(contents.pv, /Nie przeliczaj tej liczby na procent/u);
  assert.match(contents.buildings, /nie pokazuje(?: jednak)? wody bezpośrednio/u);
  assert.match(contents.uav, /wynik kalkulatora nie jest zgodą na lot/u);
  assert.match(contents.reporting, /nie gwarantuje zachowania wiarygodnej radiometrii/u);
  assert.match(contents.reporting, /nie jest certyfikatem/u);
});

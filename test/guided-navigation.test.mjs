import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeGuidedCourse } from '../src/lib/guided-course-client.mjs';
import { normalizeGuidedState } from '../src/lib/guided-course.mjs';

// A small DOM boundary fixture exercises navigation without simulating grading UI.
function fixture(mobile) {
  const lessons = ['a', 'b', 'c'].map((id) => ({
    id, title: `Lekcja ${id}`, questions: [{ answer: 0, options: ['A', 'B'] }],
  }));
  const initial = normalizeGuidedState({ version: 1, current: 'a', records: {
    a: { answers: [0], graded: true, notes: 'Wynik', review: [true, true, true], completed: true },
  } }, lessons);
  let saved = JSON.stringify(initial);
  const element = () => ({
    dataset: {}, listeners: {}, classList: { toggle() {} },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    setAttribute() {}, removeAttribute() {},
  });
  const nodes = new Map();
  const node = (selector) => {
    if (!nodes.has(selector)) nodes.set(selector, element());
    return nodes.get(selector);
  };
  node('[data-guided-data]').textContent = JSON.stringify({ lessons });
  node('[data-guided-current-link]').querySelector = node;
  const triggers = lessons.map((lesson) => {
    const button = element();
    button.dataset.lessonTrigger = lesson.id;
    button.querySelector = () => ({});
    return button;
  });
  const root = element();
  root.querySelector = node;
  root.querySelectorAll = (selector) => selector === '[data-lesson-trigger]' ? triggers : [];
  const media = element();
  media.matches = mobile;
  return {
    document: { querySelector: () => root },
    window: { matchMedia: () => media, localStorage: {
      getItem: () => saved, setItem: (_, value) => { saved = value; },
    } },
    node, media, triggers, initial, saved: () => JSON.parse(saved),
  };
}

for (const mobile of [true, false]) {
  test(`guided navigation preserves progress and adapts to ${mobile ? 'mobile' : 'desktop'}`, () => {
    const context = fixture(mobile);
    const previous = { document: globalThis.document, window: globalThis.window };
    globalThis.document = context.document;
    globalThis.window = context.window;
    try {
      initializeGuidedCourse();
      const navigation = context.node('.guided-navigation');
      const link = context.node('[data-guided-current-link]');
      assert.equal(navigation.open, !mobile);
      assert.equal(link.href, '#guided-title-a');
      assert.deepEqual(context.saved(), context.initial);
      navigation.open = true;
      context.triggers[1].listeners.click();
      assert.equal(navigation.open, !mobile);
      assert.equal(link.href, '#guided-title-b');
      assert.equal(context.node('[data-guided-current-label]').textContent, 'Lekcja b');
      assert.deepEqual(context.saved().records, context.initial.records);
      context.triggers[2].listeners.click();
      assert.equal(link.href, '#guided-title-b', 'locked lesson stays locked');
      context.media.matches = !mobile;
      context.media.listeners.change();
      assert.equal(navigation.open, mobile);
    } finally {
      globalThis.document = previous.document;
      globalThis.window = previous.window;
    }
  });
}

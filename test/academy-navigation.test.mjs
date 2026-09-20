import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeAcademyNavigation } from '../src/lib/academy-navigation.mjs';

function navigationFixture(hash = '') {
  const originalWindow = globalThis.window;
  const originalRaf = globalThis.requestAnimationFrame;
  const events = {};
  const clicks = {};
  const reference = { open: false };
  const ids = ['guided-learning', 'laboratorium-pv', 'termowizja', 'program'];
  const links = ids.map((id) => ({
    hash: `#${id}`, current: null,
    setAttribute(name, value) { if (name === 'aria-current') this.current = value; },
    removeAttribute() { this.current = null; },
  }));
  const sections = Object.fromEntries(ids.map((id, index) => [id, {
    top: 200 + index * 1000, scrolled: false,
    getBoundingClientRect() { return { top: this.top }; },
    closest: () => id === 'program' ? reference : null,
    scrollIntoView() { this.scrolled = true; },
  }]));
  sections.nauka = { closest: () => reference, scrollIntoView() { this.scrolled = true; } };
  const header = { querySelectorAll: () => links, getBoundingClientRect: () => ({ bottom: 72 }) };
  const root = {
    querySelector: () => header,
    getElementById: (id) => sections[id],
    addEventListener: (event, handler) => { clicks[event] = handler; },
  };
  globalThis.window = { location: { hash }, addEventListener: (event, handler) => { events[event] = handler; } };
  globalThis.requestAnimationFrame = (callback) => callback();
  return {
    root, links, sections, reference, events, clicks,
    restore() { globalThis.window = originalWindow; globalThis.requestAnimationFrame = originalRaf; },
  };
}

test('navigation follows section boundaries and clears current state above the lessons', () => {
  const fixture = navigationFixture();
  try {
    initializeAcademyNavigation(fixture.root);
    assert.ok(fixture.links.every((link) => link.current === null));
    fixture.sections['guided-learning'].top = -1000;
    fixture.sections['laboratorium-pv'].top = 96;
    fixture.events.scroll();
    assert.deepEqual(fixture.links.map((link) => link.current), [null, 'location', null, null]);
    fixture.sections['guided-learning'].top = 200;
    fixture.sections['laboratorium-pv'].top = 1200;
    fixture.events.scroll();
    assert.ok(fixture.links.every((link) => link.current === null));
  } finally { fixture.restore(); }
});

test('direct, clicked and history links reveal the reference library without interpreting hash markup', () => {
  const fixture = navigationFixture('#nauka');
  try {
    initializeAcademyNavigation(fixture.root);
    assert.equal(fixture.reference.open, true);
    assert.equal(fixture.sections.nauka.scrolled, true);
    fixture.reference.open = false;
    fixture.clicks.click({ target: { closest: () => ({ hash: '#program' }) } });
    assert.equal(fixture.reference.open, true);
    fixture.reference.open = false;
    globalThis.window.location.hash = '#nauka';
    fixture.events.hashchange();
    assert.equal(fixture.reference.open, true);
    for (const hash of ['#%E0%A4%A', '#%3Cimg%20src=x%20onerror=alert(1)%3E']) {
      globalThis.window.location.hash = hash;
      assert.doesNotThrow(() => fixture.events.hashchange());
    }
  } finally { fixture.restore(); }
});

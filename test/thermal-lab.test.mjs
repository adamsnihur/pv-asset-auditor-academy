import test from 'node:test';
import assert from 'node:assert/strict';
import { thermalScenes, syntheticTemperature, sceneRange, thermalColor, flightGeometry } from '../src/lib/thermal-lab.mjs';

const baseline = { distance: 30, hfov: 90, width: 600, targetCm: 30, speed: 5, integrationMs: 20 };
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
test('nadir geometry matches an analytic 90-degree field and movement fixture', () => {
  const result = flightGeometry(baseline);
  assert.equal(result.valid, true); near(result.footprint, 60); near(result.gsd, .1); near(result.pixelsAcross, 3); near(result.blurPixels, 1);
});
test('distance and native resolution affect coverage, pixels and blur consistently', () => {
  const a = flightGeometry(baseline), farther = flightGeometry({ ...baseline, distance: 60 });
  near(farther.gsd, a.gsd * 2); near(farther.pixelsAcross, a.pixelsAcross / 2);
  const finer = flightGeometry({ ...baseline, width: 1200 });
  near(finer.footprint, a.footprint); near(finer.pixelsAcross, a.pixelsAcross * 2); near(finer.blurPixels, a.blurPixels * 2);
  near(flightGeometry({ ...baseline, speed: 0 }).blurPixels, 0);
});
test('calculator rejects empty, nonnumeric, nonfinite and physically invalid input without generating results', () => {
  for (const key of Object.keys(baseline)) for (const value of [null, '', '30', NaN, Infinity, -1]) assert.equal(flightGeometry({ ...baseline, [key]: value }).valid, false);
  for (const [key, value] of [['width', 2.5], ['distance', 0], ['targetCm', 0], ['hfov', 180], ['hfov', 0]]) assert.equal(flightGeometry({ ...baseline, [key]: value }).valid, false);
});
test('synthetic fields are deterministic, finite and every comparison point is within its scale', () => {
  for (const scene of thermalScenes) {
    const [min, max] = sceneRange(scene.id);
    for (const point of [scene.target, scene.reference]) {
      const value = syntheticTemperature(scene.id, ...point);
      assert.ok(value >= min && value <= max);
      assert.equal(value, syntheticTemperature(scene.id, ...point));
    }
    assert.ok(scene.options[scene.answerIndex]); assert.ok(scene.evidence.length >= 3);
  }
});
test('palette and clipping change colors but leave original values intact', () => {
  const before = syntheticTemperature('pv', .56, .44);
  assert.notDeepEqual(thermalColor(before, 20, 80, 'iron'), thermalColor(before, 20, 80, 'gray'));
  assert.deepEqual(thermalColor(100, 20, 80), thermalColor(80, 20, 80));
  assert.deepEqual(thermalColor(-20, 20, 80), thermalColor(20, 20, 80));
  near(syntheticTemperature('pv', .56, .44), before);
  assert.throws(() => thermalColor(30, 20, 20), RangeError);
  assert.throws(() => syntheticTemperature('missing', .5, .5), RangeError);
});

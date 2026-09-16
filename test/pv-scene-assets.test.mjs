import test from 'node:test';
import assert from 'node:assert/strict';
import { createEquipment, createLandscape, layouts } from '../src/lib/pv-scene-assets.mjs';
import { systemModes } from '../src/lib/pv-system-lab.mjs';

test('every educational component has a finite scene position and clickable geometry', () => {
  for (const mode of systemModes) for (const item of mode.components) {
    assert.equal(layouts[mode.id][item.id].length, 3);
    assert.ok(layouts[mode.id][item.id].every(Number.isFinite));
    const asset = createEquipment(item, mode.id);
    let clickable = 0;
    asset.traverse((object) => {
      if (object.isMesh) {
        assert.equal(object.userData.componentId, item.id);
        clickable++;
      }
    });
    assert.ok(clickable > 0);
  }
});

test('farm cell detail is instanced and stays within a bounded draw budget', () => {
  const landscape = createLandscape('utility');
  let instances = 0, meshes = 0;
  landscape.traverse((object) => {
    if (object.isMesh) meshes++;
    if (object.isInstancedMesh) instances += object.count;
  });
  assert.ok(instances >= 1000);
  assert.ok(meshes < 400, `Expected fewer than 400 draw objects, found ${meshes}`);
});

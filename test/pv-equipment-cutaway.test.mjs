import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import { createEquipmentCutaway, setCutawayExploded, selectCutawayPart } from '../src/lib/pv-equipment-cutaway.mjs';

const fixtures = {
  switchboard: ['busbars', 'breaker', 'rcd', 'spd', 'neutral', 'earth', 'terminals'],
  mv: ['busbars', 'breaker', 'disconnector', 'earthing', 'ct', 'relay', 'cables'],
  transformer: ['core', 'lv-winding', 'mv-winding', 'insulation', 'bushings', 'cooling', 'taps'],
  inverter: ['input', 'mppt', 'dc-link', 'bridge', 'filter', 'controller', 'cooling'],
  dc: ['inputs', 'fuses', 'busbars', 'spd', 'isolator', 'monitor', 'earth'],
  metering: ['voltage', 'current', 'processor', 'registers', 'communications'],
};
const anatomy = id => ({ id, parts: fixtures[id].map(partId => ({ id: partId, name: partId })) });
function dispose(root) {
  const geometries = new Set(), materials = new Set();
  root.traverse(object => {
    if (object.isMesh) { geometries.add(object.geometry); materials.add(object.material); }
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
}
function bounds(root) {
  const result = new T.Box3().setFromObject(root);
  assert.ok([...result.min, ...result.max].every(Number.isFinite));
  assert.equal(result.isEmpty(), false); return result;
}
for (const id of Object.keys(fixtures)) {
  test(`${id}: real geometry, selectable coverage, finite bounds and bounded draw calls`, () => {
    const root = createEquipmentCutaway(anatomy(id));
    try {
      assert.deepEqual(Object.keys(root.userData.partGroups).sort(), [...fixtures[id]].sort());
      const box = bounds(root), sphere = box.getBoundingSphere(new T.Sphere());
      assert.ok(sphere.radius < 4, `${id}: radius ${sphere.radius}`);
      let draws = 0, fixedMeshes = 0;
      root.traverse(object => {
        if (!object.isMesh) return;
        draws++;
        if (!object.userData.partId) fixedMeshes++;
        const positions = object.geometry.attributes.position.array;
        assert.ok(positions.length > 0 && positions.every(Number.isFinite));
      });
      assert.ok(draws <= 220, `${id}: ${draws} draws`); assert.ok(fixedMeshes > 0);
      const owners = new Map();
      for (const [partId, group] of Object.entries(root.userData.partGroups)) {
        let count = 0;
        group.traverse(object => {
          if (!object.isMesh) return;
          count++; assert.equal(object.userData.partId, partId);
          assert.ok(!owners.has(object.material) || owners.get(object.material) === partId);
          owners.set(object.material, partId);
        });
        assert.ok(count > 0, partId);
        assert.ok(group.userData.labelPosition.isVector3);
        assert.ok(group.userData.labelPosition.toArray().every(Number.isFinite));
      }
      // First-hit raycasts from the front prove parts can actually be picked,
      // including small open contacts and exposed layers of the transformer.
      const seen = new Set(), ray = new T.Raycaster();
      for (let x = box.min.x; x <= box.max.x; x += .035) {
        for (let y = box.min.y; y <= box.max.y; y += .035) {
          ray.set(new T.Vector3(x, y, 8), new T.Vector3(0, 0, -1));
          const hit = ray.intersectObject(root, true)[0];
          if (hit?.object.userData.partId) seen.add(hit.object.userData.partId);
        }
      }
      assert.deepEqual([...seen].sort(), [...fixtures[id]].sort(), `${id}: front pickable parts`);
    } finally { dispose(root); }
  });
  test(`${id}: exploded view restores exact positions and local labels track parts`, () => {
    const root = createEquipmentCutaway(anatomy(id));
    try {
      const groups = Object.values(root.userData.partGroups);
      const original = groups.map(group => group.position.clone());
      const anchors = groups.map(group => group.localToWorld(group.userData.labelPosition.clone()));
      setCutawayExploded(root, true);
      assert.equal(root.userData.exploded, true);
      const size = bounds(root).getSize(new T.Vector3());
      assert.ok(Math.max(...size) <= 7, `${id}: exploded size ${size.toArray()}`);
      groups.forEach((group, i) => {
        assert.ok(group.position.equals(group.userData.explodedPosition));
        const offset = group.position.clone().sub(original[i]);
        const newAnchor = group.localToWorld(group.userData.labelPosition.clone());
        assert.ok(newAnchor.distanceTo(anchors[i].clone().add(offset)) < 1e-10);
      });
      setCutawayExploded(root, true);
      groups.forEach(group => assert.ok(group.position.equals(group.userData.explodedPosition)));
      setCutawayExploded(root, false); setCutawayExploded(root, false);
      assert.equal(root.userData.exploded, false);
      groups.forEach((group, i) => assert.ok(group.position.equals(original[i])));
    } finally { dispose(root); }
  });
  test(`${id}: selection is isolated and repeated selections preserve original materials`, () => {
    const root = createEquipmentCutaway(anatomy(id));
    try {
      for (let repeat = 0; repeat < 3; repeat++) for (const selected of fixtures[id]) {
        selectCutawayPart(root, selected);
        assert.equal(root.userData.selectedPartId, selected);
        for (const [partId, group] of Object.entries(root.userData.partGroups)) {
          for (const original of group.userData.materials) {
            assert.ok(original.material.color.equals(original.color));
            if (partId === selected) assert.equal(original.material.emissiveIntensity, .48);
            else {
              assert.ok(original.material.emissive.equals(original.emissive));
              assert.equal(original.material.emissiveIntensity, original.emissiveIntensity);
            }
          }
        }
      }
      selectCutawayPart(root, null);
      assert.equal(root.userData.selectedPartId, null);
      for (const group of Object.values(root.userData.partGroups)) for (const original of group.userData.materials) {
        assert.ok(original.material.emissive.equals(original.emissive));
        assert.equal(original.material.emissiveIntensity, original.emissiveIntensity);
      }
      selectCutawayPart(root, 'missing'); assert.equal(root.userData.selectedPartId, null);
    } finally { dispose(root); }
  });
}
test('unknown families fail explicitly and annotation-free fixtures remain supported', () => {
  for (const value of [undefined, { id: 'unknown' }, { id: 'constructor' }])
    assert.throws(() => createEquipmentCutaway(value), /Unknown equipment anatomy/);
  const root = createEquipmentCutaway({ id: 'switchboard', parts: [] });
  assert.equal(Object.keys(root.userData.partGroups).length, 7); dispose(root);
});

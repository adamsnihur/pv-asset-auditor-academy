import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, Vector3 } from 'three';
import { systemModes } from '../src/lib/pv-system-lab.mjs';
import { equipmentAnatomies, getEquipmentAnatomy } from '../src/lib/pv-equipment-anatomy.mjs';
import { createEquipmentCutaway, setCutawayExploded, selectCutawayPart } from '../src/lib/pv-equipment-cutaway.mjs';

test('every selectable internal part in the live curriculum resolves to real geometry', () => {
  for (const anatomy of equipmentAnatomies) {
    const group = createEquipmentCutaway(anatomy);
    assert.deepEqual(Object.keys(group.userData.partGroups).sort(), anatomy.parts.map((part) => part.id).sort());
    for (const part of anatomy.parts) {
      const node = group.userData.partGroups[part.id];
      const box = new Box3().setFromObject(node);
      assert.ok(!box.isEmpty(), `${anatomy.id}/${part.id}`);
      assert.ok(box.getSize(new Vector3()).length() > 0);
      assert.ok(node.userData.labelPosition.toArray().every(Number.isFinite));
      const anchor = node.localToWorld(node.userData.labelPosition.clone());
      const center = box.getCenter(new Vector3());
      assert.ok(Math.abs(anchor.y - center.y) < 1e-8, `${anatomy.id}/${part.id}: label must follow the actual part, including parent transforms`);
      selectCutawayPart(group, part.id);
      assert.equal(group.userData.selectedPartId, part.id);
    }
    const before = new Box3().setFromObject(group);
    setCutawayExploded(group, true); setCutawayExploded(group, false);
    const after = new Box3().setFromObject(group);
    assert.ok(before.min.distanceTo(after.min) < 1e-9);
    assert.ok(before.max.distanceTo(after.max) < 1e-9);
    group.traverse((object) => { object.geometry?.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach((material) => material?.dispose()); });
  }
});

test('both installation modes expose the intended equipment families without orphan aliases', () => {
  for (const mode of systemModes) {
    const families = new Set(mode.components.map((item) => getEquipmentAnatomy(item.id, mode.id)?.id).filter(Boolean));
    for (const id of ['switchboard', 'transformer', 'inverter', 'dc', 'metering']) assert.ok(families.has(id), `${mode.id}/${id}`);
    assert.equal(families.has('mv'), mode.id === 'utility');
  }
});

import * as T from 'three';

const mat = (color, metalness = 0, roughness = .65) => new T.MeshStandardMaterial({ color, metalness, roughness });
function block(parent, size, pos, material) {
  const mesh = new T.Mesh(new T.BoxGeometry(...size), material);
  mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function rod(parent, a, b, radius, material) {
  const start = new T.Vector3(...a), end = new T.Vector3(...b), delta = end.clone().sub(start);
  const mesh = new T.Mesh(new T.CylinderGeometry(radius, radius, delta.length(), 8), material);
  mesh.position.copy(start.add(end).multiplyScalar(.5));
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
  mesh.castShadow = true; parent.add(mesh); return mesh;
}

export function panelTable(parent, x, z, columns = 4) {
  const steel = mat(0x9ba6aa, .8, .3), cell = mat(0x102e49, .55, .19);
  const table = new T.Group(); table.position.set(x, 0, z); parent.add(table);
  const surface = new T.Group(); surface.position.y = 1.45; surface.rotation.x = .36; table.add(surface);
  const cells = new T.InstancedMesh(new T.BoxGeometry(.153, .009, .137), cell, columns * 72);
  const matrix = new T.Matrix4(); let cellIndex = 0; surface.add(cells);
  for (let c = 0; c < columns; c++) {
    const panel = new T.Group(); panel.position.x = (c - (columns - 1) / 2) * 1.08; surface.add(panel);
    block(panel, [1.04, .065, 1.85], [0, 0, 0], steel);
    block(panel, [.99, .018, 1.79], [0, .041, 0], mat(0x071323, .2, .35));
    for (let row = 0; row < 12; row++) for (let col = 0; col < 6; col++) {
      matrix.makeTranslation(panel.position.x + (col - 2.5) * .163, .054, (row - 5.5) * .147);
      cells.setMatrixAt(cellIndex++, matrix);
    }
    for (const zz of [-.55, .55]) block(panel, [1.08, .08, .06], [0, -.1, zz], steel);
  }
  for (const xx of [-(columns - 1) * .5, (columns - 1) * .5]) {
    rod(table, [xx, .05, -.62], [xx, 1.8, -.62], .045, steel);
    rod(table, [xx, .05, .62], [xx, 1.25, .62], .045, steel);
    rod(table, [xx, .15, .62], [xx, 1.65, -.62], .032, steel);
    block(table, [.34, .12, .34], [xx, .03, .62], mat(0xaaa79b));
  }
  return table;
}

export const layouts = {
  micro: { sun: [-7, 9, -7], panel: [-4, 0, 1], 'dc-protection': [.3, .8, -.7], inverter: [1.5, .8, -.7], 'ac-switchboard': [3, .8, -.7], meter: [4.2, .8, -.7], 'grid-transformer': [7, 0, -3.5], grid: [8, 0, -7] },
  utility: { sun: [-8, 10, -8], panel: [-5.5, 0, 3], string: [-5.5, 0, -.5], combiner: [-1.2, .8, 1], inverter: [1, .8, 1], 'lv-switchboard': [3.3, .8, 1], transformer: [5.5, 0, 1], 'mv-switchgear': [5.5, .8, -2], poi: [7.7, .8, -3.5], scada: [.8, 0, -4], grid: [8, 0, -7] },
};

export function createEquipment(item, mode) {
  const group = new T.Group(); group.position.set(...layouts[mode][item.id]);
  const body = mat(0xd5d9d4, .35, .36), dark = mat(0x27373c, .5, .4), metal = mat(0x879596, .75, .3);
  if (item.id === 'panel' || item.id === 'string') {
    panelTable(group, 0, 0, mode === 'micro' ? 4 : 5);
  } else if (item.id === 'sun') {
    const sun = new T.Mesh(new T.SphereGeometry(.45, 24, 16), new T.MeshBasicMaterial({ color: 0xffe4a3 })); group.add(sun);
  } else if (item.id.includes('transformer')) {
    block(group, [2.2, .18, 1.85], [0, .09, 0], mat(0xbcb7a8));
    block(group, [1.35, 1.55, 1.15], [0, .95, 0], mat(0x667a72, .45));
    for (const side of [-1, 1]) for (let i = 0; i < 10; i++) block(group, [.22, 1.1, .055], [side * .78, .9, -.48 + i * .11], metal);
    for (const xx of [-.42, 0, .42]) {
      rod(group, [xx, 1.7, 0], [xx, 2.18, 0], .055, dark);
      for (let j = 0; j < 4; j++) {
        const disc = new T.Mesh(new T.CylinderGeometry(.12, .12, .045, 12), mat(0x734c34)); disc.position.set(xx, 1.8 + j * .09, 0); group.add(disc);
      }
    }
  } else if (item.id === 'grid') {
    for (const xx of [-.6, .6]) rod(group, [xx, 0, 0], [xx * .35, 5, 0], .065, metal);
    for (let i = 0; i < 5; i++) {
      const y = i * .9; rod(group, [-.6 + y * .075, y, 0], [.6 - (y + .9) * .075, y + .9, 0], .028, metal);
    }
    rod(group, [-1.7, 4.5, 0], [1.7, 4.5, 0], .055, metal);
    for (const xx of [-1.4, 0, 1.4]) rod(group, [xx, 4.5, 0], [xx, 4.5, -7], .015, dark);
  } else if (item.id === 'scada') {
    block(group, [1.2, 1.4, .65], [0, .8, 0], body);
    rod(group, [.8, 0, 0], [.8, 4, 0], .035, metal);
    block(group, [.65, .04, .4], [.8, 3.5, 0], dark);
    rod(group, [.4, 3.9, 0], [1.2, 3.9, 0], .018, metal);
  } else {
    const inverter = item.id === 'inverter';
    const width = item.id.includes('switch') ? 1.45 : item.id === 'meter' ? .6 : 1;
    block(group, [width + .16, .15, .85], [0, -.7, 0], mat(0xaaa89d));
    block(group, [width, 1.45, .65], [0, .1, 0], body);
    block(group, [width * .92, 1.32, .025], [0, .1, .34], mat(inverter ? 0xe4e8e4 : 0xa7b5b2, .35));
    block(group, [.4, .2, .04], [-.08, .35, .38], dark);
    block(group, [.29, .08, .045], [-.08, .35, .405], new T.MeshStandardMaterial({ color: 0x6bd0b0, emissive: 0x378569, emissiveIntensity: .7 }));
    for (let i = 0; i < 9; i++) block(group, [width * .65, .023, .035], [0, -.15 - i * .04, .37], dark);
    block(group, [.035, .25, .045], [width * .37, .15, .38], dark);
    for (const xx of [-.25, .25]) rod(group, [xx, -.65, 0], [xx, -.8, .2], .026, dark);
    if (inverter) for (let i = 0; i < 12; i++) block(group, [.03, 1.2, .25], [-.44 + i * .08, .1, -.4], metal);
  }
  group.userData.componentId = item.id;
  group.traverse((object) => { if (object.isMesh) { object.userData.componentId = item.id; object.castShadow = true; object.receiveShadow = true; } });
  return group;
}

export function createLandscape(mode) {
  const group = new T.Group(), grass = mat(0x71835b), gravel = mat(0xb1ac98), steel = mat(0x677774, .5);
  block(group, [23, .35, 21], [0, -.25, -1], mat(0x655b45));
  block(group, [23, .055, 21], [0, -.045, -1], grass);
  block(group, [3.4, .04, 20], [3.2, -.005, -1], gravel);
  block(group, [11, .045, 3.5], [4, .005, 1], gravel);
  if (mode === 'utility') {
    for (const z of [-4, -7.5]) for (const x of [-6, 0]) panelTable(group, x, z, 5);
  } else {
    const house = new T.Group(); house.position.set(1.8, 0, -5); group.add(house);
    block(house, [4.6, 2.8, 3.5], [0, 1.4, 0], mat(0xe4d9c4));
    for (const side of [-1, 1]) { const roof = block(house, [2.8, .12, 4.1], [side * 1.15, 3.35, 0], mat(0x635c54)); roof.rotation.z = side * -.48; }
    for (const xx of [-1.35, 1.35]) block(house, [.95, 1, .04], [xx, 1.7, 1.78], mat(0x526d76, .4, .18));
    block(house, [.8, 1.9, .06], [0, .95, 1.78], mat(0x6c6556));
    panelTable(group, -4, -2.5, 4);
  }
  for (let i = 0; i < 15; i++) {
    const x = -11 + i * 1.55;
    rod(group, [x, 0, -10.5], [x, 1.45, -10.5], .028, steel);
    if (i < 14) for (const y of [.35, .8, 1.35]) rod(group, [x, y, -10.5], [x + 1.55, y, -10.5], .012, steel);
  }
  // Deterministic tufts give the ground texture without image downloads.
  for (let i = 0; i < 140; i++) {
    const x = Math.sin(i * 27.3) * 10.8, z = Math.cos(i * 17.1) * 9 - 1;
    if (x > 1 && x < 5) continue;
    const tuft = new T.Mesh(new T.ConeGeometry(.06, .2 + (i % 3) * .035, 3), grass);
    tuft.position.set(x, .09, z); group.add(tuft);
  }
  return group;
}

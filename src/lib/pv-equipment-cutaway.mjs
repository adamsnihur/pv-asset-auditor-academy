import * as T from 'three';

// Illustration colors distinguish functions; they are NOT a wiring color code.
const colors = { copper: 0xc78149, steel: 0x9eafb7, ivory: 0xede7d6, dark: 0x263a48,
  green: 0x276b53, teal: 0x46b5b1, gold: 0xe2b45e, red: 0xc85c50, blue: 0x567caf };
const material = (color, metalness = .15) => new T.MeshStandardMaterial({ color, metalness, roughness: .42 });
function palette() {
  return Object.fromEntries(Object.entries(colors).map(([key, color]) => [key, material(color, ['copper', 'steel'].includes(key) ? .7 : .1)]));
}
function mesh(parent, geometry, pos, mat) {
  const object = new T.Mesh(geometry, mat); object.position.set(...pos);
  object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
}
const box = (g, size, pos, mat) => mesh(g, new T.BoxGeometry(...size), pos, mat);
const cylinder = (g, radius, height, pos, mat) => mesh(g, new T.CylinderGeometry(radius, radius, height, 20), pos, mat);
function rod(g, a, b, radius, mat) {
  const start = new T.Vector3(...a), end = new T.Vector3(...b), delta = end.clone().sub(start);
  const object = cylinder(g, radius, delta.length(), start.add(end).multiplyScalar(.5).toArray(), mat);
  object.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize()); return object;
}
function ring(g, radius, tube, pos, mat, arc = Math.PI * 2) {
  return mesh(g, new T.TorusGeometry(radius, tube, 7, 28, arc), pos, mat);
}
function part(root, id, pos, explode, build) {
  const group = new T.Group(); group.name = id; group.position.set(...pos);
  group.userData.basePosition = group.position.clone();
  group.userData.explodedPosition = group.position.clone().add(new T.Vector3(...explode));
  root.add(group); root.userData.partGroups[id] = group;
  const p = palette(); build(group, p);
  const used = new Set();
  group.traverse(object => {
    if (!object.isMesh) return;
    object.userData.partId = id; used.add(object.material);
  });
  // Unused palette entries are disposed immediately; the caller owns attached assets.
  for (const mat of Object.values(p)) if (!used.has(mat)) mat.dispose();
  group.userData.materials = [...used].map(mat => ({ material: mat, color: mat.color.clone(),
    emissive: mat.emissive.clone(), emissiveIntensity: mat.emissiveIntensity }));
  // labelPosition is LOCAL to this part group; call group.localToWorld(clone()).
  group.updateWorldMatrix(true, true);
  const bounds = new T.Box3().setFromObject(group);
  group.userData.labelPosition = bounds.getCenter(new T.Vector3()).sub(group.getWorldPosition(new T.Vector3()));
  group.userData.labelPosition.z += bounds.getSize(new T.Vector3()).z / 2 + .08;
  return group;
}
function cabinet(root, width = 2.8, height = 2.8, depth = 1.05) {
  const p = palette();
  box(root, [width, .1, depth], [0, -height / 2, -.12], p.steel);
  box(root, [width, .065, depth], [0, height / 2, -.12], p.steel);
  box(root, [width, height, .04], [0, 0, -depth / 2 - .12], p.dark);
  for (const x of [-width / 2, width / 2]) {
    box(root, [.07, height, .07], [x, 0, .36], p.steel);
    box(root, [.12, .15, .55], [x * .82, -height / 2 - .09, -.08], p.dark);
  }
  for (const y of [-.7, .2, .94]) box(root, [width - .22, .08, .07], [0, y, -.38], p.steel);
  for (const [key, mat] of Object.entries(p)) if (!['steel', 'dark'].includes(key)) mat.dispose();
}
function terminals(g, p, count = 4, spacing = .2, color = 'ivory') {
  for (let i = 0; i < count; i++) {
    const x = (i - (count - 1) / 2) * spacing;
    box(g, [.15, .23, .2], [x, 0, 0], p[color]);
    const screw = cylinder(g, .037, .028, [x, .035, .12], p.steel); screw.rotation.x = Math.PI / 2;
  }
}
function busbars(g, p, width = 2.2) {
  for (let i = 0; i < 3; i++) {
    const y = (i - 1) * .17;
    box(g, [width, .065, .055], [0, y, .04], p.copper);
    for (const x of [-width * .38, width * .38]) cylinder(g, .065, .1, [x, y - .035, -.04], p.ivory);
  }
}
function breaker(g, p, count = 3) {
  for (let i = 0; i < count; i++) {
    const x = (i - (count - 1) / 2) * .26;
    box(g, [.24, .61, .3], [x, 0, 0], p.ivory);
    box(g, [.13, .15, .035], [x, .11, .17], p.dark);
    box(g, [.15, .065, .075], [x, -.08, .19], p.red);
    for (const y of [-.34, .34]) box(g, [.105, .09, .08], [x, y, .03], p.copper);
  }
  box(g, [count * .26 - .08, .04, .04], [0, -.08, .25], p.dark);
}
function board(g, p, width, height) {
  box(g, [width, height, .055], [0, 0, -.08], p.green);
  for (const x of [-width * .43, width * .43]) for (const y of [-height * .4, height * .4])
    rod(g, [x, y, -.14], [x, y, -.025], .024, p.gold);
}
function switchboard(root) {
  cabinet(root);
  part(root, 'busbars', [0, 1.02, -.13], [0, .6, .1], (g, p) => busbars(g, p));
  part(root, 'breaker', [-.74, .35, .07], [-.7, .2, .65], (g, p) => breaker(g, p));
  part(root, 'rcd', [.2, .3, .07], [.1, .15, 1.1], (g, p) => {
    box(g, [.62, .65, .12], [0, 0, -.13], p.ivory);
    ring(g, .19, .055, [0, .02, .04], p.gold);
    for (const x of [-.09, .09]) rod(g, [x, -.32, .12], [x, .32, .12], .024, p.copper);
    box(g, [.12, .09, .07], [.22, -.24, .1], p.teal);
  });
  part(root, 'spd', [.95, .3, .06], [.75, .1, .6], (g, p) => {
    for (const x of [-.13, .13]) {
      box(g, [.23, .57, .29], [x, 0, 0], p.red);
      box(g, [.1, .07, .015], [x, .14, .155], p.teal);
    }
  });
  part(root, 'neutral', [-.68, -.54, 0], [-.65, -.15, .7], (g, p) => terminals(g, p, 5, .18, 'blue'));
  part(root, 'earth', [.65, -.54, 0], [.65, -.15, .7], (g, p) => terminals(g, p, 5, .18, 'gold'));
  part(root, 'terminals', [0, -1.08, .04], [0, -.55, 1], (g, p) => terminals(g, p, 10, .22));
}
function mv(root) {
  cabinet(root, 2.9, 3, 1.25);
  part(root, 'busbars', [0, 1.15, -.14], [0, .6, .1], (g, p) => busbars(g, p, 2.3));
  part(root, 'breaker', [0, .2, 0], [0, .2, 1.2], (g, p) => {
    for (const x of [-.58, 0, .58]) {
      cylinder(g, .145, .57, [x, 0, 0], p.ivory);
      for (const y of [-.3, .3]) cylinder(g, .15, .065, [x, y, 0], p.copper);
      rod(g, [x, -.62, 0], [x, .6, 0], .046, p.steel);
    }
    box(g, [1.65, .2, .26], [0, -.56, 0], p.dark);
  });
  part(root, 'disconnector', [-.15, .8, .2], [-.55, .45, .65], (g, p) => {
    for (const x of [-.58, 0, .58]) rod(g, [x, -.1, 0], [x + .15, .16, .15], .035, p.copper);
  });
  part(root, 'earthing', [1.1, -.35, .16], [.7, -.1, .5], (g, p) => {
    rod(g, [0, -.36, 0], [0, .36, 0], .05, p.gold);
    for (const y of [-.24, 0, .24]) rod(g, [0, y, 0], [-.18, y + .15, .12], .035, p.copper);
  });
  part(root, 'ct', [0, -.7, .1], [0, -.2, 1.2], (g, p) => {
    for (const x of [-.58, 0, .58]) ring(g, .17, .065, [x, 0, 0], p.gold);
  });
  part(root, 'relay', [-1.05, .25, .28], [-.85, .1, .6], (g, p) => {
    box(g, [.43, .65, .16], [0, 0, 0], p.ivory);
    box(g, [.32, .22, .025], [0, .11, .1], p.dark);
    for (const x of [-.1, 0, .1]) box(g, [.045, .045, .025], [x, -.16, .1], p.teal);
  });
  part(root, 'cables', [0, -1.16, -.02], [0, -.65, .4], (g, p) => {
    for (const x of [-.58, 0, .58]) {
      cylinder(g, .07, .56, [x, 0, 0], p.dark);
      cylinder(g, .11, .18, [x, .22, 0], p.red);
      rod(g, [x, .25, 0], [x, .44, 0], .038, p.copper);
    }
  });
}
function transformer(root) {
  cabinet(root, 3.15, 2.7, 1.4);
  part(root, 'core', [0, -.12, -.07], [0, 0, -.45], (g, p) => {
    for (const x of [-.72, 0, .72]) box(g, [.2, 1.58, .24], [x, 0, 0], p.steel);
    for (const y of [-.8, .8]) {
      box(g, [1.86, .24, .27], [0, y, 0], p.steel);
      for (let i = 0; i < 5; i++) box(g, [1.9, .018, .285], [0, y - .09 + i * .042, 0], p.dark);
    }
  });
  // Open front sectors reveal the concentric LV/MV winding layers and iron legs.
  const windings = (id, radius, color, offset) => part(root, id, [0, -.12, -.07], offset, (g, p) => {
    for (const x of [-.72, 0, .72]) for (let i = 0; i < 11; i++) {
      const turn = ring(g, radius, .025, [x, -.52 + i * .104, 0], p[color], Math.PI * 1.56);
      turn.rotation.set(Math.PI / 2, 0, Math.PI * .72);
    }
  });
  windings('lv-winding', .195, 'copper', [-.5, .1, .85]);
  windings('mv-winding', .29, 'gold', [.55, .1, 1.25]);
  part(root, 'insulation', [0, -.12, -.07], [0, -.25, 1.8], (g, p) => {
    for (const x of [-.72, 0, .72]) for (const y of [-.63, .63]) {
      const collar = ring(g, .265, .035, [x, y, 0], p.ivory, Math.PI * 1.56);
      collar.rotation.set(Math.PI / 2, 0, Math.PI * .72);
    }
  });
  part(root, 'bushings', [0, 1.12, -.04], [0, .75, .35], (g, p) => {
    for (const x of [-.72, 0, .72]) {
      cylinder(g, .072, .56, [x, 0, 0], p.copper);
      for (let i = 0; i < 5; i++) cylinder(g, .13 - i * .009, .047, [x, -.16 + i * .075, 0], p.ivory);
    }
  });
  part(root, 'cooling', [0, -.12, -.13], [.8, -.1, -.1], (g, p) => {
    for (const side of [-1, 1]) for (let i = 0; i < 7; i++)
      box(g, [.3, 1.48, .045], [side * 1.29, 0, -.33 + i * .11], p.steel);
  });
  part(root, 'taps', [.99, .65, .37], [.7, .35, .9], (g, p) => {
    box(g, [.36, .46, .07], [0, 0, 0], p.ivory);
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * .4;
      const contact = cylinder(g, .036, .045, [Math.cos(a) * .125, Math.sin(a) * .125, .065], p.copper);
      contact.rotation.x = Math.PI / 2;
    }
    rod(g, [0, 0, .09], [.125, 0, .09], .025, p.dark);
  });
}
function inverter(root) {
  cabinet(root, 2.9, 2.8, 1.1);
  part(root, 'input', [-.9, -.98, .03], [-.65, -.45, .55], (g, p) => terminals(g, p, 3, .23));
  part(root, 'mppt', [-.77, .12, .06], [-.7, .1, .7], (g, p) => {
    board(g, p, .8, 1.15);
    for (const y of [-.27, .25]) {
      ring(g, .185, .06, [0, y, .04], p.copper);
      box(g, [.17, .17, .07], [.23, y, .03], p.dark);
    }
  });
  part(root, 'dc-link', [0, .92, .07], [0, .6, .85], (g, p) => {
    for (const x of [-.5, 0, .5]) {
      const cap = cylinder(g, .16, .46, [x, 0, 0], p.blue); cap.rotation.x = Math.PI / 2;
      const top = cylinder(g, .145, .014, [x, 0, .24], p.steel); top.rotation.x = Math.PI / 2;
      box(g, [.12, .017, .014], [x, 0, .252], p.dark);
    }
  });
  part(root, 'bridge', [.12, .11, .08], [.2, .05, 1.2], (g, p) => {
    board(g, p, .7, .85);
    for (const x of [-.17, .17]) for (const y of [-.26, 0, .26]) {
      box(g, [.2, .15, .12], [x, y, .04], p.dark);
      for (const dx of [-.04, .04]) rod(g, [x + dx, y - .08, .025], [x + dx, y - .12, -.02], .012, p.steel);
    }
  });
  part(root, 'filter', [.91, .15, .07], [.8, .05, .75], (g, p) => {
    board(g, p, .6, 1.08);
    for (const y of [-.3, 0, .3]) ring(g, .16, .056, [0, y, .055], p.gold);
  });
  part(root, 'controller', [.3, -.88, .12], [.35, -.55, 1.1], (g, p) => {
    board(g, p, 1.2, .5);
    box(g, [.26, .25, .07], [-.18, 0, 0], p.dark);
    for (let i = 0; i < 5; i++) box(g, [.085, .1, .04], [.13 + i * .09, .03, 0], p.ivory);
    box(g, [.33, .07, .035], [-.18, -.03, .045], p.teal);
  });
  part(root, 'cooling', [0, 0, -.4], [.2, 0, -.9], (g, p) => {
    box(g, [2.35, 2.2, .08], [0, 0, 0], p.steel);
    for (let i = 0; i < 14; i++) box(g, [.038, 2.14, .27], [-1.08 + i * .166, 0, -.16], p.steel);
    // Exposed edge remains selectable in the assembled cutaway.
    box(g, [.11, 2.2, .19], [1.24, 0, .07], p.steel);
  });
}
function dc(root) {
  cabinet(root, 2.7, 2.8, 1);
  part(root, 'inputs', [0, -1.1, .09], [0, -.5, .8], (g, p) => terminals(g, p, 10, .22));
  part(root, 'fuses', [-.43, -.37, .12], [-.65, -.1, .9], (g, p) => {
    for (const x of [-.6, -.3, 0, .3, .6]) {
      cylinder(g, .068, .48, [x, 0, 0], p.ivory);
      for (const y of [-.25, .25]) cylinder(g, .075, .085, [x, y, 0], p.copper);
      box(g, [.19, .68, .08], [x, 0, -.11], p.dark);
    }
  });
  part(root, 'busbars', [-.25, .34, .06], [-.25, .3, .8], (g, p) => {
    for (const y of [-.14, .14]) box(g, [1.55, .07, .055], [0, y, 0], p.copper);
  });
  part(root, 'spd', [.91, -.38, .12], [.8, -.15, .65], (g, p) => {
    box(g, [.46, .61, .28], [0, 0, 0], p.red);
    box(g, [.14, .075, .025], [0, .15, .16], p.teal);
  });
  part(root, 'isolator', [.67, .89, .13], [.7, .4, .7], (g, p) => {
    box(g, [.64, .54, .19], [0, 0, 0], p.ivory);
    const dial = cylinder(g, .19, .07, [0, 0, .15], p.gold); dial.rotation.x = Math.PI / 2;
    const handle = box(g, [.07, .29, .09], [0, 0, .21], p.red); handle.rotation.z = -.55;
  });
  part(root, 'monitor', [-.63, .95, .1], [-.65, .4, .75], (g, p) => {
    board(g, p, .82, .41);
    box(g, [.39, .22, .065], [-.12, 0, .015], p.dark);
    box(g, [.3, .065, .015], [-.12, 0, .055], p.teal);
    ring(g, .09, .027, [.26, 0, .015], p.gold);
  });
  part(root, 'earth', [.94, .26, .14], [.9, 0, .6], (g, p) => terminals(g, p, 2, .18, 'gold'));
}
function metering(root) {
  cabinet(root, 2.55, 2.8, .95);
  part(root, 'voltage', [-.73, -.54, .1], [-.75, -.15, .7], (g, p) => {
    board(g, p, .57, .8);
    for (const y of [-.25, 0, .25]) {
      box(g, [.27, .1, .09], [0, y, .03], p.ivory);
      for (const x of [-.22, .22]) rod(g, [x, y, .02], [x * .55, y, .02], .017, p.copper);
    }
  });
  part(root, 'current', [.42, -.64, .12], [.55, -.25, .9], (g, p) => {
    for (const x of [-.42, 0, .42]) {
      ring(g, .15, .052, [x, 0, 0], p.gold);
      rod(g, [x, -.32, .02], [x, .32, .02], .027, p.copper);
    }
  });
  part(root, 'processor', [-.58, .28, .1], [-.65, .2, 1], (g, p) => {
    board(g, p, .85, .7);
    box(g, [.29, .29, .08], [0, 0, .015], p.dark);
    for (let i = 0; i < 5; i++) for (const side of [-1, 1])
      box(g, [.055, .027, .022], [side * .174, -.1 + i * .05, .025], p.steel);
  });
  part(root, 'registers', [.2, 1, .18], [0, .6, .85], (g, p) => {
    box(g, [1.75, .39, .1], [0, 0, 0], p.ivory);
    box(g, [1.48, .24, .025], [0, 0, .065], p.dark);
    for (let i = 0; i < 6; i++) {
      const x = -.59 + i * .235;
      for (const y of [-.066, 0, .066]) box(g, [.11, .013, .012], [x, y, .086], p.teal);
      for (const dx of [-.06, .06]) for (const y of [-.035, .035]) box(g, [.013, .047, .012], [x + dx, y, .086], p.teal);
    }
  });
  part(root, 'communications', [.68, .26, .15], [.8, .1, .8], (g, p) => {
    board(g, p, .65, .7);
    box(g, [.3, .25, .22], [0, -.1, .055], p.steel);
    box(g, [.21, .14, .016], [0, -.1, .175], p.dark);
    for (let i = 0; i < 4; i++) box(g, [.33 - i * .055, .024, .015], [-.02, .1 + i * .055, -.04], p.gold);
  });
}
const builders = { switchboard, mv, transformer, inverter, dc, metering };

export function createEquipmentCutaway(anatomy) {
  if (!anatomy || !Object.hasOwn(builders, anatomy.id)) throw new Error(`Unknown equipment anatomy: ${anatomy?.id}`);
  const root = new T.Group(); root.name = `cutaway-${anatomy.id}`; root.position.y = 1.5;
  root.userData.partGroups = {}; root.userData.anatomyId = anatomy.id;
  root.userData.colorNote = 'Illustration colors distinguish functions; not a wiring color code.';
  builders[anatomy.id](root);
  root.userData.exploded = false; root.userData.selectedPartId = null;
  root.updateMatrixWorld(true); return root;
}
export function setCutawayExploded(root, exploded) {
  for (const group of Object.values(root.userData.partGroups))
    group.position.copy(exploded ? group.userData.explodedPosition : group.userData.basePosition);
  root.userData.exploded = Boolean(exploded); root.updateMatrixWorld(true);
}
export function selectCutawayPart(root, id) {
  for (const [partId, group] of Object.entries(root.userData.partGroups)) {
    for (const original of group.userData.materials) {
      const mat = original.material;
      mat.color.copy(original.color); mat.emissive.copy(original.emissive); mat.emissiveIntensity = original.emissiveIntensity;
      if (partId === id) { mat.emissive.setHex(0x56b8d4); mat.emissiveIntensity = .48; }
    }
  }
  root.userData.selectedPartId = Object.hasOwn(root.userData.partGroups, id) ? id : null;
}

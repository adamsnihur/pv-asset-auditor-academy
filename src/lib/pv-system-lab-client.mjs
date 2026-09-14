import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  GridHelper,
  Group,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  QuadraticBezierCurve3,
  Raycaster,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const THREE = {
  ACESFilmicToneMapping, BoxGeometry, BufferGeometry, CanvasTexture, CylinderGeometry, DirectionalLight,
  FogExp2, GridHelper, Group, HemisphereLight, Line, LineBasicMaterial, Mesh, MeshStandardMaterial,
  PCFShadowMap, PerspectiveCamera, PlaneGeometry, PointLight, QuadraticBezierCurve3, Raycaster,
  Scene, SphereGeometry, Sprite, SpriteMaterial, SRGBColorSpace, Vector2, Vector3, WebGLRenderer,
};

const flowColors = { photon: 0xffd466, dc: 0x48c5e5, ac: 0xf39b59, mv: 0xb58be4, data: 0x8ed2aa };
const kindLabels = { source: 'Źródło energii', dc: 'Tor prądu stałego', conversion: 'Konwersja DC / AC', ac: 'Tor prądu przemiennego', mv: 'Średnie napięcie', metering: 'Pomiar i granica', data: 'Dane i sterowanie', grid: 'System elektroenergetyczny' };

function makeMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: options.roughness ?? 0.48, metalness: options.metalness ?? 0.16, emissive: options.emissive ?? 0x000000, emissiveIntensity: options.emissiveIntensity ?? 0 });
}

function box(group, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position); mesh.rotation.set(...rotation); group.add(mesh); return mesh;
}

function cylinder(group, radius, height, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 20), material);
  mesh.position.set(...position); mesh.rotation.set(...rotation); group.add(mesh); return mesh;
}

function addPanel(group, offset = [0, 0, 0], scale = 1) {
  const frame = makeMaterial(0x65777c, { metalness: .65 });
  const cells = makeMaterial(0x123f5b, { metalness: .25, roughness: .24, emissive: 0x0b3350, emissiveIntensity: .25 });
  box(group, [2.2 * scale, .09 * scale, 1.25 * scale], offset, frame, [-.34, 0, 0]);
  box(group, [2.04 * scale, .035 * scale, 1.1 * scale], [offset[0], offset[1] + .055 * scale, offset[2] - .02 * scale], cells, [-.34, 0, 0]);
  for (let x = -4; x <= 4; x += 1) box(group, [.012, .022, 1.04 * scale], [offset[0] + x * .2 * scale, offset[1] + .075 * scale, offset[2] - .02], frame, [-.34, 0, 0]);
  for (let z = -2; z <= 2; z += 1) box(group, [1.96 * scale, .022, .012], [offset[0], offset[1] + .075 * scale - z * .012, offset[2] + z * .19 * scale], frame, [-.34, 0, 0]);
}

function makeAsset(item) {
  const group = new THREE.Group();
  const shell = makeMaterial(item.kind === 'dc' ? 0x2d7387 : item.kind === 'mv' ? 0x604a78 : item.kind === 'data' ? 0x39725a : 0xd9dedb, { metalness: .28 });
  const dark = makeMaterial(0x26363b, { metalness: .38 });
  const accent = makeMaterial(0xdf8c46, { emissive: 0x8a3d11, emissiveIntensity: .24 });

  if (item.id === 'sun') {
    const sun = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 18), makeMaterial(0xffc958, { emissive: 0xffa32d, emissiveIntensity: 1.5, roughness: 1 }));
    group.add(sun); group.add(new THREE.PointLight(0xffd88a, 15, 28));
  } else if (item.id === 'panel') addPanel(group);
  else if (item.id === 'string') {
    for (let index = 0; index < 3; index += 1) addPanel(group, [(index - 1) * 1.45, 0, 0], .62);
  } else if (item.id === 'transformer' || item.id === 'grid-transformer') {
    box(group, [1.35, 1.45, 1.1], [0, .1, 0], shell); cylinder(group, .16, 1.25, [-.38, .92, 0], dark); cylinder(group, .16, 1.25, [.38, .92, 0], dark); box(group, [1.65, .16, 1.28], [0, -.64, 0], dark);
  } else if (item.id === 'grid') {
    for (const x of [-.48, .48]) box(group, [.08, 2.5, .08], [x, .35, 0], dark, [0, 0, x * .18]);
    box(group, [1.55, .08, .08], [0, 1.3, 0], dark); box(group, [1.08, .07, .07], [0, .72, 0], dark);
  } else if (item.id === 'scada') {
    box(group, [1.25, .65, .85], [0, -.15, 0], shell); cylinder(group, .035, 1.7, [0, .72, 0], dark); cylinder(group, .3, .04, [0, 1.25, 0], accent, [Math.PI / 2, 0, 0]);
  } else if (item.id === 'meter') {
    box(group, [.85, 1.25, .45], [0, 0, 0], shell); box(group, [.55, .34, .03], [0, .18, .24], dark); cylinder(group, .06, .04, [0, -.32, .25], accent, [Math.PI / 2, 0, 0]);
  } else {
    const wide = item.id.includes('switchboard') || item.id === 'mv-switchgear' ? 1.5 : 1.05;
    box(group, [wide, 1.35, .82], [0, 0, 0], shell); box(group, [wide * .75, .11, .035], [0, .26, .43], dark); box(group, [wide * .75, .11, .035], [0, -.02, .43], dark); cylinder(group, .055, .035, [wide * .28, -.35, .43], accent, [Math.PI / 2, 0, 0]);
  }
  group.position.set(...item.position); group.userData.componentId = item.id;
  group.traverse((object) => { if (object.isMesh) { object.userData.componentId = item.id; object.castShadow = true; object.receiveShadow = true; } });
  return group;
}

function labelSprite(text) {
  const canvas = document.createElement('canvas'); const context = canvas.getContext('2d');
  canvas.width = 512; canvas.height = 96; context.font = '600 27px Arial'; context.textAlign = 'center';
  context.fillStyle = 'rgba(8,19,23,.82)'; context.roundRect(4, 4, 504, 84, 22); context.fill();
  context.strokeStyle = 'rgba(210,230,230,.28)'; context.stroke(); context.fillStyle = '#edf4f2'; context.fillText(text, 256, 58);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false }));
  sprite.scale.set(2.7, .5, 1); sprite.position.y = 1.55; sprite.renderOrder = 4; return sprite;
}

function replaceList(node, items, ordered = false) {
  node.replaceChildren(...items.map((text) => { const item = document.createElement('li'); item.textContent = text; return item; }));
  if (ordered) node.setAttribute('aria-label', `${items.length} kroków procesu`);
}

function disposeSceneObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      material.map?.dispose();
      material.dispose();
    });
  });
}

export function initializePvSystemLab(root = document) {
  const lab = root.querySelector('[data-pv-lab]');
  if (!lab || lab.dataset.initialized === 'true') return;
  lab.dataset.initialized = 'true';
  const viewport = lab.querySelector('[data-pv-canvas]');
  const fallback = lab.querySelector('[data-webgl-fallback].webgl-fallback');
  const dataNode = lab.querySelector('[data-pv-lab-data]');
  const { systemModes } = JSON.parse(dataNode.textContent);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mode = systemModes[0]; let selectedId = 'panel'; let renderer; let scene; let camera; let controls; let assets = [];
  let particles = []; let frame = 0; let visible = true; const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();

  function updateDetail(id, announce = true) {
    const item = mode.components.find((entry) => entry.id === id) ?? mode.components[0]; selectedId = item.id;
    lab.querySelector('[data-component-title]').textContent = item.title;
    lab.querySelector('[data-component-kind]').textContent = kindLabels[item.kind] ?? 'Element systemu';
    lab.querySelector('[data-component-role]').textContent = item.role;
    lab.querySelector('[data-component-safety]').textContent = item.safety;
    replaceList(lab.querySelector('[data-component-inside]'), item.inside, true);
    replaceList(lab.querySelector('[data-component-inspect]'), item.inspect);
    const index = mode.components.findIndex((entry) => entry.id === item.id);
    lab.querySelector('[data-component-counter]').textContent = `${String(index + 1).padStart(2, '0')} / ${String(mode.components.length).padStart(2, '0')}`;
    lab.querySelector('[data-cell-demo]').hidden = item.id !== 'panel';
    lab.querySelectorAll('[data-component-trigger]').forEach((button) => {
      const active = button.dataset.componentMode === mode.id && button.dataset.componentTrigger === item.id;
      button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active));
    });
    assets.forEach((asset) => asset.traverse((object) => {
      if (!object.isMesh || !object.material?.emissive) return;
      object.material.emissiveIntensity = asset.userData.componentId === item.id ? .52 : (object.material.emissive.getHex() ? .18 : 0);
    }));
    if (announce) lab.querySelector('[data-component-announcement]').textContent = `Wybrano: ${item.title}. ${item.role}`;
  }

  function clearScene() {
    if (!scene) return; particles = []; assets = [];
    [...scene.children].forEach((child) => {
      if (child.isLight) return;
      disposeSceneObject(child);
      scene.remove(child);
    });
  }

  function addFlow(from, to, kind) {
    const start = new THREE.Vector3(...mode.components.find((item) => item.id === from).position);
    const end = new THREE.Vector3(...mode.components.find((item) => item.id === to).position);
    const bend = new THREE.Vector3().lerpVectors(start, end, .5); bend.y += kind === 'data' ? 1.1 : .24;
    const curve = new THREE.QuadraticBezierCurve3(start, bend, end); const color = flowColors[kind];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(28)), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .38 }));
    scene.add(line);
    const count = kind === 'data' ? 2 : 4;
    for (let index = 0; index < count; index += 1) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(kind === 'photon' ? .075 : .055, 10, 8), makeMaterial(color, { emissive: color, emissiveIntensity: 1.8, roughness: .1 }));
      const offset = index / count;
      dot.position.copy(curve.getPoint(offset));
      scene.add(dot); particles.push({ dot, curve, offset, speed: kind === 'photon' ? .0012 : .00072 });
    }
  }

  function buildMode() {
    clearScene();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 13, 20, 10), new THREE.MeshStandardMaterial({ color: 0x102328, roughness: .9, metalness: 0, transparent: true, opacity: .88 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -.78; ground.receiveShadow = true; scene.add(ground);
    const grid = new THREE.GridHelper(28, 28, 0x31545c, 0x1b343a); grid.position.y = -.76; scene.add(grid);
    mode.components.forEach((item) => { const asset = makeAsset(item); asset.add(labelSprite(item.title)); assets.push(asset); scene.add(asset); });
    mode.flow.forEach((flow) => addFlow(...flow));
    camera.position.set(mode.id === 'micro' ? 1.5 : .5, 8.6, mode.id === 'micro' ? 24 : 27); controls.target.set(.4, .9, 0); controls.update();
    viewport.setAttribute('aria-label', `Interaktywny model 3D: ${mode.title}, ${mode.powerRange}`); updateDetail('panel', false);
  }

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    viewport.replaceChildren(renderer.domElement); renderer.domElement.tabIndex = 0; renderer.domElement.setAttribute('aria-label', 'Model 3D. Wybierz komponent z listy poniżej, aby nawigować klawiaturą.');
    scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x091317, .034); camera = new THREE.PerspectiveCamera(43, 1, .1, 100);
    scene.add(new THREE.HemisphereLight(0xc9eff5, 0x173017, 2.2)); const key = new THREE.DirectionalLight(0xffe3bd, 3.8); key.position.set(-6, 10, 7); key.castShadow = true; scene.add(key);
    controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = .06; controls.minDistance = 7; controls.maxDistance = 28; controls.maxPolarAngle = Math.PI * .47;
    buildMode();
  } catch {
    lab.dataset.webgl = 'unavailable'; fallback.hidden = false; lab.querySelector('[data-pv-loading]')?.setAttribute('hidden', '');
  }

  function resize() {
    if (!renderer) return; const { width, height } = viewport.getBoundingClientRect();
    renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(viewport); resize();

  function animate(time) {
    frame = requestAnimationFrame(animate); if (!renderer || !visible) return;
    if (!reducedMotion) particles.forEach(({ dot, curve, offset, speed }) => dot.position.copy(curve.getPoint((offset + time * speed) % 1)));
    controls.update(); renderer.render(scene, camera);
  }
  frame = requestAnimationFrame(animate);
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '200px' });
  visibilityObserver.observe(lab);

  renderer?.domElement.addEventListener('pointerup', (event) => {
    const rect = renderer.domElement.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(assets, true).find(({ object }) => object.userData.componentId);
    if (hit) updateDetail(hit.object.userData.componentId);
  });
  lab.querySelectorAll('[data-component-trigger]').forEach((button) => button.addEventListener('click', () => updateDetail(button.dataset.componentTrigger)));
  lab.querySelectorAll('[data-system-mode]').forEach((button) => button.addEventListener('click', () => {
    mode = systemModes.find(({ id }) => id === button.dataset.systemMode); selectedId = 'panel';
    lab.querySelectorAll('[data-system-mode]').forEach((item) => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
    lab.querySelectorAll('[data-mode-panel]').forEach((panel) => { panel.hidden = panel.dataset.modePanel !== mode.id; });
    lab.querySelector('[data-mode-title]').textContent = mode.title; lab.querySelector('[data-mode-voltage]').textContent = mode.voltage;
    if (renderer) buildMode(); else updateDetail(selectedId); lab.querySelector('[data-component-announcement]').textContent = `Tryb: ${mode.title}, ${mode.powerRange}.`;
  }));
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    controls?.dispose();
    clearScene();
    renderer?.dispose();
  }, { once: true });
}

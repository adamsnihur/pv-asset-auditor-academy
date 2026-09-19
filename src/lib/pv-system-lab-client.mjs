import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Box3,
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
import { createEquipment, createLandscape, layouts } from './pv-scene-assets.mjs';
import { createEquipmentCutaway, setCutawayExploded, selectCutawayPart } from './pv-equipment-cutaway.mjs';
import { createAnatomyController } from './pv-anatomy-client.mjs';

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

function partNumberSprite(number) {
  const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
  const context = canvas.getContext('2d');
  context.fillStyle = '#173c40'; context.beginPath(); context.arc(64, 64, 55, 0, Math.PI * 2); context.fill();
  context.strokeStyle = '#ebc99a'; context.lineWidth = 5; context.stroke();
  context.fillStyle = '#ffffff'; context.font = '600 43px Arial'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(number, 64, 66);
  const sprite = new Sprite(new SpriteMaterial({ map: new CanvasTexture(canvas), depthTest: false }));
  sprite.scale.set(.32, .32, 1); sprite.renderOrder = 10; return sprite;
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
  let particles = []; let frame = 0; let visible = true; let cameraGoal; let targetGoal;
  let paused = reducedMotion; let lastTime = 0; let elapsed = 0;
  let cutaway = null;
  const pauseButton = lab.querySelector('[data-pv-pause]');
  if (pauseButton) { pauseButton.textContent = paused ? 'Wznów przepływ' : 'Zatrzymaj przepływ'; pauseButton.setAttribute('aria-pressed', String(paused)); }
  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  const anatomyView = createAnatomyController(lab, {
    onOpen(record) {
      if (!renderer) return;
      clearScene();
      cutaway = createEquipmentCutaway(record); scene.add(cutaway); assets = [cutaway];
      record.parts.forEach((part, index) => {
        const group = cutaway.userData.partGroups[part.id];
        const label = partNumberSprite(String(index + 1).padStart(2, '0'));
        if (group.userData.labelPosition) label.position.copy(group.userData.labelPosition);
        else label.position.set(0, .25, .5);
        // Concentric windings share a center; put their numbered callouts on separate visible regions.
        const callouts = record.id === 'transformer' ? {
          core: [0, .83, 0], 'lv-winding': [-.72, .2, 0], 'mv-winding': [.72, -.15, 0],
          insulation: [0, -.65, 0], cooling: [-1.29, -.27, 0],
        } : record.id === 'inverter' ? { cooling: [1.15, -.9, .8] } : {};
        if (callouts[part.id]) label.position.add(new Vector3(...callouts[part.id]));
        label.userData.partId = part.id; group.add(label);
      });
      controls.minDistance = 2; controls.maxDistance = 30; controls.maxPolarAngle = Math.PI * .85;
      viewport.setAttribute('aria-label', `Przekrój 3D: ${record.title}. ${record.parts.length} części do wyboru z listy poniżej.`);
      frameCutaway();
    },
    onClose(id) { if (renderer) buildMode(); updateDetail(id, false); if (renderer) renderer.render(scene, camera); },
    onPart(id) { if (cutaway) { selectCutawayPart(cutaway, id); renderer.render(scene, camera); } },
    onExplode(value) { if (cutaway) { setCutawayExploded(cutaway, value); frameCutaway(); } },
  });
  anatomyView.setMode(mode);

  function frameCutaway() {
    if (!cutaway || !camera) return;
    const bounds = new Box3().setFromObject(cutaway), size = bounds.getSize(new Vector3());
    targetGoal = bounds.getCenter(new Vector3());
    const verticalFov = camera.fov * Math.PI / 180;
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const radius = size.length() / 2;
    const distance = Math.max(5, radius / Math.sin(Math.min(verticalFov, horizontalFov) / 2) * 1.08);
    cameraGoal = targetGoal.clone().add(new Vector3(.18, .15, 1).normalize().multiplyScalar(distance));
    controls.maxDistance = Math.max(30, distance * 1.6);
    // A new cutaway replaces the whole scene, so frame it immediately even in background tabs.
    camera.position.copy(cameraGoal); controls.target.copy(targetGoal); controls.update();
    renderer.render(scene, camera);
  }

  function updateDetail(id, announce = true) {
    const item = mode.components.find((entry) => entry.id === id) ?? mode.components[0]; selectedId = item.id;
    anatomyView.syncDevice(item.id);
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
    assets.forEach((asset) => { const label = asset.children.find((child) => child.isSprite); if (label) label.visible = asset.userData.componentId === item.id; });
    if (announce && camera) {
      targetGoal = new THREE.Vector3(...layouts[mode.id][item.id]).add(new THREE.Vector3(0, 1, 0));
      cameraGoal = targetGoal.clone().add(new THREE.Vector3(6, 5, 8));
      if (reducedMotion) { camera.position.copy(cameraGoal); controls.target.copy(targetGoal); }
    }
  }

  function clearScene() {
    if (!scene) return; particles = []; assets = []; cutaway = null;
    [...scene.children].forEach((child) => {
      if (child.isLight) return;
      disposeSceneObject(child);
      scene.remove(child);
    });
  }

  function addFlow(from, to, kind) {
    const start = new THREE.Vector3(...layouts[mode.id][from]);
    const end = new THREE.Vector3(...layouts[mode.id][to]);
    if (kind !== 'photon') { start.y = .25; end.y = .25; } else end.y = 1.5;
    const bend = new THREE.Vector3().lerpVectors(start, end, .5); bend.y += kind === 'data' ? 1.8 : .08;
    const curve = new THREE.QuadraticBezierCurve3(start, bend, end); const color = flowColors[kind];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .85 }));
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
    controls.minDistance = 4; controls.maxDistance = 60; controls.maxPolarAngle = Math.PI * .47;
    scene.add(createLandscape(mode.id));
    mode.components.forEach((item) => {
      const asset = createEquipment(item, mode.id); const label = labelSprite(item.title);
      label.position.y = item.id.includes('transformer') ? 2.8 : 2.3;
      label.scale.set(3.2, .6, 1); asset.add(label); assets.push(asset); scene.add(asset);
    });
    mode.flow.forEach((flow) => addFlow(...flow));
    cameraGoal = null; targetGoal = null;
    camera.position.set(17, 18, 24); controls.target.set(0, .5, -2); controls.update();
    viewport.setAttribute('aria-label', `Interaktywny model 3D: ${mode.title}, ${mode.powerRange}`); updateDetail('panel', false);
  }

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    viewport.replaceChildren(renderer.domElement); renderer.domElement.tabIndex = 0; renderer.domElement.setAttribute('aria-label', 'Model 3D. Wybierz komponent z listy poniżej, aby nawigować klawiaturą.');
    scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xb9cbd0, .008); camera = new THREE.PerspectiveCamera(43, 1, .1, 150);
    scene.add(new THREE.HemisphereLight(0xe0f2ff, 0x596646, 2));
    const key = new THREE.DirectionalLight(0xffe0ae, 3.2); key.position.set(-10, 17, 8); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, far: 60 }); key.shadow.bias = -.0004; key.shadow.normalBias = .025; scene.add(key);
    controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = .07; controls.minDistance = 4; controls.maxDistance = 60; controls.maxPolarAngle = Math.PI * .47;
    controls.addEventListener('start', () => { cameraGoal = null; targetGoal = null; });
    buildMode();
  } catch {
    renderer?.dispose(); renderer = null;
    lab.dataset.webgl = 'unavailable'; fallback.hidden = false; lab.querySelector('[data-pv-loading]')?.setAttribute('hidden', '');
  }

  function resize() {
    if (!renderer) return; const { width, height } = viewport.getBoundingClientRect();
    renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix();
    if (anatomyView.active) frameCutaway();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(viewport); resize();

  function animate(time) {
    frame = requestAnimationFrame(animate); if (!renderer || !visible) return;
    const dt = Math.min(time - lastTime, 50); lastTime = time;
    if (!paused) elapsed += dt;
    particles.forEach(({ dot, curve, offset, speed }) => dot.position.copy(curve.getPoint((offset + elapsed * speed * .25) % 1)));
    if (cameraGoal && targetGoal) { const blend = reducedMotion ? 1 : 1 - Math.exp(-dt * .004); camera.position.lerp(cameraGoal, blend); controls.target.lerp(targetGoal, blend); }
    controls.update(); renderer.render(scene, camera);
  }
  frame = requestAnimationFrame(animate);
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '200px' });
  visibilityObserver.observe(lab);

  let pointerStart;
  renderer?.domElement.addEventListener('pointerdown', (event) => { pointerStart = [event.clientX, event.clientY]; });
  renderer?.domElement.addEventListener('pointerup', (event) => {
    if (!pointerStart || Math.hypot(event.clientX - pointerStart[0], event.clientY - pointerStart[1]) > 6) return;
    const rect = renderer.domElement.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (anatomyView.active) {
      const hit = raycaster.intersectObjects(assets, true).find(({ object }) => object.userData.partId);
      if (hit) anatomyView.selectPart(hit.object.userData.partId);
      return;
    }
    const hit = raycaster.intersectObjects(assets, true).find(({ object }) => object.userData.componentId);
    if (hit) updateDetail(hit.object.userData.componentId);
  });
  lab.querySelector('[data-pv-overview]')?.addEventListener('click', () => { if (anatomyView.active) { frameCutaway(); return; } cameraGoal = new THREE.Vector3(17, 18, 24); targetGoal = new THREE.Vector3(0, .5, -2); });
  lab.querySelector('[data-pv-pause]')?.addEventListener('click', (event) => { paused = !paused; event.currentTarget.textContent = paused ? 'Wznów przepływ' : 'Zatrzymaj przepływ'; event.currentTarget.setAttribute('aria-pressed', String(paused)); });
  lab.querySelectorAll('[data-component-trigger]').forEach((button) => button.addEventListener('click', () => {
    if (anatomyView.active) {
      if (!anatomyView.open(button.dataset.componentTrigger)) { anatomyView.close(); updateDetail(button.dataset.componentTrigger); }
    } else updateDetail(button.dataset.componentTrigger);
    viewport.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' });
  }));
  lab.querySelectorAll('[data-system-mode]').forEach((button) => button.addEventListener('click', () => {
    mode = systemModes.find(({ id }) => id === button.dataset.systemMode); selectedId = 'panel';
    anatomyView.setMode(mode);
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

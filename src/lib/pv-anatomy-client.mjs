import { getEquipmentAnatomy } from './pv-equipment-anatomy.mjs';

/** DOM view independent of WebGL: all learning controls also work in fallback mode. */
export function createAnatomyController(lab, callbacks) {
  const find = (name) => lab.querySelector(`[data-anatomy-${name}]`);
  const device = find('device');
  let mode, anatomy = null, active = false, exploded = false, selectedPart = null;
  const setText = (name, text) => { find(name).textContent = text; };
  const announce = (text) => setText('status', text);

  function selectPart(id, stepIndex = null) {
    if (!anatomy) return;
    const index = anatomy.parts.findIndex((part) => part.id === id);
    if (index < 0) return;
    const part = anatomy.parts[index]; selectedPart = id;
    const number = String(index + 1).padStart(2, '0');
    setText('part-number', `Część ${number} / ${String(anatomy.parts.length).padStart(2, '0')}`);
    for (const key of ['role', 'mechanism', 'observation', 'misconception']) setText(`part-${key}`, part[key]);
    setText('part-title', part.name);
    setText('selection', `${number} · ${part.name}`);
    find('parts').querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.partId === id)));
    find('steps').querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === stepIndex)));
    const step = anatomy.process[stepIndex];
    setText('step-copy', step ? `${step.description} Elementy: ${step.partIds.map((pid) => anatomy.parts.find((p) => p.id === pid).name).join(', ')}.` : 'Wybierz etap powyżej, aby połączyć części z zasadą działania urządzenia.');
    callbacks.onPart(id);
    announce(`Wybrano część ${number}: ${part.name}. ${part.role}`);
  }

  function show(activeView) {
    active = activeView;
    find('panel').hidden = !active;
    find('controls').hidden = !active;
    find('caption').hidden = !active;
    lab.querySelector('[data-system-detail]').hidden = active;
    lab.querySelector('.pv-lab__legend').hidden = active;
    lab.querySelector('.pv-lab__scene-ui').hidden = active;
    lab.querySelector('[data-pv-pause]').hidden = active;
    lab.querySelector('[data-pv-overview]').textContent = active ? 'Wycentruj urządzenie' : 'Cała instalacja';
    find('open').textContent = active ? 'Pokaż wybrane urządzenie ↗' : 'Zajrzyj do środka ↗';
    lab.dataset.view = active ? 'anatomy' : 'installation';
  }

  function open(id = device.value) {
    const record = getEquipmentAnatomy(id, mode.id);
    if (!record) return false;
    anatomy = record; device.value = id; exploded = false;
    setText('title', record.title);
    setText('view-title', mode.components.find((item) => item.id === id)?.title ?? record.title);
    for (const key of ['intro', 'principle', 'scope']) setText(key, record[key]);
    for (const key of ['question', 'working', 'answer']) setText(key, record.example[key]);
    find('parts').replaceChildren(...record.parts.map((part, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.partId = part.id;
      const number = document.createElement('span'); number.textContent = String(i + 1).padStart(2, '0');
      button.append(number, document.createTextNode(part.name));
      button.addEventListener('click', () => selectPart(part.id)); return button;
    }));
    find('steps').replaceChildren(...record.process.map((step, i) => {
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = `${i + 1}. ${step.title}`;
      button.addEventListener('click', () => selectPart(step.partIds[0], i)); return button;
    }));
    find('sources').replaceChildren(...record.sources.map((source) => {
      const li = document.createElement('li'); const link = document.createElement('a');
      const url = new URL(source.url);
      if (url.protocol !== 'https:') throw new TypeError('Equipment sources must use HTTPS');
      link.href = url.href; link.textContent = source.title; link.target = '_blank'; link.rel = 'noopener noreferrer'; li.append(link); return li;
    }));
    find('explode').setAttribute('aria-pressed', 'false'); find('explode').textContent = 'Rozsuń części';
    show(true); callbacks.onOpen(record, id); selectPart(record.parts[0].id);
    return true;
  }

  function close() {
    if (!active) return;
    show(false); callbacks.onClose(device.value);
    announce('Wrócono do całej instalacji.');
  }

  find('open').addEventListener('click', () => {
    if (open()) lab.querySelector('[data-pv-canvas]').scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  device.addEventListener('change', () => { if (active) open(); });
  find('return').addEventListener('click', () => { close(); find('open').focus({ preventScroll: true }); });
  find('explode').addEventListener('click', () => {
    exploded = !exploded;
    find('explode').textContent = exploded ? 'Złóż części' : 'Rozsuń części';
    find('explode').setAttribute('aria-pressed', String(exploded));
    callbacks.onExplode(exploded);
    announce(exploded ? 'Części rozsunięte. Położenia służą nauce budowy, nie odwzorowują połączeń.' : 'Przywrócono przekrój urządzenia.');
  });

  return {
    get active() { return active; },
    get exploded() { return exploded; },
    get anatomy() { return anatomy; },
    get selectedPart() { return selectedPart; },
    open, close, selectPart,
    syncDevice(id) { if (getEquipmentAnatomy(id, mode.id)) device.value = id; },
    setMode(nextMode) {
      mode = nextMode; show(false); anatomy = null; selectedPart = null; exploded = false;
      device.replaceChildren(...mode.components.filter((item) => getEquipmentAnatomy(item.id, mode.id)).map((item) => {
        const option = document.createElement('option'); option.value = item.id; option.textContent = item.title; return option;
      }));
      device.value = mode.id === 'micro' ? 'ac-switchboard' : 'lv-switchboard';
    },
  };
}

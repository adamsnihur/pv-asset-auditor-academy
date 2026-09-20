import { thermalScenes, syntheticTemperature, sceneRange, thermalColor, flightGeometry } from './thermal-lab.mjs';

export function initializeThermalWorkshop(root = document) {
  const section = root.querySelector('[data-thermal-workshop]');
  if (!section || section.dataset.initialized) return;
  section.dataset.initialized = 'true';
  const find = (name) => section.querySelector(`[data-thermal-${name}]`);
  const setText = (name, text) => { find(name).textContent = text; };
  const format = (value, places = 1) => value.toLocaleString('pl-PL', { minimumFractionDigits: places, maximumFractionDigits: places });
  let scene = thermalScenes[0], selectedPoint = 'target';
  const ranges = new Map(thermalScenes.map(item => [item.id, sceneRange(item.id)]));
  const canvas = find('image'), context = canvas.getContext('2d');
  const buffer = document.createElement('canvas'); buffer.width = 160; buffer.height = 100;
  const bufferContext = buffer.getContext('2d');

  function renderField() {
    const range = find('range').value, palette = find('palette').value;
    const [min, max] = range === 'wide' ? [20, 80] : range === 'narrow' ? [35, 50] : ranges.get(scene.id);
    setText('min', `${min}°C`); setText('max', `${max}°C`);
    find('gradient').style.background = `linear-gradient(90deg, ${Array.from({ length: 11 }, (_, i) => `rgb(${thermalColor(min + (max - min) * i / 10, min, max, palette).join(',')})`).join(',')})`;
    const a = syntheticTemperature(scene.id, ...scene.target), b = syntheticTemperature(scene.id, ...scene.reference);
    setText('a', `${format(a)}°C`); setText('b', `${format(b)}°C`); setText('delta', `${format(a - b)} K`);
    const limits = ranges.get(scene.id), clipped = min > limits[0] || max < limits[1];
    setText('display-note', clipped ? 'Część wartości wypada poza skalę i ma skrajny kolor. Nasycenie barwy nie oznacza, że wszystkie te miejsca mają tę samą temperaturę.' : 'Kolory zależą od wybranej skali; dane A i B się nie zmieniają. Różnica 1 K ma taką samą wartość liczbową jak różnica 1°C.');
    canvas.setAttribute('aria-label', `${scene.label}. A: ${format(a)}°C, B: ${format(b)}°C. ${clipped ? 'Skala obcina część wartości.' : 'Skala obejmuje wartości sceny.'}`);
    if (!context || !bufferContext) return;
    const pixels = bufferContext.createImageData(buffer.width, buffer.height);
    for (let y = 0; y < buffer.height; y++) for (let x = 0; x < buffer.width; x++) {
      const offset = (y * buffer.width + x) * 4;
      const color = thermalColor(syntheticTemperature(scene.id, x / (buffer.width - 1), y / (buffer.height - 1)), min, max, palette);
      pixels.data.set([...color, 255], offset);
    }
    bufferContext.putImageData(pixels, 0, 0);
    context.imageSmoothingEnabled = true; context.drawImage(buffer, 0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(255,255,255,.28)'; context.lineWidth = 1;
    if (scene.id === 'pv') {
      for (let row = 0; row < 3; row++) for (let col = 0; col < 6; col++) {
        const x = (.08 + col * .145) * 640, y = (.13 + row * .25) * 400;
        context.strokeRect(x, y, .13 * 640, .21 * 400);
        for (let cell = 1; cell < 6; cell++) { context.beginPath(); context.moveTo(x + .13 * 640 * cell / 6, y); context.lineTo(x + .13 * 640 * cell / 6, y + .21 * 400); context.stroke(); }
      }
    } else if (scene.id === 'roof') {
      context.strokeRect(24, 24, 592, 352);
      for (let x = 95; x < 620; x += 95) { context.beginPath(); context.moveTo(x, 25); context.lineTo(x, 375); context.stroke(); }
    } else {
      context.strokeRect(35, 30, 570, 340);
      for (let x = 140; x < 600; x += 140) { context.beginPath(); context.moveTo(x, 30); context.lineTo(x, 370); context.stroke(); }
    }
  }

  function selectPoint(key) {
    selectedPoint = key;
    section.querySelectorAll('[data-thermal-point]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.thermalPoint === key)));
    setText('point-status', `Wybrano punkt ${key === 'target' ? 'A' : 'B'}: ${format(syntheticTemperature(scene.id, ...scene[key]))}°C w danych sceny.`);
  }

  function renderScene() {
    scene = thermalScenes.find(item => item.id === find('scene').value) ?? thermalScenes[0];
    for (const name of ['context', 'observation']) setText(name, scene[name]);
    setText('case-question', scene.question);
    find('evidence').replaceChildren(...scene.evidence.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    find('case-options').replaceChildren(...scene.options.map((text, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = text; button.dataset.thermalCaseAnswer = i;
      return button;
    }));
    find('case-feedback').hidden = true;
    section.querySelectorAll('[data-thermal-point]').forEach(button => {
      const point = scene[button.dataset.thermalPoint]; button.style.left = `${point[0] * 100}%`; button.style.top = `${point[1] * 100}%`;
    });
    renderField(); selectPoint(selectedPoint);
  }
  find('scene').addEventListener('change', renderScene);
  for (const name of ['palette', 'range']) find(name).addEventListener('change', renderField);
  section.querySelectorAll('[data-thermal-point]').forEach(button => button.addEventListener('click', () => selectPoint(button.dataset.thermalPoint)));
  find('case-options').addEventListener('click', event => {
    const button = event.target.closest('[data-thermal-case-answer]'); if (!button) return;
    const correct = Number(button.dataset.thermalCaseAnswer) === scene.answerIndex;
    find('case-options').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    setText('case-feedback', `${correct ? 'Trafne rozumowanie.' : 'Wróć do granicy między obserwacją a diagnozą.'} ${scene.explanation}`);
    find('case-feedback').hidden = false;
  });
  renderScene();

  const flightForm = find('flight-form');
  function calculate() {
    const input = Object.fromEntries(['distance', 'hfov', 'width', 'targetCm', 'speed', 'integrationMs'].map(key => [key, flightForm.elements.namedItem(key).valueAsNumber]));
    const result = flightGeometry(input), valid = result.valid && flightForm.checkValidity();
    find('flight-error').hidden = valid; find('flight-result').hidden = !valid;
    if (!valid) { setText('flight-error', result.error ?? 'Wpisz wartości w zakresach pól. Wyczyść błędny zapis i przelicz ponownie.'); return; }
    setText('footprint', `${format(result.footprint, 2)} m`); setText('gsd', `${format(result.gsd * 100, 2)} cm/px`);
    setText('pixels', `${format(result.pixelsAcross, 2)} px`); setText('blur', `${format(result.blurPixels, 2)} px`);
    setText('flight-interpretation', `Szczegół zajmuje około ${format(result.pixelsAcross, 1)} piksela na szerokości. W czasie integracji obraz przemieszcza się o ${format(result.blurPixels, 2)} piksela. Porównaj wynik z wymaganiami sensora i metody; nie jest to ocena gotowości do pomiaru ani lotu.`);
  }
  flightForm.addEventListener('submit', event => { event.preventDefault(); calculate(); });
  flightForm.addEventListener('input', calculate); calculate();

  const { thermalQuestions } = JSON.parse(find('data').textContent), quiz = find('quiz');
  quiz.addEventListener('submit', event => {
    event.preventDefault(); let correct = 0;
    for (const question of thermalQuestions) {
      const choice = quiz.querySelector(`input[name="thermal-${question.id}"]:checked`);
      const matches = choice && Number(choice.value) === question.answerIndex;
      if (matches) correct++;
      const feedback = quiz.querySelector(`[data-thermal-question-feedback="${question.id}"]`);
      feedback.textContent = `${matches ? 'Poprawnie.' : 'Sprawdź rozumowanie.'} ${question.explanation}`; feedback.hidden = false;
    }
    setText('quiz-result', `Wynik: ${correct} / ${thermalQuestions.length}. Przeczytaj objaśnienia przy pytaniach. To sprawdzian wiedzy, nie potwierdzenie kwalifikacji.`);
  });
  quiz.addEventListener('change', () => { setText('quiz-result', 'Odpowiedź zmieniona. Sprawdź ponownie, aby zobaczyć aktualny wynik.'); quiz.querySelectorAll('[data-thermal-question-feedback]').forEach(item => { item.hidden = true; }); });
}

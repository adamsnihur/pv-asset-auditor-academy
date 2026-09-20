// Synthetic teaching fields. These values are not radiometric camera data.
export const thermalScenes = [
  {
    id: 'pv', title: 'PV · lokalna anomalia', label: 'Syntetyczna instalacja PV w widoku z góry',
    context: 'Jedno miejsce ma wyższą wartość niż porównywalny fragment sąsiedniego modułu. Nie znamy obciążenia, napromienienia ani historii instalacji.',
    target: [.56, .44], reference: [.25, .44],
    observation: 'Zapisz lokalizację A i porównanie z B. Sam kształt ani różnica temperatur nie rozstrzygają o uszkodzeniu ogniwa, diody czy połączenia.',
    question: 'Co powinno trafić do pierwszego wniosku?',
    options: ['Ogniwo jest uszkodzone i wymaga wymiany.', 'Zaobserwowano lokalną anomalię; trzeba zweryfikować warunki, RGB i dane elektryczne.', 'Kolor czerwony oznacza bezpośrednie zagrożenie pożarem.'],
    answerIndex: 1,
    explanation: 'Obserwacja to początek weryfikacji. Zestaw ją z RGB, obciążeniem i warunkami; potwierdzenie przyczyny należy do właściwej osoby i metody.',
    evidence: ['Identyfikator modułu i para plików RGB/IR', 'Czas, warunki i stan pracy', 'Porównywalny obszar odniesienia', 'Następne badanie uzgodnione z O&M'],
  },
  {
    id: 'reflection', title: 'Metal · odbicie czy nagrzanie?', label: 'Syntetyczna powierzchnia metalowa z jasną plamą',
    context: 'Jasny fragment metalowej osłony może zawierać znaczny udział promieniowania odbitego. Wartość sceny reprezentuje odczyt pozorny, nie potwierdzoną temperaturę metalu.',
    target: [.61, .4], reference: [.29, .59],
    observation: 'Niska emisyjność zwiększa znaczenie odbić. Porównanie bez kontroli kąta i otoczenia może prowadzić do fałszywego alarmu.',
    question: 'Jak odróżnić hipotezę odbicia od nagrzania?',
    options: ['Zmienić paletę na czarno-białą i uznać jaśniejsze miejsce za uszkodzenie.', 'Wpisać emisyjność 1, aby wyeliminować odbicia.', 'Porównać bezpiecznie pozyskane ujęcia z innego kąta oraz kontekst powierzchni i otoczenia.'],
    answerIndex: 2,
    explanation: 'Zmiana obrazu wraz z geometrią jest wskazówką, którą łączy się z innymi dowodami. Sama zmiana ustawienia emisyjności nie usuwa fizycznego odbicia.',
    evidence: ['Materiał i stan powierzchni', 'Geometria obserwacji i możliwe źródła odbić', 'Porównanie ujęć przy zachowaniu bezpiecznego dostępu', 'Jawne ograniczenie wiarygodności temperatury'],
  },
  {
    id: 'roof', title: 'Dach · rozległa różnica', label: 'Syntetyczny dach płaski z obszarem o innym przebiegu cieplnym',
    context: 'Rozległy obszar różni się od sąsiedniej części dachu. Nie mamy informacji o warstwach, wcześniejszym deszczu, zacienieniu i przebiegu chłodzenia.',
    target: [.58, .58], reference: [.23, .58],
    observation: 'Termowizja pokazuje efekt na powierzchni. Wilgoć, różne materiały, naprawy i warunki mogą tworzyć podobne wzory; kamera nie ogląda wody pod pokryciem.',
    question: 'Jak opisać ten obszar w raporcie?',
    options: ['Obszar o odmiennej odpowiedzi cieplnej; przyczyna i zasięg wilgoci wymagają weryfikacji.', 'Potwierdzony przeciek dokładnie pod najjaśniejszym pikselem.', 'Każdy cieplejszy obszar jest mokry, niezależnie od pory badania.'],
    answerIndex: 0,
    explanation: 'Wzór termiczny jest pośrednią przesłanką. Potrzebne są informacje o dachu, warunkach i badanie potwierdzające uzgodnione ze specjalistą.',
    evidence: ['Warstwy dachu i znane naprawy', 'Pogoda i historia nagrzewania/chłodzenia', 'Obszar porównawczy o tej samej konstrukcji', 'Oględziny lub inna metoda potwierdzająca'],
  },
];

export function syntheticTemperature(sceneId, x, y) {
  if (![x, y].every(Number.isFinite) || x < 0 || x > 1 || y < 0 || y > 1) throw new RangeError('Point outside field');
  const bump = (cx, cy, sx, sy) => Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
  if (sceneId === 'pv') {
    const column = Math.floor((x - .08) / .145), row = Math.floor((y - .13) / .25);
    const onModule = column >= 0 && column < 6 && row >= 0 && row < 3 && (x - .08) % .145 < .13 && (y - .13) % .25 < .21;
    return onModule ? 42 + 1.2 * y + 17 * bump(.56, .44, .028, .045) : 28 + 2 * y;
  }
  if (sceneId === 'reflection') return 31 + y + 25 * bump(.61, .4, .11, .18) - 6 * bump(.18, .22, .15, .1);
  if (sceneId === 'roof') return 37 + 1.5 * x + 6 * bump(.58, .58, .18, .19) - 3 * bump(.78, .2, .11, .1);
  throw new RangeError('Unknown thermal scene');
}

export function sceneRange(id) {
  let min = Infinity, max = -Infinity;
  for (let y = 0; y < 100; y++) for (let x = 0; x < 160; x++) {
    const t = syntheticTemperature(id, x / 159, y / 99); min = Math.min(min, t); max = Math.max(max, t);
  }
  return [Math.floor(min), Math.ceil(max)];
}

const palettes = {
  iron: [[13, 9, 34], [67, 19, 107], [163, 38, 102], [235, 93, 46], [252, 182, 57], [255, 248, 201]],
  gray: [[12, 18, 24], [250, 250, 245]],
  ice: [[8, 23, 64], [21, 114, 165], [101, 207, 210], [246, 223, 105], [210, 50, 35]],
};

export function thermalColor(value, min, max, palette = 'iron') {
  if (![value, min, max].every(Number.isFinite) || max <= min || !palettes[palette]) throw new RangeError('Invalid display scale');
  const stops = palettes[palette], position = Math.max(0, Math.min(1, (value - min) / (max - min))) * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(position)), mix = position - index;
  return stops[index].map((channel, i) => Math.round(channel + (stops[index + 1][i] - channel) * mix));
}

/** Flat plane, rectilinear lens, nadir optical axis, square pixels, uniform translation. */
export function flightGeometry({ distance, hfov, width, targetCm, speed, integrationMs }) {
  const values = [distance, hfov, width, targetCm, speed, integrationMs];
  if (!values.every((v) => typeof v === 'number' && Number.isFinite(v)) || distance <= 0 || hfov <= 0 || hfov >= 180 || !Number.isInteger(width) || width <= 0 || targetCm <= 0 || speed < 0 || integrationMs < 0) {
    return { valid: false, error: 'Podaj dodatnią odległość, rozmiar celu i liczbę pikseli oraz HFOV między 0° a 180°. Prędkość i czas nie mogą być ujemne.' };
  }
  const footprint = 2 * distance * Math.tan(hfov * Math.PI / 360);
  const gsd = footprint / width;
  const pixelsAcross = targetCm / 100 / gsd;
  const blurPixels = speed * integrationMs / 1000 / gsd;
  if (![footprint, gsd, pixelsAcross, blurPixels].every(Number.isFinite) || gsd <= 0) return { valid: false, error: 'Wartości wykraczają poza zakres modelu obliczeniowego.' };
  return { valid: true, footprint, gsd, pixelsAcross, blurPixels };
}

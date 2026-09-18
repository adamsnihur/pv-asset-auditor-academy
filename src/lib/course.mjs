export const COURSE_HOURS = 220;

export const courseStages = [
  {
    id: '0', eyebrow: 'Fundament', title: 'Bezpieczeństwo i metrologia', hours: 18,
    level: 'Podstawowy', kind: 'module', image: 'assets/course/safety-boundaries.webp',
    summary: 'Granice kompetencji, JSA, LOTO, źródła dowodów i niepewność pomiaru.',
    outcomes: ['Rozpoznasz granice kompetencji audytora', 'Zbudujesz bezpieczny plan pracy', 'Odróżnisz wymaganie, rekomendację i założenie'],
  },
  {
    id: '1', eyebrow: 'Moduł 1', title: 'Fizyka ogniwa i degradacja', hours: 42,
    level: 'Podstawowy+', kind: 'module', image: 'assets/course/pv-module-rgb.webp',
    summary: 'Od złącza i modelu diodowego do LID, LeTID, PID, pęknięć i korozji.',
    outcomes: ['Zinterpretujesz cechy krzywej I-V', 'Rozdzielisz mechanizmy degradacji', 'Zbudujesz hipotezy różnicowe'],
  },
  {
    id: '2', eyebrow: 'Moduł 2', title: 'Architektura farmy i SCADA', hours: 40,
    level: 'Średniozaawansowany', kind: 'module', image: 'assets/course/pv-farm-overview.webp',
    summary: 'Topologia DC/AC, MPPT, PR, dostępność, jakość danych i loss tree.',
    outcomes: ['Odtworzysz mapę assetów', 'Rozdzielisz clipping i curtailment', 'Zbudujesz loss tree bez overlap'],
  },
  {
    id: '3', eyebrow: 'Moduł 3', title: 'Termografia radiometryczna BSP', hours: 64,
    level: 'Zaawansowany', kind: 'module', image: 'assets/course/pv-module-thermal.webp',
    summary: 'Radiancja, geometria, GSD, blur, warunki misji, QA i walidacja AI.',
    outcomes: ['Zaprojektujesz geometrię nalotu', 'Odrzucisz odbicia i nieważne klatki', 'Połączysz IR, RGB, SCADA i human QA'],
  },
  {
    id: '4', eyebrow: 'Moduł 4', title: 'Diagnostyka naziemna', hours: 38,
    level: 'Zaawansowany', kind: 'module', image: 'assets/course/pv-field-operations.webp',
    summary: 'I-V, EL/PL, izolacja i bezpieczne potwierdzanie obserwacji termicznych.',
    outcomes: ['Wyjaśnisz kryteria wiarygodnego pomiaru I-V', 'Dobierzesz EL/PL i próbę izolacji', 'Potwierdzisz lub odrzucisz hipotezę IR'],
  },
  {
    id: '5', eyebrow: 'Moduł 5', title: 'TDD i ekonomika aktywa', hours: 18,
    level: 'Ekspercki', kind: 'module', image: 'assets/course/pv-risk-analysis.webp',
    summary: 'Data room, konstrukcje, gwarancje, odzyskiwalna energia, NPV i decyzja.',
    outcomes: ['Zbudujesz finding gotowy do decyzji', 'Policzysz NPV ze scenariuszami', 'Rozdzielisz ryzyko safety od wartości energii'],
  },
  {
    id: '6', eyebrow: 'Audyt końcowy', title: 'Capstone: farma 80 MWp', hours: 0,
    level: 'Ekspercki', kind: 'capstone', image: 'assets/course/hero.webp',
    summary: 'Pełna synteza dowodów: loss tree, misja BSP, ground truth, ryzyko i NPV.',
    outcomes: ['Obronisz kompletny łańcuch dowodowy', 'Ustalisz priorytety S0-S4', 'Przygotujesz claims-ready evidence pack'],
  },
];

const question = (prompt, options, answer, explanation) => ({ prompt, options, answer, explanation });

export const quizzes = {
  '0': {
    passingScore: 1,
    questions: [
      question('Co samodzielnie dowodzi pojedynczy termogram?', ['Przyczyny usterki', 'Straty energii', 'Rozkładu sygnału IR i temperatury oszacowanej z modelu', 'Zgodności gwarancyjnej'], 2, 'Detektor rejestruje sygnał IR; temperatura jest wynikiem modelu z założonymi parametrami. Przyczyna i strata wymagają dalszych dowodów.'),
      question('Kto może pracować przy obwodach DC 1500 V i stacjach SN/WN?', ['Każdy pilot BSP', 'Kompetentny personel według zatwierdzonej instrukcji', 'Audytor po przeczytaniu podręcznika', 'Operator kamery termicznej'], 1, 'Materiał szkoleniowy nie zastępuje kwalifikacji, LOTO ani instrukcji organizacji bezpiecznej pracy.'),
      question('Co oznacza etykieta [A]?', ['Akt prawny', 'Aktualną normę', 'Założenie projektowe lub syntetyczne', 'Automatyczny wynik'], 2, '[A] identyfikuje założenie użyte do obliczenia lub przygotowania misji.'),
      question('Jaki próg dotyczy pozycji krytycznych w bramce Safety?', ['80%', '90%', '95%', '100%'], 3, 'Każda pozycja krytyczna musi być poprawna, a wynik całościowy wynosić co najmniej 90%.'),
      question('Co powinien zawierać wynik z niepewnością?', ['Tylko wartość średnią', 'Measurand, model, wejścia, uc, k i przedział', 'Wyłącznie tolerancję producenta', 'Jedną wartość po zaokrągleniu'], 1, 'Pełny budżet niepewności opisuje wielkość mierzoną, model i pochodzenie wszystkich składników.'),
    ],
  },
  '1': {
    passingScore: 0.8,
    questions: [
      question('Jaki jest typowy skutek wzrostu Rs?', ['Wzrost Isc', 'Spadek fill factor', 'Wzrost Rsh', 'Brak wpływu na I-V'], 1, 'Wysoki opór szeregowy zaokrągla krzywą przy Voc i obniża FF.'),
      question('Brak anomalii IR przy mikropęknięciu oznacza, że:', ['Pęknięcia nie ma', 'Moduł jest bezpieczny', 'IR nie wyklucza pęknięcia', 'EL jest zbędne'], 2, 'EL jest zwykle czulsze, a brak kontrastu cieplnego nie wyklucza pęknięcia.'),
      question('Co jest najmocniejszym zestawem dla hipotezy PID?', ['Kolor JPEG', 'Pozycja potencjału, izolacja, EL i I-V', 'Samo Voc', 'Zdjęcie RGB'], 1, 'PID wymaga zgodności topologii i kilku niezależnych metod.'),
      question('Co ogranicza prąd tandemu 2T?', ['Suma prądów podogniw', 'Słabsze prądowo podogniwo', 'Wyłącznie temperatura', 'Napięcie sieci'], 1, 'W połączeniu szeregowym prąd jest w przybliżeniu minimum prądów podogniw.'),
      question('Jak interpretować snail trail?', ['Jako dokładną skalę straty', 'Jako pewny PID', 'Jako marker potrzeby badania', 'Jako defekt wyłącznie kosmetyczny'], 2, 'Przebarwienie jest markerem, ale jego wpływ wymaga EL, I-V i oględzin.'),
    ],
  },
  '2': {
    passingScore: 0.8,
    questions: [
      question('Jaka mapa jest konieczna dla diagnostyki topologicznej?', ['Moduł do MPPT, inwertera, transformatora i POI', 'Wyłącznie GPS drona', 'Lista numerów faktur', 'Paleta termiczna'], 0, 'Sygnał trzeba prześledzić przez cały tor DC/AC do punktu przyłączenia.'),
      question('Czym jest PR?', ['Sprawnością modułu', 'Relacją uzysku końcowego do referencyjnego', 'Dostępnością czasową', 'Mocą znamionową'], 1, 'PR jest wskaźnikiem uzysku, zależnym od granic i jakości danych, a nie sprawnością.'),
      question('Płaska moc AC w południe:', ['Zawsze dowodzi clippingu', 'Zawsze dowodzi awarii', 'Wymaga rozdzielenia clippingu, curtailment i limitów', 'Oznacza błąd termografii'], 2, 'Setpoint, P/Q/S, temperaturę i status trzeba sprawdzić przed klasyfikacją.'),
      question('Który krok należy do poprawnej weryfikacji braku napięcia?', ['Pomiar tylko po pracy', 'Sprawdzenie miernika przed i po pomiarze', 'Wyłączenie aplikacji SCADA', 'Usunięcie blokad przez przełożonego'], 1, 'Sekwencja live-dead-live chroni przed fałszywym wskazaniem uszkodzonego miernika.'),
      question('Dlaczego dostępność energetyczna różni się od czasowej?', ['Uwzględnia porę i oczekiwaną energię', 'Nie używa danych SCADA', 'Liczy wyłącznie noc', 'Jest zawsze wyższa'], 0, 'Dziesięć minut postoju w południe ma inny skutek energetyczny niż w nocy.'),
    ],
  },
  '3': {
    passingScore: 0.8,
    questions: [
      question('Co bezpośrednio mierzy detektor termiczny?', ['Temperaturę ogniwa', 'Sygnał zależny od radiancji w paśmie', 'Sprawność modułu', 'Stratę MWh'], 1, 'Temperatura powstaje dopiero przez odwrócenie modelu radiometrycznego.'),
      question('Jak oznaczono 600 W/m² POA w podręczniku?', ['Uniwersalny wymóg IEC', 'Rekomendację IEA PVPS [R]', 'Limit prawny BSP', 'Założenie gwarancyjne'], 1, 'To rekomendacja praktyczna, nie odtworzona klauzula IEC.'),
      question('Który plik jest źródłem radiometrycznym?', ['Screenshot palety', 'Natywny R-JPEG z metadanymi', 'JPEG z prezentacji', 'Ortomozajka PNG'], 1, 'Źródło musi zachować odwracalne dane per pixel, metadane i hash.'),
      question('Jak najskuteczniej rozdzielić odbicie od anomalii ogniwa?', ['Zmienić paletę', 'Powtórzyć kadr z innego azymutu lub elewacji', 'Zwiększyć kontrast', 'Uśrednić mozaikę'], 1, 'Odbicie przemieszcza się z geometrią, a anomalia pozostaje związana z modułem.'),
      question('Jak dzielić dane do walidacji AI?', ['Losowo po klatkach', 'Na poziomie farmy lub misji', 'Według jasności pikseli', 'Wyłącznie po klasach pozytywnych'], 1, 'Sąsiednie klatki są skorelowane. Podział losowy powoduje leakage.'),
    ],
  },
  '4': {
    passingScore: 0.8,
    questions: [
      question('String ma Voc 1320 V, a tracer zakres 1000 V. Co robisz?', ['Mierzę szybciej', 'Zmniejszam irradiance', 'Odrzucam konfigurację jako zabronioną', 'Koryguję wynik programowo'], 2, 'Zakres jest przekroczony jeszcze przed marginesem na zimny Voc.'),
      question('Dlaczego nie wolno skalować całej I-V tylko przez Gref/G?', ['Nie koryguje napięcia, Rs, Rsh ani bypass', 'Zmienia numer seryjny', 'Usuwa wszystkie punkty', 'Dotyczy tylko AC'], 0, 'Korekcja do STC wymaga jawnej procedury i parametrów konkretnego modułu.'),
      question('Cały moduł jest ciemny w EL. Jaki jest pierwszy krok?', ['Wymiana modułu', 'Sprawdzenie wzbudzenia, polaryzacji, optyki i referencji', 'Roszczenie gwarancyjne', 'Podniesienie napięcia bez limitu'], 1, 'Najpierw wyklucza się błąd aparatury i konfiguracji na obiekcie referencyjnym.'),
      question('Skąd bierze się napięcie próby izolacji?', ['Z pamięci operatora', 'Z najwyższego zakresu miernika', 'Z właściwej normy i instrukcji komponentów', 'Z temperatury modułu'], 2, 'Nie istnieje jedna uniwersalna nastawa dla każdego obwodu.'),
      question('Co ma priorytet przy gorącym złączu DC?', ['Estetyka raportu', 'Safety escalation i bezpieczna weryfikacja', 'Obliczenie PR', 'Automatyczna wymiana całego bloku'], 1, 'Ryzyko łuku wymaga eskalacji niezależnie od małej straty energii.'),
    ],
  },
  '5': {
    passingScore: 0.8,
    questions: [
      question('Co powinien zawierać finding TDD?', ['Samą fotografię', 'Stan, dowód, ryzyko, niepewność, właściciela i termin', 'Wyłącznie koszt', 'Jedną diagnozę bez alternatyw'], 1, 'Finding musi łączyć dowód z wymaganiem, ekspozycją i decyzją.'),
      question('Jak wyznacza się E_loss?', ['Moc STC razy liczba modułów', 'Różnica kontrfaktycznej i rzeczywistej mocy w czasie', 'Suma ΔT', 'Liczba alarmów IR'], 1, 'Strata energii wymaga modelu kontrfaktycznego i całkowania po czasie.'),
      question('Dlaczego clipping i curtailment analizuje się osobno?', ['Nie są danymi SCADA', 'Naprawa DC nie musi zwiększyć eksportu w tych okresach', 'Zawsze są usterką modułu', 'Nie wpływają na NPV'], 1, 'Odzyskana moc może pozostać poza limitem eksportu lub poleceniem operatora.'),
      question('Czy breakaway torque odtwarza preload śruby?', ['Tak, dokładnie', 'Tak, bez znajomości tarcia', 'Nie, przypadkowy retorque może zniszczyć dowód', 'Tylko na zdjęciu'], 2, 'Moment zależy od tarcia, powłoki i procesu. Test musi wynikać z ITP.'),
      question('Czy niski EMV pozwala odroczyć finding safety-critical?', ['Tak', 'Nie', 'Tylko przy wysokim clippingu', 'Tylko bez gwarancji'], 1, 'Obowiązek bezpieczeństwa nie jest zastępowany średnią wartością pieniężną ryzyka.'),
    ],
  },
  '6': {
    passingScore: 0.8,
    questions: [
      question('Ile wynosi roczna różnica model kontra eksport w capstone?', ['1 175 MWh', '3 663 MWh', '610 MWh', '84 000 MWh'], 1, 'Loss tree rozlicza pełne 3 663 MWh różnicy.'),
      question('Które kategorie nie są odzyskiwalne zwykłą naprawą DC/O&M?', ['Curtailment 1050 i clipping 610 MWh', 'Soiling i stringi', 'Inwertery i złącza', 'Residuum i OPEX'], 0, 'Nie należy włączać ich do oczekiwanego odzysku technicznego.'),
      question('Dlaczego osiem złączy ma S4 mimo około 6 MWh/rok straty?', ['Ze względu na cenę energii', 'Ze względu na ryzyko łuku i wspólną przyczynę', 'Ze względu na estetykę IR', 'Ze względu na clipping'], 1, 'Safety determinuje priorytet niezależnie od bezpośredniej wartości energii.'),
      question('Co pokazał ground truth wśród 160 pozycji?', ['Każdy alarm był usterką', '26 artefaktów/brak odchylenia i 16 nierozstrzygniętych', 'Brak otwartych stringów', '100% skuteczności AI'], 1, 'Wynik pokazuje, dlaczego screening wymaga potwierdzenia i uczciwej niepewności.'),
      question('Jaki jest bazowy oczekiwany odzysk programu?', ['Około 1 174,7 MWh/rok', '3 663 MWh/rok', '145 600 MWh/rok', '130 MWh/rok'], 0, 'Po współczynnikach realizacji i usunięciu overlap oczekiwany odzysk wynosi 1 174,7 MWh/rok.'),
    ],
  },
};

export function scoreQuiz(stageId, answers = []) {
  const quiz = quizzes[stageId];
  if (!quiz) throw new RangeError(`Unknown stage: ${stageId}`);
  const correct = quiz.questions.reduce((sum, item, index) => sum + Number(answers[index] === item.answer), 0);
  const score = correct / quiz.questions.length;
  return { correct, total: quiz.questions.length, score, passed: score >= quiz.passingScore };
}

export function unlockedStageIds(completed = []) {
  const passed = new Set(completed);
  const unlocked = ['0'];
  for (let index = 0; index < courseStages.length - 1; index += 1) {
    if (!passed.has(courseStages[index].id)) break;
    unlocked.push(courseStages[index + 1].id);
  }
  return unlocked;
}

export function splitCourseContent(source) {
  const clean = source.replace(/^---[\s\S]*?---\s*/, '');
  const markers = ['# Moduł 1.', '# Moduł 2.', '# Moduł 3.', '# Moduł 4.', '# Moduł 5.', '# Macierz diagnostyczna usterek'];
  const boundaries = markers.map((marker) => clean.indexOf(marker));
  if (boundaries.some((index) => index < 0)) throw new Error('Course source is missing a required module boundary');
  const starts = [0, ...boundaries];
  return starts.map((start, index) => {
    const end = starts[index + 1] ?? clean.length;
    let markdown = clean.slice(start, end);
    if (index < starts.length - 1 && markdown.endsWith('\n')) markdown = markdown.slice(0, -1);
    return { id: courseStages[index].id, markdown };
  });
}

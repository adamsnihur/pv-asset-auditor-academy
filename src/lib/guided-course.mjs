export const GUIDED_STORAGE_KEY = 'pv-asset-auditor-guided:v1';
export const GUIDED_VERSION = 1;
export const REVIEW_ITEMS = [
  'Wykonałem wszystkie kroki i zapisałem wymagany rezultat ćwiczenia.',
  'Porównałem rezultat z przykładem lub kryteriami lekcji i poprawiłem błędy.',
  'Zapisałem ograniczenia, niepewności lub pytania wymagające konsultacji.',
];

export function flattenCatalogs(catalogs) {
  return ['electrical', 'field', 'mapping'].flatMap((group) => {
    const catalog = catalogs.find((item) => item.id === group);
    return (catalog?.lessons ?? []).map((lesson) => ({ ...lesson, group, groupTitle: catalog.title }));
  });
}

export function gradeQuestions(questions, answers = []) {
  const results = questions.map((question, index) => ({
    correct: Number.isInteger(answers[index]) && answers[index] === question.answer,
    answered: Number.isInteger(answers[index]) && answers[index] >= 0 && answers[index] < question.options.length,
    critical: question.critical === true,
  }));
  const general = results.filter((result) => !result.critical);
  const critical = results.filter((result) => result.critical);
  const generalScore = general.length ? general.filter((result) => result.correct).length / general.length : 1;
  const criticalPassed = critical.every((result) => result.correct);
  const answered = results.length > 0 && results.every((result) => result.answered);
  return { results, generalScore, criticalPassed, answered, passed: answered && criticalPassed && generalScore >= 0.8 };
}

export function canCompleteLesson(lesson, record = {}) {
  return record.graded === true && gradeQuestions(lesson.questions, record.answers).passed
    && typeof record.notes === 'string' && record.notes.trim().length > 0
    && REVIEW_ITEMS.every((_, index) => record.review?.[index] === true);
}

export function isLessonUnlocked(lessons, state, id) {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return index >= 0 && lessons.slice(0, index).every((lesson) => state.records[lesson.id]?.completed === true);
}

export function emptyGuidedState(lessons) {
  return { version: GUIDED_VERSION, current: lessons[0]?.id ?? '', records: {} };
}

export function normalizeGuidedState(raw, lessons) {
  const state = emptyGuidedState(lessons);
  if (!raw || raw.version !== GUIDED_VERSION || !raw.records || typeof raw.records !== 'object') return state;
  for (const lesson of lessons) {
    const record = raw.records[lesson.id];
    if (!record || typeof record !== 'object') continue;
    const clean = {
      answers: lesson.questions.map((question, index) => {
        const answer = record.answers?.[index];
        return Number.isInteger(answer) && answer >= 0 && answer < question.options.length ? answer : null;
      }),
      notes: typeof record.notes === 'string' ? record.notes.slice(0, 50000) : '',
      review: REVIEW_ITEMS.map((_, index) => record.review?.[index] === true),
      graded: record.graded === true,
      completed: false,
    };
    clean.completed = record.completed === true && canCompleteLesson(lesson, clean) && isLessonUnlocked(lessons, state, lesson.id);
    state.records[lesson.id] = clean;
  }
  state.current = isLessonUnlocked(lessons, state, raw.current) ? raw.current : lessons[0]?.id ?? '';
  return state;
}

export function loadGuidedState(storage, lessons, storageKey = GUIDED_STORAGE_KEY) {
  try { return normalizeGuidedState(JSON.parse(storage?.getItem(storageKey) ?? 'null'), lessons); }
  catch { return emptyGuidedState(lessons); }
}

export function saveGuidedState(storage, state, storageKey = GUIDED_STORAGE_KEY) {
  try {
    if (!storage) return false;
    storage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch { return false; }
}

export function exportGuidedNotes(lessons, state) {
  return ['PV Asset Auditor Academy | Dziennik nauki',
    'Zapis samokształcenia. Nie potwierdza kwalifikacji zawodowych ani oceny przez instruktora.',
    ...lessons.flatMap((lesson) => {
      const record = state.records[lesson.id];
      return [`\n${lesson.title}`, `Status: ${record?.completed ? 'ukończona samodzielnie' : 'w toku'}`,
        `Rezultat: ${lesson.activity.deliverable}`, record?.notes || '(brak notatek)'];
    }),
  ].join('\n');
}

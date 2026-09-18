import { GUIDED_STORAGE_KEY, REVIEW_ITEMS, canCompleteLesson, emptyGuidedState, exportGuidedNotes,
  gradeQuestions, isLessonUnlocked, loadGuidedState, normalizeGuidedState, saveGuidedState } from './guided-course.mjs';

export function initializeGuidedCourse() {
  const root = document.querySelector('[data-guided-course]');
  if (!root || root.dataset.initialized) return;
  const data = root.querySelector('[data-guided-data]');
  let lessons;
  try { lessons = JSON.parse(data.textContent).lessons; } catch { return; }
  if (!lessons.length) return;
  root.dataset.initialized = 'true';
  let storage;
  try { storage = window.localStorage; } catch { storage = null; }
  let state = loadGuidedState(storage, lessons);
  const panels = [...root.querySelectorAll('[data-lesson-panel]')];
  const triggers = [...root.querySelectorAll('[data-lesson-trigger]')];
  const status = root.querySelector('[data-guided-status]');
  const storageStatus = root.querySelector('[data-guided-storage]');
  const announce = (message) => { status.textContent = message; };
  const invalidateCompletion = (record) => {
    if (record.completed) announce('Edycja cofnęła ukończenie tej i kolejnych lekcji. Notatki pozostają zachowane.');
    record.completed = false;
  };
  const recordFor = (id) => state.records[id] ??= { answers: [], graded: false, notes: '', review: REVIEW_ITEMS.map(() => false), completed: false };
  const persist = () => {
    state = normalizeGuidedState(state, lessons);
    storageStatus.textContent = saveGuidedState(storage, state)
      ? 'Postęp i notatki zapisane w tej przeglądarce.'
      : 'Zapis lokalny niedostępny. Pobierz notatki przed zamknięciem strony.';
  };

  function render(focus = false) {
    const completeCount = lessons.filter((lesson) => state.records[lesson.id]?.completed).length;
    root.querySelector('[data-guided-progress]').textContent = `${completeCount} / ${lessons.length}`;
    const progress = root.querySelector('progress');
    progress.value = completeCount;
    progress.max = lessons.length;
    triggers.forEach((button) => {
      const id = button.dataset.lessonTrigger;
      const completed = state.records[id]?.completed;
      button.disabled = !isLessonUnlocked(lessons, state, id);
      button.classList.toggle('is-complete', Boolean(completed));
      if (state.current === id) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.querySelector('[data-lesson-state]').textContent = completed ? 'Ukończona' : button.disabled ? 'Zablokowana' : state.current === id ? 'Teraz' : 'Dostępna';
    });
    panels.forEach((panel, index) => {
      const lesson = lessons[index];
      const record = recordFor(lesson.id);
      panel.hidden = state.current !== lesson.id;
      panel.querySelectorAll('[data-guided-answer]').forEach((input) => {
        input.checked = record.answers[Number(input.dataset.question)] === Number(input.value);
      });
      const notes = panel.querySelector('[data-guided-notes]');
      if (notes.value !== record.notes) notes.value = record.notes;
      panel.querySelectorAll('[data-guided-review]').forEach((input, reviewIndex) => { input.checked = record.review[reviewIndex] === true; });
      const grade = gradeQuestions(lesson.questions, record.answers);
      panel.querySelectorAll('[data-guided-feedback]').forEach((feedback, questionIndex) => {
        feedback.hidden = !record.graded;
        feedback.textContent = record.graded ? `${grade.results[questionIndex].correct ? 'Poprawnie.' : 'Wróć do tego zagadnienia.'} ${lesson.questions[questionIndex].explanation}` : '';
        feedback.dataset.correct = String(grade.results[questionIndex].correct);
      });
      const result = panel.querySelector('[data-guided-result]');
      result.textContent = !record.graded ? '' : grade.passed
        ? 'Sprawdzian zaliczony. Zapisz rezultat ćwiczenia i wykonaj samoocenę poniżej.'
        : `Jeszcze nie. Wynik ogólny: ${Math.round(grade.generalScore * 100)}%. Pytania krytyczne: ${grade.criticalPassed ? 'poprawne' : 'wymagają poprawy'}. ${grade.answered ? 'Przeczytaj wyjaśnienia i spróbuj ponownie.' : 'Odpowiedz na każde pytanie.'}`;
      const completeButton = panel.querySelector('[data-guided-complete]');
      completeButton.disabled = Boolean(record.completed) || !canCompleteLesson(lesson, record);
      completeButton.textContent = record.completed ? 'Lekcja ukończona samodzielnie ✓' : 'Zapisz ukończenie lekcji';
      panel.querySelector('[data-guided-next]').disabled = !lessons[index + 1] || !isLessonUnlocked(lessons, state, lessons[index + 1]?.id);
      panel.querySelector('[data-guided-back]').disabled = index === 0;
      panel.querySelector('[data-guided-gate]').textContent = record.completed
        ? 'Ukończenie zapisane. Możesz przejść dalej lub wrócić do materiału.'
        : `Do ukończenia: ${[!record.graded || !grade.passed ? 'zalicz sprawdzian' : '', !record.notes.trim() ? 'zapisz rezultat' : '', !record.review.every(Boolean) ? 'zaznacz trzy kryteria samooceny' : ''].filter(Boolean).join(' · ') || 'kliknij przycisk zapisu ukończenia'}.`;
    });
    root.querySelector('[data-guided-finished]').hidden = completeCount !== lessons.length;
    if (focus) {
      const heading = panels.find((panel) => !panel.hidden)?.querySelector('[data-guided-title]');
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  function navigate(id) {
    if (!isLessonUnlocked(lessons, state, id)) return;
    state.current = id;
    persist();
    render(true);
    announce(`Otwarta lekcja: ${lessons.find((lesson) => lesson.id === id).title}`);
  }

  triggers.forEach((button) => button.addEventListener('click', () => navigate(button.dataset.lessonTrigger)));
  panels.forEach((panel, index) => {
    const lesson = lessons[index];
    panel.querySelector('[data-guided-quiz]').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!isLessonUnlocked(lessons, state, lesson.id)) return;
      recordFor(lesson.id).graded = true;
      persist(); render();
      panel.querySelector('[data-guided-result]').focus();
    });
    panel.querySelectorAll('[data-guided-answer]').forEach((input) => input.addEventListener('change', () => {
      const record = recordFor(lesson.id);
      record.answers[Number(input.dataset.question)] = Number(input.value);
      record.graded = false;
      invalidateCompletion(record);
      persist(); render();
    }));
    panel.querySelector('[data-guided-notes]').addEventListener('input', (event) => {
      const record = recordFor(lesson.id);
      record.notes = event.target.value;
      record.review = REVIEW_ITEMS.map(() => false);
      invalidateCompletion(record);
      persist(); render();
    });
    panel.querySelectorAll('[data-guided-review]').forEach((input, reviewIndex) => input.addEventListener('change', () => {
      const record = recordFor(lesson.id);
      record.review[reviewIndex] = input.checked;
      if (!input.checked) invalidateCompletion(record);
      persist(); render();
    }));
    panel.querySelector('[data-guided-complete]').addEventListener('click', () => {
      const record = recordFor(lesson.id);
      if (!isLessonUnlocked(lessons, state, lesson.id) || !canCompleteLesson(lesson, record)) return;
      record.completed = true;
      persist(); render();
      announce('Samodzielna lekcja ukończona. To zapis nauki, nie potwierdzenie uprawnień.');
      if (lessons[index + 1]) panel.querySelector('[data-guided-next]').focus();
      else root.querySelector('[data-guided-finished]').focus();
    });
    panel.querySelector('[data-guided-next]').addEventListener('click', () => navigate(lessons[index + 1]?.id));
    panel.querySelector('[data-guided-back]').addEventListener('click', () => navigate(lessons[index - 1]?.id));
  });

  root.querySelector('[data-guided-export]').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([exportGuidedNotes(lessons, state)], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'pv-asset-auditor-notatki.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('Plik notatek został przygotowany do pobrania.');
  });
  const resetBox = root.querySelector('[data-guided-reset-box]');
  root.querySelector('[data-guided-reset]').addEventListener('click', () => {
    resetBox.hidden = false;
    root.querySelector('[data-guided-reset-cancel]').focus();
  });
  root.querySelector('[data-guided-reset-cancel]').addEventListener('click', () => {
    resetBox.hidden = true;
    root.querySelector('[data-guided-reset]').focus();
  });
  root.querySelector('[data-guided-reset-confirm]').addEventListener('click', () => {
    try { storage?.removeItem(GUIDED_STORAGE_KEY); } catch { /* In-memory reset remains available. */ }
    state = emptyGuidedState(lessons);
    resetBox.hidden = true;
    persist(); render(true);
    announce('Postęp, odpowiedzi, samoocena i notatki zostały wyzerowane.');
  });
  persist(); render();
}

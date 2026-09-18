export const STORAGE_KEY = 'pv-asset-auditor-academy.progress.v1';

function readState(storage, stageIds) {
  const fallback = { current: '0', completed: [], scores: {}, theme: 'system' };
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
    if (!parsed || !Array.isArray(parsed.completed)) return fallback;
    return {
      current: stageIds.includes(parsed.current) ? parsed.current : '0',
      completed: parsed.completed.filter((id) => stageIds.includes(id)),
      scores: parsed.scores && typeof parsed.scores === 'object' ? parsed.scores : {},
      theme: ['system', 'dark', 'light'].includes(parsed.theme) ? parsed.theme : 'system',
    };
  } catch {
    return fallback;
  }
}

function getUnlocked(stageIds, completed) {
  const passed = new Set(completed);
  const result = new Set([stageIds[0]]);
  for (let index = 0; index < stageIds.length - 1; index += 1) {
    if (!passed.has(stageIds[index])) break;
    result.add(stageIds[index + 1]);
  }
  return result;
}

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function initializeCourse(root = document) {
  const academy = root.querySelector('.academy');
  const dataNode = root.querySelector('#course-data');
  if (!academy || !dataNode) return;

  const { courseStages, quizzes } = JSON.parse(dataNode.textContent);
  const stageIds = courseStages.map(({ id }) => id);
  const stageButtons = [...root.querySelectorAll('[data-stage-trigger]')];
  const stagePanels = [...root.querySelectorAll('[data-course-stage]')];
  const storage = window.localStorage;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let state = readState(storage, stageIds);

  function save() {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* course still works without persistence */ }
  }

  function setTheme(theme) {
    state.theme = theme;
    academy.dataset.courseTheme = theme;
    const button = root.querySelector('[data-theme-toggle]');
    if (button) button.textContent = `Motyw: ${{ system: 'system', dark: 'ciemny', light: 'jasny' }[theme]}`;
    save();
  }

  function assignHeadingIds() {
    stagePanels.forEach((panel) => {
      const stageId = panel.dataset.courseStage;
      panel.querySelectorAll('.course-prose h2, .course-prose h3').forEach((heading, index) => {
        heading.id = `stage-${stageId}-heading-${index}`;
        heading.dataset.slug = slugify(heading.textContent);
      });
    });
  }

  function updateProgress() {
    const completed = new Set(state.completed);
    const unlocked = getUnlocked(stageIds, completed);
    const percent = Math.round((completed.size / stageIds.length) * 100);
    const hours = courseStages.filter(({ id }) => completed.has(id)).length;
    const ring = root.querySelector('[data-progress-ring]');
    const value = root.querySelector('[data-progress-value]');
    const hoursNode = root.querySelector('[data-hours-complete]');
    if (ring) ring.style.setProperty('--progress', `${percent}%`);
    if (value) value.textContent = `${percent}%`;
    if (hoursNode) hoursNode.textContent = String(hours);

    stageButtons.forEach((button, index) => {
      const id = button.dataset.stageTrigger;
      const isCompleted = completed.has(id);
      const isUnlocked = unlocked.has(id);
      button.disabled = !isUnlocked;
      button.classList.toggle('is-complete', isCompleted);
      const indexNode = button.querySelector('.stage-nav__index');
      const statusNode = button.querySelector('.stage-nav__status');
      if (indexNode) indexNode.textContent = isCompleted ? '✓' : (isUnlocked ? String(index).padStart(2, '0') : '🔒');
      if (statusNode) statusNode.textContent = isCompleted ? 'Zaliczone' : (isUnlocked ? 'Dostępny' : 'Zablokowany');
    });

    const certificate = root.querySelector('[data-certificate]');
    if (certificate) certificate.hidden = completed.size !== stageIds.length;
    if (!unlocked.has(state.current)) state.current = stageIds[0];
  }

  function activateStage(id, { scroll = false } = {}) {
    if (!getUnlocked(stageIds, new Set(state.completed)).has(id)) return;
    state.current = id;
    stageButtons.forEach((button) => {
      const active = button.dataset.stageTrigger === id;
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    stagePanels.forEach((panel) => { panel.hidden = panel.dataset.courseStage !== id; });
    save();
    academy.dispatchEvent(new CustomEvent('course:stage-change', { detail: { stageId: id } }));
    if (scroll) root.querySelector('#nauka')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function renderAnswerFeedback(form, stageId, answers) {
    const quiz = quizzes[stageId];
    quiz.questions.forEach((item, index) => {
      const fieldset = form.querySelector(`[data-quiz-question="${index}"]`);
      const feedback = fieldset?.querySelector('.quiz-feedback');
      fieldset?.querySelectorAll('.quiz-option').forEach((label, optionIndex) => {
        label.classList.toggle('is-correct', optionIndex === item.answer);
        label.classList.toggle('is-incorrect', optionIndex === answers[index] && optionIndex !== item.answer);
      });
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = `${answers[index] === item.answer ? 'Poprawnie.' : 'Sprawdź ponownie.'} ${item.explanation}`;
      }
    });
  }

  root.querySelectorAll('[data-quiz] form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const stageId = form.closest('[data-quiz]').dataset.quiz;
      const quiz = quizzes[stageId];
      const formData = new FormData(form);
      const answers = quiz.questions.map((_, index) => {
        const value = formData.get(`q-${stageId}-${index}`);
        return value === null ? null : Number(value);
      });
      const result = form.querySelector('[aria-live="polite"]');
      if (answers.some((answer) => answer === null)) {
        result.textContent = 'Odpowiedz na wszystkie pytania, zanim sprawdzisz wynik.';
        result.className = 'quiz-result is-warning';
        return;
      }

      const correct = quiz.questions.reduce((sum, item, index) => sum + Number(answers[index] === item.answer), 0);
      const score = correct / quiz.questions.length;
      const passed = score >= quiz.passingScore;
      state.scores[stageId] = Math.max(state.scores[stageId] ?? 0, score);
      if (passed && !state.completed.includes(stageId)) state.completed.push(stageId);
      renderAnswerFeedback(form, stageId, answers);
      result.textContent = passed
        ? `Zaliczone: ${correct}/${quiz.questions.length}. Kolejny etap jest dostępny.`
        : `Wynik ${correct}/${quiz.questions.length}. Wróć do materiału i spróbuj ponownie.`;
      result.className = `quiz-result ${passed ? 'is-pass' : 'is-warning'}`;
      updateProgress();
      save();
    });
  });

  stageButtons.forEach((button) => button.addEventListener('click', () => activateStage(button.dataset.stageTrigger, { scroll: true })));
  root.querySelector('[data-course-start]')?.addEventListener('click', () => activateStage(state.current, { scroll: true }));
  root.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const themes = ['system', 'dark', 'light'];
    setTheme(themes[(themes.indexOf(state.theme) + 1) % themes.length]);
  });
  root.querySelector('[data-print-certificate]')?.addEventListener('click', () => window.print());
  root.querySelector('[data-reset-progress]')?.addEventListener('click', () => {
    if (!window.confirm('Wyzerować zapisany postęp i wyniki quizów?')) return;
    state = { current: '0', completed: [], scores: {}, theme: state.theme };
    root.querySelectorAll('.quiz-feedback').forEach((node) => { node.hidden = true; node.textContent = ''; });
    root.querySelectorAll('.quiz-option').forEach((node) => node.classList.remove('is-correct', 'is-incorrect'));
    root.querySelectorAll('[data-quiz] form').forEach((form) => form.reset());
    root.querySelectorAll('.quiz-result').forEach((node) => { node.textContent = ''; node.className = 'quiz-result'; });
    updateProgress(); activateStage('0'); save();
  });

  assignHeadingIds();
  setTheme(state.theme);
  updateProgress();
  activateStage(state.current);
}

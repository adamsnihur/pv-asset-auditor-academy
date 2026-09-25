import { MIN_ANSWER_LENGTH, balancedOralSet, emptyOralRecord, exportOralNotes, loadOralState,
  oralSummary, oralVerdict, saveOralState } from './g1-oral.mjs';

export function initializeOralPractice(root = document.querySelector('[data-oral-root]')) {
  if (!root || root.dataset.initialized) return;
  let bank;
  try { bank = JSON.parse(root.querySelector('[data-oral-data]').textContent); } catch { return; }
  if (!Array.isArray(bank) || !bank.length) return;
  root.dataset.initialized = 'true';
  let storage;
  try { storage = window.localStorage; } catch { storage = null; }
  const state = loadOralState(storage, bank);
  const mode = root.querySelector('[data-oral-mode]');
  const filter = root.querySelector('[data-oral-filter]');
  const cards = new Map([...root.querySelectorAll('[data-oral-card]')].map((card) => [card.dataset.oralCard, card]));
  const status = root.querySelector('[data-oral-save]');
  let index = 0;
  const activeBank = () => mode.value === 'mock'
    ? (state.session?.ids || []).map((id) => bank.find((item) => item.id === id))
    : bank.filter((item) => filter.value === 'all' || item.lessonId === filter.value);
  const records = () => mode.value === 'mock' ? state.session.records : state.records;
  const recordFor = (item) => records()[item.id] ??= emptyOralRecord(item);
  const persist = () => { status.textContent = saveOralState(storage, state)
    ? 'Odpowiedzi zapisane na tym urządzeniu. Brak synchronizacji i automatycznej oceny treści.'
    : 'Zapis lokalny niedostępny. Pobierz odpowiedzi przed zamknięciem strony.'; };

  function render(focus = false) {
    const selected = activeBank();
    index = Math.min(Math.max(0, index), Math.max(0, selected.length - 1));
    const current = selected[index];
    for (const [id, card] of cards) card.hidden = id !== current?.id;
    root.querySelector('[data-oral-prev]').disabled = index === 0;
    root.querySelector('[data-oral-next]').disabled = index >= selected.length - 1;
    root.querySelector('[data-oral-position]').textContent = selected.length ? `${index + 1} / ${selected.length}` : 'Wylosuj zestaw pytań.';
    root.querySelector('[data-oral-filter-label]').hidden = mode.value === 'mock';
    root.querySelector('[data-oral-new]').hidden = mode.value !== 'mock';
    root.querySelector('[data-oral-mode-note]').textContent = mode.value === 'mock'
      ? 'Próba obejmuje po jednym pytaniu z każdej lekcji G13–G24. Odpowiadaj bez materiałów. Każda próba ma oddzielne odpowiedzi od powtórek tematycznych; zapisany zestaw wróci po wybraniu tego trybu.'
      : 'Wybierz temat. Odpowiedzi są zapisywane lokalnie, niezależnie od zaliczeń lekcji.';
    const summary = oralSummary(selected, records());
    root.querySelector('[data-oral-summary]').textContent = `Według Twojej samooceny: ${summary.confirmed} pełnych odpowiedzi · ${summary.review} do powtórzenia · ${summary.pending} bez zakończonej oceny. Tematy krytyczne do powtórzenia: ${summary.criticalReview}. To nie jest wynik egzaminu.`;
    if (!current) return;
    const card = cards.get(current.id);
    const record = recordFor(current);
    card.querySelector('[data-oral-answer]').value = record.answer;
    card.querySelector('[data-oral-reveal]').disabled = record.answer.trim().length < MIN_ANSWER_LENGTH;
    card.querySelector('[data-oral-model]').hidden = !record.revealed;
    [...card.querySelectorAll('[data-oral-criterion]')].forEach((input, i) => { input.checked = record.criteria[i]; });
    const safe = card.querySelector('[data-oral-safe]');
    if (safe) safe.checked = record.safe;
    const verdict = oralVerdict(current, record);
    card.querySelector('[data-oral-verdict]').textContent = verdict === 'self-confirmed'
      ? 'Zaznaczyłeś wszystkie kryteria. Sprawdź odpowiedź z instruktorem i spróbuj ponownie bez podglądu.'
      : verdict === 'review' ? 'Wróć do wskazanej lekcji i uzupełnij brakujące rozumowanie. Błędu krytycznego nie wyrównuje poprawność innych odpowiedzi.' : '';
    if (focus) card.querySelector('h3').focus();
  }

  for (const item of bank) {
    const card = cards.get(item.id);
    card.querySelector('[data-oral-answer]').addEventListener('input', (event) => {
      const record = recordFor(item);
      record.answer = event.target.value;
      record.revealed = false; record.evaluated = false; record.safe = false;
      record.criteria = item.keyPoints.map(() => false);
      persist(); render();
    });
    card.querySelector('[data-oral-reveal]').addEventListener('click', () => {
      const record = recordFor(item);
      if (record.answer.trim().length < MIN_ANSWER_LENGTH) return;
      record.revealed = true; persist(); render();
    });
    [...card.querySelectorAll('[data-oral-criterion]')].forEach((input, i) => input.addEventListener('change', () => {
      const record = recordFor(item); record.criteria[i] = input.checked; record.evaluated = false;
      persist(); render();
    }));
    card.querySelector('[data-oral-safe]')?.addEventListener('change', (event) => {
      const record = recordFor(item); record.safe = event.target.checked; record.evaluated = false;
      persist(); render();
    });
    card.querySelector('[data-oral-grade]').addEventListener('click', () => {
      const record = recordFor(item);
      if (!record.revealed || record.answer.trim().length < MIN_ANSWER_LENGTH) return;
      record.evaluated = true; persist(); render();
    });
  }
  root.querySelector('[data-oral-prev]').addEventListener('click', () => { index--; render(true); });
  root.querySelector('[data-oral-next]').addEventListener('click', () => { index++; render(true); });
  filter.addEventListener('change', () => { index = 0; render(); });
  mode.addEventListener('change', () => {
    if (mode.value === 'mock' && !state.session) state.session = { ids: balancedOralSet(bank), records: {} };
    root.querySelector('[data-oral-new-confirm]').hidden = true;
    index = 0; persist(); render();
  });
  root.querySelector('[data-oral-new]').addEventListener('click', () => {
    root.querySelector('[data-oral-new-confirm]').hidden = false;
    root.querySelector('[data-oral-cancel]').focus();
  });
  root.querySelector('[data-oral-cancel]').addEventListener('click', () => {
    root.querySelector('[data-oral-new-confirm]').hidden = true;
    root.querySelector('[data-oral-new]').focus();
  });
  root.querySelector('[data-oral-start]').addEventListener('click', () => {
    state.session = { ids: balancedOralSet(bank), records: {} };
    root.querySelector('[data-oral-new-confirm]').hidden = true;
    index = 0; persist(); render(true);
  });
  root.querySelector('[data-oral-export]').addEventListener('click', () => {
    const text = exportOralNotes(activeBank(), records(), mode.value === 'mock' ? 'Próba przekrojowa' : 'Powtórka tematyczna');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'g1-odpowiedzi-ustne.txt'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  render();
  status.textContent = storage ? 'Odpowiedzi pozostają lokalnie na tym urządzeniu.' : 'Zapis lokalny niedostępny. Korzystaj z pobierania odpowiedzi.';
}

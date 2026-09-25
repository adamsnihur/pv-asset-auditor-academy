export const ORAL_STORAGE_KEY = 'pv-asset-auditor-g1-oral:v1';
export const MIN_ANSWER_LENGTH = 80;

export function balancedOralSet(bank, random = Math.random) {
  const groups = new Map();
  for (const item of bank) {
    if (!groups.has(item.lessonId)) groups.set(item.lessonId, []);
    groups.get(item.lessonId).push(item.id);
  }
  return [...groups.values()].map((ids) => ids[Math.min(ids.length - 1, Math.max(0, Math.floor(random() * ids.length)))]);
}

export function emptyOralRecord(item) {
  return { answer: '', revealed: false, criteria: item.keyPoints.map(() => false), safe: false, evaluated: false };
}

export function oralVerdict(item, record) {
  if (!record?.evaluated || !record.revealed || record.answer.trim().length < MIN_ANSWER_LENGTH) return 'pending';
  return record.criteria.length === item.keyPoints.length && record.criteria.every((value) => value === true)
    && (!item.critical || record.safe === true) ? 'self-confirmed' : 'review';
}

function normalizeRecords(raw, bank) {
  const records = {};
  for (const item of bank) {
    const value = raw?.[item.id];
    if (!value || typeof value !== 'object') continue;
    const record = emptyOralRecord(item);
    record.answer = typeof value.answer === 'string' ? value.answer.slice(0, 10000) : '';
    record.revealed = value.revealed === true && record.answer.trim().length >= MIN_ANSWER_LENGTH;
    record.criteria = item.keyPoints.map((_, index) => value.criteria?.[index] === true);
    record.safe = value.safe === true;
    record.evaluated = value.evaluated === true && record.revealed;
    records[item.id] = record;
  }
  return records;
}

export function normalizeOralState(raw, bank) {
  const state = { version: 1, records: {}, session: null };
  if (raw?.version !== 1) return state;
  state.records = normalizeRecords(raw.records, bank);
  const ids = raw.session?.ids;
  const lookup = new Map(bank.map((item) => [item.id, item]));
  const lessonCount = new Set(bank.map((item) => item.lessonId)).size;
  if (Array.isArray(ids) && ids.length === lessonCount && new Set(ids).size === ids.length
      && ids.every((id) => lookup.has(id)) && new Set(ids.map((id) => lookup.get(id).lessonId)).size === lessonCount) {
    state.session = { ids, records: normalizeRecords(raw.session.records, bank.filter((item) => ids.includes(item.id))) };
  }
  return state;
}

export function loadOralState(storage, bank) {
  try { return normalizeOralState(JSON.parse(storage?.getItem(ORAL_STORAGE_KEY) || 'null'), bank); }
  catch { return normalizeOralState(null, bank); }
}

export function saveOralState(storage, state) {
  try { if (!storage) return false; storage.setItem(ORAL_STORAGE_KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}

export function oralSummary(bank, records) {
  const result = { total: bank.length, pending: 0, review: 0, confirmed: 0, criticalReview: 0 };
  for (const item of bank) {
    const verdict = oralVerdict(item, records[item.id]);
    if (verdict === 'self-confirmed') result.confirmed++;
    else if (verdict === 'pending') result.pending++;
    else { result.review++; if (item.critical) result.criticalReview++; }
  }
  return result;
}

export function exportOralNotes(bank, records, label) {
  return [`G1 · ${label}`, 'Samoocena odpowiedzi. Nie jest wynikiem egzaminu ani potwierdzeniem kwalifikacji.',
    ...bank.flatMap((item) => [ '', `${item.id} · ${item.prompt}`, records[item.id]?.answer || '(brak odpowiedzi)',
      `Status samooceny: ${oralVerdict(item, records[item.id])}`, `Do powtórzenia: ${item.lessonId} · ${item.lessonTitle}` ])].join('\n');
}

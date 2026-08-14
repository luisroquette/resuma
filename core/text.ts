const STOP_WORDS = new Set([
  'a', 'as', 'ao', 'aos', 'aqui', 'com', 'como', 'da', 'das', 'de', 'do', 'dos', 'e', 'ela', 'ele',
  'em', 'essa', 'esse', 'esta', 'este', 'eu', 'foi', 'isso', 'mais', 'mas', 'muito', 'na', 'nas', 'no',
  'nos', 'o', 'os', 'ou', 'para', 'pela', 'pelo', 'por', 'pra', 'que', 'se', 'sem', 'ser', 'sua', 'tem',
  'ate', 'amanha', 'quando', 'onde', 'quem', 'qual', 'quais', 'sera',
  'um', 'uma', 'the', 'and', 'for', 'from', 'this', 'that', 'with', 'you', 'your', 'what', 'when',
]);

export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function terms(value: string): string[] {
  return normalize(value)
    .split(' ')
    .filter((term) => term.length >= 3 && !STOP_WORDS.has(term));
}

export function shorten(value: string, limit = 180): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const boundary = clean.slice(0, limit + 1).lastIndexOf(' ');
  return `${clean.slice(0, boundary > limit * 0.65 ? boundary : limit).trim()}…`;
}

export function unique(values: string[], limit = values.length): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const key = normalize(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(value);
    if (output.length >= limit) break;
  }
  return output;
}

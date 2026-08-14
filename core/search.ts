import type { CommunityMessage, SearchResult } from './types';
import { normalize, shorten, terms } from './text';

export function searchHistory(query: string, messages: CommunityMessage[], maxResults = 3): SearchResult[] {
  const queryTerms = [...new Set(terms(query))];
  if (!queryTerms.length) return [];
  const phrase = normalize(query);

  return messages
    .map((message) => {
      const haystack = normalize(message.text);
      const matchedTerms = queryTerms.filter((term) => haystack.includes(term));
      const coverage = matchedTerms.length / queryTerms.length;
      const phraseBonus = phrase.length >= 6 && haystack.includes(phrase) ? 5 : 0;
      return { message, matchedTerms, score: matchedTerms.length * 3 + coverage * 4 + phraseBonus };
    })
    .filter((result) => result.matchedTerms.length > 0 && result.score >= 4)
    .sort((left, right) => right.score - left.score || right.message.occurredAt.localeCompare(left.message.occurredAt))
    .slice(0, Math.max(1, Math.min(maxResults, 5)));
}

export function renderAnswer(query: string, results: SearchResult[]): string {
  if (!results.length) return `Não encontrei evidência suficiente no histórico para responder: “${shorten(query, 120)}”.`;
  const sources = results.map(({ message }, index) => {
    const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' })
      .format(new Date(message.occurredAt));
    return `${index + 1}. ${message.senderName || 'Participante'} · ${date}\n“${shorten(message.text, 180)}”`;
  });
  return `*Encontrei estas referências no histórico:*\n\n${sources.join('\n\n')}`;
}

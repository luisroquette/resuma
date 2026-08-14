import type { CommunityMessage, Summary } from './types';
import { normalize, shorten, terms, unique } from './text';

const URL_PATTERN = /https?:\/\/[^\s<>"']+/giu;
const URL_TEST_PATTERN = /https?:\/\/[^\s<>"']+/iu;
const DECISION_PATTERN = /\b(decis[aã]o|decidid[oa]|ficou definido|aprovad[oa]|confirmad[oa]|combinamos|resolved[oa])\b/iu;
const PENDING_PATTERN = /\b(pend[eê]ncia|pendente|falta(?:ndo)?|aguardando|a definir|precisamos|todo)\b/iu;

function safeLink(raw: string, allowedDomains?: string[]): string | null {
  const candidate = raw.replace(/[),.;:!?\]}]+$/g, '');
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.local') || /^\d+(?:\.\d+){3}$/.test(host)) return null;
    if (allowedDomains?.length && !allowedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`))) return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function dynamicTopics(messages: CommunityMessage[]): Array<{ label: string; count: number }> {
  const counts = new Map<string, number>();
  for (const message of messages) {
    const inMessage = new Set(terms(message.text));
    for (const term of inMessage) counts.set(term, (counts.get(term) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([term, count]) => count >= 2 && term.length >= 4 && !/\d/.test(term))
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], 'pt-BR'))
    .slice(0, 5)
    .map(([label, count]) => ({ label: label[0].toUpperCase() + label.slice(1), count }));
}

function usefulScore(message: CommunityMessage): number {
  const text = message.text;
  return (DECISION_PATTERN.test(text) ? 8 : 0)
    + (PENDING_PATTERN.test(text) ? 6 : 0)
    + (URL_TEST_PATTERN.test(text) ? 4 : 0)
    + (text.includes('?') ? 2 : 0)
    + (text.length >= 35 && text.length <= 240 ? 3 : 0);
}

export function summarize(messages: CommunityMessage[], options: {
  maxItems?: number;
  allowedLinkDomains?: string[];
} = {}): Summary {
  const maxItems = Math.max(1, Math.min(options.maxItems || 5, 8));
  const valid = messages.filter((message) => message.text.trim().length >= 3);
  const ranked = [...valid].sort((a, b) => usefulScore(b) - usefulScore(a) || b.occurredAt.localeCompare(a.occurredAt));
  const highlights = unique(ranked.map((message) => shorten(message.text.replace(URL_PATTERN, ' '), 170)), maxItems);
  const decisions = unique(valid.filter((message) => DECISION_PATTERN.test(message.text)).map((message) => shorten(message.text, 170)), 3);
  const pendingItems = unique(valid.filter((message) => PENDING_PATTERN.test(message.text)).map((message) => shorten(message.text, 170)), 3);
  const links = unique(valid.flatMap((message) => message.text.match(URL_PATTERN) || [])
    .map((link) => safeLink(link, options.allowedLinkDomains))
    .filter((link): link is string => Boolean(link)), 5);
  const topics = dynamicTopics(valid);

  const lines = [`*Resumo — ${valid.length} mensagens*`];
  if (topics.length) lines.push(`\n*Temas:* ${topics.map((topic) => topic.label).join(' · ')}`);
  if (highlights.length) lines.push(`\n*Em resumo*\n${highlights.map((item) => `• ${item}`).join('\n')}`);
  if (decisions.length) lines.push(`\n*Decisões*\n${decisions.map((item) => `• ${item}`).join('\n')}`);
  if (pendingItems.length) lines.push(`\n*Pendências*\n${pendingItems.map((item) => `• ${item}`).join('\n')}`);
  if (links.length) lines.push(`\n*Links*\n${links.map((item) => `• ${item}`).join('\n')}`);
  if (!valid.length) lines.push('\nNenhuma mensagem disponível para resumir.');

  return { messageCount: valid.length, topics, highlights, decisions, pendingItems, links, renderedText: lines.join('\n') };
}

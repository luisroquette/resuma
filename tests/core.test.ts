import assert from 'node:assert/strict';
import test from 'node:test';
import {
  dueWeeklyCampaigns,
  dispatchDueWeeklyCampaigns,
  InMemoryCommunityStore,
  renderAnswer,
  ResumaEngine,
  searchHistory,
  summarize,
  type CommunityMessage,
  type MessageAdapter,
} from '../core';

const messages: CommunityMessage[] = [
  { kind: 'text', id: 'm1', groupId: 'g1', senderId: 'u1', senderName: 'Ana', text: 'Ficou definido que o workshop será terça às 19h.', occurredAt: '2026-08-14T12:00:00Z' },
  { kind: 'text', id: 'm2', groupId: 'g1', senderId: 'u2', senderName: 'Beto', text: 'Precisamos confirmar o auditório até amanhã.', occurredAt: '2026-08-14T12:10:00Z' },
  { kind: 'text', id: 'm3', groupId: 'g1', senderId: 'u3', text: 'Material: https://example.com/guia#parte', occurredAt: '2026-08-14T12:15:00Z' },
];

test('summary stays concise and derives topics from the actual messages', () => {
  const result = summarize(messages, { maxItems: 3, allowedLinkDomains: ['example.com'] });
  assert.equal(result.messageCount, 3);
  assert.ok(result.decisions[0].includes('workshop'));
  assert.ok(result.pendingItems[0].includes('auditório'));
  assert.deepEqual(result.links, ['https://example.com/guia']);
  assert.ok(result.renderedText.includes('•'));
  assert.equal(result.topics.some((topic) => topic.label === 'Vagas'), false);
});

test('summary omits topics when the conversation does not support a repeated theme', () => {
  const result = summarize(messages.slice(0, 2));
  assert.deepEqual(result.topics, []);
  assert.equal(result.renderedText.includes('*Temas:*'), false);
});

test('summary rejects links outside the allowlist', () => {
  const result = summarize([{ ...messages[2], text: 'Veja https://untrusted.example/file' }], { allowedLinkDomains: ['example.com'] });
  assert.deepEqual(result.links, []);
});

test('question search returns sources instead of inventing an answer', () => {
  const results = searchHistory('quando será o workshop?', messages);
  assert.equal(results[0].message.id, 'm1');
  assert.match(renderAnswer('quando será o workshop?', results), /Ana/);
  assert.match(renderAnswer('assunto inexistente', []), /Não encontrei evidência suficiente/);
});

test('engine ignores records from another group', async () => {
  const output: string[] = [];
  const adapter: MessageAdapter = { async sendText(_groupId, text) { output.push(text); return {}; } };
  const engine = new ResumaEngine({ groupId: 'g1' }, new InMemoryCommunityStore(), adapter);
  const result = await engine.process({ ...messages[0], groupId: 'g2' });
  assert.equal(result.status, 'ignored');
  assert.deepEqual(output, []);
});

test('engine answers !pergunta with a cited message', async () => {
  const output: string[] = [];
  const adapter: MessageAdapter = { async sendText(_groupId, text) { output.push(text); return {}; } };
  const engine = new ResumaEngine({ groupId: 'g1' }, new InMemoryCommunityStore(), adapter);
  await engine.process(messages[0]);
  const result = await engine.process({ kind: 'text', id: 'q1', groupId: 'g1', senderId: 'u2', text: '!pergunta quando será o workshop?', occurredAt: '2026-08-14T13:00:00Z' });
  assert.equal(result.status, 'sent');
  assert.match(output[0], /terça às 19h/);
});

test('commands are excluded from later summaries', async () => {
  const output: string[] = [];
  const adapter: MessageAdapter = { async sendText(_groupId, text) { output.push(text); return {}; } };
  const engine = new ResumaEngine({ groupId: 'g1' }, new InMemoryCommunityStore(), adapter);
  await engine.process(messages[0]);
  await engine.process({ kind: 'text', id: 'q1', groupId: 'g1', senderId: 'u2', text: '!pergunta quando será o workshop?', occurredAt: '2026-08-14T13:00:00Z' });
  await engine.process({ kind: 'text', id: 's1', groupId: 'g1', senderId: 'u2', text: '!resumo', occurredAt: '2026-08-14T13:01:00Z' });
  assert.equal(output[1].includes('!pergunta'), false);
});

test('participant exit sends one configured campaign above the system preview', async () => {
  const output: string[] = [];
  const adapter: MessageAdapter = { async sendText(_groupId, text) { output.push(text); return {}; } };
  const store = new InMemoryCommunityStore();
  const engine = new ResumaEngine({ groupId: 'g1', triggerCampaigns: [{ id: 'after-leave', trigger: 'participant_leave', text: 'Anúncio configurado' }] }, store, adapter);
  const event = { kind: 'participant_leave' as const, id: 'leave-1', groupId: 'g1', participantId: 'u9', occurredAt: '2026-08-14T13:00:00Z' };
  assert.equal((await engine.process(event)).status, 'sent');
  assert.equal((await engine.process(event)).status, 'duplicate');
  assert.deepEqual(output, ['Anúncio configurado']);
});

test('weekly campaigns use explicit timezone and one dispatch key per day', () => {
  const due = dueWeeklyCampaigns([{ id: 'weekly', weekday: 5, time: '12:00', text: 'Hello' }], new Date('2026-08-14T15:00:00Z'), 'America/Sao_Paulo');
  assert.equal(due.length, 1);
  assert.equal(due[0].dispatchKey, '2026-08-14:weekly');
});

test('weekly campaign dispatch is idempotent', async () => {
  const output: string[] = [];
  const adapter: MessageAdapter = { async sendText(_groupId, text) { output.push(text); return {}; } };
  const store = new InMemoryCommunityStore();
  const input = {
    campaigns: [{ id: 'weekly', weekday: 5 as const, time: '12:00' as const, text: 'Hello' }],
    groupId: 'g1',
    store,
    adapter,
    at: new Date('2026-08-14T15:00:00Z'),
    timeZone: 'America/Sao_Paulo',
  };
  assert.deepEqual(await dispatchDueWeeklyCampaigns(input), { due: 1, sent: 1, skipped: 0 });
  assert.deepEqual(await dispatchDueWeeklyCampaigns(input), { due: 1, sent: 0, skipped: 1 });
  assert.deepEqual(output, ['Hello']);
});

test('custom deterministic command is configurable', async () => {
  const output: string[] = [];
  const adapter: MessageAdapter = { async sendText(_groupId, text) { output.push(text); return {}; } };
  const engine = new ResumaEngine({ groupId: 'g1', commands: { '!regras': 'Be kind.' } }, new InMemoryCommunityStore(), adapter);
  await engine.process({ kind: 'text', id: 'c1', groupId: 'g1', senderId: 'u1', text: '!REGRAS.', occurredAt: '2026-08-14T13:00:00Z' });
  assert.deepEqual(output, ['Be kind.']);
});

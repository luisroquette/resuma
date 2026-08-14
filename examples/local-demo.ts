import { InMemoryCommunityStore, ResumaEngine, type MessageAdapter } from '../core';

const sent: string[] = [];
const adapter: MessageAdapter = {
  async sendText(groupId, text) {
    sent.push(text);
    console.log(`\n[send → ${groupId}]\n${text}`);
    return { providerMessageId: `local-${sent.length}` };
  },
};

const engine = new ResumaEngine({
  groupId: 'community-demo',
  commands: { '!regras': '1. Respeite as pessoas.\n2. Não publique dados pessoais.' },
  triggerCampaigns: [{
    id: 'leave-follow-up',
    trigger: 'participant_leave',
    text: '📌 Conheça os materiais gratuitos da comunidade: https://example.com/resources',
  }],
}, new InMemoryCommunityStore(), adapter);

async function main() {
  await engine.process({ kind: 'text', id: 'm1', groupId: 'community-demo', senderId: 'u1', senderName: 'Ana', text: 'Ficou definido que o encontro será terça às 19h.', occurredAt: '2026-08-14T12:00:00Z' });
  await engine.process({ kind: 'text', id: 'm2', groupId: 'community-demo', senderId: 'u2', senderName: 'Beto', text: 'Precisamos confirmar o auditório até amanhã.', occurredAt: '2026-08-14T12:10:00Z' });
  await engine.process({ kind: 'text', id: 'q1', groupId: 'community-demo', senderId: 'u3', text: '!pergunta quando será o encontro?', occurredAt: '2026-08-14T12:20:00Z' });
  await engine.process({ kind: 'text', id: 's1', groupId: 'community-demo', senderId: 'u3', text: '!resumo', occurredAt: '2026-08-14T12:21:00Z' });
  await engine.process({ kind: 'participant_leave', id: 'e1', groupId: 'community-demo', participantId: 'u4', occurredAt: '2026-08-14T12:22:00Z' });
}

void main();

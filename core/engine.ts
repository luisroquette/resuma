import { renderAnswer, searchHistory } from './search';
import { summarize } from './summary';
import type {
  CommunityMessage,
  CommunityRecord,
  CommunityStore,
  MessageAdapter,
  ProcessResult,
  ResumaConfig,
  TriggerCampaign,
} from './types';

function isMessage(record: CommunityRecord): record is CommunityMessage {
  return !record.kind.startsWith('participant_');
}

function validateRecord(record: CommunityRecord): void {
  if (!record.id.trim() || !record.groupId.trim()) throw new Error('Record id and groupId are required');
  if (Number.isNaN(new Date(record.occurredAt).getTime())) throw new Error('occurredAt must be a valid ISO date');
  if (isMessage(record) && (!record.senderId.trim() || !record.text.trim())) {
    throw new Error('Messages require senderId and text');
  }
  if (!isMessage(record) && !record.participantId.trim()) throw new Error('Participant events require participantId');
}

function campaignFor(record: CommunityRecord, campaigns: TriggerCampaign[]): TriggerCampaign | undefined {
  if (record.kind !== 'participant_join' && record.kind !== 'participant_leave') return undefined;
  const candidates = campaigns.filter((campaign) => campaign.enabled !== false && campaign.trigger === record.kind && campaign.text.trim());
  if (!candidates.length) return undefined;
  const hash = [...record.id].reduce((total, character) => total + character.charCodeAt(0), 0);
  return candidates[hash % candidates.length];
}

export class ResumaEngine {
  constructor(
    private readonly config: ResumaConfig,
    private readonly store: CommunityStore,
    private readonly adapter: MessageAdapter,
  ) {
    if (!config.groupId.trim()) throw new Error('config.groupId is required');
  }

  async process(record: CommunityRecord): Promise<ProcessResult> {
    validateRecord(record);
    if (record.groupId !== this.config.groupId) return { status: 'ignored' };
    await this.store.append(record);

    const campaign = campaignFor(record, this.config.triggerCampaigns || []);
    if (campaign) {
      const actionId = `trigger:${record.id}:${campaign.id}`;
      if (!(await this.store.claim(actionId))) return { status: 'duplicate' };
      await this.adapter.sendText(record.groupId, campaign.text);
      return { status: 'sent', reason: 'trigger_campaign', text: campaign.text };
    }

    if (!isMessage(record)) return { status: 'stored' };
    const commandText = record.text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[.?]+$/g, '');
    if (!commandText.startsWith('!')) return { status: 'stored' };

    const history = (await this.store.list(record.groupId))
      .filter(isMessage)
      .filter((message) => !message.text.trim().startsWith('!'));
    let reply: string | undefined;
    if (commandText === '!resumo') {
      reply = summarize(history, {
        maxItems: this.config.maxSummaryItems,
        allowedLinkDomains: this.config.allowedLinkDomains,
      }).renderedText;
    } else if (commandText.startsWith('!pergunta ')) {
      const question = record.text.trim().slice(record.text.trim().indexOf(' ') + 1);
      reply = renderAnswer(question, searchHistory(question, history, this.config.maxSearchResults));
    } else {
      reply = Object.entries(this.config.commands || {})
        .find(([alias]) => alias.trim().toLowerCase().replace(/[.?]+$/g, '') === commandText)?.[1];
    }

    if (!reply) return { status: 'stored' };
    const actionId = `command:${record.id}`;
    if (!(await this.store.claim(actionId))) return { status: 'duplicate' };
    await this.adapter.sendText(record.groupId, reply);
    return { status: 'sent', reason: 'command', text: reply };
  }
}

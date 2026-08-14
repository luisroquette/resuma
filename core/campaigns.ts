import type { CommunityStore, MessageAdapter, WeeklyCampaign } from './types';

function localParts(at: Date, timeZone: string): { weekday: number; time: string; date: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(at);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || '';
  const weekdays: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    weekday: weekdays[value('weekday')],
    time: `${value('hour')}:${value('minute')}`,
    date: `${value('year')}-${value('month')}-${value('day')}`,
  };
}

export function dueWeeklyCampaigns(campaigns: WeeklyCampaign[], at = new Date(), timeZone = 'UTC') {
  const local = localParts(at, timeZone);
  return campaigns
    .filter((campaign) => campaign.enabled !== false && campaign.weekday === local.weekday && campaign.time === local.time)
    .map((campaign) => ({ ...campaign, dispatchKey: `${local.date}:${campaign.id}` }));
}

export async function dispatchDueWeeklyCampaigns(input: {
  campaigns: WeeklyCampaign[];
  groupId: string;
  store: CommunityStore;
  adapter: MessageAdapter;
  at?: Date;
  timeZone?: string;
}): Promise<{ due: number; sent: number; skipped: number }> {
  const due = dueWeeklyCampaigns(input.campaigns, input.at, input.timeZone);
  const result = { due: due.length, sent: 0, skipped: 0 };
  for (const campaign of due) {
    if (!(await input.store.claim(`weekly:${input.groupId}:${campaign.dispatchKey}`))) {
      result.skipped += 1;
      continue;
    }
    await input.adapter.sendText(input.groupId, campaign.text);
    result.sent += 1;
  }
  return result;
}

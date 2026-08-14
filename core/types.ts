export type MessageKind = 'text' | 'image_caption' | 'video_caption' | 'document_caption';

export type CommunityMessage = {
  kind: MessageKind;
  id: string;
  groupId: string;
  senderId: string;
  senderName?: string;
  text: string;
  occurredAt: string;
};

export type ParticipantEvent = {
  kind: 'participant_join' | 'participant_leave';
  id: string;
  groupId: string;
  participantId: string;
  participantName?: string;
  occurredAt: string;
};

export type CommunityRecord = CommunityMessage | ParticipantEvent;

export type Summary = {
  messageCount: number;
  topics: Array<{ label: string; count: number }>;
  highlights: string[];
  decisions: string[];
  pendingItems: string[];
  links: string[];
  renderedText: string;
};

export type SearchResult = {
  message: CommunityMessage;
  score: number;
  matchedTerms: string[];
};

export type TriggerCampaign = {
  id: string;
  trigger: 'participant_join' | 'participant_leave';
  text: string;
  enabled?: boolean;
};

export type WeeklyCampaign = {
  id: string;
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  time: `${number}:${number}`;
  text: string;
  enabled?: boolean;
};

export interface CommunityStore {
  append(record: CommunityRecord): Promise<void>;
  list(groupId: string): Promise<CommunityRecord[]>;
  claim(actionId: string): Promise<boolean>;
}

export interface MessageAdapter {
  sendText(groupId: string, text: string): Promise<{ providerMessageId?: string }>;
}

export type ResumaConfig = {
  groupId: string;
  allowedLinkDomains?: string[];
  maxSummaryItems?: number;
  maxSearchResults?: number;
  triggerCampaigns?: TriggerCampaign[];
  commands?: Record<string, string>;
};

export type ProcessResult =
  | { status: 'ignored' | 'stored' | 'duplicate' }
  | { status: 'sent'; reason: 'command' | 'trigger_campaign'; text: string };

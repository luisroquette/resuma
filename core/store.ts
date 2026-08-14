import type { CommunityRecord, CommunityStore } from './types';

export class InMemoryCommunityStore implements CommunityStore {
  private readonly records = new Map<string, CommunityRecord[]>();
  private readonly claims = new Set<string>();

  async append(record: CommunityRecord): Promise<void> {
    const group = this.records.get(record.groupId) || [];
    if (!group.some((existing) => existing.id === record.id)) group.push(structuredClone(record));
    this.records.set(record.groupId, group);
  }

  async list(groupId: string): Promise<CommunityRecord[]> {
    return structuredClone(this.records.get(groupId) || []);
  }

  async claim(actionId: string): Promise<boolean> {
    if (this.claims.has(actionId)) return false;
    this.claims.add(actionId);
    return true;
  }
}

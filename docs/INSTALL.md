# Install Resuma Core

The public core is a deterministic TypeScript reference implementation. It does not require a paid AI API and never connects to WhatsApp by itself.

## 1. Clone and validate

```bash
git clone https://github.com/luisroquette/resuma.git
cd resuma
npm ci
npm test
npm run demo
```

## 2. Implement the two ports

Provide a `CommunityStore` for durable, group-scoped history and idempotency, plus a `MessageAdapter` for your authorized messaging provider.

```ts
import { ResumaEngine, type CommunityStore, type MessageAdapter } from './core';

const store: CommunityStore = /* your durable implementation */;
const adapter: MessageAdapter = /* your authorized provider */;

const engine = new ResumaEngine({
  groupId: process.env.AUTHORIZED_GROUP_ID!,
  allowedLinkDomains: ['example.org'],
  triggerCampaigns: [{
    id: 'after-leave',
    trigger: 'participant_leave',
    text: 'A configured community announcement',
  }],
}, store, adapter);
```

Normalize the provider webhook into a `CommunityMessage` or `ParticipantEvent`, then call `engine.process(record)`.

## 3. Preserve the safety boundaries

1. Accept events only from explicitly authorized groups.
2. Verify webhook authenticity before normalization.
3. Store credentials only in server-side environment variables.
4. Use a durable atomic implementation of `claim` in production.
5. Obtain administrator authorization and disclose retention before capturing history.

The included `InMemoryCommunityStore` is for tests and local demonstrations only. It loses data on restart and must not be used as a production database.

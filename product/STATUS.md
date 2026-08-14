# Product Status

This document is the public source of truth for product claims. Website copy and repository documentation must not describe roadmap work as released.

## Available in the public core

| Capability | Status | Public implementation |
|---|---|---|
| Concise deterministic summaries | Available | `core/summary.ts` |
| Sourced `!pergunta` search | Available | `core/search.ts` and `core/engine.ts` |
| Configurable commands | Available | `core/engine.ts` |
| Participant join and leave events | Available | Provider-neutral event types in `core/types.ts` |
| Triggered and weekly campaigns | Available | `core/engine.ts` and `core/campaigns.ts` |

The public core ships without a WhatsApp provider, production database, tenant dashboard, or customer configuration. The local demo uses only simulated data.

## Available in the current pilot

| Capability | Status | Evidence in the private pilot implementation |
|---|---|---|
| Concise text summaries | Available | Structured generation, persistence, scheduled delivery, and retry handling |
| Sourced `!pergunta` search | Available | Command parsing, historical lookup, source references, and low-confidence fallback |
| Configured campaigns | Available | Scheduled promotions, trigger-based replies, idempotent dispatch, and administrator controls |
| Group events | Available | Participant join and leave ingestion plus configurable follow-up flows |
| WhatsApp-native commands | Available | Command routing and replies inside the authorized group |

## In development

| Capability | Status | Release requirement |
|---|---|---|
| Automatically produced podcast | In development | A complete synthesis, delivery, consent, and quality-controlled production path |
| Advanced moderation | In development | Configurable policies, appeals, audit logs, and administrator controls |
| Multi-community administration | In development | Tenant isolation, onboarding, permissions, and an independent dashboard |
| Self-service onboarding | In development | Safe authorization, group selection, disclosure, and revocation flows |

## Public claim rules

1. Say "pilot", not "generally available".
2. Say "selected groups use it for free", not "free forever".
3. Label simulated WhatsApp conversations as demonstrations.
4. Never claim official affiliation with WhatsApp or Meta.
5. Never expose the private pilot's credentials, customer data, or organization-specific code.

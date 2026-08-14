# Contributing to Resuma

Resuma includes a provider-neutral open-source core and a manually managed private pilot. Contributions to the core, adapters, documentation, accessibility, performance, localization, and tests are welcome.

## Before opening a pull request

1. Open an issue describing one bounded problem.
2. Keep product claims aligned with [product/STATUS.md](product/STATUS.md).
3. Never add real group messages, participant data, credentials, production identifiers, or organization-specific campaign copy.
4. Run `npm test` and include the result in the pull request.
5. Keep repository documentation and code comments in English.

## Local setup

```bash
npm install
npm test
npm run demo
```

## Pull requests

Use a focused branch and explain what changed, why it changed, user impact, and validation. Simulated WhatsApp examples must be visibly labeled as demonstrations.

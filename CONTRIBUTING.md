# Contributing to Resuma

Resuma is in a manually managed pilot. Contributions are currently limited to the public website, documentation, accessibility, performance, localization, and test coverage.

## Before opening a pull request

1. Open an issue describing one bounded problem.
2. Keep product claims aligned with [product/STATUS.md](product/STATUS.md).
3. Never add real group messages, participant data, credentials, or private pilot code.
4. Run `npm test` and include the result in the pull request.
5. Keep repository documentation and code comments in English.

## Local setup

```bash
npm install
npm run serve
npm test
```

## Pull requests

Use a focused branch and explain what changed, why it changed, user impact, and validation. Simulated WhatsApp examples must be visibly labeled as demonstrations.

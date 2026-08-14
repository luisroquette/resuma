# Graph Report - resuma-graphify-20260814  (2026-08-14)

## Corpus Check
- 38 files · ~80,781 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 231 nodes · 332 edges · 20 communities (19 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Engine Campaigns and Store
- Brand Governance and Claims
- Package and Scripts
- TypeScript Build Configuration
- Social Preview Content
- Visual Brand System
- Search and Summarization
- Open Core Product Scope
- Commercial Hero
- Install and Adapters
- Playwright Site Tests
- Commercial Site Interactions
- Dark Logo Lockup
- Light Logo Lockup
- Public Demo Interactions
- Site Signal Mark
- Docs Signal Mark
- Dark Site Mark
- Core Brand Mark
- CI Validation

## God Nodes (most connected - your core abstractions)
1. `summarize()` - 10 edges
2. `CommunityStore` - 10 edges
3. `compilerOptions` - 10 edges
4. `Resuma Brand System` - 10 edges
5. `Resuma` - 9 edges
6. `InMemoryCommunityStore` - 8 edges
7. `MessageAdapter` - 8 edges
8. `scripts` - 8 edges
9. `searchHistory()` - 7 edges
10. `CommunityRecord` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Public claim alignment` --semantically_similar_to--> `Public source of truth for product claims`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → product/STATUS.md
- `Open at the core, private at the edges` --semantically_similar_to--> `Explicit connectivity and storage adapter boundaries`  [INFERRED] [semantically similar]
  docs/index.html → README.md
- `Purpose-limited access to authorized groups` --semantically_similar_to--> `Group isolation, idempotency, explicit authorization, and server-only credentials`  [INFERRED] [semantically similar]
  site/index.html → SECURITY.md
- `Confidence over invention` --semantically_similar_to--> `Evidence over promises`  [INFERRED] [semantically similar]
  docs/index.html → brand/BRAND.md
- `Roadmap features must not be presented as released` --semantically_similar_to--> `Public source of truth for product claims`  [INFERRED] [semantically similar]
  brand/BRAND.md → product/STATUS.md

## Import Cycles
- 1-file cycle: `tests/core.test.ts -> tests/core.test.ts`
- 1-file cycle: `playwright.config.js -> playwright.config.js`

## Hyperedges (group relationships)
- **Resuma Core Color Palette** — brand_concepts_resuma_brand_board_v1_charcoal, brand_concepts_resuma_brand_board_v1_ivory, brand_concepts_resuma_brand_board_v1_signal_lime, brand_concepts_resuma_brand_board_v1_graphite_palette [EXTRACTED 1.00]
- **Resuma Visual Identity** — brand_concepts_resuma_brand_board_v1_resuma_logo, brand_concepts_resuma_brand_board_v1_signal_lime, brand_concepts_resuma_brand_board_v1_inter, brand_concepts_resuma_brand_board_v1_jetbrains_mono [EXTRACTED 1.00]
- **Resuma Product Expression** — brand_concepts_resuma_brand_board_v1_resuma_domain, brand_concepts_resuma_brand_board_v1_product_interface, brand_concepts_resuma_brand_board_v1_content_categories [EXTRACTED 1.00]
- **Resuma Core Product Outputs** — docs_assets_og_resuma_close_summaries, docs_assets_og_resuma_searchable_memory, docs_assets_og_resuma_source_backed_answers [EXTRACTED 1.00]
- **Daily Signal Contents** — docs_assets_og_resuma_workshop_confirmation, docs_assets_og_resuma_registration_deadline, docs_assets_og_resuma_preserved_links [EXTRACTED 1.00]
- **Resuma Mark Visual Composition** — site_assets_resuma_mark_progressively_shorter_lines, site_assets_resuma_mark_signal_dot, site_assets_resuma_mark_signal_lime [EXTRACTED 1.00]

## Communities (20 total, 1 thin omitted)

### Community 0 - "Engine Campaigns and Store"
Cohesion: 0.11
Nodes (28): dispatchDueWeeklyCampaigns(), dueWeeklyCampaigns(), localParts(), campaignFor(), isMessage(), ResumaEngine, validateRecord(), renderAnswer() (+20 more)

### Community 1 - "Brand Governance and Claims"
Cohesion: 0.09
Nodes (25): Evidence over promises, Progressive reduction from conversation noise to clear signal, Roadmap features must not be presented as released, Resuma brand system, Resuma contribution policy, Public claim alignment, Sensitive and organization-specific data exclusion, Visible labeling of simulated WhatsApp demonstrations (+17 more)

### Community 2 - "Package and Scripts"
Cohesion: 0.09
Nodes (21): description, devDependencies, @playwright/test, @types/node, typescript, engines, node, name (+13 more)

### Community 3 - "TypeScript Build Configuration"
Cohesion: 0.11
Nodes (17): core/**/*.ts, dist, examples/**/*.ts, node_modules, tests/**/*.ts, compilerOptions, esModuleInterop, forceConsistentCasingInFileNames (+9 more)

### Community 4 - "Social Preview Content"
Cohesion: 0.17
Nodes (15): Authorized WhatsApp Group Conversations, Close Summaries, Community Conversation Compressed into Signal, Today, in Three Points, View on GitHub, Manually Managed Pilot, No App Switching for Members, 126 Messages Organized (+7 more)

### Community 5 - "Visual Brand System"
Cohesion: 0.19
Nodes (13): Charcoal #0C1110, Resumo, Insights and Sinais, Graphite Color Scale, Information Convergence Motif, Inter Primary Typeface, Ivory #F3F1E8, JetBrains Mono Secondary Typeface, Resuma Product Interface (+5 more)

### Community 6 - "Search and Summarization"
Cohesion: 0.37
Nodes (10): searchHistory(), dynamicTopics(), safeLink(), summarize(), usefulScore(), normalize(), shorten(), STOP_WORDS (+2 more)

### Community 7 - "Open Core Product Scope"
Cohesion: 0.25
Nodes (9): Open at the core, private at the edges, Authorized group conversations, Concise summaries, Configured campaigns, Explicit connectivity and storage adapter boundaries, Participant join and leave events, Organization-specific private pilot, Provider-neutral deterministic open-source core (+1 more)

### Community 8 - "Commercial Hero"
Cohesion: 0.28
Nodes (9): Resuma commercial website hero, Resumo do dia summary card, Free pilot for communities, WhatsApp group conversation fragments, Quero testar gratuitamente call to action, Use in a real community, Resuma brand identity, Conversation compressed into useful signal (+1 more)

### Community 9 - "Install and Adapters"
Cohesion: 0.29
Nodes (8): Resuma GitHub Pages public demo, CommunityStore port, InMemoryCommunityStore is limited to tests and local demos, Install Resuma Core, MessageAdapter port, Production safety boundaries, ResumaEngine integration flow, Public crawl policy and sitemap declaration

### Community 10 - "Playwright Site Tests"
Cohesion: 0.29
Nodes (4): { defineConfig, devices }, @playwright/test, { test, expect }, { test, expect }

### Community 11 - "Commercial Site Interactions"
Cohesion: 0.29
Nodes (5): header, menu, menuButton, reveals, year

### Community 12 - "Dark Logo Lockup"
Cohesion: 0.33
Nodes (6): Charcoal rounded background, Resuma dark lockup logo, resuma wordmark, Signal lime, Signal mark with three descending rounded bars and a circle, Warm ivory

### Community 13 - "Light Logo Lockup"
Cohesion: 0.40
Nodes (6): Charcoal, Resuma light lockup logo, resuma wordmark, Signal lime, Signal mark with three descending rounded bars and a circle, Warm ivory rounded background

### Community 14 - "Public Demo Interactions"
Cohesion: 0.33
Nodes (4): demo, demoContent, header, year

### Community 15 - "Site Signal Mark"
Cohesion: 0.53
Nodes (6): Accessible Image Metadata, Three Progressively Shorter Lines, Resuma Mark, Signal Dot, Signal Lime #B7FF4A, Transformation into a Signal

### Community 16 - "Docs Signal Mark"
Cohesion: 0.50
Nodes (5): Three progressively smaller lines, Resuma mark, Signal, Signal lime, Circular signal point

### Community 17 - "Dark Site Mark"
Cohesion: 0.50
Nodes (5): Charcoal, Circular point, Three progressively shorter rounded bars, Resuma dark mark, Abstract signal

### Community 18 - "Core Brand Mark"
Cohesion: 0.67
Nodes (4): Three progressively shorter conversation lines, Conversation signal, Resuma mark, Signal point

## Knowledge Gaps
- **83 isolated node(s):** `STOP_WORDS`, `MessageKind`, `header`, `year`, `demoContent` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Resuma` connect `Brand Governance and Claims` to `Install and Adapters`, `Open Core Product Scope`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Provider-neutral deterministic open-source core` connect `Open Core Product Scope` to `Brand Governance and Claims`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `STOP_WORDS`, `MessageKind`, `header` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Engine Campaigns and Store` be split into smaller, more focused modules?**
  _Cohesion score 0.10505050505050505 - nodes in this community are weakly interconnected._
- **Should `Brand Governance and Claims` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Should `Package and Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `TypeScript Build Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
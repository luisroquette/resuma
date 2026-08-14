# Graph Report - resuma-graphify-20260814  (2026-08-14)

## Corpus Check
- 25 files · ~80,781 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 228 nodes · 327 edges · 22 communities (18 shown, 4 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `306ee12b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.ts
- Product Status
- scripts
- compilerOptions
- Resuma
- Resuma Brand System
- summary.ts
- Provider-neutral deterministic open-source core
- Resuma commercial website hero
- Install Resuma Core
- playwright.config.js
- site/script.js
- Resuma dark lockup logo
- Resuma light lockup logo
- docs/script.js
- Resuma Mark
- Resuma mark
- Resuma dark mark
- Three progressively shorter conversation lines
- Core and browser test validation
- pages.spec.js
- site.spec.js

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
- `Purpose-limited access to authorized groups` --semantically_similar_to--> `Group isolation, idempotency, explicit authorization, and server-only credentials`  [INFERRED] [semantically similar]
  site/index.html → SECURITY.md
- `Confidence over invention` --semantically_similar_to--> `Evidence over promises`  [INFERRED] [semantically similar]
  docs/index.html → brand/BRAND.md
- `Roadmap features must not be presented as released` --semantically_similar_to--> `Public source of truth for product claims`  [INFERRED] [semantically similar]
  brand/BRAND.md → product/STATUS.md
- `Public claim alignment` --semantically_similar_to--> `Public source of truth for product claims`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → product/STATUS.md
- `Open at the core, private at the edges` --semantically_similar_to--> `Explicit connectivity and storage adapter boundaries`  [INFERRED] [semantically similar]
  docs/index.html → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Resuma Core Color Palette** — brand_concepts_resuma_brand_board_v1_charcoal, brand_concepts_resuma_brand_board_v1_ivory, brand_concepts_resuma_brand_board_v1_signal_lime, brand_concepts_resuma_brand_board_v1_graphite_palette [EXTRACTED 1.00]
- **Resuma Product Expression** — brand_concepts_resuma_brand_board_v1_resuma_domain, brand_concepts_resuma_brand_board_v1_product_interface, brand_concepts_resuma_brand_board_v1_content_categories [EXTRACTED 1.00]
- **Resuma Visual Identity** — brand_concepts_resuma_brand_board_v1_resuma_logo, brand_concepts_resuma_brand_board_v1_signal_lime, brand_concepts_resuma_brand_board_v1_inter, brand_concepts_resuma_brand_board_v1_jetbrains_mono [EXTRACTED 1.00]
- **Resuma Core Product Outputs** — docs_assets_og_resuma_close_summaries, docs_assets_og_resuma_searchable_memory, docs_assets_og_resuma_source_backed_answers [EXTRACTED 1.00]
- **Daily Signal Contents** — docs_assets_og_resuma_workshop_confirmation, docs_assets_og_resuma_registration_deadline, docs_assets_og_resuma_preserved_links [EXTRACTED 1.00]
- **Resuma Mark Visual Composition** — site_assets_resuma_mark_progressively_shorter_lines, site_assets_resuma_mark_signal_dot, site_assets_resuma_mark_signal_lime [EXTRACTED 1.00]

## Communities (22 total, 4 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.11
Nodes (26): dispatchDueWeeklyCampaigns(), dueWeeklyCampaigns(), localParts(), campaignFor(), isMessage(), ResumaEngine, validateRecord(), renderAnswer() (+18 more)

### Community 1 - "Product Status"
Cohesion: 0.09
Nodes (25): Evidence over promises, Progressive reduction from conversation noise to clear signal, Roadmap features must not be presented as released, Resuma brand system, Resuma contribution policy, Public claim alignment, Sensitive and organization-specific data exclusion, Visible labeling of simulated WhatsApp demonstrations (+17 more)

### Community 2 - "scripts"
Cohesion: 0.09
Nodes (21): description, devDependencies, @playwright/test, @types/node, typescript, engines, node, name (+13 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (17): core/**/*.ts, dist, examples/**/*.ts, node_modules, tests/**/*.ts, compilerOptions, esModuleInterop, forceConsistentCasingInFileNames (+9 more)

### Community 4 - "Resuma"
Cohesion: 0.17
Nodes (15): Authorized WhatsApp Group Conversations, Close Summaries, Community Conversation Compressed into Signal, Today, in Three Points, View on GitHub, Manually Managed Pilot, No App Switching for Members, 126 Messages Organized (+7 more)

### Community 5 - "Resuma Brand System"
Cohesion: 0.19
Nodes (13): Charcoal #0C1110, Resumo, Insights and Sinais, Graphite Color Scale, Information Convergence Motif, Inter Primary Typeface, Ivory #F3F1E8, JetBrains Mono Secondary Typeface, Resuma Product Interface (+5 more)

### Community 6 - "summary.ts"
Cohesion: 0.37
Nodes (10): searchHistory(), dynamicTopics(), safeLink(), summarize(), usefulScore(), normalize(), shorten(), STOP_WORDS (+2 more)

### Community 7 - "Provider-neutral deterministic open-source core"
Cohesion: 0.25
Nodes (9): Open at the core, private at the edges, Authorized group conversations, Concise summaries, Configured campaigns, Explicit connectivity and storage adapter boundaries, Participant join and leave events, Organization-specific private pilot, Provider-neutral deterministic open-source core (+1 more)

### Community 8 - "Resuma commercial website hero"
Cohesion: 0.28
Nodes (9): Resuma commercial website hero, Resumo do dia summary card, Free pilot for communities, WhatsApp group conversation fragments, Quero testar gratuitamente call to action, Use in a real community, Resuma brand identity, Conversation compressed into useful signal (+1 more)

### Community 9 - "Install Resuma Core"
Cohesion: 0.29
Nodes (8): Resuma GitHub Pages public demo, CommunityStore port, InMemoryCommunityStore is limited to tests and local demos, Install Resuma Core, MessageAdapter port, Production safety boundaries, ResumaEngine integration flow, Public crawl policy and sitemap declaration

### Community 11 - "site/script.js"
Cohesion: 0.29
Nodes (5): header, menu, menuButton, reveals, year

### Community 12 - "Resuma dark lockup logo"
Cohesion: 0.33
Nodes (6): Charcoal rounded background, Resuma dark lockup logo, resuma wordmark, Signal lime, Signal mark with three descending rounded bars and a circle, Warm ivory

### Community 13 - "Resuma light lockup logo"
Cohesion: 0.40
Nodes (6): Charcoal, Resuma light lockup logo, resuma wordmark, Signal lime, Signal mark with three descending rounded bars and a circle, Warm ivory rounded background

### Community 14 - "docs/script.js"
Cohesion: 0.33
Nodes (4): demo, demoContent, header, year

### Community 15 - "Resuma Mark"
Cohesion: 0.53
Nodes (6): Accessible Image Metadata, Three Progressively Shorter Lines, Resuma Mark, Signal Dot, Signal Lime #B7FF4A, Transformation into a Signal

### Community 16 - "Resuma mark"
Cohesion: 0.50
Nodes (5): Three progressively smaller lines, Resuma mark, Signal, Signal lime, Circular signal point

### Community 17 - "Resuma dark mark"
Cohesion: 0.50
Nodes (5): Charcoal, Circular point, Three progressively shorter rounded bars, Resuma dark mark, Abstract signal

### Community 18 - "Three progressively shorter conversation lines"
Cohesion: 0.67
Nodes (4): Three progressively shorter conversation lines, Conversation signal, Resuma mark, Signal point

## Knowledge Gaps
- **81 isolated node(s):** `STOP_WORDS`, `MessageKind`, `header`, `year`, `demoContent` (+76 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Resuma` connect `Product Status` to `Install Resuma Core`, `Provider-neutral deterministic open-source core`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Provider-neutral deterministic open-source core` connect `Provider-neutral deterministic open-source core` to `Product Status`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `STOP_WORDS`, `MessageKind`, `header` to the rest of the system?**
  _81 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11295681063122924 - nodes in this community are weakly interconnected._
- **Should `Product Status` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
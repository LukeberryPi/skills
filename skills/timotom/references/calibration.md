# Calibration from the review corpus

This reference records why the skill behaves as it does. It is evidence for calibration, not an extra checklist to load during every review.

## Corpus manifest

The corpus was retrieved on 2026-09-24 with the authenticated GitHub CLI from `BauerXcel/rayo-web` and `BauerXcel/uk-audio-services-tesla`. It includes all visible comments authored by `tomellwood` or `haapti` on three GitHub pull-request surfaces:

| Repository | Reviewer | Inline diff comments | PR conversation comments | Non-empty review bodies | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| rayo-web | tomellwood | 1,300 | 39 | 41 | 1,380 |
| rayo-web | haapti | 976 | 30 | 20 | 1,026 |
| uk-audio-services-tesla | tomellwood | 976 | 58 | 48 | 1,082 |
| uk-audio-services-tesla | haapti | 292 | 12 | 34 | 338 |
| **Total** |  | **3,544** | **139** | **143** | **3,826** |

The dates run from 2018-12-11 through 2026-09-24. All 3,826 records had unique `(kind, database_id)` pairs and non-empty bodies.

Collection used `gh api` with explicit pagination over repository pull-request review comments and issue comments, filtering issue comments against the complete pull-request number set. Review bodies came from batched GraphQL queries over every pull request; all review connections reported `hasNextPage: false` after 100 results. Expected REST page counts were reconciled: rayo-web had 46 review-comment pages and 57 issue-comment pages; Tesla had 22 and 4. This can establish completeness only for comments visible to the authenticated account at retrieval time; deleted or inaccessible records cannot be recovered.

## Shared values with representative evidence

### Trace behavior across variants

Both reviewers routinely leave the local line and ask what happens in the other real path. Haapti asks whether a disabled drawer flag preserves production behavior across Planet Radio and Nordic brands ([Tesla PR 832](https://github.com/BauerXcel/uk-audio-services-tesla/pull/832#pullrequestreview-884065387)) and whether branding changes still work without Rayo branding ([Tesla PR 1296](https://github.com/BauerXcel/uk-audio-services-tesla/pull/1296#pullrequestreview-2060843759)). Tom checks whether a new value is already consumed elsewhere before endorsing its removal ([rayo-web PR 1668](https://github.com/BauerXcel/rayo-web/pull/1668#discussion_r4091287427)).

### Respect contracts and sources of truth

Generated artifacts are not treated as editable truth. Haapti redirects an `api.ts` edit to the OpenAPI source ([Tesla PR 832](https://github.com/BauerXcel/uk-audio-services-tesla/pull/832#discussion_r806068533)); Tom similarly asks for a client change to be generated from `listenApiSpec.json` ([Tesla PR 591](https://github.com/BauerXcel/uk-audio-services-tesla/pull/591#discussion_r589456873)). Current comments still defend strict typing rather than widening it without cause ([rayo-web PR 1668](https://github.com/BauerXcel/rayo-web/pull/1668#discussion_r4083564915)).

### Remove duplication and accidental complexity

Tom frequently searches for the existing helper before accepting another file, as with token decoding in [rayo-web PR 1668](https://github.com/BauerXcel/rayo-web/pull/1668#discussion_r4083627066). Haapti pushes configuration toward a single established helper instead of mock-only config in [rayo-web PR 1529](https://github.com/BauerXcel/rayo-web/pull/1529#discussion_r3794541503). The corpus contains 388 Tom comments and 191 Haapti comments matching removal, reuse, duplication, or unnecessary-complexity terms.

### Probe edge cases and lifecycle symmetry

Tom catches mutation that empties caller-owned data after repeated `splice` calls ([Tesla PR 151](https://github.com/BauerXcel/uk-audio-services-tesla/pull/151#discussion_r298925846)). Haapti checks cleanup symmetry when an unavailable consent API can break `removeEventListener` ([Tesla PR 1060](https://github.com/BauerXcel/uk-audio-services-tesla/pull/1060#discussion_r1022655660)). Questions about empty data, unset state, loading, fallback, errors, retries, and timeouts appear throughout both histories.

### Treat accessibility and visual behavior as correctness

The reviews cover semantic nesting ([Tesla PR 17](https://github.com/BauerXcel/uk-audio-services-tesla/pull/17#discussion_r250566290)), mandatory accessible names for icon buttons ([rayo-web PR 104](https://github.com/BauerXcel/rayo-web/pull/104#discussion_r1502294031)), initial focus in modals ([Tesla PR 841](https://github.com/BauerXcel/uk-audio-services-tesla/pull/841#discussion_r813886847)), dark-mode regressions with screenshot evidence ([rayo-web PR 1401](https://github.com/BauerXcel/rayo-web/pull/1401#discussion_r3638269422)), and long-title overflow on desktop and mobile ([Tesla PR 918](https://github.com/BauerXcel/uk-audio-services-tesla/pull/918#pullrequestreview-979693212)).

### Verify runtime, performance, and boundaries

Haapti prefers server components with only the user-dependent portion isolated to the client ([rayo-web PR 1456](https://github.com/BauerXcel/rayo-web/pull/1456#discussion_r3703326463)) and reasons about framework cache behavior around auth headers ([rayo-web PR 1529](https://github.com/BauerXcel/rayo-web/pull/1529#discussion_r3794900194)). Tom flags data over-fetching while explicitly calibrating it as non-blocking ([rayo-web PR 642](https://github.com/BauerXcel/rayo-web/pull/642#pullrequestreview-3016562467)). Browser and third-party behavior are tested rather than assumed, as in Tom's IE compatibility question ([Tesla PR 253](https://github.com/BauerXcel/uk-audio-services-tesla/pull/253#discussion_r330063069)).

### Honor product, analytics, and localization contracts

Tom follows analytics names and ownership back to the design source, including distinguishing the filter trigger from filter selection ([rayo-web PR 1596](https://github.com/BauerXcel/rayo-web/pull/1596#discussion_r3970589846)). Haapti treats translation workflow and visual review as merge criteria ([rayo-web PR 242](https://github.com/BauerXcel/rayo-web/pull/242#pullrequestreview-2240682622)) and asks for context that lets translators choose meaningful landmark labels ([rayo-web PR 1548](https://github.com/BauerXcel/rayo-web/pull/1548#discussion_r3810684429)).

## Reviewer calibration

Tom's reviews are broad and explicitly calibrated. His corpus contains 219 `[question]` and 92 `[minor]` prefixes. He commonly searches for existing code, checks exact product or analytics meaning, and distinguishes a useful thought from a merge blocker. He also retracts a concern when the surrounding code disproves it ([rayo-web PR 1668](https://github.com/BauerXcel/rayo-web/pull/1668#discussion_r4092796239)) and summarizes when all comments are non-blocking questions ([rayo-web PR 569](https://github.com/BauerXcel/rayo-web/pull/569#pullrequestreview-2843560592)).

Haapti's reviews more often turn runtime knowledge into direct checks or change requests: run the typechecker against the current branch state, verify the feature-disabled path, inspect the real UI across viewports and themes, keep generated sources and dependencies exact, complete translation workflow, and cover regional behavior. The corpus includes 18 non-empty `CHANGES_REQUESTED` review summaries from Haapti versus 5 `COMMENTED` summaries, reflecting that directness without making every observation blocking.

The combined standard is therefore: Tom's breadth, repository memory, and uncertainty calibration plus Haapti's runtime matrix, source-of-truth discipline, and hands-on verification.

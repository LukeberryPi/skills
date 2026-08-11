# Research: evidence base for an `a11y-maxxing` skill

Research date: 2026-08-11

## Question

What process, test coverage, tool configuration, and completion gates should a Codex skill use when asked to maximize the accessibility of a web interface?

## Executive conclusions

1. The skill should optimize **accessible task completion**, with WCAG 2.2 AA as a minimum target when the scope permits. It should not optimize an axe violation count or Lighthouse score. WCAG conformance applies to complete pages, responsive variations, and every page in a complete process; Level AA requires every applicable Level A and AA success criterion, not a favorable aggregate score ([WCAG 2.2, Conformance Requirements](https://www.w3.org/TR/WCAG22/#conformance-reqs)).
2. Use one repeatable **evidence loop**: define scope and support baseline; inventory representative views, states, and complete journeys; capture automated and manual baselines; prioritize; remediate; rerun the same evidence; record unresolved findings. W3C's evaluation methodology follows the same broad shape: define scope, explore the product, select a representative sample, evaluate it, and report findings ([WCAG-EM 2.0](https://www.w3.org/TR/wcag-em-2/)).
3. Automated tools are necessary but cannot establish accessibility or WCAG conformance. W3C states that no tool alone can determine whether a site meets accessibility standards and that knowledgeable human evaluation is required ([WAI Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/)). Axe itself reports uncertain results as `incomplete`, requiring manual review ([axe-core README](https://github.com/dequelabs/axe-core)).
4. A static scan of one URL is not enough for an application. Axe does not test hidden UI such as inactive menus or closed dialogs; its own API documentation instructs tests to expose those regions and rerun analysis ([axe-core API notes](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#section-2-api-reference)). The CLI is not a crawler ([axe CLI README](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/cli/README.md#usage)).
5. The durable core should be short: scope, inventory, baseline, triage, remediate, verify, report. Put the detailed manual matrix in a disclosed reference and put result normalization/comparison in a script. Separate **audit** and **remediation** branches so a read-only audit does not silently become an implementation pass.

## 1. Define the target precisely

### WCAG 2.2 AA is a floor, not a score

WCAG 2.2 AA requires satisfying all Level A and Level AA success criteria. Conformance is for full pages, including responsive variations, and a multi-page process conforms only when every page in that process conforms ([WCAG 2.2 §§5.2.1–5.2.3](https://www.w3.org/TR/WCAG22/#conformance-reqs)). Therefore:

- “zero axe violations” is not equivalent to “WCAG 2.2 AA conformant”;
- “Lighthouse 100” is not equivalent to conformance;
- a component-only or route-only review can report findings within that scope, but cannot make a whole-page or whole-product conformance claim;
- an `a11y-maxxing` pass may apply valuable AAA criteria and best practices, but it should report those as enhancements unless all A, AA, and AAA criteria have been evaluated. W3C also advises against requiring AAA conformance as a general policy for entire sites because some content cannot satisfy every AAA criterion ([WCAG 2.2 §5.2.1](https://www.w3.org/TR/WCAG22/#cc1)).

Recommended objective:

> Maximize high-impact accessible usability within the requested scope, using WCAG 2.2 AA as the minimum standard where a conformance target is in scope, and record the evidence and limits of every conclusion.

### Define an accessibility support baseline

WCAG conformance relies on accessibility-supported uses of technology. W3C says support documentation should identify technology, browser/user-agent, assistive-technology, operating-system, and version combinations, including known limitations ([Documenting Accessibility Support](https://www.w3.org/WAI/WCAG22/Understanding/documenting-accessibility-support)). The skill should therefore record the supported combinations it actually tests, for example `Safari + VoiceOver on current macOS` or `Chrome + NVDA on current Windows`, rather than writing the vague result “screen reader checked.” A single combination is useful evidence but should not be generalized to all assistive technologies.

## 2. Discover representative views, states, and journeys

WCAG-EM requires a structured sample covering common views, essential functionality, content/sample types, technologies relied upon, and other relevant samples; it also requires all views in selected complete processes ([WCAG-EM, Select a Representative Sample](https://www.w3.org/TR/wcag-em-2/#step3)). This is a better basis than “scan localhost:3000.”

The skill should create a test inventory before baseline collection:

- common layouts and shared components;
- essential tasks and complete journeys, such as registration, authentication, search, purchase, editing, and destructive confirmation;
- anonymous, authenticated, role-dependent, empty, populated, loading, success, validation-error, permission-error, and offline/error states that exist in scope;
- interactive states: menus, popovers, dialogs, disclosures, tabs, comboboxes, toasts, drag-and-drop, and dynamically inserted content;
- responsive variants and both supported orientations when layout or function changes;
- media, complex images, data tables, charts, maps, and embedded third-party content;
- routes/components changed by the current diff, plus shared consumers that could regress.

This inventory is a completion checklist: every selected item must have before and after evidence, or an explicit “not testable” reason.

## 3. Configure automated evidence correctly

### Correct axe tags for WCAG 2.2 AA

Axe tags are incremental. Its official tag table defines `wcag2a` and `wcag2aa` for WCAG 2.0, `wcag21a` and `wcag21aa` for additions in WCAG 2.1, and `wcag22aa` for WCAG 2.2 AA rules ([axe-core tags](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags)). Consequently, a WCAG 2.2 A/AA scan must select all five:

```text
wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa
```

There is no documented `wcag22a` tag in axe-core's official tag table. The `wcag22aa` selection includes axe's rules associated with WCAG 2.2 Level A and AA additions. The current rule catalogue shows only one WCAG 2.2 automated rule, `target-size`, and marks it disabled by default; explicitly selecting `wcag22aa` through `runOnly`/`withTags` includes matching rules despite their default state ([axe rule catalogue](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md#wcag-22-level-a--aa-rules), [axe rule selection logic](https://github.com/dequelabs/axe-core/blob/develop/lib/core/utils/rule-should-run.js)). This sparse coverage is another reason that the manual WCAG 2.2 checks are indispensable.

For a quick page-load baseline with the official CLI:

```sh
npx @axe-core/cli http://localhost:3000 \
  --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa \
  --stdout > axe-before.json
```

The CLI accepts comma-separated tag lists and produces JSON via `--stdout` or `--save`; `--exit` can make violations fail CI ([axe CLI options and output](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/cli/README.md#running-specific-rules)). It does not document a `--reporter json` option.

For an existing Playwright suite, use `@axe-core/playwright` and scan after navigation and after each materially different UI state is exposed. Playwright's official guide recommends combining automated tests, manual assessment, and inclusive user testing, and shows `AxeBuilder` integration ([Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)). Axe likewise recommends inserting `axe.run()` whenever a new piece of UI becomes visible or exposed ([axe-core README](https://github.com/dequelabs/axe-core)).

Accessible-tree assertions are valuable regression tests for essential semantics. Playwright ARIA snapshots expose roles, accessible names, hierarchy, and states such as `checked`, `expanded`, `invalid`, `pressed`, and `selected` ([Playwright ARIA snapshots](https://playwright.dev/docs/aria-snapshots)). They are not substitutes for interaction, visual, or assistive-technology testing.

### Handle all axe result classes

The evidence should retain at least:

- `violations`, including rule ID, impact, node count, targets, and help URL;
- `incomplete`, as mandatory manual-review work rather than ignored noise;
- tool, browser, URL/state identifier, timestamp, and axe version;
- exclusions and disabled rules, each with a rationale.

Axe's API defines `impact` as `minor`, `moderate`, `serious`, or `critical`, but this is one signal about an automated rule—not a complete product priority ([axe-core result model](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#results-object)).

### Keep Lighthouse supplementary

Lighthouse's accessibility score is a weighted average of binary automated audits. Manual audits and some low-impact/best-practice audits do not affect the score ([Lighthouse accessibility scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)). Use the report to discover additional evidence and regressions, but never use `100` as the skill's accessibility or conformance completion criterion.

## 4. Required manual audit matrix

Automated testing should run first because it cheaply finds repeatable failures, but the following manual categories are completion requirements for each applicable representative view, state, or journey.

### Keyboard and focus

- Complete every essential action without a pointer; verify forward and reverse sequential navigation, component-specific arrow-key behavior, escape/dismiss behavior, and absence of traps.
- Verify focus order preserves meaning and operation, focus is always visible, focus is not fully obscured by author-created sticky/overlay content, and focus moves to and returns from dialogs or other context changes predictably.
- Avoid placing static or non-operable elements in the tab order without a specific focus-management reason.

WCAG requires keyboard operation, no keyboard traps, meaningful focus order, visible focus, and—new at AA in 2.2—focus not entirely obscured ([WCAG 2.2 Guideline 2.1 and §§2.4.3, 2.4.7, 2.4.11](https://www.w3.org/TR/WCAG22/#keyboard-accessible)). APG notes that ARIA roles do not supply keyboard behavior; authors must implement the expected interaction model for custom widgets ([APG Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)).

### Semantics and screen-reader behavior

- Inspect landmarks, headings, reading order, control roles, accessible names/descriptions, and state/value changes.
- Exercise the selected complete journeys with each declared browser/screen-reader combination, including dialogs, form errors, asynchronous loading/progress, search result counts, cart updates, and toasts.
- Verify necessary status changes are announced without moving focus, and reject redundant or excessively chatty live regions.
- Prefer native HTML and persistent visible text. Use ARIA only where native semantics cannot express the needed behavior, and implement the keyboard/focus contract of the chosen pattern.

WCAG 4.1.2 requires assistive technologies to obtain and stay updated on name, role, value, and state; standard HTML controls already satisfy much of this when used according to specification ([Understanding Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)). WCAG 4.1.3 requires existing status messages to be programmatically determinable without focus; W3C warns that overusing live regions can create an overly chatty experience ([Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)). APG recommends visible text and native naming techniques and warns that incorrect ARIA can severely misrepresent the nonvisual UI ([APG Names and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/), [APG Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).

### Zoom, resize, reflow, orientation, and contrast

- Check text resizing to 200% without loss of content or function.
- Check reflow at a 320 CSS-pixel-wide viewport (or the corresponding 256 CSS-pixel height for vertical writing) without two-dimensional scrolling except for permitted content such as data tables.
- Check intermediate zoom/layout points where sticky headers, cookie banners, dialogs, and controls can overlap, clip, or hide focused content.
- Check responsive variants and supported orientations, plus text spacing overrides where applicable.
- Check text contrast, non-text contrast for controls/focus/state, and meaning that must not depend on color alone. Include forced-colors/high-contrast behavior when the product's support baseline includes it.

WCAG 1.4.4 requires text to reach 200% without loss; 1.4.10 requires reflow at the specified CSS-pixel dimensions; the full-page conformance requirement includes responsive variations ([Understanding Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text), [Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow), [WCAG 2.2 §5.2.2](https://www.w3.org/TR/WCAG22/#cc2)).

### Motion, timing, and input modality

- With reduced motion enabled, remove or replace non-essential motion while preserving essential state feedback.
- Verify automatically moving, blinking, scrolling, or updating content can be paused/stopped/hidden where required, and check flashing limits.
- Supply single-pointer alternatives for multipoint/path gestures, non-drag alternatives for dragging, and non-motion alternatives for motion actuation.
- Verify touch/pointer targets at every applicable interactive state.

WCAG 2.3.3 (AAA) permits users to disable non-essential interaction-triggered motion and identifies `prefers-reduced-motion` as a sufficient technique; WCAG 2.2 AA also adds a non-drag alternative requirement ([Understanding Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions), [WCAG 2.2 §2.5.7](https://www.w3.org/TR/WCAG22/#dragging-movements)). Even when the formal target is AA, reduced-motion support is a high-value “maxxing” enhancement.

WCAG 2.5.8 AA requires a target of at least 24 by 24 CSS pixels or one of its defined exceptions, including sufficient spacing. The measurement applies to the actual target, not merely the visible icon, and must also be evaluated in newly displayed content such as menus and dialogs ([Understanding Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)). A blanket “all controls must be 44×44” rule would incorrectly turn the AAA 2.5.5 enhanced threshold into an AA requirement ([Understanding Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced)).

### Forms, errors, authentication, and recovery

- Verify visible labels/instructions, programmatic associations, required/format guidance, input purposes, and usable autocomplete.
- Trigger every material validation and submission failure; identify the field and error in text, associate it programmatically, announce it when appropriate, preserve entered data, and provide a correction suggestion when one is known.
- Verify focus/summary behavior at submission and error recovery with keyboard, zoom, and screen reader.
- Check accessible authentication, redundant entry, and error prevention for important transactions.

WCAG requires labels or instructions, textual error identification, and correction suggestions when known ([Understanding Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions), [Understanding Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification), [Understanding Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion)).

### Images, structure, tables, and media

- Judge whether each non-text alternative communicates the image's purpose in context; decorative images must be ignored by assistive technology, and complex images/charts need an equivalent explanation.
- Verify headings, lists, landmarks, regions, tables, and reading sequence express the visual relationships programmatically.
- For media, verify keyboard-accessible labeled controls, accurate synchronized captions, transcripts/alternatives for audio-only material, and audio description or a media alternative for important visual information.

WCAG requires text alternatives appropriate to the non-text content's purpose, captions for prerecorded synchronized audio, and audio description or a media alternative for prerecorded visual content ([WCAG 2.2 §§1.1.1–1.2.5](https://www.w3.org/TR/WCAG22/#text-alternatives), [Understanding Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded), [Understanding Audio Description or Media Alternative](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded)).

## 5. Prioritization

Neither raw issue count nor axe impact alone is sufficient. The following ordering is a synthesis grounded in WCAG-EM's emphasis on essential functionality, complete processes, common views, and repeated issues ([WCAG-EM, Explore the Product](https://www.w3.org/TR/wcag-em-2/#step2), [WCAG-EM, Report Findings](https://www.w3.org/TR/wcag-em-2/#step5)):

1. **Task blocker:** prevents or seriously impedes an essential journey for a disability/input mode.
2. **Reach:** occurs in a shared component or many common views/states.
3. **Conformance impact:** confirmed A/AA failure before optional AAA or best-practice enhancement.
4. **User impact signal:** critical/serious axe impact or equivalent manual severity before moderate/minor, while allowing task evidence to override the tool rating.
5. **Confidence:** confirmed failure before an uncertain or environment-specific hypothesis; all `incomplete` results still require disposition.
6. **Fix leverage and risk:** prefer root fixes in primitives/design tokens/shared components, but do not let a broad risky refactor delay a safe fix for a task blocker.

Each finding should contain: stable ID, affected inventory items, user consequence, WCAG criterion or best-practice basis, reproduction, evidence, severity, confidence, proposed fix, and verification method.

## 6. Before/after verification and completion gates

Use a stable matrix keyed by `route-or-journey × state × viewport × input/AT mode`. Compare like with like. A lower total violation count is not enough: a run can fix many minor nodes while introducing one critical task blocker, and a baseline of zero cannot become “lower.”

Recommended completion criteria for remediation mode:

- every selected inventory item has before and after evidence, or a documented not-testable reason;
- no new axe violation or unresolved `incomplete` item was introduced in the scoped matrix;
- every in-scope confirmed A/AA failure and critical/serious task barrier is fixed, or explicitly deferred with owner/reason/evidence;
- every applicable manual matrix category is completed after the change;
- essential journeys succeed with keyboard and each declared browser/assistive-technology combination;
- relevant automated regression tests cover the exposed interactive states and critical accessible semantics;
- exclusions, disabled rules, unsupported environments, third-party blockers, and remaining findings are recorded;
- the report claims only what the scope and evidence justify.

For audit-only mode, replace “fixed” with “reported and prioritized”; make no source changes. WCAG-EM requires the evaluation scope, conformance target, support baseline, representative sample, methods, and outcomes to be documented, and recommends indicating recurring issues ([WCAG-EM, Document Outcomes](https://www.w3.org/TR/wcag-em-2/#step5a)).

## 7. Recommended durable skill structure

This section is a design synthesis rather than a requirement from an accessibility standard.

```text
a11y-maxxing/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   └── manual-audit.md
└── scripts/
    └── compare-evidence.mjs
```

### `SKILL.md`: one evidence loop, two branches

Keep only steps every run needs:

1. **Establish mode and boundary:** audit or remediate; target; scope; auth/data constraints; support baseline; artifact location.
2. **Build the inventory:** representative views/states/complete journeys and changed/shared surfaces. Completion: every selected matrix row is named.
3. **Capture baseline:** automated results plus applicable manual checks. Completion: every row has evidence or a reason it cannot be tested.
4. **Triage:** normalize findings and order them using the prioritization model. Audit mode stops after a complete report.
5. **Remediate:** fix root causes in small verified batches, preferring native HTML and established project primitives.
6. **Verify:** rerun the identical matrix, add durable regression tests, and apply the completion gates.
7. **Report:** scope, environment, changes/findings, before/after evidence, unresolved risks, and precise claim limits.

### `references/manual-audit.md`

Move the detailed matrix from Section 4 into a checkable reference. The `SKILL.md` pointer should say exactly when to load it: before building the baseline and again before declaring verification complete. Make applicability explicit so media checks do not become noise on products without media.

### `scripts/compare-evidence.mjs`

Normalize axe JSON into stable finding keys, preserve node-level changes and `incomplete` results, compare per inventory row, and fail when new findings appear. Do not reduce the evidence to a single count. Keep raw audit output transient or ignored unless the user requests a committed report.

### Tool selection behavior

- Detect and reuse the repository's existing package manager, browser tests, accessibility libraries, start command, and report conventions before adding dependencies.
- Prefer project-local or ephemeral execution to a global install.
- Use the CLI only for quick page-load baselines; use the existing browser-test framework for authenticated journeys and exposed states.
- Do not silently exclude third-party content or unstable areas. Record the exclusion and its impact on the claim.

## Proposed source hierarchy for the eventual skill

Use these sources in this order when the skill needs to resolve a question:

1. [WCAG 2.2 normative specification](https://www.w3.org/TR/WCAG22/)
2. [WCAG 2.2 Understanding documents](https://www.w3.org/WAI/WCAG22/understanding/)
3. [WCAG-EM 2.0](https://www.w3.org/TR/wcag-em-2/)
4. [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria/) and [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
5. [axe-core API/rule documentation](https://github.com/dequelabs/axe-core/tree/develop/doc) and [official axe CLI documentation](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/cli)
6. [Playwright accessibility testing documentation](https://playwright.dev/docs/accessibility-testing), when Playwright is the repository's browser-test framework
7. [Lighthouse accessibility documentation](https://developer.chrome.com/docs/lighthouse/accessibility/), only as supplementary automated evidence

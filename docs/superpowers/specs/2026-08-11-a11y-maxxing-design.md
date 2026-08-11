# `a11y-maxxing` skill design

## Objective

Create a manually invoked skill that audits or remediates high-impact web accessibility barriers. Optimize accessible task completion within an explicit scope, using WCAG 2.2 Level AA as the minimum conformance target when applicable. Treat automated scores as supporting evidence rather than the objective, and limit every accessibility claim to the surfaces, states, environments, and methods actually tested.

## Invocation and modes

Name the skill `a11y-maxxing` and keep it user-invoked with `disable-model-invocation: true`. Its human-facing description should identify two branches:

1. **Audit:** inspect, test, prioritize, and report without changing product source.
2. **Remediate:** inspect, change source, add regression coverage, and verify the same scope after modification.

Accept three scope sizes: a changed feature or component, selected routes and journeys, or a representative product-wide sample. Do not represent a sampled audit as whole-product WCAG conformance.

## Skill architecture

Create the following structure:

```text
skills/a11y-maxxing/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   └── manual-audit.md
└── scripts/
    └── compare-evidence.mjs
```

Keep the execution-critical workflow in `SKILL.md`. Put the detailed, conditionally applicable manual checks in `references/manual-audit.md`. Put normalization and before/after comparison of axe result sets in `scripts/compare-evidence.mjs` so every run uses the same comparison semantics.

The repository-level research note remains at `research/a11y-maxxing-skill-research.md`; it supports maintenance of the skill but is not loaded during normal invocation.

## Evidence loop

Make every run follow the same seven steps.

### 1. Establish the boundary

Resolve audit versus remediation mode, target surfaces, representative user tasks, authentication and data constraints, supported browsers and assistive technologies, available tooling, and the location for transient evidence. Prefer a narrower explicit scope over an implied whole-product claim.

Completion criterion: mode, scope, support baseline, constraints, and evidence location are all explicit.

### 2. Build the inventory

Inventory representative routes, shared layouts and primitives, important user journeys, responsive variants, and materially different UI states. Include authenticated, empty, populated, loading, success, validation-error, permission-error, dialog, menu, disclosure, toast, drag, and other states when they exist in scope.

Completion criterion: every selected route, journey, state, and viewport has a stable inventory identifier.

### 3. Capture the baseline

Detect and reuse the repository's package manager, start command, browser tests, accessibility libraries, and reporting conventions. Run automated checks against rendered UI in each selected state. Load `references/manual-audit.md` and complete every applicable category. Record untestable rows and reasons.

For axe WCAG 2.2 A/AA selection, use the complete incremental tag set:

```text
wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa
```

Retain violations, incomplete results, exclusions, tool versions, browser, state, and viewport. Use Lighthouse only as supplementary evidence.

Completion criterion: every inventory row has automated and applicable manual evidence, or an explicit untestable reason.

### 4. Triage

Prioritize findings in this order: essential-task blocking, reach across shared surfaces, confirmed WCAG A/AA impact, user impact, confidence, and fix leverage versus regression risk. Let task evidence override raw axe impact. In audit mode, stop after producing the complete prioritized report.

Completion criterion: every finding has an affected inventory scope, user consequence, evidence, standard or best-practice basis, confidence, proposed remedy, and verification method.

### 5. Remediate

In remediation mode, fix root causes in small verifiable batches. Prefer native HTML, visible labels, and established project primitives. Treat every ARIA role as a keyboard and focus contract. Avoid silent exclusions and rule suppression. Add or update regression tests in the existing test stack.

Completion criterion: every in-scope confirmed A/AA failure and critical task barrier is fixed or explicitly deferred with a reason and evidence.

### 6. Verify

Rerun the identical inventory matrix. Load `references/manual-audit.md` again before completion. Use `scripts/compare-evidence.mjs` for supported axe evidence, and inspect every new or incomplete result. Exercise essential journeys with keyboard and each declared browser/assistive-technology combination.

Completion criterion: no unexplained matrix mismatch, new finding, or unresolved incomplete result exists; applicable manual checks and project tests pass; remaining limitations are recorded.

### 7. Report

Report mode and scope, tested environment, findings or changes, before/after evidence by inventory row, unresolved risks, exclusions, and precise claim limits. Never treat axe zero or Lighthouse 100 as proof of conformance.

Completion criterion: a reader can reproduce the tested scope and distinguish confirmed results, deferrals, untested areas, and enhancements beyond AA.

## Manual reference

Organize `manual-audit.md` as a checkable applicability matrix covering:

- keyboard operation, focus order, focus visibility, traps, and obscuration;
- landmarks, headings, reading order, names, descriptions, roles, values, and state changes;
- screen-reader journeys, dialogs, errors, progress, result counts, toasts, and live-region quality;
- text resizing, zoom, reflow, orientation, text spacing, text contrast, non-text contrast, color independence, and forced colors when supported;
- reduced motion, autoplay and timing, flashing, pointer gestures, drag alternatives, motion actuation, and target size/spacing;
- labels, instructions, autocomplete, validation, error association and announcement, data preservation, authentication, redundant entry, and important-transaction recovery;
- images, complex graphics, headings, lists, tables, charts, media controls, captions, transcripts, and audio description.

Mark categories not applicable rather than forcing irrelevant work. Record the exact browser, operating system, assistive technology, and version for screen-reader evidence.

## Evidence comparison script

Implement a dependency-free Node.js CLI that accepts before and after axe JSON files. Support the official axe CLI's array output and direct axe-core result objects. Normalize each result into stable keys containing result class, rule ID, and target. Preserve `violations` and `incomplete` separately.

The comparison must report added, resolved, and unchanged findings grouped by result class and impact. Exit nonzero when a new violation or incomplete result appears. Reject malformed or unsupported input with a concise diagnostic. Do not reduce completion to aggregate counts.

Keep raw browser output transient or ignored unless the user asks to commit a report.

## Tool behavior and fallbacks

Prefer tools in this order:

1. Existing project browser tests and installed axe integration.
2. Existing browser automation capable of exposing authenticated and dynamic states.
3. Project-local or ephemeral axe CLI execution for quick page-load baselines.
4. Lighthouse for supplementary discovery and regression evidence.
5. Static source inspection when the application cannot run.

Do not install global packages by default. Do not treat a CLI scan as a crawler. When rendered or assistive-technology testing is unavailable, continue with safe static checks and report the reduced confidence rather than claiming completion.

## Repository integration

Add the skill to the repository skill table, installation examples, and structure in `README.md`. Add `./skills/a11y-maxxing` to `.claude-plugin/plugin.json`. Generate `agents/openai.yaml` with a display name, a 25–64 character short description, and a one-sentence default prompt that explicitly invokes `$a11y-maxxing`.

## Validation and forward testing

Run the skill-creator validator and test `compare-evidence.mjs` with fixtures covering:

- a resolved violation;
- a newly introduced violation despite a lower total node count;
- a new incomplete result;
- official CLI array output and direct axe-core object output;
- malformed JSON and unsupported shapes.

Forward-test the completed skill in isolated temporary fixtures:

1. An audit-only page with obvious automated failures; verify that no source changes occur.
2. A page with a clean automated result but a manual keyboard or focus barrier; verify that the skill does not stop at the score.
3. A project that cannot start; verify that the skill performs static analysis, records unavailable evidence, and avoids a conformance claim.

Review the resulting implementation for repository standards and fidelity to this design. Commit the finished skill and repository integrations only after validation and review pass.

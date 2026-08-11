---
name: a11y-maxxing
description: Audit or remediate web accessibility barriers, optimizing accessible task completion against a WCAG 2.2 AA floor.
disable-model-invocation: true
---

# A11y Maxxing

Optimize accessible task completion within an explicit scope, with WCAG 2.2 Level AA as the minimum target where conformance is in scope. Automated scores are supporting evidence, never the objective. Limit every claim to the surfaces, states, environments, and methods actually tested.

## Modes

Route the run before anything else:

- **Audit** — steps 1–4, then 7. Inspect, test, prioritize, and report; product source stays untouched.
- **Remediate** — steps 1–7. Inspect, fix, add regression coverage, and verify the identical matrix.

Scope is one of: a changed feature or component, selected routes and journeys, or a representative product-wide sample. A sampled audit claims the sample, never whole-product WCAG conformance.

## Workflow

### 1. Establish the boundary

Resolve mode, target surfaces, representative user tasks, authentication and data constraints, supported browser and assistive-technology combinations, available tooling, and where transient evidence lives. Prefer a narrower explicit scope over an implied whole-product claim.

Done when mode, scope, support baseline, constraints, and evidence location are all explicit.

### 2. Build the matrix

Key every row `route-or-journey × state × viewport × input/AT mode`. Cover representative routes, shared layouts and primitives, essential journeys, responsive variants, and materially different UI states — authenticated, empty, populated, loading, success, validation-error, permission-error, dialog, menu, disclosure, toast, drag — where they exist in scope.

Done when every selected row has a stable identifier.

### 3. Capture the baseline

Detect and reuse the repository's package manager, start command, browser tests, accessibility libraries, and reporting conventions. Run automated checks against rendered UI in every matrix row, then load [references/manual-audit.md](references/manual-audit.md) and complete every applicable category.

For axe WCAG 2.2 A/AA coverage, tags are incremental — select all five:

```text
wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa
```

Retain violations, incomplete results, exclusions, tool versions, browser, state, and viewport per row. Keep raw tool output transient unless the user asks to commit a report.

Prefer tools in this order:

1. Existing project browser tests with an installed axe integration.
2. Existing browser automation that can expose authenticated and dynamic states.
3. Project-local or ephemeral axe CLI for page-load baselines — it sees one rendered page, so scan each exposed state individually.
4. Lighthouse, as supplementary discovery evidence only.
5. Static source inspection when the application cannot run — continue with safe static checks and report the reduced confidence.

Prefer project-local or ephemeral execution over global installs.

Done when every matrix row has automated and applicable manual evidence, or an explicit untestable reason.

### 4. Triage

Prioritize in this order: essential-task blockers, reach across shared surfaces, confirmed WCAG A/AA impact, user impact, confidence, then fix leverage versus regression risk. Task evidence overrides raw axe impact.

Done when every finding has an affected matrix scope, user consequence, evidence, standard or best-practice basis, confidence, proposed remedy, and verification method. Audit mode proceeds directly to step 7.

### 5. Remediate

Fix root causes in small verifiable batches. Prefer native HTML, visible labels, and established project primitives; treat every ARIA role as a keyboard and focus contract. Keep every rule enabled, and record any exclusion with its impact on the claim. Add or update regression tests in the existing test stack.

Done when every in-scope confirmed A/AA failure and critical task barrier is fixed, or explicitly deferred with a reason and evidence.

### 6. Verify

Rerun the identical matrix. Reload [references/manual-audit.md](references/manual-audit.md) before declaring completion. Compare axe evidence with [scripts/compare-evidence.mjs](scripts/compare-evidence.mjs) and inspect every new or incomplete result. Exercise essential journeys with keyboard and each declared browser/assistive-technology combination — this is where every ARIA contract from step 5 is honored or exposed.

Done when no unexplained matrix mismatch, new finding, or unresolved incomplete result remains; applicable manual checks and project tests pass; and remaining limitations are recorded.

### 7. Report

Report mode and scope, tested environment and versions, findings or changes, per-row evidence, unresolved risks, exclusions, and claim limits. Axe zero and Lighthouse 100 are instrument readings, not conformance.

Done when, in audit mode, every finding is reported and prioritized with its evidence and claim limits and product source is unchanged; in remediate mode, every matrix row shows before/after evidence or a documented untestable reason, with deferrals, untested areas, and enhancements beyond AA listed.

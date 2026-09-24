---
name: timotom
description: Trace-review BauerXcel web pull requests and code changes with the standards demonstrated by @tomellwood and @haapti. Use for reviews in rayo-web or uk-audio-services-tesla, or when the user asks for their review style.
---

# Timotom

Review the behavior around the diff, not only the edited lines. Trace every changed assumption through its source of truth, consumers, runtime branches, user-visible variants, and operational consequences. Report findings; modify or post code only when the user asks.

## Values

- **Behavior over local elegance.** A tidy implementation still fails review when an empty response, stale state, disabled flag, alternate region, or existing consumer behaves incorrectly.
- **The repository is evidence.** Compare nearby implementations, shared helpers, generated sources, types, tests, stories, configuration, and history before proposing a new pattern.
- **One source of truth.** Change schemas/specs rather than generated output, derive rather than duplicate, and keep configuration and domain facts in their established home.
- **Removal before addition.** Look for redundant state, props, wrappers, helpers, branches, dependencies, comments, and repeated work. Prefer the smallest complete design.
- **Variants are first-class.** Treat feature flags, brands, locales, regions, auth and entitlement states, device sizes, browsers, themes, and third-party failure as real product paths.
- **Interfaces include people and systems.** Check semantic HTML, keyboard/focus behavior, accessible names, translations and translator context, analytics contracts, API contracts, and deployment behavior.
- **Pragmatic precision.** Separate demonstrated defects from questions and minors. Acknowledge uncertainty, verify before asserting, and correct a mistaken concern plainly.

## 1. Establish the change contract

Read repository instructions, the complete diff, PR description, linked ticket or acceptance criteria, designs, relevant discussions, and dependent PRs when available. Identify every changed behavior and its claimed purpose. Build a private change map with:

- changed behavior and owning source of truth;
- callers, consumers, sibling implementations, and generated artifacts;
- affected user, data, runtime, and deployment variants;
- tests, stories, monitoring, analytics, and translations that express the contract.

This step is complete when every changed file belongs to a mapped behavior and every explicit requirement is matched to code or recorded as unverifiable.

## 2. Trace outward

For each mapped behavior, follow the code far enough to evaluate every applicable dimension:

- **Contracts:** exact types, optionality, schemas, API specifications, generated files, analytics payloads, translation keys, configuration, and dependency versions.
- **State and lifecycle:** initial/reset state, loading/empty/error/success, mount/update/unmount, hook dependencies and cleanup, stale or duplicated state, mutation, races, and repeated requests.
- **Boundaries:** server/client placement, serialization, auth, caching and revalidation, network cost, bundle cost, third-party availability, and deployment or rollback paths.
- **Variants:** flag on/off, authenticated/anonymous, premium/free, brand/locale/region, live/on-demand, mobile/tablet/desktop, browser differences, light/dark, and old/new data.
- **UI behavior:** semantics, accessible name, focus and keyboard flow, valid nesting, responsive layout, overflow, loading stability, links versus buttons, and visual-regression coverage.
- **Maintainability:** existing helper or component reuse, naming, repository conventions, unnecessary indirection, duplicated logic, obsolete code, and whether the abstraction owns the fact it receives.
- **Scope:** all analogous occurrences, inverse operations, counterpart components, mocks, tests, stories, docs, and follow-up work needed for a complete change.

A dimension may be marked inapplicable only after checking it. This step is complete when no mapped behavior remains justified solely by the local diff.

## 3. Cross-examine and verify

Search for existing implementations and all uses of changed symbols. Construct concrete counterexamples: absent data, empty arrays, failed third parties, stale caches, flag disabled, alternate brand or region, narrow and wide viewports, keyboard-only use, and the inverse of each state transition.

Run the narrowest relevant typecheck, tests, lint, build, and UI checks available. Inspect CI, Storybook or Chromatic, and generated-file provenance when they bear on the change. Record checks that could not be run instead of treating them as passed.

Every candidate finding must have a specific code path, triggering scenario, consequence, and tight location. Re-read the surrounding code before reporting it. Convert an unproven concern to a question and discard concerns the code disproves.

## 4. Sweep for incompleteness

Inspect every changed file once more. Check paired operations and sibling sites: add/remove, set/reset, subscribe/unsubscribe, enable/disable, open/close, server/client, success/failure, populated/empty, and both sides of a feature flag. Look for temporary config, test-only data, hard-coded values, console output, copied generated code, stale comments, partial renames, and one-of-many updates.

This step is complete when every changed file, every analogous occurrence found by search, and every candidate finding has an explicit disposition.

## 5. Write the review

Lead with findings in descending impact. Use the reviewers' calibration:

- `[blocking]` for a demonstrated correctness, data, security, accessibility, deployment, or requirement failure that should be fixed before merge;
- `[question]` when intent or evidence is missing, or the risk is plausible but not yet demonstrated;
- `[minor]` for worthwhile consistency, naming, simplification, or cleanup that is safe to defer.

Each finding should name the issue, point to the narrowest file and line, explain the triggering scenario and consequence, and give the shortest useful direction. Reference an existing repository pattern when it makes the remedy concrete. Keep independent issues separate and group repeated instances of the same root cause.

After findings, list open assumptions and the checks performed. If there are no findings, say so explicitly and state residual risks or unrun checks. Keep approval warm and brief; reserve detailed prose for actionable feedback.

## Calibration reference

Read [references/calibration.md](references/calibration.md) when teaching this review style, resolving an ambiguous priority, or revising the skill. Ordinary reviews should use the process above without loading the corpus notes.

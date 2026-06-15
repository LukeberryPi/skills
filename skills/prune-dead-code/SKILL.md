---
name: prune-dead-code
description: Audit a codebase for safe-to-remove declarations, including dead code, duplicated constants, drift-prone literals, and arbitrary limits. Use when asked to find unused code, deduplicate declarations, remove arbitrary caps or thresholds, or clean up a codebase.
---

# Prune Dead Code

Find and remove low-value declarations across four categories. Confirm usage with a repository-wide search before claiming anything is unused. Present every finding in the required Item, Location, and Notes format, separating safe removals from arbitrary but intentional values.

## Categories

1. **Confirmed dead**: exported or declared symbols, constants, tokens, or barrel re-exports with zero references anywhere.
2. **Dedupe**: the same constant, string, or type literal declared verbatim in two or more places.
3. **Drift**: a magic literal that duplicates an existing named constant.
4. **Arbitrary limits**: caps, thresholds, or timeouts that guard against situations a real user never reaches. Quantify the real limit before recommending removal.

## Workflow

1. Search each category across the whole repository, including code and tests.
2. Confirm usage of every candidate with a search before judging it.
3. Classify each candidate as safe to remove or arbitrary but intentional.
4. Report findings using the required table.
5. Ask which findings to apply before editing.
6. Apply the approved changes and update tests that referenced removed or unexported symbols.
7. Run the project's typecheck, lint, and tests. Fix issues caused by the changes.

## Required Output

Use exactly these columns:

```markdown
| Item | Location | Notes |
|------|----------|-------|
| `<symbol>` | `path:line` | Zero references repo-wide (verified). Confirmed dead. |
| `<constant>` | `pathA:line`, `pathB:line` | Identical declaration in 2 files. Dedupe into one shared constant. |
| literal `<value>` | `path:line` | Duplicates `<NAMED_CONSTANT>`; reference the constant to avoid drift. |
| `<CAP>` | `path:line` | Threshold unreachable in practice (state the real limit). Safe to remove. |
```

- **Item**: Use the exact declaration in backticks or a short phrase for inline literals.
- **Location**: Use `path:line`; list every location for dedupe and drift findings.
- **Notes**: State what the item is, whether usage was confirmed, and the verdict in one sentence.

## Rules

- Verify before claiming dead. A symbol used only in its own file can be unexported but not deleted; a symbol imported across files must stay exported.
- Do not treat cross-file types or constants as dead when they have a consumer.
- Account for tests before removing exports. Keep an export when a test uses it to exercise non-trivial logic, or flag the trade-off for the user.
- Keep intentional tuning values such as animation timings, debounce intervals, sizes, and minimums. Report them as arbitrary but intentional.
- Do not delete validation or guards that prevent crashes on corrupt or missing data.
- Treat uncertain dynamic access, reflection, constructed imports, public APIs, and framework entry points as live.
- Remove only fully verified dead code.
- After editing, update affected tests and run the project's typecheck, lint, and test suite.

---
name: prune-dead-code
description: Audit a codebase for safe-to-remove declarations, including dead code, duplicated constants, drift-prone literals, and arbitrary limits. Use when asked to find unused code, deduplicate declarations, remove arbitrary caps or thresholds, or clean up a codebase.
---

# Prune Dead Code

Find low-value declarations in four categories. Verify usage repository-wide, report every finding in the required format, and separate safe removals from intentional arbitrary values.

## Categories

1. **Confirmed dead**: symbols, constants, tokens, or barrel re-exports with zero references.
2. **Dedupe**: the same constant, string, or type literal declared verbatim in two or more places.
3. **Drift**: a magic literal that duplicates an existing named constant.
4. **Arbitrary limits**: caps, thresholds, or timeouts guarding against situations users cannot reach. Quantify the real limit before recommending removal.

## Workflow

1. Search each category across the whole repository, including code and tests.
2. Search every candidate's usage before judging it.
3. Classify each candidate as safe to remove or arbitrary but intentional.
4. Report the required table.
5. Ask which findings to apply before editing.
6. Apply approved changes and update affected tests.
7. Run typecheck, lint, and tests; fix issues caused by the changes.

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

- **Item**: Exact declaration in backticks, or a short phrase for inline literals.
- **Location**: `path:line`; include every dedupe and drift location.
- **Notes**: In one sentence, identify the item, confirm usage, and give the verdict.

## Rules

- Verify before claiming dead. A symbol used only in its file may be unexported, not deleted; cross-file consumers require it to remain exported.
- Check tests before removing exports. Keep exports used to test non-trivial logic, or flag the trade-off.
- Keep intentional tuning values such as animation timings, debounce intervals, sizes, and minimums. Report them as arbitrary but intentional.
- Keep validation and guards that prevent crashes on corrupt or missing data.
- Treat uncertain dynamic access, reflection, constructed imports, public APIs, and framework entry points as live.
- Remove only fully verified dead code.

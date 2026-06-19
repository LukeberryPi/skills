---
name: prune-dead-code
description: Audit a codebase for dead and otherwise safe-to-remove code, and report each finding for approval. Use when asked to find dead or unused code, deduplicate repeated constants, replace magic literals that duplicate a named constant, or remove arbitrary caps, thresholds, or timeouts.
---

# Prune Dead Code

Treat every declaration as **live** until you have proven it safe to remove. Find candidates in four categories, verify each one across the whole repository, and report them all for approval before editing.

## Categories

1. **Confirmed dead**: symbols, constants, tokens, or barrel re-exports with zero references.
2. **Dedupe**: the same constant, string, or type literal declared verbatim in two or more places.
3. **Drift**: a magic literal that duplicates an existing named constant.
4. **Arbitrary limits**: caps, thresholds, or timeouts guarding against situations users cannot reach. Quantify the real limit before recommending removal.

## Workflow

1. Search each category across the whole repository, code and tests alike.
2. Verify every candidate's usage before judging it; one missed reference makes the verdict wrong.
3. Classify each candidate as safe to remove or arbitrary but intentional.
4. Report the table below.
5. Ask which findings to apply before editing.
6. Apply approved changes and update affected tests.
7. Run typecheck, lint, and tests; fix anything the changes broke.

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

When in doubt, it stays **live** — remove only what you have proven dead.

- A symbol used only in its own file may be unexported, not deleted; cross-file consumers require it to stay exported.
- Check tests before removing exports. Keep exports that cover non-trivial logic, or flag the trade-off.
- Keep intentional tuning values — animation timings, debounce intervals, sizes, minimums — and report them as arbitrary but intentional.
- Keep validation and guards that prevent crashes on corrupt or missing data.
- Treat uncertain dynamic access, reflection, constructed imports, public APIs, and framework entry points as live.

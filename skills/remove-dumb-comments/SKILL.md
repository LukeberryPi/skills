---
name: remove-dumb-comments
description: Find low-value comments that merely restate adjacent code and confirm their removal with the user. Use when asked to remove dumb, redundant, obvious, or noisy comments, clean up comments, or invoke `/remove-dumb-comments [<number>|all]`.
---

# Remove Dumb Comments

Find comments that only restate adjacent code or rename a symbol, then let the user choose which to remove.

## Invocation

| Command | Behavior |
|---|---|
| `/remove-dumb-comments` | Find the 10 lowest-value comments. |
| `/remove-dumb-comments <number>` | Find that many lowest-value comments. |
| `/remove-dumb-comments all` | Find every low-value comment. |

## Never Remove

Keep comments that explain:

- backports, compatibility, or version-specific behavior;
- infrastructure, deployment, or architecture;
- workarounds, gotchas, or non-obvious reasons;
- documentation, specifications, RFCs, or ADRs;
- bugs, issues, tickets, or contextual TODOs/FIXMEs;
- intent, trade-offs, constraints, or other "why" the code cannot convey.

When unsure, keep it. Flag only pure restatements.

## Workflow

1. Set the limit to 10, the supplied number, or all.
2. Search source files; skip generated output, vendored dependencies, lockfiles, and documentation.
3. Rank candidates from most redundant to least redundant.
4. Get each candidate's age with `git blame`.
5. Present the required table.
6. Ask whether to remove all recommended comments.
7. If yes, remove every `Remove` item without individual review.
8. If no, ask `Remove` or `Keep` for each comment, using its exact text rather than its location.
9. Remove only approved comments.
10. Run the project's lint and typecheck. Fix issues caused by the changes.

If available, delegate the read-only search to a fast, low-reasoning subagent. Request at most the limit, with exact path, line, comment text, and one to three adjacent code lines. Otherwise search directly.

## Comment Age

For each candidate, run:

```bash
git blame -L <line>,<line> --date=relative -- <file>
```

Use the relative date; mark uncommitted lines `uncommitted`.

## Required Output

Use exactly these columns:

```markdown
| Comment | Age | Why |
|---------|-----|-----|
| `// increment the counter` | 8 months ago | *Remove.* Restates `count++` verbatim. |
| `/** Returns the user id. */` | 3 weeks ago | *Remove.* Describes the function word by word. |
| `// debounce avoids hammering the API on each keypress` | 1 year ago | *Keep.* Explains intent, not mechanics. |
```

- **Comment**: Include the exact comment text in backticks.
- **Age**: Use the relative `git blame` age.
- **Why**: Start with `*Remove.*` or `*Keep.*`, then give one short reason.

## Feedback

After presenting the table, ask:

> **Remove all recommended?**
> - Yes, remove all recommended
> - No, I want to review each comment

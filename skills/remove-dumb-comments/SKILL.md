---
name: remove-dumb-comments
description: Flag comments that merely restate the code instead of explaining why, and remove only those the user approves. Use when asked to remove dumb, redundant, or obvious comments, clean up comments, or invoke `/remove-dumb-comments [<number>|all]`.
---

# Remove Dumb Comments

Flag comments that say *what* the code already says; keep every comment that explains *why*. The user chooses which flagged comments to remove.

## Invocation

| Command | Behavior |
|---|---|
| `/remove-dumb-comments` | Find the 10 lowest-value comments. |
| `/remove-dumb-comments <number>` | Find that many lowest-value comments. |
| `/remove-dumb-comments all` | Find every low-value comment. |

## Never Remove

Keep any comment that carries a *why* the code cannot convey:

- backports, compatibility, or version-specific behavior;
- infrastructure, deployment, or architecture;
- workarounds, gotchas, or non-obvious reasons;
- documentation, specifications, RFCs, or ADRs;
- bugs, issues, tickets, or contextual TODOs/FIXMEs;
- intent, trade-offs, or constraints.

When unsure, keep it. Flag only pure restatements.

## Workflow

1. Resolve the limit from the invocation (default 10).
2. Search source files; skip generated output, vendored dependencies, lockfiles, and documentation.
3. Rank candidates from most redundant to least.
4. Get each candidate's age with `git blame` (see Comment Age).
5. Present the table below, then ask whether to remove all recommended (see Feedback).
6. If yes, treat every `Remove` item as approved. If no, ask `Remove` or `Keep` for each, naming it by its exact text, not its location.
7. Remove only the approved comments.
8. Run the project's lint and typecheck; fix anything the changes broke.

Delegate the read-only search to a fast, low-reasoning subagent when one is available: request at most the limit, each with exact path, line, comment text, and one to three adjacent code lines. Otherwise search directly.

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

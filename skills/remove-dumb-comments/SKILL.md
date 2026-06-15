---
name: remove-dumb-comments
description: Find low-value comments that merely restate adjacent code and confirm their removal with the user. Use when asked to remove dumb, redundant, obvious, or noisy comments, clean up comments, or invoke `/remove-dumb-comments [<number>|all]`.
---

# Remove Dumb Comments

Surface comments that add no information beyond the code beneath them, then let the user decide which to remove. Treat comments that merely translate the next line into prose, or documentation that only renames a symbol, as low-value candidates.

## Invocation

| Command | Behavior |
|---|---|
| `/remove-dumb-comments` | Find the 10 lowest-value comments. |
| `/remove-dumb-comments <number>` | Find the requested number of lowest-value comments. |
| `/remove-dumb-comments all` | Find all low-value comments. |

## Never Remove

Never treat a comment as low-value when it describes:

- backporting, compatibility, or version-specific behavior;
- infrastructure, deployment, or architectural decisions;
- a workaround, gotcha, or non-obvious reason a block exists;
- documentation, specifications, RFCs, or ADRs;
- a bug, issue, ticket, or contextual TODO or FIXME;
- intent, trade-offs, constraints, or any other "why" the code cannot convey.

When unsure, keep the comment. Flag only pure restatements of adjacent code.

## Workflow

1. Parse the invocation and set the limit to 10, the supplied number, or all.
2. Search source files only. Skip generated output, vendored dependencies, lockfiles, and documentation.
3. Rank candidates from most redundant to least redundant.
4. Get each candidate's age with `git blame`.
5. Present the findings using the required table.
6. Ask whether to remove all recommended comments.
7. If the user agrees, remove every comment marked `Remove` and skip individual review.
8. If the user declines, ask for a Remove or Keep decision for each comment.
9. Remove only comments the user approves.
10. Run the project's lint and typecheck. Fix issues caused by the changes.

When a subagent tool is available, delegate the read-only source search to a fast, low-reasoning subagent. Instruct it to return at most the requested number of candidates with the exact path, line number, comment text, and one to three adjacent lines of code. Perform the search directly when no subagent tool is available.

## Comment Age

For each candidate, run:

```bash
git blame -L <line>,<line> --date=relative -- <file>
```

Use the relative date. Mark lines without committed history as `uncommitted`.

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
- **Age**: Use the relative age from `git blame`.
- **Why**: Start with `*Remove.*` or `*Keep.*`, followed by one short reason.

## Feedback

After presenting the table, ask:

> **Remove all recommended?**
> - Yes, remove all recommended
> - No, I want to review each comment

If the user chooses individual review, ask about each comment by its exact content, not its file location. Offer `Remove` and `Keep` as the choices, then remove only approved comments.

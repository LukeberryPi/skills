---
name: dissect-and-interview
description: Dissect a codebase and run a 10-question mock technical interview on it, rating each answer 1-10 and closing with a PASS or FAIL verdict.
disable-model-invocation: true
---

# Dissect and Interview

Act as a rigorous technical interviewer. Dissect the codebase first; every question grows from **evidence** you found there, and every answer is graded against that evidence.

## Criteria

1. UX quality
2. Trust and safety judgment
3. Error handling and edge cases
4. State modeling
5. Code quality and organization
6. Documentation quality
7. Overall polish

## Workflow

1. **Dissect.** Explore the codebase until every criterion has evidence: a specific decision, trade-off, or flaw you can cite as `path:line`.
2. **Draft** ten questions privately. Each names its evidence and probes the judgment behind it ("In `auth.ts:42`, a failed login returns 200 with an error body — defend that choice"), so it cannot be answered without knowing this codebase. Cover all seven criteria; spend the surplus questions where the evidence is richest.
3. **Interview.** Ask one question at a time, numbered `1/10` through `10/10`, and wait for each answer. Between questions, acknowledge neutrally and move on — save every judgment for the report.
4. **Report.** After the tenth answer, deliver the report below with all ten answers rated.

## Report

One row per answer:

| # | Criterion | Rating | Feedback |
|---|-----------|--------|----------|

- **Rating**, 1–10: 1–3 the answer misses what the evidence shows; 4–6 it describes the code without judgment; 7–8 it explains the trade-off; 9–10 it explains the trade-off and offers a concrete improvement.
- **Feedback**: what a stronger answer would say, plus the fix for any weakness the evidence exposed.

Close with the mean rating and the verdict: **PASS** at a mean of 7.0 or above, otherwise **FAIL**.

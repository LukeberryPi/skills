# Agent Skills

Reusable coding-agent skills for codebase maintenance.

## Skills

| Skill | Description |
|---|---|
| [`a11y-maxxing`](skills/a11y-maxxing/SKILL.md) | Audits or remediates web accessibility barriers, optimizing accessible task completion against a WCAG 2.2 AA floor. |
| [`dissect-and-interview`](skills/dissect-and-interview/SKILL.md) | Dissects a codebase and runs a 10-question mock technical interview, rating each answer and closing PASS or FAIL. |
| [`mega-brain-com-copy-thief`](skills/mega-brain-com-copy-thief/SKILL.md) | Manual-only Portuguese video reformulation workflow for entrepreneur-focused scripts. |
| [`prune-dead-code`](skills/prune-dead-code/SKILL.md) | Audits dead declarations, duplicated constants, drift-prone literals, and arbitrary limits. |
| [`remove-dumb-comments`](skills/remove-dumb-comments/SKILL.md) | Finds comments that merely restate the code and removes only those approved by the user. |
| [`timotom`](skills/timotom/SKILL.md) | Trace-reviews BauerXcel web changes with the standards demonstrated by Tom Ellwood and Haapti. |

## Install

Install every skill in this repository:

```bash
npx skills add LukeberryPi/skills
```

Install one specific skill:

```bash
npx skills add LukeberryPi/skills --skill a11y-maxxing
npx skills add LukeberryPi/skills --skill dissect-and-interview
npx skills add LukeberryPi/skills --skill mega-brain-com-copy-thief
npx skills add LukeberryPi/skills --skill prune-dead-code
npx skills add LukeberryPi/skills --skill remove-dumb-comments
npx skills add LukeberryPi/skills --skill timotom
```

General form:

```bash
npx skills add your-github-username/your-skills --skill your-skill-name
```

### Claude plugin

The repo ships a [Claude plugin](https://docs.anthropic.com/en/docs/claude-code/plugins) manifest at `.claude-plugin/plugin.json` that registers every skill under `skills/`. Install the plugin from this repository in Claude Code, or copy individual skill directories as above.

## Repository Structure

```text
.
├── README.md
├── .claude-plugin/
│   └── plugin.json
└── skills/
    ├── a11y-maxxing/
    │   ├── SKILL.md
    │   ├── agents/
    │   │   └── openai.yaml
    │   ├── references/
    │   │   └── manual-audit.md
    │   └── scripts/
    │       └── compare-evidence.mjs
    ├── dissect-and-interview/
    │   └── SKILL.md
    ├── mega-brain-com-copy-thief/
    │   └── SKILL.md
    ├── prune-dead-code/
    │   └── SKILL.md
    ├── remove-dumb-comments/
    │   └── SKILL.md
    └── timotom/
        ├── SKILL.md
        ├── agents/
        │   └── openai.yaml
        └── references/
            └── calibration.md
```

## GitHub Topics

```bash
gh repo edit lukeberry99/skills --add-topic agent-skill,claude-code-skill
```

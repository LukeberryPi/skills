# Agent Skills

Reusable coding-agent skills for codebase maintenance.

## Skills

| Skill | Description |
|---|---|
| [`prune-dead-code`](skills/prune-dead-code/SKILL.md) | Audits dead declarations, duplicated constants, drift-prone literals, and arbitrary limits. |
| [`remove-dumb-comments`](skills/remove-dumb-comments/SKILL.md) | Finds comments that merely restate the code and removes only those approved by the user. |

## Install

Clone the repository, then copy or symlink the skill directories into the skills directory used by your agent.

### Codex

```bash
git clone https://github.com/lukeberry99/skills.git
mkdir -p ~/.codex/skills
cp -R skills/skills/* ~/.codex/skills/
```

### Claude Code

```bash
git clone https://github.com/lukeberry99/skills.git
mkdir -p ~/.claude/skills
cp -R skills/skills/* ~/.claude/skills/
```

To install one skill, copy only its directory.

### Claude plugin

The repo ships a [Claude plugin](https://docs.anthropic.com/en/docs/claude-code/plugins) manifest at `.claude-plugin/plugin.json` that registers every skill under `skills/`. Install the plugin from this repository in Claude Code, or copy individual skill directories as above.

## Repository Structure

```text
.
├── README.md
├── .claude-plugin/
│   └── plugin.json
└── skills/
    ├── prune-dead-code/
    │   └── SKILL.md
    └── remove-dumb-comments/
        └── SKILL.md
```

## GitHub Topics

```bash
gh repo edit lukeberry99/skills --add-topic agent-skill,claude-code-skill
```

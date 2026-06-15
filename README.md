# Agent Skills

Reusable coding-agent skills for codebase maintenance.

## Skills

| Skill | Description |
|---|---|
| [`prune-dead-code`](www/skills/prune-dead-code/SKILL.md) | Audits dead declarations, duplicated constants, drift-prone literals, and arbitrary limits. |
| [`remove-dumb-comments`](www/skills/remove-dumb-comments/SKILL.md) | Finds comments that merely restate the code and removes only those approved by the user. |

## Install

Clone the repository, then copy or symlink the skill directories into the skills directory used by your agent.

### Codex

```bash
git clone https://github.com/lukeberry99/skills.git
mkdir -p ~/.codex/skills
cp -R skills/www/skills/* ~/.codex/skills/
```

### Claude Code

```bash
git clone https://github.com/lukeberry99/skills.git
mkdir -p ~/.claude/skills
cp -R skills/www/skills/* ~/.claude/skills/
```

To install one skill, copy only its directory.

## Repository Structure

```text
www/
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

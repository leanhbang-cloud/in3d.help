# dinh-mountain-help — `.agents/` Folder Index

> **For AI agents**: This is the index of the `.agents/` working folder.
> The router file is `AGENT_README.md` at the repo root — read that first.
> This file describes what lives inside `.agents/` and when to read what.

---

## What is `.agents/`?

A dedicated workspace for AI agents working on this project. It holds:

- **Persistent context** — files agents should read to understand the project
- **Working rules** — non-negotiable behavior rules
- **Plans & artifacts** — agent-produced work (plans, storyboards, drafts)
- **Reference workflows** — recipe playbooks for repeated tasks

Humans usually do not need to read these files directly. They are the
agent's long-term memory.

---

## Folder map

    .agents/
    ├── AGENT_README.md          <- you are here (index)
    ├── context/                 <- persistent project knowledge
    │   ├── MISSION.md           <- why this project exists (read FIRST)
    │   ├── ARCHITECTURE.md      <- system shape, components, data flow
    │   ├── DECISIONS.md         <- ADRs (architecture decision records)
    │   └── GLOSSARY.md          <- project-specific terms
    ├── rules/                   <- non-negotiable agent behavior
    │   ├── workspace.md         <- universal rules (read every session)
    │   └── stack-conventions.md <- stack-specific patterns
    ├── workflows/               <- reusable task recipes (*.md.example)
    ├── plans/                   <- dated planning docs agents produce
    ├── storyboards/             <- UI/UX storyboards (if applicable)
    ├── drafts/                  <- in-progress drafts (gitignored)
    └── screenshots/             <- visual references (gitignored)

---

## Read order for a new session

1. `../AGENT_README.md` — the router (project identity, stack, gotchas)
2. `rules/workspace.md` — universal rules for this workspace
3. `context/MISSION.md` — what we are building and why
4. `context/ARCHITECTURE.md` — only if the task touches structure
5. `context/DECISIONS.md` — search for relevant ADRs before changing patterns
6. `context/GLOSSARY.md` — when unfamiliar terms appear
7. `rules/stack-conventions.md` — when writing code

---

## Writing rules

- **`context/`** is mostly stable. Update only when reality changes (new ADR,
  new component, mission pivot). Always reference the change in commit message.
- **`rules/`** is immutable without an ADR. Propose changes via `DECISIONS.md`.
- **`plans/`** and **`storyboards/`** are append-only. Date each file
  (e.g., `2026-05-25-feature-x.md`).
- **`drafts/`** and **`screenshots/`** are scratch space — gitignored.

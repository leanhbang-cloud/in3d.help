# Glossary - dinh-mountain-help

> Project-specific terms, abbreviations, and concepts that have a
> specific meaning in this codebase. Read before any unclear word
> "feels obvious" — terms often mean different things in different teams.

> **For AI agents**: When you encounter an unfamiliar term in code,
> commits, or user requests, check here FIRST before inferring meaning.
> If a term is not in the glossary but appears in 3+ places, propose
> adding it.

---

## How to use this file

Each entry has 3 columns:

- **Term**: the word or abbreviation as it appears in code, docs, or conversation
- **Definition**: a 1-2 sentence explanation (avoid jargon in the definition itself)
- **Context**: where this term applies (which module, layer, or workflow)

Sort alphabetically. Group related terms with a `### Section header` if
the list grows beyond ~30 entries.

---

## Terms

| Term | Definition | Context |
|------|------------|---------|
| _ADR_ | _Architecture Decision Record. A short doc capturing one significant decision and its rationale._ | _All projects; see `.agents/context/DECISIONS.md`_ |
| _MVP_ | _Minimum Viable Product. The smallest scope that delivers user value._ | _Project planning; see `MISSION.md`_ |
| _RSC_ | _React Server Component. Runs only on the server, no JS shipped to client._ | _Next.js apps only_ |
| _SSG_ | _Static Site Generation. Build once, serve flat HTML._ | _Astro, Next.js export_ |
| | | |
| | | |
| | | |
| | | |
| | | |

> NOTE: Replace the example rows above with your real terms.
> Italicized rows are examples - delete them when you start filling in.

---

## Acronyms (quick reference)

> NOTE: Short list of acronyms used frequently. If an acronym is used
> once or twice, put it inline in the Terms table above. If it appears
> 5+ times, also list here.

| Acronym | Expansion |
|---------|-----------|
| _e.g. ADR_ | _Architecture Decision Record_ |
| _e.g. MVP_ | _Minimum Viable Product_ |
| | |
| | |

---

## Naming conventions (project-specific)

> NOTE: Document any naming patterns specific to this project. Helps
> agents and new contributors avoid creating inconsistent names.
>
> Examples:
> - Routes use kebab-case: `/user-profile`, never `/userProfile`
> - DB tables are snake_case plural: `users`, `blog_posts`
> - Components are PascalCase: `UserCard.tsx`
> - Env vars are SCREAMING_SNAKE: `DATABASE_URL`, `API_KEY`

- _Convention 1_
- _Convention 2_

---

## Revision history

> NOTE: Append when you add a new section or rename a term in bulk.
> Single-term additions don't need a history entry.

- _YYYY-MM-DD: Initial glossary started_

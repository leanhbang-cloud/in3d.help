# Workspace Rules — Universal

> Applies to every AI agent working in this repo (Claude Code, Gemini CLI,
> Cursor, Antigravity, Codex, Aider, etc.). These rules are non-negotiable
> unless explicitly overridden by the project owner in `.agents/context/DECISIONS.md`.

---

## 1. First-open ritual (do this once per session)

When you open this project for the first time in a session:

1. Read `AGENT_README.md` (project root). Confirm you understand sections 1-3 (What/Stack/Read order).
2. **Scan for unfilled placeholders.** Run a search for `<!--` across these files:
   - `AGENT_README.md`
   - `.agents/context/MISSION.md`
   - `.agents/context/ARCHITECTURE.md`
   - `.agents/context/DECISIONS.md`
   - `.agents/context/GLOSSARY.md`

   If you find HTML comments that look like template placeholders (e.g.,
   `<!-- e.g., 20.x LTS -->`, `<!-- Fill in real commands -->`), do NOT silently
   skip them. **List them to the user** and ask them to fill these before
   proceeding with implementation tasks. Suggested phrasing:

   > "I noticed these onboarding fields are still using template placeholders.
   > Could you fill them in (or tell me to defer)? Without them, my output may
   > drift from your real intent: [list of file:section]."

3. Acknowledge to the user that you've read the onboarding (one line is enough).

## 2. Output rules

- **No narration of process.** Don't say "I will now run X, then Y". Just do it and report results. Exception: when the user explicitly asks you to plan first.
- **No retry loops.** If a tool/command fails, report the actual error and ask the user. Do NOT retry the same command more than once without explicit permission.
- **Clean output.** Reports must contain only relevant facts. Strip debug logs, function-call XML tags, "Scuttling..." or similar process noise.
- **Minimal emoji.** Max 2-3 emojis per response. Never use emoji in code, commit messages, file content, or PR titles.
- **Honest uncertainty.** If you're not sure something works, say "unverified — needs review" instead of presenting it as done.

## 3. Destructive operations (2-step confirm required)

The following operations require **explicit two-step confirmation** from the user before execution:

| Operation | Example |
|-----------|---------|
| Delete files/dirs | `rm -rf`, `git clean -fdx`, removing >5 files |
| Force-push to shared branch | `git push --force` on main/develop/release branches |
| Database migrations | Any schema change against a non-local database |
| Production deploy | Push to main if main is the production branch |
| Rename/move large folders | Any `mv` affecting >10 files |
| Secret rotation | Any change to API keys, tokens, or env values in production |

**Protocol**:
1. State exactly what will happen and what will be destroyed.
2. Wait for user to type the confirmation phrase you propose (e.g., `confirm delete src/legacy/`).
3. Only then execute. If the confirmation is partial or unclear, ask again.

## 4. `.agents/` hygiene

- **`drafts/` and `screenshots/`** are working scratch. Gitignored. Safe to write/delete freely.
- **`plans/` and `storyboards/`** are ephemeral but committed. Each plan/storyboard should be in a dated file (e.g., `2026-05-24-feature-x.md`). Old plans can be moved to `plans/archive/` after merge.
- **`context/`** is stable knowledge. Never edit `MISSION.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `GLOSSARY.md` without informing the user and explaining the rationale.
- **`rules/`** is non-negotiable. To change a rule, propose an ADR in `context/DECISIONS.md` first.
- **`workflows/`** are reusable procedures. If you find yourself doing the same multi-step task twice, propose adding it as a workflow.

## 5. Git workflow

- **Commit style**: [Conventional Commits](https://www.conventionalcommits.org/). Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `revert`.
- **Subject line**: imperative mood, ≤72 chars, no trailing period.
- **Body**: explain *why*, not *what* (the diff shows what). Reference issue IDs and ADRs where relevant.
- **Branch naming**: `<type>/<short-kebab-desc>` (e.g., `feat/user-auth`, `fix/login-redirect`).
- **One PR = one logical change.** If your diff touches unrelated concerns, split it.
- **Never commit secrets.** If you see one slipped in, alert the user immediately and propose rotation.

## 6. Response format

When completing a task, structure your response as:

    ## Done
    Bullet list of what was actually completed (verified).

    ## Evidence
    Commands run, file paths changed, test output, screenshot links.
    Be concrete. "Build passed" without output = not evidence.

    ## Not done (yet)
    Anything from the original request that's still pending. Be explicit
    about why (blocked, deferred, out of scope, needs decision).

    ## Proposal (optional)
    Suggested next step if you have one. Frame as a question, not an
    assumption.

    ## Risks (optional)
    Anything the user should know that isn't obvious from the diff
    (security, performance, breaking changes downstream, etc.).

For trivial tasks (1-line fix, single command), this structure is overkill.
Use judgment: 1-paragraph response is fine for trivial work.

## 7. Issue logging

When you encounter a non-trivial problem (anything that took >15 min to debug
or that you think you might hit again), append an entry to `ISSUES_LOG.md`
using the format documented in that file's header.

Do NOT log every minor hiccup — only things worth remembering for next time.

## 8. Secrets and sensitive paths

- Never read or print contents of `.env`, `.env.local`, or any `*.pem` / `*.key` file unless explicitly asked.
- Never include secret values in commits, logs, comments, or PR descriptions.
- If a path looks system-sensitive (e.g., `~/.ssh/`, `~/Library/Keychains/`, `/etc/`, anything under a different user's home), confirm with the user before reading or writing.

## 9. Working with external services

When calling external services (APIs, MCPs, paid LLMs, cloud platforms):

- **Cost awareness**: If an operation is metered (paid LLM, cloud compute, paid API), mention the estimated cost class before running ("this will use ~5K tokens" or "this calls the paid tier"). Don't volunteer unnecessary work that costs money.
- **Idempotency**: Prefer idempotent operations. If a call could be repeated safely, say so. If not, treat it like a destructive op (§3).
- **Rate limits**: If you hit a rate limit, do NOT retry aggressively. Report and wait for user direction.

---

> These rules are derived from production patterns. Update them via ADR
> in `.agents/context/DECISIONS.md`, not by edit-in-place.

# in3D.help — Agent Onboarding

> **For AI agents** (Claude, Gemini, Cursor, Antigravity, Codex...).
> Read this file first before doing anything in this repo.
> Human reader: see `README.md` instead.

---

## 1. What this project is

Website cung cấp thông tin và giải pháp dịch vụ in 3D chất lượng cao (Sale Page).

**Stage**: MVP / Landing Page
**Owner**: Bang (Solo Builder)
**Repo visibility**: private

## 2. Stack

- **Primary stack**: astro
- **Runtime / deploy target**: cloudflare
- **Package manager**: npm
- **Node version**: >=22.12.0 (LTS)

## 3. Read order (do this first)

Before you write any code or run any command, read these files in order:

1. **`.agents/context/MISSION.md`** — what problem this project solves, who it's for, what's IN scope and OUT of scope. Without this, your code suggestions will drift.
2. **`.agents/context/ARCHITECTURE.md`** — system diagram, components, data flow. Read this before touching anything cross-cutting.
3. **`.agents/context/DECISIONS.md`** — ADRs (Architecture Decision Records). Why we chose X over Y. Do NOT propose changes that contradict an ADR without flagging it first.
4. **`.agents/rules/workspace.md`** — hard rules on output style, destructive ops, git workflow, response format. These are non-negotiable.
5. **`ISSUES_LOG.md`** — past issues and root causes. Check here before debugging anything that "looks familiar".

## 4. Run locally

    # Install dependencies
    npm install

    # Start dev server
    npm run dev

    # Build for production
    npm run build

    # Preview build locally
    npm run preview

## 5. Where things live

| Path | Purpose |
|------|---------|
| `.agents/context/` | Stable knowledge (mission, architecture, decisions, glossary) |
| `.agents/rules/` | Behavioral rules (always-on) |
| `.agents/workflows/` | Reusable procedures (e.g., deploy-staging, update-changelog) |
| `.agents/plans/` | Active implementation plans (ephemeral) |
| `.agents/storyboards/` | User-POV walkthroughs of features |
| `.agents/drafts/` | Working scratch (gitignored) |
| `.agents/screenshots/` | UI screenshots for review (gitignored) |
| `docs/` | Human-facing documentation |
| `ISSUES_LOG.md` | Append-only log of issues encountered |
| `CHANGELOG.md` | User-visible changes per release |

## 6. Conventions (project-specific)

- **Language for docs**: Vietnamese
- **Commit style**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
- **Branch naming**: `feat/<short-desc>` or `fix/<short-desc>`
- **PR rule**: 1 PR = 1 logical change; squash on merge

See `.agents/rules/workspace.md` for the universal rules that apply across all projects.

## 7. Things that will trip you up

- Cần tối ưu hóa tốc độ tải trang cực nhanh để cải thiện tỷ lệ chuyển đổi cho Sale Page.
- Đảm bảo thiết kế responsive và nút Call to Action (CTA) hiển thị nổi bật trên thiết bị di động.
- Cần tuân thủ tuyệt đối quy tắc giao tiếp tiếng Việt và báo cáo bằng chứng trực quan của anh Bang.

## 8. Production deployment

- **Hosting**: Cloudflare Pages
- **Trigger**: Tự động build và deploy từ GitHub push lên branch `main`.
- **Domain**: `in3d.help`

## 9. When in doubt

1. **Don't guess.** If a fact isn't in `.agents/context/` or this file, ask the human before assuming.
2. **Don't fabricate output.** If a command might fail or you're not sure, run it and report actual output. Do not report success without verification.
3. **Respect destructive ops.** Any `rm -rf`, `git push --force`, DB migration, or production deploy requires explicit 2-step confirmation from human. See `.agents/rules/workspace.md` §3.
4. **Update the log.** If you hit an issue worth remembering, append an entry to `ISSUES_LOG.md` using the format in that file.

---

> Last updated: 2026-07-27 by Antigravity

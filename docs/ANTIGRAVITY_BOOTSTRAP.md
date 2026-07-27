# Antigravity Bootstrap Checklist

> **Purpose**: Reproducible setup for Antigravity IDE on a new machine.
> Follow top-to-bottom. Expected duration: 30-45 minutes.
>
> **Last verified**: 2026-05-25 (macOS, home machine setup)

---

## When to use this checklist

- Setting up Antigravity on a brand-new machine (e.g., work laptop).
- Re-provisioning after OS reinstall.
- Verifying existing setup matches the canonical config.

---

## A. Pre-flight checklist

Before installing Antigravity, verify the host machine has:

### A.1 Node.js (LTS)

    node --version    # expect v20.x or v22.x (LTS)

If missing:

    brew install node@22
    brew link --overwrite node@22

### A.2 Git config

    git config --global user.name              # expect: your name
    git config --global user.email             # expect: your GitHub email
    git config --global init.defaultBranch     # expect: main
    git config --global pull.rebase             # expect: false (or your preference)

If missing:

    git config --global user.name "Your Name"
    git config --global user.email "you@example.com"
    git config --global init.defaultBranch main

### A.3 GitHub CLI

    gh --version       # expect: 2.x
    gh auth status     # expect: Logged in to github.com as <username>

If not logged in:

    gh auth login
    # Choose: GitHub.com -> SSH -> Upload SSH public key -> Login with browser

### A.4 SSH key for GitHub

    ssh -T git@github.com    # expect: "Hi <username>! You've successfully authenticated"

If fails, follow GitHub docs to generate ed25519 key and add to GitHub.
**Use a new key per machine** — do NOT copy private key between machines.

### A.5 Test clone

    git clone git@github.com:leanhbang-cloud/solo-builder-template.git /tmp/preflight-test
    rm -rf /tmp/preflight-test
    echo "Pre-flight OK"

If clone fails, fix SSH/GitHub auth before continuing.

---

## B. Install Antigravity

### B.1 Download

- Source: Antigravity website (download `.dmg` for macOS).
- Install: open `.dmg`, drag to `/Applications/`.
- Launch from `/Applications/Antigravity.app`.

### B.2 Login

- Use **personal account** (separate per machine if work policy requires).
- Login flow: web browser auth -> callback to app.
- Verify login: open Settings -> Account, confirm email shown.

### B.3 Verify base install

    /Applications/Antigravity.app/Contents/MacOS/Antigravity --version 2>/dev/null || echo "Open via UI"

Open a test folder (any folder), confirm AI chat panel responds.

---

## C. File Permissions

Settings -> File Permissions. Add these **Deny** rules:

| Type       | Pattern                                | Reason                          |
|------------|----------------------------------------|---------------------------------|
| File Read  | `/Users/<user>/.ssh/**`                | Protect SSH keys                |
| File Read  | `/Users/<user>/Library/Mobile Documents/**` | Protect iCloud Drive    |
| File Write | `/Users/<user>/Library/Mobile Documents/**` | Protect iCloud Drive    |

Replace `<user>` with your macOS username (`echo $USER`).

**Rationale**: AI agents should never read SSH private keys, even by
accident. iCloud Drive contains personal docs unrelated to coding.

---

## D. Network Permissions

Settings -> Network Permissions. Add these **Deny** rules under "Read URLs":

| Pattern                                  | Reason                       |
|------------------------------------------|------------------------------|
| `https://api.anthropic.com/**`           | Block external LLM APIs      |
| `https://api.cohere.com/**`              | Block external LLM APIs      |
| `https://api.mistral.ai/**`              | Block external LLM APIs      |
| `https://api.openai.com/**`              | Block external LLM APIs      |
| `https://api.perplexity.ai/**`           | Block external LLM APIs      |
| `https://generativelanguage.googleapis.com/**` | Block Gemini direct API |

**Rationale**: Antigravity routes its own LLM calls through internal
infrastructure. Blocking external APIs prevents agent code from making
unintended LLM calls (which would bypass Antigravity's billing/logging).

---

## E. Terminal Commands

Settings -> Terminal Commands.

### E.1 Ask rules (4 entries)

| Pattern              | Reason                                   |
|----------------------|------------------------------------------|
| `brew uninstall*`    | Removing tools should be explicit        |
| `git reset --hard*`  | Destroys uncommitted work                |
| `npm uninstall*`     | Removing packages should be explicit     |
| `rm -rf *`           | Destructive recursive delete             |

### E.2 Deny rules (2 entries)

| Pattern        | Reason                                |
|----------------|---------------------------------------|
| `rm -rf /*`    | Catastrophic (root-level delete)      |
| `sudo *`       | No privilege escalation by agent      |

### E.3 IMPORTANT: `git push --force*` exception

**On home machine (original setup)**: `git push --force*` is set to **Deny**.

**On new machines (this checklist)**: Set `git push --force*` to **Ask**,
not Deny. Reason: `solo-builder-template` requires `git push -u --force
origin main` for the first push after `init-project.sh` (orphan commit
issue documented in ISS-006). Setting to Ask lets you confirm each time
the agent suggests it.

| Pattern              | Setting  | Reason                                  |
|----------------------|----------|-----------------------------------------|
| `git push --force*`  | **Ask**  | Required for first push (ISS-006)       |

Workaround if you prefer keeping Deny: run `git push -u --force origin main`
manually in your terminal (not via agent).

---

## F. Commands Outside Sandbox

Settings -> Commands Outside Sandbox.

Leave **empty**. Agent should never run commands outside the sandbox.

---

## G. MCP Tools

Settings -> MCP Tools.

Leave **empty**. MCP capability is provided by Skills via their plugins,
not by manually adding MCP servers.

---

## H. Skills (8 expected)

Settings -> Skills. Install these 8 skills (via Build with Google Plugins (Settings > Customizations > Build with Google Plugins) inside
Antigravity, search by name):

| Skill                      | Plugin source                  | When used                          |
|----------------------------|--------------------------------|------------------------------------|
| a11y-debugging             | chrome-devtools-plugin         | Accessibility auditing             |
| chrome-devtools            | chrome-devtools-plugin         | Browser debugging                  |
| chrome-extensions          | modern-web-guidance-plugin     | Chrome extension dev (MV3)         |
| debug-optimize-lcp         | chrome-devtools-plugin         | LCP / Core Web Vitals              |
| google-antigravity-sdk     | google-antigravity-sdk         | Antigravity SDK agent design       |
| memory-leak-debugging      | chrome-devtools-plugin         | JS heap / OOM debugging            |
| modern-web-guidance        | modern-web-guidance-plugin     | Modern web best practices          |
| troubleshooting            | chrome-devtools-plugin         | MCP connection issues              |

All skills are **Global** scope (apply to every project).

Verify after install:

- Open Settings -> Skills, confirm count = 8.
- Plugin labels visible on each skill row.

---

## I. Rules

Settings -> Rules. One global rule:

| Rule         | Scope  | Content                              |
|--------------|--------|--------------------------------------|
| user_global  | Global | "Bang's Personal Setup" (see below)  |

`user_global` content: **set up directly on each machine** (not synced via
this template). Paste the same content as the home machine. The rule
covers communication style, project preferences, and personal workflows.

---



> **Update 2026-05-25 (ISS-008)**: Antigravity 2.0+ không còn entry `user_global` trong UI.
> Global Rules giờ là file Markdown tại `~/.gemini/GEMINI.md` (max 12,000 chars).
> Cách edit:
> 1. Edit trực tiếp file: `nano ~/.gemini/GEMINI.md` hoặc qua editor.
> 2. Qua UI: mở agent panel → "..." dropdown → Customizations → Rules → + Global.
> Workspace-level rules đặt tại `.agents/rules/` (workspace-relative).
> Tham khảo: https://antigravity.google/docs/rules-workflows

## J. Post-install verification

After completing sections A-I, run this end-to-end test:

### J.1 Bootstrap a test project

    cd ~/Projects   # or wherever you keep projects
    gh repo create antigravity-bootstrap-test \
      --template leanhbang-cloud/solo-builder-template \
      --private \
      --clone
    cd antigravity-bootstrap-test
    ./scripts/init-project.sh

Provide inputs when prompted:
- Project name: `antigravity-bootstrap-test`
- Description: `Verify Antigravity setup`
- Stack: `astro`
- Runtime: `vercel`
- Confirm: `y`

### J.2 Verify init output

Expect at the end of init output:

    [init] Initialization complete.
    ...
    FIRST PUSH TO GITHUB:
      Remote detected: https://github.com/<user>/antigravity-bootstrap-test.git
      Run (one-time, force needed due to GitHub template's orphan commit):
          git push -u --force origin main

### J.3 First push

    git push -u --force origin main

If Antigravity prompts (because `git push --force*` is set to Ask), confirm.

### J.4 Open in Antigravity

    open -a Antigravity .

Expect:
- Antigravity opens the folder
- File tree shows `.agents/`, `AGENT_README.md`, etc.
- Open the AI chat panel, ask: "Read AGENT_README.md and summarize what
  this project is about"
- Agent should respond with a coherent summary mentioning Astro and Vercel.

### J.5 Cleanup test project

    cd ~/Projects
    rm -rf antigravity-bootstrap-test
    gh repo delete leanhbang-cloud/antigravity-bootstrap-test --yes

---

## K. Troubleshooting

### K.1 Agent cannot read `.agents/` files

- Check File Permissions does not Deny the project folder.
- File Permissions Deny patterns should only cover `.ssh` and `Mobile Documents`.

### K.2 First push fails with "stale info"

- You used `--force-with-lease` instead of `--force`. See ISS-006.
- Use plain `git push -u --force origin main` for first push only.

### K.3 `gh repo create --template` clones empty repo

- Verify the template is marked `isTemplate: true`:
      gh repo view leanhbang-cloud/solo-builder-template --json isTemplate
- If false: `gh repo edit leanhbang-cloud/solo-builder-template --template`

### K.4 init-project.sh refuses to run

- Two possible causes:
  - You're inside the template repo source (safety guard, correct behavior).
  - The project is already initialized (idempotency guard).
- Read the error message — it tells you which case.

---

## L. Maintenance

Update this checklist when:
- Antigravity adds/changes settings.
- You add/remove Skills.
- You discover a new step needed for clean setup.

Commit message convention: `docs(antigravity): <what changed>`.

---

## See also

- `TEMPLATE_README.md` — user-facing template intro
- `.agents/workflows/update-template.md` — how to update this template
- `ISSUES_LOG.md` — running log (especially ISS-001 -> resolved by this doc)

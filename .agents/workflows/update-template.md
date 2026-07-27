# Workflow: Updating the Template Repo

> **Purpose**: How to safely update `solo-builder-template` itself when you
> discover bugs or missing features while using the template in a real project.

---

## Branch strategy

- **`main` only**. No `develop` branch, no release branches.
- Solo dev — no collaborators to coordinate with.
- Quality gate is the test suite (`./scripts/test-init.sh`), not branch separation.

---

## When to update the template

Update the template when:

1. A bug surfaces while using template in a real project (e.g., init script
   fails on some input, generated file has a typo, etc.).
2. A pattern proves useful across multiple projects and should be default.
3. A safety guard needs hardening (see ISS-004 / ISS-005 history).

Do NOT update the template for:

- Project-specific tweaks (those belong in the project, not the template).
- Speculative features (wait until you actually need them in 2+ projects).
- Cosmetic preferences that vary by project.

---

## 5-step update flow

### 1. Identify

While working on a real project (e.g., `billy-ai-blog`), notice the template
gave you something broken or missing. Capture:

- What went wrong (1 sentence)
- Minimal reproduction (file path, command, expected vs actual)
- Severity (blocking / annoying / nice-to-have)

### 2. Reproduce in template repo

    cd ~/Projects/solo-builder-template
    git pull origin main
    git status   # must be clean

Open ISSUES_LOG.md and add new entry (next ISS-NNN). Document the bug.

### 3. Fix

- Edit the template files in solo-builder-template.
- If the fix touches `scripts/init-project.sh`, also update test cases in
  `scripts/test-init.sh` if applicable.
- Keep changes minimal and focused — one bug per commit.

### 4. Test (mandatory quality gate)

    ./scripts/test-init.sh

Must show `21 passed, 0 failed` (or higher if you added test cases).
If any test fails, fix before continuing.

For changes touching init-project.sh logic, also do a sanity bootstrap:

    SANDBOX=/tmp/template-test-$(date +%s)
    git clone --depth=1 git@github.com:leanhbang-cloud/solo-builder-template.git "$SANDBOX"
    rm -rf "$SANDBOX/.git"
    cd "$SANDBOX"
    ./scripts/init-project.sh
    # verify expected behavior, then cleanup
    rm -rf "$SANDBOX"

### 5. Commit + push

Use conventional commit prefix:

- `feat(F.X): ...` for new features
- `fix(F.X): ...` for bug fixes
- `docs: ...` for doc-only changes
- `chore: ...` for housekeeping

Commit message body should explain WHY, not just WHAT.

    git add <files>
    git commit -m "fix(F.4.2): <one-line>

    <multi-line explanation of root cause, fix approach, and verification>"
    git push origin main

---

## How existing projects benefit from updates

**Existing projects do NOT auto-update** when you fix the template. Each
project is a snapshot from the moment it was bootstrapped.

Three options to apply template improvements to an existing project:

### Option A: Manual cherry-pick (recommended for small fixes)

In the project that needs the fix:

    cd ~/Projects/my-existing-project
    git remote add template git@github.com:leanhbang-cloud/solo-builder-template.git
    git fetch template
    git cherry-pick <commit-sha-from-template>
    # resolve conflicts if any
    git remote remove template

Best for: small bug fixes, single-file changes.

### Option B: Manual file copy (recommended for doc updates)

Just copy the updated file from template to project, commit.
Best for: `AGENT_README.md` improvements, `.agents/rules/` updates.

### Option C: Ignore (recommended for most cases)

If the update doesn't affect the existing project, ignore it. The project
already works. Only apply template updates if you actually need the fix.

---

## Tag-based versioning (optional, future)

Currently the template has no version tags. If the template stabilizes and
breaking changes become rare, consider tagging stable points:

    git tag -a v1.0.0 -m "First stable release"
    git push origin v1.0.0

Then projects can bootstrap from a specific tag (manual workflow, gh CLI
does not directly support `--tag` with `--template`).

Not implemented yet — add only if template churn slows down.

---

## See also

- `ISSUES_LOG.md` — running log of issues and fixes
- `docs/ANTIGRAVITY_BOOTSTRAP.md` — setup checklist for new machines
- `TEMPLATE_README.md` — user-facing intro

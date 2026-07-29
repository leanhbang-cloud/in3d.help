# Issues Log — in3D.help

> Format khi add entry mới:
>
> ## YYYY-MM-DD: Short title
>
> - **Symptom**: gì đã xảy ra (observable)
> - **Root cause**: nguyên nhân thật sự (sau khi điều tra)
> - **Fix**: làm gì để giải quyết
> - **What didn't work**: các attempt fail trước khi tìm ra fix (quan trọng để tránh lặp lại)
> - **References**: file paths, commits, related ADR, links


## 2026-07-29: Khắc phục các lỗi tối ưu Accessibility, SEO và Sitemap Domain khi chạy QC

- **Symptom**: Khi chạy QC bằng Lighthouse phát hiện điểm A11y bị kéo xuống 93/100 do lỗi thiếu main landmark, nhảy cấp heading (H2 -> H4) và độ tương phản màu sắc không đạt chuẩn WCAG AA trên topbar/footer. Ngoài ra robots.txt bị trỏ sai sitemap domain và og:image bị lỗi double slash (//).
- **Root cause**: Thừa kế code từ template cũ chưa được tối ưu ngữ nghĩa và chưa đồng bộ cấu hình custom domain mới cho dự án in3D.help.
- **Fix**: 
  - Thêm thẻ `<main>` bao bọc `<slot />` trong Layout.
  - Chuẩn hóa thứ tự heading thành H3 ở các bước/modules và footer.
  - Tăng màu sắc của text trang trí và liên kết footer để vượt qua kiểm tra tương phản màu.
  - Sử dụng constructor `URL` để triệt tiêu double slash cho og:image.
  - Đổi sitemap domain trong robots.txt và site config sang `3dprinting.ledainhan.com`.
- **What didn't work**: N/A — Các sửa đổi được thực hiện trực tiếp và verify thành công ngay.
- **References**: [Layout.astro](file:///Users/bangle-macmini/Projects/in3d-help/src/layouts/Layout.astro), [SEOHead.astro](file:///Users/bangle-macmini/Projects/in3d-help/src/components/SEOHead.astro), [global.css](file:///Users/bangle-macmini/Projects/in3d-help/src/styles/global.css), [robots.txt](file:///Users/bangle-macmini/Projects/in3d-help/public/robots.txt)


## ISS-012 — Lỗi upload ảnh lớn hơn 3MB bị chặn ở frontend/backend
**Date**: 2026-06-28
**Severity**: high
**Status**: fixed

- **Symptom**: Thành viên gặp lỗi khi gửi ảnh thực địa lớn (5MB - 12MB từ camera điện thoại độ phân giải cao). Giao diện báo ảnh sau nén vẫn > 3MB và API backend từ chối nhận file, gây ức chế cho người đóng góp.
- **Root cause**: Thư viện `browser-image-compression` sử dụng tìm kiếm nhị phân chất lượng ảnh với số lượt lặp bị giới hạn (10 lượt). Đối với các bức ảnh thiên nhiên Núi Dinh chứa nhiều chi tiết phức tạp (entropy cao), khi resize về `maxWidthOrHeight: 2400` không thể đạt mức dưới 3MB trong 10 lượt thử, thư viện bỏ cuộc và trả về tệp > 3MB.
- **Fix**:
  - Triển khai thuật toán nén nhiều lượt (Multi-pass fallback loop):
    - Lượt 1: Thử nén WebP, 1600px, target 1.5MB.
    - Lượt 2: Nén tiếp lần 2 WebP, 1280px, target 1.2MB.
    - Lượt 3: Nén lần 3 JPEG, 1080px, quality 50%.
  - Cập nhật thông điệp UI cho phép chọn ảnh tới 15MB, hệ thống tự động nén.
- **What didn't work**: Tự viết Canvas thủ công để nén ảnh gặp rủi ro crash bộ nhớ trình duyệt trên các dòng điện thoại di động cũ và dễ mất dữ liệu EXIF orientation (khiến ảnh chụp dọc bị xoay ngang).
- **References**: [upload-anh.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/pages/upload-anh.astro), [image_compression_solution.md](file:///Users/mac/Projects/Dinh-Mountant-help/docs/image_compression_solution.md)


## ISS-001 — Antigravity Project bootstrap checklist
**Date**: 2026-05-24
**Severity**: medium
**Status**: deferred

- **Symptom**: When using this template to spawn a new project, the user
  must manually configure the Antigravity IDE (UI rules, MCP servers,
  skills, model selection) per project. Handoff V3 mentions "16 hard UI
  rules" but does not list them; no default MCP set; no automation.
- **Root cause**: Template covers repo scaffolding (files, folders, init
  script) but not the IDE-side configuration that the user has been
  managing manually for billy-ai-blog.
- **Fix**: NOT YET IMPLEMENTED. Plan:
  1. Document the 16 hard UI rules used in billy-ai-blog (names, values,
     rationale) in `docs/ANTIGRAVITY_BOOTSTRAP.md`.
  2. Document default MCP servers to connect (Context7 confirmed; check
     filesystem, GitHub MCP).
  3. Investigate whether Antigravity supports config export/import. If
     yes, ship `antigravity-rules.template.json` and have `init-project.sh`
     print import instructions.
  4. Add Skills + model recommendation section (Gemini 3.5 Flash High,
     per handoff V3 note that Pro is tier-unavailable).
  5. Add pre-flight checklist for the user's first prompt to the agent.
- **What did NOT work**: N/A — deferred, not attempted yet.
- **References**:
  - Handoff V3 §"Workflow Sử Dụng Template" — only one ambiguous line
    about "16 hard UI rules"
  - Handoff V3 §F.11 (Bonus) — mentions Context7 MCP but as optional
  - Session log 2026-05-24: user raised this gap during F.4.1 testing
- **Owner / next step**: Defer until F.4 (init-project.sh) is complete.
  Then ask user to screenshot Antigravity Settings → Rules to enumerate
  the 16 rules. Decide on EN vs VI language for the doc.


---

### Update (2026-05-25): RESOLVED

Created `docs/ANTIGRAVITY_BOOTSTRAP.md` (324 lines) with 12 sections:
- A. Pre-flight checklist (Node, Git, gh CLI, SSH)
- B. Install Antigravity (download, login, verify)
- C. File Permissions (2 Deny rules)
- D. Network Permissions (6 Deny rules)
- E. Terminal Commands (4 Ask + 2 Deny + 1 exception for git push --force)
- F. Commands Outside Sandbox (empty)
- G. MCP Tools (empty, provided by Skills)
- H. Skills (8 skills with plugin sources)
- I. Rules (user_global, set per machine)
- J. Post-install verification (end-to-end bootstrap test)
- K. Troubleshooting (4 common issues)
- L. Maintenance

Verified at home machine (2026-05-25). To be verified at work machine on next setup.

## ISS-002 — Empty .example workflow files in template
**Date**: 2026-05-25
**Severity**: low
**Status**: deferred
**Discovered during**: F.4.2 real-run test in sandbox

### Problem
After running `init-project.sh`, these files remain as empty `.example` files
in the new project:
- `.agents/workflows/deploy-staging.md.example`
- `.agents/workflows/update-changelog.md.example`
- `.cursorrules` (root)
- `docs/AI_CONTEXT.md` (renamed from `.template`)
- `scripts/new-issue-log-entry.sh`
- `README.md` (renamed from `.template`)

### Root cause
F.2 created these as placeholder/scaffolding files but F.3 only wrote content
for 6 core templates (AGENT_README, workspace.md, 4 context files).
Remaining files are empty.

### Decision
Defer to a future phase (F.8+ "Bonus templates"). The `.example` semantics
mean "reference, copy if needed" — empty examples are not blocking. Users
can fill them per project, or we add content in a later sprint.

### Action items
- [ ] Write content for `.agents/workflows/deploy-staging.md.example`
- [ ] Write content for `.agents/workflows/update-changelog.md.example`
- [ ] Write content for `.cursorrules` (1-liner pointer to AGENT_README.md)
- [ ] Write content for `docs/AI_CONTEXT.md.template` (or remove)
- [ ] Write content for `scripts/new-issue-log-entry.sh` (helper script)
- [ ] Write content for `README.md.template` (human-facing readme)

---

## ISS-003 — Stack-conventions example files are empty
**Date**: 2026-05-25
**Severity**: low
**Status**: deferred
**Discovered during**: F.4.2 real-run test in sandbox

### Problem
The 3 stack-conventions example files are empty placeholders:
- `.agents/rules/stack-conventions-astro.md.example`
- `.agents/rules/stack-conventions-next.md.example`
- `.agents/rules/stack-conventions-hono.md.example`

When `init-project.sh` runs with `--stack=astro`, it copies the empty file
to `stack-conventions.md` and emits a WARN. The new project ends up with
an empty `stack-conventions.md`.

### Decision
Defer to F.8 (Bonus phase: stack-specific conventions). Each file deserves
~80-150 lines of stack-idiomatic patterns (Astro: islands, content collections;
Next: app router vs pages router, RSC patterns; Hono: middleware order,
Cloudflare bindings). Out of scope for current Phase F core delivery.

### Action items
- [ ] F.8.1: Write stack-conventions-astro.md.example content
- [ ] F.8.2: Write stack-conventions-next.md.example content
- [ ] F.8.3: Write stack-conventions-hono.md.example content
- [ ] (Optional) Add stack-conventions-python.md.example


---

## ISS-004 — init-project.sh corrupted template repo (postmortem)
**Date**: 2026-05-25
**Severity**: high
**Status**: resolved
**Discovered during**: F.5 test execution

### Symptom
During F.5 (`degit` end-to-end test), `npx degit` failed for the private
repo, and the subsequent `cd "$TEST1"` failed silently because the bash
block did not have `set -e`. Bash continued, `cd` left cwd at the template
repo root, and `./scripts/init-project.sh` then ran ON the template repo
itself — wiping `.git/`, renaming all `.template` files, and creating a
fake `init: my-astro-app` commit.

### Root cause
1. `init-project.sh` had no guard preventing it from running inside the
   template source repo. `is_already_initialized()` only checked for
   `.template` files, which were present, so the check passed.
2. F.5 test harness lacked `set -e` and did not verify `cd` success before
   running destructive scripts.

### Fix (committed)
1. **Marker file**: Added `.template-source` to template repo root. New
   `is_template_repo()` helper in init-project.sh refuses to run when
   either (a) `.template-source` exists, or (b) git remote URL contains
   `solo-builder-template`.
2. **Sandbox-aware tests**: `scripts/test-init.sh` `run_init()` now
   rsyncs template into `/tmp/sbt-test-XXX` (excluding `.template-source`
   and `.git`) before invoking init-project.sh — so tests still pass
   while production safety is preserved.
3. **Cleanup integration**: `do_cleanup_template_files` removes
   `.template-source` automatically when init-project.sh succeeds in a
   real project bootstrap.
4. **`.gitattributes`**: Marks template-internal files with `export-ignore`
   so `git archive`-based tools (including public-repo degit) skip them.

### What did NOT work
- Initial `is_already_initialized()` check (insufficient — only looked
  at .template file presence).
- First patch attempt for cleanup function: regex did not match because
  the actual function had no `log "Cleaning up..."` line; needed direct
  string match against `if [ -f "$REPO_ROOT/TEMPLATE_README.md" ]`.

### Recovery
- Backup of corrupted folder: `~/Projects/solo-builder-template-CORRUPTED-1779683963/`
- Restored via `git clone git@github.com:leanhbang-cloud/solo-builder-template.git`
  (commit `8de8b79` was the last good state pushed to remote).

### Lessons learned
1. **Always `set -e`** in test harness blocks that chain destructive ops.
2. **Verify cwd** before running scripts that mutate filesystem.
3. **Push early, push often** — GitHub remote saved the project.
4. **Safety markers** are cheap and high-value for template repos.

### References
- Commit `8de8b79` (last good state)
- Backup: `~/Projects/solo-builder-template-CORRUPTED-1779683963/`
- Session log: 2026-05-25 F.5 attempt 1

---

## ISS-005 — init-project.sh lost git remote after wiping .git/
**Date**: 2026-05-25
**Severity**: medium
**Status**: resolved
**Discovered during**: C.5 smoke test (gh repo create --template flow)

### Symptom
After running `gh repo create --template leanhbang-cloud/solo-builder-template
--clone`, the project clone has a valid `origin` remote pointing to the
new GitHub repo (e.g., `billy-test-bootstrap.git`). When init-project.sh
ran, `do_cleanup_template_files` wiped the entire `.git/` directory
(including the remote configuration), then `do_git_init` created a fresh
empty repo with no remote. User saw `git push` fail with
`fatal: 'origin' does not appear to be a git repository`.

### Root cause
The cleanup logic assumed the `.git/` directory only contained inherited
template history (true for Option 3 manual clone, where user runs
`rm -rf .git` before init). But Options 1 (GitHub UI) and 2 (gh
--template) leave `.git/` populated with the NEW project's remote
configuration. Wiping it was correct for history, wrong for remote.

### Fix (committed)
- `do_cleanup_template_files` now captures `git remote get-url origin`
  BEFORE wiping `.git/`. Filters out URLs containing
  `solo-builder-template` (so a bypassed safety guard doesn't restore
  a remote pointing to the template). Writes to `.preserved-remote-url`.
- `do_git_init` now checks for `.preserved-remote-url`. If present,
  reads it, runs `git remote add origin <url>`, then removes the file.
- Log message at end of init reflects whether remote was preserved.

### What did NOT work
- N/A — fix worked on first attempt after recognizing the cause.

### References
- Smoke test session 2026-05-25 (C.5 step)
- Workaround applied to billy-test-bootstrap: manually
  `git remote add origin ... && git push -u origin main --force`

### Lessons learned
1. `rm -rf .git/` deletes more than history — it also deletes
   configuration (remotes, hooks, user.email overrides).
2. Templates used via GitHub's "Use this template" arrive with `.git/`
   pre-configured — different from local degit/manual-clone usage.
3. Smoke test in real conditions (gh create --template) catches what
   sandbox tests (rsync to /tmp) cannot.

## ISS-006 — GitHub template orphan commit requires force-push on first push

- **Date**: 2026-05-25
- **Severity**: low (documented, by design)
- **Status**: resolved (documented workaround)

### Problem
`gh repo create --template` (and "Use this template" UI button) auto-creates
an "Initial commit" with unrelated history. After running `init-project.sh`
(which wipes `.git/`), `git push` fails with `non-fast-forward` error.

### Root cause
GitHub template repos do NOT preserve commit ancestry by design (unlike
forks). This is documented GitHub behavior — confirmed via GitHub Community
discussions and Git docs on `--allow-unrelated-histories`.

### Decision
Chose **A1** — document + smart hint in `print_next_steps`.
- Rejected B (keep `.git`, amend): leaves rubbish "Initial commit" in history.
- Rejected C (`--auto-push` flag): force-push should be deliberate user action.
- Rejected D (rebase onto initial commit): too complex, fragile edge cases.

### Fix
1. `print_next_steps` now detects `origin` remote and prints exact command
   (`git push -u --force-with-lease origin main`) with rationale.
2. If no remote, prints `gh repo create <name> --private --source=. --push`.
3. Documented in `TEMPLATE_README.md` "Why force-push on first push?" section.

### References
- https://github.com/orgs/community/discussions/50012
- https://adamj.eu/tech/2023/10/31/git-force-push-safely/
- StackOverflow: `--force` vs `--force-with-lease`

### Addendum (2026-05-25): --force-with-lease does not work for fresh repos

Sanity test (billy-test-bootstrap-v3) revealed that `--force-with-lease`
fails with "stale info" error on freshly-bootstrapped repos because the
fresh local `.git/` has no remote-tracking refs (no prior `git fetch`).

**Revised fix**: Use plain `git push -u --force origin main` for the
one-time first push. Safe in this context because:
1. Repo was created seconds ago — no collaborators to race against.
2. Remote only contains GitHub's placeholder "Initial commit".
3. After this push, all future pushes use normal `git push`.

For day-to-day collaboration push workflow, users should still prefer
`--force-with-lease` over `--force` as the safer default.

**Lesson learned**: Original research suggested `--force-with-lease` as
modern best practice — true in general, but failed to account for fresh
repos without remote-tracking refs. Always verify recommendations in
actual context before committing.

## ISS-007 — Antigravity 'git push --force*' Deny conflicts with template first-push

- **Date**: 2026-05-25
- **Severity**: low (documented, by design)
- **Status**: resolved (documented decision)

### Problem
Default Antigravity setup on home machine has `git push --force*` set to
**Deny** in Terminal Commands. However, `solo-builder-template` requires
`git push -u --force origin main` for the first push after bootstrap
(ISS-006: GitHub template orphan commit).

### Decision
Set `git push --force*` to **Ask** (not Deny) on machines used with this
template. Each force-push attempt prompts for confirmation. Documented in
`docs/ANTIGRAVITY_BOOTSTRAP.md` section E.3.

### Alternative workaround (if you prefer keeping Deny)
Run `git push -u --force origin main` manually in your terminal app
(Warp, iTerm, Terminal.app), not via Antigravity agent.

### Rationale for Ask over Deny
- First push is a known, expected event (1 per project lifetime).
- Ask gives same safety as Deny (you confirm each time) without blocking
  the legitimate workflow.
- Day-to-day force-pushes (history rewrites) still get confirmed.



---

## ISS-008: Antigravity terminology — "Build with Google Plugins" thay vì "plugin marketplace"

**Date**: 2026-05-25
**Severity**: Low (documentation accuracy)
**Status**: RESOLVED
**Discovered on**: Máy Cty (Mac mini, user `bangle-macmini`) trong quá trình Phase B setup.

### Symptom
Tài liệu `docs/ANTIGRAVITY_BOOTSTRAP.md` ban đầu (Section H) gọi nơi cài plugin là "plugin marketplace". Người dùng không tìm thấy UI element này trong Antigravity Settings.

### Root cause
1. Antigravity không có khái niệm "marketplace" cho plugins. Plugins được phân loại thành 2 nhóm:
   - **Bundled Plugins** (Google-built): cài qua `Settings > Customizations > Build with Google Plugins`.
   - **Manual plugins**: copy thư mục vào `~/.gemini/config/plugins/` (global) hoặc `.agents/plugins/` (workspace).
2. "Marketplace MCP Servers" tồn tại nhưng chỉ cho MCP servers, không phải plugins. Hai khái niệm bị nhầm lẫn.
3. Antigravity 2.0+ cũng đã chuyển Global Rules từ entry `user_global` trong UI sang file `~/.gemini/GEMINI.md` — checklist cũ outdated.

### Fix
1. `docs/ANTIGRAVITY_BOOTSTRAP.md`:
   - Section H: thay "plugin marketplace" → "Build with Google Plugins (Settings > Customizations)".
   - Section I: thêm addendum mô tả `~/.gemini/GEMINI.md` location + cách edit qua UI mới.
2. Trên máy Cty: cài bundle "Chrome DevTools" qua Build with Google Plugins → đủ 8 skills.
3. Tạo `~/.gemini/GEMINI.md` (7796 bytes, 11 sections) → verify AI đọc rules đúng.

### Verification
Phase J test trên máy Cty (`antigravity-verify-cty`):
- AI trả lời tiếng Việt ✅ (Section 1 GEMINI.md)
- Không preamble ✅
- Đọc đúng 6 file context ✅ (File Permissions OK)
- Stop-and-ask pattern hoạt động ✅ (Section 3)

### Lessons learned
- Khi viết doc về 3rd-party UI, **kiểm chứng terminology bằng screenshot từ UI thật**, đừng dùng từ generic như "marketplace".
- Antigravity update nhanh (2.0+ đã thay đổi rules UI) — checklist cần mark version + ngày verify.
- Plugins, MCP servers, Skills là 3 concept riêng biệt, không thay thế nhau.

### Reference URLs
- https://antigravity.google/docs/plugins (plugin structure)
- https://antigravity.google/docs/build-with-google (bundled plugins list)
- https://antigravity.google/docs/rules-workflows (Global Rules location)


---

## ISS-009 — Lỗi vỡ giao diện Trail Grid và rớt dòng nát bấy ở Card trên Desktop
**Date**: 2026-06-01
**Severity**: high
**Status**: resolved

- **Symptom**: Cả 5 card cung đường trekking bị ép xếp thành 1 hàng ngang 5 cột chật chội trên Desktop. Dải thông tin Forest strip bị co rúm rớt dòng và chữ nút "Chi Tiết Cung Đường" rớt làm 3 dòng đè lên nhau, tràn cả ra ngoài mép bo tròn dưới của Card.
- **Root cause**: 
  1. **Cơ chế CSS Scoping mặc định của Astro**: CSS viết trong `index.astro` dạng `.trail-grid > :nth-child(x)` bị hash scope tự động, không thể chọn được thẻ con `<article class="card-a">` vì thẻ này nằm trong scope độc lập của component `CardA.astro`. Dẫn đến việc chỉ thị grid-column chia lưới 3 cột (dòng 1) và 2 cột căn giữa (dòng 2) bị trình duyệt bỏ qua, trình duyệt ép cả 5 card lên 1 hàng ngang.
  2. **Độ dài chữ quá dài**: Chữ "Chi Tiết Cung Đường" (19 ký tự) và nhãn "THỜI GIAN" (9 ký tự) quá dài so với chiều rộng hẹp của card khi bị co ép.
- **Fix**:
  1. Sử dụng `:global()` selector trong CSS Grid của `index.astro` để phá vỡ scoping của Astro: `.trail-grid > :global(*:nth-child(x))`. Điều này ép trình duyệt render đúng 3 cột (dòng đầu) và 2 cột căn giữa (dòng sau) tuyệt đối từ màn hình Tablet (768px) trở lên.
  2. Rút ngắn nhãn nút bấm thành **"Xem Chi Tiết"** (12 ký tự) và co bớt padding nút bấm trong card để dành diện tích cho chữ.
  3. Giảm `.data-label` xuống `0.625rem` (10px in hoa) — đây là chuẩn micro-typography của giao diện cao cấp, vừa sang vừa chống rớt dòng tuyệt đối.
  4. Co bớt padding dải strip trong card để tăng diện tích co dãn.
- **What didn't work**: N/A - giải pháp trên đã sửa đổi thành công và triệt để lỗi visual.
- **References**:
  - `src/pages/index.astro` (CSS Grid fix)
  - `src/components/cards/CardA.astro` (Card layout & Button text fix)
  - `src/components/Button.astro` (Nút bấm props update)

## ISS-010 — Nâng cấp 5 Cung đường trekking từ Grid tĩnh thành Slider cuộn ngang (Carousel)
**Date**: 2026-06-02
**Severity**: medium
**Status**: resolved
**Discovered by**: Anh Bang duyệt nâng cấp để tối ưu hóa thiết kế (5 card xếp 2 dòng mất cân đối trên Desktop và quá dài trên Mobile).

- **Symptom**: Layout Grid 5 card tạo ra sự bất đối xứng (dòng trên 3 card, dòng dưới 2 card bị hụt) trông không cân đối. Trên mobile, danh sách kéo dài theo chiều dọc làm người dùng phải cuộn trang quá nhiều mới đọc hết.
- **Root cause**: Lưới grid tĩnh 2 dòng hoạt động ổn định về mặt kỹ thuật sau fix ISS-009, nhưng chưa đạt đỉnh cao về UX/UI thẩm mỹ và tính cân xứng của thiết kế cao cấp.
- **Fix**:
  1. Thay thế lưới tĩnh `.trail-grid` bằng Slider ngang `.trail-slider` dùng **CSS Scroll Snapping** (`scroll-snap-type: x mandatory`).
  2. Bổ sung cụm nút điều hướng mũi tên ở góc phải tiêu đề section (`#prev-slide`, `#next-slide`) cho phép người dùng click chuột để cuộn mượt.
  3. Viết script JavaScript siêu nhẹ (20 dòng native) xử lý sự kiện click của nút bấm, tự động tính toán khoảng cách cuộn thông minh (`slideWidth + gap`), và làm mờ (opacity: 0.3) / vô hiệu hóa nút bấm khi slider đạt đến hai đầu danh sách.
  4. Trên Mobile, thiết lập độ rộng slide `290px` để card tiếp theo lấp ló một góc nhỏ ở rìa phải, kích thích tâm lý vuốt chạm tự nhiên mà không cần click nút.
- **What didn't work**: N/A.
- **References**:
  - `src/pages/index.astro` (HTML slider structure, CSS scroll snapping, JS controller)
  - `/Users/mac/.gemini/antigravity/brain/a8802999-f5ba-4062-a8ea-000030561d51/slider_desktop.png` & `slider_mobile.png` (Ảnh bằng chứng nghiệm thu trực quan)

---

## ISS-011 — Đề xuất tối ưu hóa hiệu năng và ảnh (Phase 4 Performance Audit)
**Date**: 2026-06-03
**Severity**: medium
**Status**: deferred

- **Symptom**: Điểm hiệu năng (Performance) trên mobile chỉ đạt từ 67 đến 73. Thời gian Largest Contentful Paint (LCP) dưới giả lập Slow 3G lên tới 5.2 giây.
- **Root cause**:
  1. Ảnh hero trang chủ `hero_bg.png` quá nặng (1.1MB).
  2. Các ảnh gallery kích thước gốc trên trang `/ve-nui-dinh` quá lớn (từ 319KB đến 528KB), định dạng `.jpg` chưa được nén và tối ưu sang `.webp`.
  3. Các ảnh Unsplash lấy từ nguồn ngoài trên trang chủ `/` và `/cac-cung-duong` chưa khai báo thuộc tính `width` và `height`, tăng nguy cơ gây giật dịch chuyển bố cục (CLS).
- **Fix (Kế hoạch thực hiện sau khi hoàn tất chuỗi QC chính)**:
  1. Chuyển đổi toàn bộ định dạng ảnh sang `.webp`. Nén ảnh Hero nền xuống dưới 100KB, ảnh Full-size gallery xuống dưới 100KB, và ảnh Thumbnail xuống dưới 35KB.
  2. Thêm thuộc tính `width` và `height` rõ ràng vào các thẻ ảnh Unsplash trong mã nguồn.
- **What didn't work**: N/A (Được chuyển thành action items hoãn lại để ưu tiên hoàn thành QC).
- **References**:
  - [.agents/plans/performance_test_report.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/plans/performance_test_report.md)

---

## ISS-012 — Đề xuất tối ưu hóa khả năng truy cập & SEO (Phase 5 A11y & SEO Audit)
**Date**: 2026-06-03
**Severity**: medium
**Status**: deferred

- **Symptom**: 
  1. Nhiều phần tử bị lỗi tương phản màu (Color Contrast) dưới 4.5:1. Đặc biệt là các section label màu Vàng Gold trên nền Kem/Trắng chỉ đạt tỉ lệ ~2.1:1.
  2. Bị lỗi thứ tự tiêu đề (Heading Order) nhảy từ H2 sang H4 trong phần timeline lộ trình và các mục cẩm nang/di chuyển.
  3. Lỗi `aria-hidden` chứa phần tử nhận Focus ở Lightbox Modal (bàn phím vẫn focus được nút đóng ẩn).
  4. Thiếu file `robots.txt` và `sitemap.xml`.
- **Root cause**:
  1. CSS phối màu chưa đạt tỉ lệ tương phản tối thiểu cho chữ cỡ nhỏ.
  2. Bỏ qua cấp H3 trong cấu trúc HTML.
  3. Lightbox khi ẩn chỉ chỉnh `opacity: 0` và `pointer-events: none` thay vì dùng `visibility: hidden` hoặc `display: none` để triệt tiêu focus.
- **Fix (Kế hoạch thực hiện sau khi hoàn tất chuỗi QC chính)**:
  1. Điều chỉnh CSS phối màu để tăng độ tương phản của chữ (chi tiết trong báo cáo).
  2. Đổi các thẻ timeline-title từ H4 sang H3.
  3. Thêm `visibility: hidden` vào CSS của Lightbox Modal khi ở trạng thái đóng.
  4. Tạo tệp `robots.txt` và tích hợp `@astrojs/sitemap`.
- **Rủi ro thẩm mỹ**:
  * Việc đổi màu của nhãn section label từ Gold `#C8A45D` sang màu xanh Forest `#1E3A28` để đạt chuẩn tương phản màu (từ 2.18:1 lên 6.5:1) có thể làm giảm bớt tính thẩm mỹ đồng bộ tone Louis Vuitton ấm. Cần cân nhắc lựa chọn kỹ lưỡng sau khi quá trình test hoàn tất.
- **Quyết định nội dung (03/06/2026)**: Anh Bang quyết định tạm thời giữ hệ thống 4 cung đường theo CSDL. Sẽ tiến hành cập nhật Hero, Footer và liên kết neo link về bộ 4 cung này. Đồng thời cấu trúc code và dữ liệu vẫn được tối ưu để dễ dàng scale thêm cung đường sau này.
- **References**:
  - [.agents/plans/accessibility_seo_report.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/plans/accessibility_seo_report.md)
  - [.agents/plans/content_verification_report.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/plans/content_verification_report.md)


---

## ISS-013 — Lỗi Đăng nhập Admin báo "Lỗi kết nối" (500 Error) khi chuyển sang Workers
**Date**: 2026-06-19
**Severity**: high
**Status**: resolved

- **Symptom**: Khi người dùng nhấn "Đăng nhập" ở giao diện Admin `/admin/login`, giao diện báo lỗi màu đỏ "Lỗi kết nối. Vui lòng thử lại.".
- **Root cause**: Khi chuyển đổi từ Cloudflare Pages sang Cloudflare Workers, biến môi trường bí mật `ADMIN_PASSWORD_HASH` chưa được thiết lập trên môi trường Workers của tài khoản Cloudflare production. Hàm `verifyPassword` trong `src/lib/auth.ts` cố gắng đọc độ dài của hash (`storedHash.length`), do `storedHash` (được lấy từ `env.ADMIN_PASSWORD_HASH`) bị `undefined` nên gây ra crash runtime `TypeError: Cannot read properties of undefined (reading 'length')` và trả về mã lỗi HTTP 500.
- **Fix**: Thiết lập biến mật khẩu bí mật lên Cloudflare Workers bằng lệnh:
  `echo "<hash_mat_khau>" | npx wrangler secret put ADMIN_PASSWORD_HASH`
- **What didn't work**: N/A.
- **References**:
  - `src/lib/auth.ts`
  - `src/pages/api/auth/login.ts`

---

## ISS-014 — Ảnh trên trang Thư viện ảnh bị vỡ (404) trên Production Workers
**Date**: 2026-06-19
**Severity**: high
**Status**: resolved

- **Symptom**: Sau khi admin duyệt ảnh thành công, ảnh xuất hiện trên trang Thư viện ảnh `/thu-vien-anh` dưới dạng khung trống bị lỗi kèm alt text (không render được hình ảnh thật).
- **Root cause**: Component `OptimizedImage.astro` ở production tự động bọc đường dẫn ảnh thông qua dịch vụ Cloudflare Image Resizing (`/cdn-cgi/image/width=...`). Tính năng này không khả dụng mặc định trên gói Cloudflare Free hoặc subdomain Workers `.workers.dev`, dẫn đến việc các request tải ảnh bị Cloudflare trả về mã lỗi 404.
- **Fix**: Sửa `src/components/OptimizedImage.astro`, gỡ bỏ hoàn toàn việc bọc URL qua `/cdn-cgi/image/` đối với production, chuyển sang serve trực tiếp qua clean URL `/photos/[filename]` (lấy trực tiếp từ R2 public qua endpoint `/photos/[key].ts` giống như môi trường dev).

---

## ISS-015 — Ảnh và bình luận vừa duyệt không xuất hiện ngay (Trễ do Cache)
**Date**: 2026-06-19
**Severity**: medium
**Status**: resolved

- **Symptom**: Admin bấm duyệt ảnh và bình luận thành công trong trang quản trị `/admin`, nhưng khi truy cập lại trang công khai `/thu-vien-anh` thì không thấy thay đổi xuất hiện ngay lập tức.
- **Root cause**: Trang `/thu-vien-anh` cấu hình header `Cache-Control` dạng `public, s-maxage=300, stale-while-revalidate=600`, làm cho Cloudflare Edge Cache lưu trữ bản HTML cũ tới 5 phút mà không chuyển tiếp request về Workers để render dữ liệu mới từ D1.
- **Fix**: Sửa `src/pages/thu-vien-anh.astro`, đổi header `Cache-Control` thành `no-cache, no-store, must-revalidate` để tắt caching CDN đối với trang tương tác động này, đảm bảo mỗi truy cập đều render dữ liệu real-time từ D1.

---

## ISS-016 — Lỗi 404 các trang con trên production custom domain nuidinh.help
**Date**: 2026-06-19
**Severity**: high
**Status**: resolved

- **Symptom**: Khi truy cập các trang con như `/cac-cung-duong/`, `/thu-vien-anh/` trên tên miền chính `nuidinh.help` bị trả về mã lỗi 404 Not Found. Trang chủ `/` hoạt động bình thường nhưng thực chất là do Cloudflare CDN đang phục vụ cache cũ từ 16 tiếng trước.
- **Root cause**: Từ Astro 6+, adapter `@astrojs/cloudflare` mặc định biên dịch mã nguồn theo cấu hình mới của Cloudflare Workers + Assets (Worker độc lập), không còn xuất bản tệp `_worker.js` cho nền tảng Cloudflare Pages cũ. Dự án chính `nuidinh.help` hiện đang được cấu hình dưới dạng **Cloudflare Pages** trong Cloudflare dashboard, nên khi nhận mã nguồn mới nó không thể định tuyến các trang SSR và các trang động, dẫn đến trả về 404. Việc chuyển tên miền sang Worker mới bị chặn bởi bản ghi DNS/CNAME hiện tại đang thuộc quyền quản lý của Pages project.
- **Fix**: Gỡ bỏ liên kết tên miền `nuidinh.help` khỏi dự án Cloudflare Pages cũ trên Cloudflare Dashboard. Sau đó, chạy `npx wrangler login` để xác thực lại tài khoản trên iMac và chạy `npx wrangler deploy` dưới dạng Cloudflare Worker mới với cấu hình Custom Domain trong `wrangler.jsonc`. Cloudflare sẽ tự động tái cấu hình bản ghi DNS trỏ trực tiếp về Worker động mới.
- **What didn't work**:
  - Thử chạy deploy trực tiếp bằng `npx wrangler deploy` với cấu hình `custom_domain: true` trong `wrangler.jsonc` nhưng thất bại do xung đột DNS đang được quản lý bởi Cloudflare Pages (`code: 100117`).
  - Thử deploy thư mục `dist/` trực tiếp lên Pages thì Pages chỉ coi là trang tĩnh, làm các đường dẫn SSR và API bị 404 (các trang tĩnh lọt vào `/client/` thay vì ở root `/`).
- **References**:
  - `wrangler.jsonc` (cấu hình `routes` và `assets`)
  - Lệnh deploy thất bại của Task-673

---

## ISS-017 — Lỗi lệch đồng bộ deploy giữa Cloudflare Pages và Cloudflare Workers
**Date**: 2026-06-23
**Severity**: high
**Status**: resolved

- **Symptom**: Code tối ưu hiệu năng (picture element, WebP images, layout shift fixes) đã được commit, push, và báo cáo deploy thành công lên Pages preview, nhưng khi truy cập tên miền chính `https://nuidinh.help/` thì giao diện vẫn chạy code cũ (không có picture tag, bị lỗi chập chờn NO_LCP trên mobile). Tình trạng lệch deploy này xảy ra 2 lần trong 2 ngày liên tiếp.
- **Root cause**: Custom domain `nuidinh.help` đã được chuyển hướng DNS sang hệ thống **Cloudflare Workers** động mới (theo quyết định ISS-016). Tuy nhiên, các tài liệu hướng dẫn và workflow cũ trong `CURRENT_FOCUS.md` và `AGENT_README.md` vẫn giữ lệnh deploy lên **Cloudflare Pages** (`npx wrangler pages deploy`). Các agent sau đó chỉ chạy lệnh Pages deploy, khiến code được tải lên Pages preview thành công nhưng Worker của tên miền chính `nuidinh.help` vẫn chạy bản code cũ từ trước đó.
- **Fix**: 
  1. Đồng bộ và thay đổi toàn bộ tài liệu deploy sang Cloudflare Workers. Chạy lệnh `npm run build && npx wrangler deploy` để cập nhật trực tiếp lên Worker của custom domain.
  2. Cập nhật lại hướng dẫn trong `CURRENT_FOCUS.md` và `AGENT_README.md` để đồng nhất lệnh deploy Workers trên mọi phiên làm việc tiếp theo.
- **What didn't work**: Chạy `wrangler pages deploy` không đồng bộ được dữ liệu lên domain chính do domain đã chuyển quyền DNS quản lý qua Workers.
- **References**:
  - `wrangler.jsonc` (cấu hình deploy Workers)
  - Lệnh deploy Workers thành công của session ngày 2026-06-23 (Task-369)

---

## ISS-018 — Lỗi chập chờn Mobile LCP (NO_LCP) trên PageSpeed Insights
**Date**: 2026-06-24
**Severity**: high
**Status**: resolved

- **Symptom**: Lighthouse/PageSpeed Insights thỉnh thoảng báo 'Error! NO_LCP' (không phát hiện được phần tử LCP trên di động) hoặc thời gian LCP di động rất cao.
- **Root cause**:
  1. **Chromium Full-Viewport Image Exclusion Heuristic**: Ảnh Hero trên mobile có chiều cao cố định 500px, dễ chiếm gần 100% diện tích màn hình trên các thiết bị có viewport ngắn (hoặc khi thanh địa chỉ trình duyệt bị ẩn). Trình duyệt loại bỏ ảnh Hero khỏi danh sách ứng viên LCP vì coi nó là background.
  2. **Kích thước file ảnh Hero lớn**: Mobile vẫn đang load chung tệp ảnh gốc `/images/hero_bg.webp` nặng 253KB giống desktop, làm chậm tốc độ truyền tải trên mạng di động 3G/4G.
  3. **Thiếu Preload**: Ảnh Hero không được khai báo preload trong HTML head, khiến trình duyệt bắt đầu tải ảnh muộn hơn sau khi đã parse DOM.
- **Fix**:
  1. **Tạo ảnh mobile riêng**: Resize ảnh gốc xuống chiều rộng 768px (`hero_bg_mobile.webp`), giúp dung lượng file giảm 45.8% (còn 137.2KB), tăng tốc độ tải.
  2. **Sửa chiều cao Hero**: Đổi từ `500px` cố định sang `height: clamp(320px, 60vh, 420px)` trên mobile. Ảnh Hero chỉ chiếm tối đa 60% viewport, tránh được heuristic loại trừ của Chromium và lộ chân trang Overview bên dưới.
  3. **Thêm Preload**: Preload ảnh mobile và desktop trong `<head>` trang chủ `index.astro` có điều kiện media query phù hợp.
  4. **Định danh**: Gắn thuộc tính `elementtiming="hero-image"` cho thẻ `<img>` của Hero.
- **References**:
  - `scripts/generate-mobile-hero.js` (script resize bằng sharp)
  - `src/components/Hero.astro` (sửa picture source và CSS height)
  - `src/pages/index.astro` (thêm thẻ preload)
  - `package.json` (thêm script deploy Workers để đồng bộ hoá)
---

## ISS-019 — Lỗi code block rác '```' chưa đóng ở cuối bài viết Blog
**Date**: 2026-06-26
**Severity**: medium
**Status**: resolved

- **Symptom**: Đoạn phân cách `---` và phần chân trang (footer) ở cuối một số bài viết blog hiển thị lỗi bên trong một khối màu đen sậm (code block). Cụ thể bị ảnh hưởng ở 5 bài viết: `an-toan-sinh-ton-tren-nui-dinh-nhung-dieu-can-biet.md`, `review-top-5-quan-ga-nuong-ngon-nhat-chan-nui-dinh.md`, `huong-dan-di-chuyen-tu-tphcm-den-nui-dinh-chi-tiet.md`, `checklist-chuan-bi-trekking-nui-dinh-27-mon-do.md`, và `camping-qua-dem-dinh-la-ban-huong-dan-a-z.md`.
- **Root cause**: Khi Genspark sinh bài viết, nó bọc toàn bộ nội dung MDX trong một block code lớn (mở bằng ` ```markdown ` và đóng bằng ` ``` `). Script `scripts/content-generator.sh` cố gắng làm sạch wrapper thô ở đầu bằng cách tìm dòng `---` và cắt từ đó trở đi, vô tình loại bỏ thẻ mở ` ```markdown ` ở đầu file, nhưng lại giữ nguyên thẻ đóng ` ``` ` ở cuối file. Khi script `scripts/post-process.sh` cắt bỏ phần phụ lục B/C/D từ dòng `# PHẦN B` trở đi, nó lại giữ lại phần trước đó bao gồm thẻ đóng ` ``` ` này. Thẻ đóng ` ``` ` cô đơn trở thành thẻ mở của một code block mới, nuốt chửng toàn bộ thẻ `---` và layout bên dưới nó.
- **Fix**: 
  1. Đã chạy script Python dọn dẹp và cắt bỏ hoàn toàn các ký tự ` ``` ` và `---` thừa ở cuối 5 file MDX bị ảnh hưởng trực tiếp.
  2. Deploy lại bản cập nhật sạch sẽ lên môi trường sandbox (`sandbox.nuidinh.help`).
  *(Lưu ý cho session sau: Cần sửa lỗi triệt để trong script generator/post-process để tránh sinh ra code block rác khi chạy pipeline ở các lần tiếp theo)*
- **What didn't work**: N/A.
- **References**:
  - `src/content/blog/*.md` (các file MDX được sửa)
  - `scripts/content-generator.sh` & `scripts/post-process.sh` (mã nguồn pipeline sinh bài viết)

---

## ISS-020 — Lỗi duyệt ảnh trang Admin không hoạt động, nút hành động quá nhỏ, và lỗi vỡ ảnh Thư viện
**Date**: 2026-06-27
**Severity**: high
**Status**: resolved

- **Symptom**: 
  1. Lỗi duyệt ảnh: Admin click "Duyệt" ảnh chờ duyệt ở trang quản trị `/admin` thì báo lỗi alert "Không tìm thấy file trong staging".
  2. Nút bấm quá nhỏ: 3 nút hành động (Duyệt, Từ Chối, Xóa) trên trang Admin có kích thước rất nhỏ, khó chạm trên mobile.
  3. Lỗi vỡ ảnh: Ảnh đã được duyệt thành công trên trang "Thư viện ảnh" (`nuidinh.help/thu-vien-anh`) hiển thị icon lỗi (broken thumbnail), không tải được ảnh thực tế.
- **Root cause**: 
  1. Lỗi duyệt ảnh: Hàm `copyToPublic` trong `src/lib/r2.ts` chuyển tiếp trực tiếp `stagingObject.body` (dạng `ReadableStream`) qua `bucket.put`. Trong runtime Cloudflare Workers, `put` yêu cầu stream phải có kích thước xác định trước (known length), luồng stream từ `bucket.get` không tự động truyền thông tin này xuống, dẫn đến lỗi runtime `TypeError: Provided readable stream must have a known length`.
  2. Lỗi giao diện: Giao diện admin dùng Astro scoped `<style>` nhưng các phần tử danh sách ảnh/bình luận được sinh động từ client-side bằng `innerHTML`. Do đó, chúng thiếu các thuộc tính scoped class (`data-astro-cid-xxxx`) nên không ăn style css.
  3. Lỗi vỡ ảnh: Component `OptimizedImage.astro` sử dụng tính năng Cloudflare Image Resizing thông qua đường dẫn `/cdn-cgi/image/...` trên môi trường Production. Do zone của dự án sử dụng gói Cloudflare Free plan (không hỗ trợ tính năng này), mọi request lấy ảnh đã resize đều trả về lỗi 404 từ Cloudflare, làm vỡ hiển thị thumbnail.
- **Fix**: 
  1. Sửa `copyToPublic` trong `src/lib/r2.ts` sử dụng `await stagingObject.arrayBuffer()` để copy tệp an toàn qua buffer.
  2. Sửa `src/pages/admin/index.astro` đổi từ `<style>` sang `<style is:global>` để css áp dụng được cho dynamic HTML. Bổ sung icon SVG, nâng kích thước và cấu hình Grid 3 cột đều cho di động.
  3. Sửa `src/components/OptimizedImage.astro` vô hiệu hóa hoàn toàn cơ chế cdn-cgi (set `srcset` và `sizes` về `undefined`) để tải trực tiếp ảnh gốc qua URL sạch `/photos/[key]`. Do tệp ảnh tải lên đều nhỏ (~100-300KB), việc tải trực tiếp vẫn rất nhanh và an toàn 100%.
- **What didn't work**: Sử dụng luồng stream R2 nguyên bản trên Cloudflare Workers; sử dụng `/cdn-cgi/image/` trên gói Cloudflare Free.
- **References**:
  - `src/lib/r2.ts`
  - `src/pages/admin/index.astro`
  - `src/components/OptimizedImage.astro`
  - Github issue cloudflare/workers-sdk#6425

---

## ISS-021 — Lỗi thư viện nén ảnh làm phình to kích thước tệp tin trên iOS/Safari
**Date**: 2026-06-27
**Severity**: medium
**Status**: resolved

- **Symptom**: Người dùng tải ảnh lên (ví dụ tệp `2.79MB` < 3MB) nhưng bị hệ thống từ chối và báo lỗi: `"Ảnh sau khi nén vẫn lớn hơn 3MB. Vui lòng chọn ảnh nhỏ hơn."`
- **Root cause**: Thư viện `browser-image-compression` khi hoạt động trên iOS/Safari (WebKit engine) thực hiện chuyển đổi ảnh sang định dạng WebP (`fileType: 'image/webp'`) thông qua Canvas API của Safari. Trong một số trường hợp với ảnh JPEG đã được tối ưu tốt từ trước, cơ chế mã hóa WebP của WebKit hoạt động không hiệu quả, dẫn đến kết quả ảnh sau nén bị phình to hơn cả ảnh gốc (vượt quá 3MB).
- **Fix**: Sửa đổi logic trong [upload-anh.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/pages/upload-anh.astro). Thêm bước kiểm tra: Nếu kích thước tệp sau khi nén (`compressedFile.size`) lớn hơn tệp gốc ban đầu (`originalFile.size`), hệ thống sẽ tự động bỏ qua bản nén và sử dụng tệp gốc để upload. Tệp gốc nếu nhỏ hơn 3MB sẽ vượt qua vòng kiểm tra và tải lên thành công.
- **What didn't work**: Ép buộc mọi ảnh nén sang WebP trên Safari mà không có cơ chế fallback.
- **References**:
  - `src/pages/upload-anh.astro`

---

## ISS-022 — Lỗi bịa thông tin địa điểm (quán gà nướng ảo) trong bài viết blog review
**Date**: 2026-06-28
**Severity**: high
**Status**: resolved

- **Symptom**: Bài viết blog review gà nướng chứa các thông tin không có thật về địa danh, vị trí địa lý của các quán ăn tại chân Núi Dinh (bịa ra các quán Bà Tư Béo, Chú Sáu Lùn, Cô Ba Nướng).
- **Root cause**: AI ở các session trước được giao nhiệm vụ viết bài theo tiêu đề *"Top 5 quán gà nướng"*. Do dữ liệu thực tế thực địa chỉ cung cấp thông tin 3 quán gà nướng thực sự, AI đã tự ý bịa ra thêm 3 địa danh giả để lấp đầy số lượng 5 theo yêu cầu của tiêu đề, thay vì dừng lại hỏi ý kiến hoặc điều chỉnh cấu trúc bài viết.
- **Fix**: 
  1. Chuyển đổi bài viết theo Phương án 1 được duyệt bởi anh Bang: Đổi tên bài viết thành *"Review 3 quán gà nướng ngon nhất chân Núi Dinh & các điểm dừng nghỉ tiếp sức"*, đổi slug thành `review-quan-ga-nuong-ngon-nhat-chan-nui-dinh-va-diem-dung-nghi`.
  2. Viết lại nội dung bài viết chỉ tập trung vào 3 quán gà nướng có thật (Cô Hường, Cô Kiều, Tư Vui) và bổ sung 2 điểm dừng nghỉ thực tế (quán Hùng Cường trước cổng Chùa Hang Mai và các trạm tiếp nước dọc đường).
  3. Cập nhật `scripts/queue.tsv` và đổi tên thư mục ảnh tĩnh tương ứng.
  4. Deploy thử nghiệm thành công lên Sandbox.
- **What didn't work**: Giữ nguyên tiêu đề "Top 5" và cố tình bịa đặt các địa điểm dịch vụ không có thật để lấp đầy số lượng bài viết.
- **References**:
  - `src/content/blog/review-quan-ga-nuong-ngon-nhat-chan-nui-dinh-va-diem-dung-nghi.md`
  - `scripts/queue.tsv`
  - Thư mục ảnh `public/images/blog/review-quan-ga-nuong-ngon-nhat-chan-nui-dinh-va-diem-dung-nghi/`

---

## ISS-022 — Lỗi bịa thông tin địa điểm (quán gà nướng ảo) trong bài viết blog review
**Date**: 2026-06-28
**Severity**: high
**Status**: resolved

- **Symptom**: Bài viết blog review gà nướng chứa các thông tin không có thật về địa danh, vị trí địa lý của các quán ăn tại chân Núi Dinh (bịa ra các quán Bà Tư Béo, Chú Sáu Lùn, Cô Ba Nướng).
- **Root cause**: AI ở các session trước được giao nhiệm vụ viết bài theo tiêu đề *"Top 5 quán gà nướng"*. Do dữ liệu thực tế thực địa chỉ cung cấp thông tin 3 quán gà nướng thực sự, AI đã tự ý bịa ra thêm 3 địa danh giả để lấp đầy số lượng 5 theo yêu cầu của tiêu đề, thay vì dừng lại hỏi ý kiến hoặc điều chỉnh cấu trúc bài viết.
- **Fix**: 
  1. Chuyển đổi bài viết theo Phương án 1 được duyệt bởi anh Bang: Đổi tên bài viết thành *"Review 3 quán gà nướng ngon nhất chân Núi Dinh & các điểm dừng nghỉ tiếp sức"*, đổi slug thành `review-quan-ga-nuong-ngon-nhat-chan-nui-dinh-va-diem-dung-nghi`.
  2. Viết lại nội dung bài viết chỉ tập trung vào 3 quán gà nướng có thật (Cô Hường, Cô Kiều, Tư Vui) và bổ sung 2 điểm dừng nghỉ thực tế (quán Hùng Cường trước cổng Chùa Hang Mai và các trạm tiếp nước dọc đường).
  3. Cập nhật `scripts/queue.tsv` và đổi tên thư mục ảnh tĩnh tương ứng.
  4. Deploy thử nghiệm thành công lên Sandbox.
- **What didn't work**: Giữ nguyên tiêu đề "Top 5" và cố tình bịa đặt các địa điểm dịch vụ không có thật để lấp đầy số lượng bài viết.
- **References**:
  - `src/content/blog/review-quan-ga-nuong-ngon-nhat-chan-nui-dinh-va-diem-dung-nghi.md`
  - `scripts/queue.tsv`
  - Thư mục ảnh `public/images/blog/review-quan-ga-nuong-ngon-nhat-chan-nui-dinh-va-diem-dung-nghi/`




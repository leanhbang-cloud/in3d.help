# /start-session

Workflow khởi động session làm việc. Sync git + load context trước khi làm bất cứ thứ gì.

## Trigger

User gõ `/start-session`, `bắt đầu session`, `mở session`, hoặc mở chat mới với project này.

## Steps (tuần tự, KHÔNG hỏi confirm từng bước)

### 1. Sync git state

Chạy `git fetch origin main` (nếu có network).

So sánh local HEAD vs origin/main:

| Trạng thái | Hành động |
|---|---|
| LOCAL == REMOTE | Báo "✅ Up to date với origin/main" |
| LOCAL behind REMOTE | Chạy `git pull origin main`, show `git diff --stat HEAD@{1} HEAD` |
| LOCAL ahead REMOTE | Cảnh báo "⚠️ Có commit chưa push từ session trước". Show `git log origin/main..HEAD --oneline`. Hỏi user có muốn push không |
| DIVERGED (ahead + behind) | STOP. Báo "❌ Diverged — conflict risk". Show cả 2 log. Hỏi user xử lý thủ công trước khi tiếp tục |

Nếu `git fetch` fail (không có network) → vẫn load context, báo "⚠️ Offline mode — chưa sync remote."

### 2. Load context

Đọc theo thứ tự:

1. `AGENT_README.md` (root) — project identity, stack, gotchas
2. `.agents/rules/workspace.md` — hard rules cho session này
3. `.agents/context/CURRENT_FOCUS.md` — state của session trước

### 3. Báo cáo state

Tóm tắt trong 4-6 bullet:

```
Working on: <task từ CURRENT_FOCUS.md>
Progress:   <phase X/Y hoặc milestone>
Next:       <action cụ thể tiếp theo>
Blockers:   <nếu có, hoặc "None">
Last commit: <SHA ngắn + message>
Last updated: <timestamp từ CURRENT_FOCUS.md>
```

### 4. Scan placeholders (chỉ làm lần đầu, khi context/* còn dạng template)

Kiểm tra nhanh các file sau có HTML comment placeholder chưa fill không:
- `AGENT_README.md`
- `.agents/context/MISSION.md`
- `.agents/context/ARCHITECTURE.md`
- `.agents/context/DECISIONS.md`

Nếu có → list ra và hỏi: "Còn placeholder chưa fill. Mày muốn tao bỏ qua hay fill trước khi bắt đầu code?"

### 5. Hỏi user

"Tiếp tục task cũ hay có task mới hôm nay?"

Chờ user xác nhận trước khi làm bất cứ gì.

---

## Quy tắc

- KHÔNG tự động chạy build/dev server.
- KHÔNG tự sửa file nào.
- KHÔNG bịa state — đọc file thật, không đoán.
- Nếu `CURRENT_FOCUS.md` trống hoặc chưa có → báo "Chưa có CURRENT_FOCUS.md. Đây có thể là session đầu tiên." rồi hỏi user muốn làm gì.

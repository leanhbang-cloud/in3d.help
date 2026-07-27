# /end-session

Workflow đóng session. Đảm bảo CURRENT_FOCUS.md được cập nhật và push lên remote trước khi tắt máy.

## Trigger

User gõ `/end-session`, hoặc nói "tao đi ngủ", "mai làm tiếp", "tắt máy đây", "off đây", "kết session", "đóng session".

## Steps (tuần tự)

### 1. Snapshot state hiện tại

- Chạy `git status --short` → ghi nhận file chưa commit
- Chạy `git log --oneline -5` → 5 commit gần nhất trong session
- Đọc `.agents/context/CURRENT_FOCUS.md` hiện tại (để so sánh khi update)

### 2. Soạn version mới của CURRENT_FOCUS.md

Dùng thông tin từ chat session hiện tại + git log. Nội dung gồm:

```
Working on: <task hiện tại>
Progress:   <phase X/Y done, hoặc milestone đã đạt>
Next:       <action cụ thể tiếp theo khi resume>
Blockers:   <nếu có, hoặc "None">
Last commit: <SHA ngắn + message>
Updated:    <YYYY-MM-DD HH:MM>
Machine:    <home / cty — hỏi user nếu chưa rõ>
```

### 3. Show diff cho user review

Hiển thị diff giữa CURRENT_FOCUS.md cũ và bản mới.
Chờ user OK hoặc yêu cầu sửa. KHÔNG ghi file trước khi user xác nhận.

### 4. Xử lý file chưa commit

Kiểm tra `git status`:

- **Chỉ có CURRENT_FOCUS.md** → proceed tự động sang bước 5.
- **Có file khác chưa commit** → LIỆT KÊ rõ từng file, HỎI:

  > "Còn file chưa commit. Mày muốn:
  > (a) Commit hết với message tao đề xuất
  > (b) Commit riêng từng nhóm (tao guide từng cái)
  > (c) Stash / bỏ qua"

  KHÔNG tự commit hộ file ngoài CURRENT_FOCUS.md.

### 5. Commit CURRENT_FOCUS.md + push

```bash
git add .agents/context/CURRENT_FOCUS.md
git commit -m "focus: end session <YYYY-MM-DD>"
git push origin main
```

Verify: `git log origin/main..HEAD --oneline` phải trả về empty (nghĩa là local == remote).

### 6. Final report

```
✅ Session closed.

Commits trong session này: <N>
Files changed: <list>
Latest commit: <SHA ngắn> — <message>

Lần sau: git pull origin main rồi /start-session để tiếp tục.
```

---

## Quy tắc

- KHÔNG force push.
- KHÔNG commit file ngoài CURRENT_FOCUS.md nếu không có xác nhận rõ ràng từ user.
- KHÔNG xóa file nào.
- KHÔNG tự đoán "Working on" hay "Next" — phải dựa vào chat history thực tế + CURRENT_FOCUS.md cũ.
- Nếu push fail (no network / conflict) → báo lỗi cụ thể, đề xuất user tự push sau khi có network.

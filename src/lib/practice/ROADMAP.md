# Kế hoạch bổ sung luyện ngữ pháp / chính tả tiếng Anh

Mô hình: menu `/pratice` → chọn chủ đề → random từ + pool + giải thích quy tắc.

## Đã ship

- [x] Động từ ngôi 3 số ít (`-s` / `-es`) — `/pratice/s-es`
- [x] Quá khứ / phân từ (`-ed` + bất quy tắc V2/V3) — `/pratice/ed`
- [x] Động từ `-ing` — `/pratice/ing`
- [x] Danh từ số nhiều — `/pratice/plurals`
- [x] Tính từ → trạng từ (`-ly`) — `/pratice/ly`
- [x] So sánh tính từ — `/pratice/compare`
- [x] So sánh trạng từ — `/pratice/adv-compare`
- [x] Tiền tố phủ định — `/pratice/neg-prefix`
- [x] Hậu tố → danh từ — `/pratice/noun-suffix`
- [x] Hậu tố → tính từ — `/pratice/adj-suffix`

---

## Phase C — Ngữ pháp cấu trúc (tiếp theo)

Vẫn giữ UX drill, nhưng câu trả lời có thể là cụm / chọn đúng dạng trong ngữ cảnh.

### C1. Present continuous vs Present simple
### C2. Past simple vs Present perfect
### C3. Bị động (be + V3) — tận dụng dataset V3 đã có
### C4. Câu điều kiện loại 1 / 2

---

## Nguyên tắc kỹ thuật

1. Dataset + rules (hoặc curated list) + route `/pratice/...` + entry `topics.ts`
2. Dùng `WordDrill` khi chỉ cần một đáp án / toggle mode đơn giản
3. Pool tạm, Reset, Enter check/next, không phân biệt hoa/thường
4. Giải thích tiếng Việt; tách regular / irregular
5. Không phụ thuộc API

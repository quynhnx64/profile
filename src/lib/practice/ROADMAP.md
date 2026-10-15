# Kế hoạch bổ sung luyện ngữ pháp / chính tả tiếng Anh

Mô hình hiện tại (đã có): menu `/pratice` → chọn chủ đề → random từ + pool + giải thích quy tắc.

Đã ship:
- [x] Động từ ngôi 3 số ít (`-s` / `-es`)
- [x] Quá khứ / phân từ (`-ed` + bất quy tắc V2/V3)
- [x] Tính từ → trạng từ (`-ly` + bất quy tắc)
- [x] So sánh hơn / nhất (`-er`/`-est` · `more`/`most` + bất quy tắc)

---

## Phase A — Cùng kiểu “thêm hậu tố / biến dạng” (ưu tiên cao)

Các chủ đề gần nhất với những gì đã làm: input một dạng gốc → viết dạng đích → giải thích quy tắc.

### A1. Danh từ số nhiều (`-s` / `-es` / `-ies` / `-ves`)
- Route đề xuất: `/pratice/plurals`
- Quy tắc: `+s`; `-s/-x/-z/-ch/-sh → -es`; phụ âm+`y` → `-ies`; một số `-f/-fe` → `-ves`; `-o` → `-s` hoặc `-es`
- Bất quy tắc: `child→children`, `man→men`, `mouse→mice`, `sheep→sheep`, `fish→fish`…
- Độ khó: thấp · tận dụng logic gần giống `-s/-es` động từ

### A2. Động từ `-ing` (V-ing)
- Route: `/pratice/ing`
- Quy tắc: `+ing`; bỏ `-e` + `ing` (`make→making`); CVC gấp đôi phụ âm (`run→running`); `-ie` → `-ying` (`lie→lying`)
- Ngoại lệ: `age→ageing/aging`, không gấp đôi `w/x/y`
- Độ khó: thấp–trung · liên quan mạnh với `-ed`

### A3. So sánh trạng từ
- Route: `/pratice/adv-compare`
- Quy tắc: trạng từ ngắn `faster/fastest`; trạng từ `-ly` dùng `more/most carefully`; bất quy tắc `well→better/best`, `badly→worse/worst`
- Độ khó: trung · mở rộng từ so sánh tính từ + `-ly`

---

## Phase B — Đổi loại từ (word formation)

### B1. Danh từ từ tính từ / động từ (hậu tố thường gặp)
- Route: `/pratice/noun-suffix`
- Ví dụ: `-ness` (happy→happiness), `-tion/-sion` (create→creation), `-ment` (develop→development), `-er/-or` (teach→teacher)
- Lưu ý: nhiều bất quy tắc / phải nhớ — nên chia nhỏ theo từng hậu tố

### B2. Tính từ từ danh từ / động từ
- Route: `/pratice/adj-suffix`
- Ví dụ: `-ful` (care→careful), `-less` (hope→hopeless), `-able/-ible`, `-ous`, `-al`, `-ive`

### B3. Tiền tố phủ định
- Route: `/pratice/negative-prefix`
- `un-`, `in-` / `im-` / `il-` / `ir-`, `dis-`, `non-`
- Quy tắc chọn `im/il/ir` theo chữ cái đầu (possible→impossible, legal→illegal, regular→irregular)

---

## Phase C — Ngữ pháp cấu trúc (không chỉ chính tả)

Vẫn giữ UX drill, nhưng câu trả lời có thể là cụm / chọn đúng dạng trong ngữ cảnh.

### C1. Present continuous vs Present simple (chọn dạng đúng)
### C2. Past simple vs Present perfect
### C3. Bị động (be + V3) — tận dụng dataset V3 đã có
### C4. Câu điều kiện loại 1 / 2 (điền động từ)

---

## Thứ tự đề xuất triển khai

| # | Chủ đề | Lý do ưu tiên |
|---|--------|----------------|
| 1 | Plurals | Cùng pattern `-s/-es`, ship nhanh |
| 2 | `-ing` | Cùng CVC / bỏ `e` như `-ed` |
| 3 | So sánh trạng từ | Tái sử dụng compare + ly |
| 4 | Negative prefixes | Ít biến thể, giải thích rõ |
| 5 | Noun / adj suffixes | Chia nhỏ theo hậu tố |
| 6 | Passive động / thì | Sau khi nền chính tả ổn |

---

## Nguyên tắc kỹ thuật (giữ đồng nhất)

1. Mỗi chủ đề: `*-rules.ts` + dataset + route `/pratice/...` + entry trong `topics.ts`
2. Pool tạm trong phiên, Reset, Enter check/next, so sánh không phân biệt hoa/thường
3. Giải thích tiếng Việt ngắn + ví dụ; tách `regular` / `irregular`
4. Không phụ thuộc API — dữ liệu nhúng sẵn
5. Menu chỉ hiện topic `available: true`; topic sắp làm có thể thêm sẵn `available: false`

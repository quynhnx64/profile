# Nâng cấp portfolio: Home, Công nghệ, cuộn theo phần, trang /edit

## 1. Thanh điều hướng
- Thêm mục "Trang chủ" (về đầu trang), đánh dấu mục đang xem khi cuộn.

## 2. Phần mới "Công nghệ & Công cụ"
- Hiển thị đầy đủ theo nhóm: Frontend, Backend, Database, DevOps/Hạ tầng, Bảo mật, Công cụ.
- Mỗi mục có tên + mức độ/ghi chú ngắn, lấy từ CV.

## 3. Rà soát câu chữ và trình bày
- Viết lại tiêu đề, mô tả ngắn gọn, thống nhất giọng văn, sửa lỗi chính tả, căn chỉnh khoảng cách giữa các phần.

## 4. Cuộn theo từng phần (full màn hình)
- Mỗi phần chiếm trọn một màn hình, cuộn chuột sẽ "bắt dính" sang phần kế tiếp.
- Nếu nội dung một phần dài hơn màn hình (máy nhỏ), cho phép cuộn bên trong phần đó trước khi chuyển phần.
- Trên điện thoại rất nhỏ: tự chuyển về cuộn thường để tránh khó dùng.

## 5. Trang /edit có mật khẩu
- Bật Lovable Cloud để lưu nội dung trang.
- Toàn bộ nội dung (hero, chỉ số, năng lực, dự án, quy trình, kinh nghiệm, công nghệ, liên hệ) lưu dạng JSON trong cơ sở dữ liệu; trang chủ đọc từ đó thay vì viết cứng.
- /edit: đăng nhập bằng tài khoản quản trị (email + mật khẩu), chỉ tài khoản có quyền admin được sửa.
- Giao diện sửa: các tab theo phần, form thêm/xóa/sửa/sắp xếp từng mục (vd. thêm dự án mới), cùng chế độ sửa JSON thô cho người thành thạo. Nút Lưu cập nhật ngay trên trang công khai.
- Dữ liệu hiện tại được đưa vào làm nội dung mặc định ban đầu.

## Kỹ thuật
- Bảng `site_content` (một dòng, cột `data jsonb`), đọc công khai, chỉ admin được ghi (bảng `user_roles` + hàm `has_role`).
- Trang chủ tải nội dung qua loader + TanStack Query; dữ liệu mặc định dùng khi chưa có bản ghi.
- Route `/edit` dùng xác thực, server function có middleware kiểm tra admin khi lưu.
- Scroll-snap CSS `y proximity` trên container; mỗi section `min-h-svh` với vùng nội dung `overflow-y-auto` khi vượt chiều cao.
- Tài khoản admin đầu tiên: bạn đăng ký tại /edit, sau đó tôi cấp quyền admin cho email đó.

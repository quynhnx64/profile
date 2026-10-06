# Căn chỉnh điều hướng và tăng chuyển động cho portfolio

## Thay đổi
- Đồng bộ menu với đúng các màn hình: Trang chủ, Năng lực, Dự án, Công nghệ, Kinh nghiệm & Liên hệ.
- Gộp nội dung Kinh nghiệm và Liên hệ vào cùng một màn hình; bỏ điểm cuộn và mục menu Liên hệ riêng.
- Căn lại chiều cao, khoảng cách neo và trạng thái menu đang xem để không còn lệch khi cuộn toàn màn hình.
- Rút gọn các tiêu đề theo giọng chuyên nghiệp, trực diện; riêng phần Công nghệ đổi thành tiêu đề ngắn gọn hơn.
- Làm danh sách công nghệ chuyển động kiểu marquee chậm, dừng khi rê chuột; thêm hiệu ứng xuất hiện tuần tự và tương tác nhẹ cho năng lực, dự án, quy trình.
- Tôn trọng chế độ giảm chuyển động và giữ cuộn thường trên màn hình nhỏ.

## Kỹ thuật
- Chỉ chỉnh giao diện trang công khai và nội dung mặc định; dữ liệu vẫn lấy từ JSON hiện có và tiếp tục sửa được tại `/edit`.
- Dùng CSS animation nhẹ, không thêm thư viện và không thay đổi dữ liệu hay quyền quản trị.
- Kiểm tra menu, cuộn từng màn hình, phần gộp và khả năng đọc trên máy tính lẫn điện thoại.

# NovaWave Commerce

NovaWave là trải nghiệm thương mại điện tử kết hợp giao diện neon tương lai với backend Python sử dụng FastAPI và cơ sở dữ liệu SQLite. Dự án minh họa cách kết nối liền mạch giữa frontend tĩnh và API backend cho các luồng đăng ký/đăng nhập, quản lý sản phẩm, giỏ hàng và thanh toán.

## Kiến trúc

- **Frontend**: HTML/CSS/JavaScript thuần, cung cấp trải nghiệm thị giác động và tương tác.
- **Backend**: FastAPI chạy bằng Python, lưu trữ dữ liệu trong SQLite (`backend/novawave.db`).
- **API chính**:
  - `POST /api/auth/register` & `POST /api/auth/login`: xác thực người dùng, trả về token phiên.
  - `GET/POST/PUT/DELETE /api/products`: quản trị viên quản lý danh mục sản phẩm.
  - `POST /api/orders`: tạo đơn hàng với nhiều phương thức thanh toán.
  - `GET /api/orders`: lịch sử đơn hàng theo người dùng hoặc toàn hệ thống (admin).
  - `GET /api/settings` và `PUT /api/settings/*`: lưu cấu hình giao diện & thanh toán trong cơ sở dữ liệu.

## Cài đặt & chạy dự án

1. **Tạo virtualenv và cài đặt backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows dùng .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Chạy API FastAPI**
   ```bash
   uvicorn backend.app:app --reload
   ```
   API sẽ lắng nghe tại `http://localhost:8000`.

3. **Phục vụ frontend**
   Trong một terminal khác tại thư mục gốc dự án:
   ```bash
   python -m http.server 5500
   ```
   Truy cập `http://localhost:5500/index.html` trong trình duyệt. Ứng dụng sẽ tự động kết nối tới API tại `http://localhost:8000/api`.

## Tài khoản mặc định

- **Quản trị viên**: `admin@novawave.vn` / `admin123`
  - Có thể chỉnh sửa sản phẩm, thay đổi cài đặt giao diện và quản lý thông điệp thanh toán.

## Tùy chỉnh

- Để đổi khóa đăng ký admin, cập nhật hằng số `ADMIN_ENROLL_KEY` trong `backend/app.py`.
- Dữ liệu mẫu sản phẩm được khởi tạo trong hàm `seed_products` và có thể chỉnh sửa để phù hợp nhu cầu.

## Kiểm thử nhanh

- Đăng ký người dùng mới, đăng nhập và thêm sản phẩm vào giỏ hàng.
- Dùng tài khoản admin để tạo/ cập nhật sản phẩm, bật/tắt các hiệu ứng hiển thị và thay đổi thông điệp thanh toán.
- Hoàn tất thanh toán để xem đơn hàng được lưu vào lịch sử và bảng điều khiển.

## Giấy phép

Dự án dùng cho mục đích minh họa. Tùy ý mở rộng và tái sử dụng.

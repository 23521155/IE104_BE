# README

## Tên dự án
**Andifi — Website bán hàng thời trang**

## Mô tả ngắn
Andifi là backend cho một website bán hàng thời trang, được xây dựng bằng Node.js và Express.js. Hệ thống quản lý sản phẩm, người dùng, giỏ hàng và đơn hàng, hỗ trợ REST API cho frontend HTML/CSS/JS hoặc bất kỳ client nào.

## Tính năng chính
- Quản lý người dùng: đăng ký, đăng nhập, phân quyền.
- Quản lý sản phẩm: tạo, đọc, cập nhật, xóa (CRUD).
- Quản lý giỏ hàng và đơn hàng.
- Tích hợp xác thực JWT và bảo mật cơ bản.
- CORS enabled để kết nối frontend.

## Công nghệ sử dụng
- Node.js
- Express.js
- MongoDB
- bcrypt (hash password)
- jsonwebtoken (JWT auth)
- dotenv (quản lý biến môi trường)

## Cấu trúc thư mục

IE104_BE/
├─ server.js
├─ package.json
├─ .env
├─ config/
│ ├─ cors.js
│ ├─ environment.js
│ └─ mongodb.js
├─ routes/
│ └─ v1/
│ ├─ cartRoute.js
│ ├─ imageRoute.js
│ ├─ orderRoute.js
│ ├─ productRoute.js
│ ├─ productTypeRoute.js
│ ├─ userRoute.js
│ ├─ wishListRoute.js
│ └─ index.js
├─ controllers/
│ ├─ cartController.js
│ ├─ imageController.js
│ ├─ orderController.js
│ ├─ productController.js
│ ├─ productTypeController.js
│ ├─ userController.js
│ └─ wishListController.js
├─ services/
│ ├─ cartService.js
│ ├─ imageService.js
│ ├─ orderService.js
│ ├─ productService.js
│ ├─ productTypeService.js
│ ├─ userService.js
│ └─ wishListService.js
├─ models/
│ ├─ cartModel.js
│ ├─ imageModel.js
│ ├─ orderModel.js
│ ├─ productModel.js
│ ├─ productTypeModel.js
│ ├─ userModel.js
│ └─ wishListModel.js
├─ middleware/
│ ├─ authMiddleware.js
│ ├─ multerUploadMiddleware.js
│ └─ errorHandlingMiddleware.js
├─ providers/
└─ utils/
└─ helpers.js

## Cài đặt & chạy project
1. Clone repo về máy:
```bash
git clone <url-repo>

Cài đặt dependencies:

npm install

Tạo file .env với nội dung ví dụ:

env chúng tôi sẽ không công bố

Chạy server:

npm run dev       # dùng nodemon

Server chạy tại http://localhost:1234 (hoặc PORT bạn setup)


Lưu ý

Backend chưa có payment gateway thật, chỉ quản lý dữ liệu đơn hàng.

Đảm bảo bảo mật JWT và hashing password khi triển khai production.

Cải tiến & mở rộng

Kết nối với frontend thực tế, sử dụng fetch/Axios.

License

MIT License.

Liên hệ

Nếu cần demo kết nối backend với frontend hoặc setup database mẫu, mình có thể hướng dẫn chi tiết.



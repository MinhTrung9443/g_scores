# G-Scores

G-Scores là một ứng dụng web full-stack được thiết kế để quản lý và phân tích điểm thi Tốt nghiệp THPT Quốc gia năm 2024. Ứng dụng sở hữu luồng xử lý (pipeline) nhập dữ liệu CSV mạnh mẽ, tính năng tra cứu điểm thi và các bảng điều khiển (dashboard) phân tích trực quan.

## 1. Tổng quan dự án
Dự án này được xây dựng nhằm thể hiện các kỹ năng lập trình Fullstack JavaScript. Hệ thống có khả năng đọc mượt mà file CSV dung lượng 42MB chứa hơn 1 triệu bản ghi điểm của học sinh, seed dữ liệu siêu tốc vào cơ sở dữ liệu MySQL/TiDB sử dụng Sequelize ORM, và cung cấp dữ liệu phân tích qua Express.js API đến giao diện frontend viết bằng React.

## 2. Tính năng nổi bật
- **Luồng dữ liệu CSV:** Trình phân tích cú pháp dạng stream giúp xử lý hiệu quả giới hạn bộ nhớ, tự động chèn dữ liệu vào MySQL theo từng lô (batch) lớn để tối ưu hóa hiệu suất bộ nhớ (RAM).
- **Tra cứu điểm thi:** Tìm kiếm nhanh điểm thi của học sinh thông qua số báo danh (8 chữ số).
- **Báo cáo điểm số (Dashboard):** Các chỉ số tổng hợp phân loại điểm thi của học sinh thành 4 mức độ khác nhau trên cả 9 môn học, được trực quan hóa bằng biểu đồ cột nhóm (grouped bar charts).
- **Top 10 Khối A:** Bảng xếp hạng thời gian thực của 10 học sinh có tổng điểm 3 môn Toán, Vật lý, và Hóa học cao nhất.

## 3. Công nghệ sử dụng
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Axios, React Router.
- **Backend:** Node.js, Express.js, Sequelize ORM.
- **Cơ sở dữ liệu:** MySQL / MariaDB (hoặc TiDB Serverless Cloud).

## 4. Kiến trúc hệ thống
Ứng dụng sử dụng kiến trúc phân tách rõ ràng:
- **Frontend:** Xây dựng với Vite giúp phát triển nhanh chóng. Sử dụng React Hooks để quản lý trạng thái và Tailwind CSS cho thiết kế UI/UX hiện đại, responsive.
- **Backend:** Tổ chức theo kiến trúc Controller-Service-Repository Pattern. Các logic nghiệp vụ (như đọc CSV, lấy báo cáo) được tách biệt vào các Services riêng rẽ. 

## 5. Thiết kế Cơ sở dữ liệu
Chúng tôi sử dụng cơ sở dữ liệu quan hệ MySQL. Cấu trúc logic bao gồm:
- Bảng `subjects`: Định nghĩa các môn học.
- Bảng `students`: Lưu trữ danh sách thí sinh (số báo danh là duy nhất).
- Bảng `scores`: Bảng trung gian lưu điểm từng môn của từng thí sinh, liên kết khóa ngoại với `students` và `subjects`.
- Bảng `report_group_a`: Lưu trữ sẵn điểm khối A đã được tính toán trong quá trình seed CSV để cho phép truy xuất Bảng xếp hạng Top 10 siêu tốc độ mà không cần tính toán lại trên 1 triệu bản ghi mỗi khi có request.

## 6. Tài liệu API
- `GET /api/students/:registrationNumber`: Trả về điểm thi của một học sinh. Trả về 404 nếu không tìm thấy, 400 nếu sai định dạng.
- `GET /api/reports/score-levels`: Trả về dữ liệu phân loại mức điểm tổng hợp cho cả 9 môn học. (Kết quả được Cache lại 15 phút).
- `GET /api/reports/top-group-a`: Trả về mảng 10 học sinh có điểm Khối A cao nhất.
- `POST /api/seed`: API bí mật để kích hoạt quá trình đọc file CSV và đẩy vào CSDL tự động.

## 7. Cài đặt môi trường Local
1. Đảm bảo bạn đã cài đặt Node.js và một hệ quản trị CSDL MySQL (hoặc lấy thông tin của TiDB Cloud).
2. Clone repository này và di chuyển vào thư mục gốc của dự án.
3. Khởi động Backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
4. Khởi động Frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 8. Biến môi trường
Tạo file `.env` trong thư mục `backend`:
```env
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_NAME=test
DB_USER=root
DB_PASSWORD=your_password
PORT=3000
CORS_ORIGIN=http://localhost:5173
```
Tạo file `.env` trong thư mục `frontend` (tuỳ chọn nếu khác đường dẫn mặc định):
```env
VITE_API_URL="http://localhost:3000/api"
```

## 9. Hướng dẫn Import dữ liệu CSV
Đảm bảo bạn đã có file `diem_thi_thpt_2024.csv` trong thư mục `data` của dự án.
Từ thư mục `backend`, chạy lệnh sau để tự động phân tích và nạp 1 triệu bản ghi vào DB:
```bash
npm run seed
```
*(Bạn cũng có thể dùng Postman gọi vào `POST http://localhost:3000/api/seed`)*

## 10. Hướng dẫn sử dụng Docker
Dự án có đi kèm một file `Dockerfile` chuẩn hóa, chuyên dùng để build backend Node.js.
```bash
docker build -t gscores-backend .
docker run -p 3000:3000 gscores-backend
```

## 11. Triển khai (Deployment)
- **Frontend:** Có thể deploy lên Vercel hoặc Netlify.
- **Backend:** Có thể deploy lên Render dưới dạng Web Service bằng Docker.
- **Cơ sở dữ liệu:** Khuyên dùng TiDB Serverless (Cloud) hoặc Aiven MySQL do Render sử dụng ổ cứng tạm thời (Ephemeral Storage) làm mất dữ liệu nội bộ mỗi lần restart.

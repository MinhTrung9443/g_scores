# G-Scores

G-Scores là một ứng dụng web full-stack được thiết kế để quản lý và phân tích điểm thi Tốt nghiệp THPT Quốc gia năm 2024. Ứng dụng sở hữu luồng xử lý (pipeline) nhập dữ liệu CSV mạnh mẽ, tính năng tra cứu điểm thi và các bảng điều khiển (dashboard) phân tích trực quan.

## 1. Tổng quan dự án
Dự án này được xây dựng nhằm thể hiện các kỹ năng lập trình Fullstack JavaScript. Hệ thống có khả năng đọc mượt mà file CSV dung lượng 42MB chứa hơn 1 triệu bản ghi điểm của học sinh, seed dữ liệu hiệu quả vào cơ sở dữ liệu MongoDB sử dụng Prisma, và cung cấp dữ liệu phân tích qua NestJS API đến giao diện frontend viết bằng React.

## 2. Tính năng nổi bật
- **Luồng dữ liệu CSV:** Trình phân tích cú pháp dạng stream giúp xử lý hiệu quả giới hạn bộ nhớ, dữ liệu bị thiếu, tự động tạo ID và chèn dữ liệu vào MongoDB theo từng lô (batch).
- **Tra cứu điểm thi:** Tìm kiếm nhanh điểm thi của học sinh thông qua số báo danh (8 chữ số).
- **Báo cáo điểm số (Dashboard):** Các chỉ số tổng hợp phân loại điểm thi của học sinh thành 4 mức độ khác nhau trên cả 9 môn học, được trực quan hóa bằng biểu đồ cột nhóm (grouped bar charts).
- **Top 10 Khối A:** Bảng xếp hạng thời gian thực của 10 học sinh có tổng điểm 3 môn Toán, Vật lý, và Hóa học cao nhất.

## 3. Công nghệ sử dụng
- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Recharts, Axios, React Router.
- **Backend:** Node.js, NestJS, TypeScript, class-validator.
- **Cơ sở dữ liệu:** MongoDB, Prisma ORM.

## 4. Kiến trúc hệ thống
Ứng dụng sử dụng kiến trúc phân tách rõ ràng:
- **Frontend:** Xây dựng với Vite giúp phát triển nhanh chóng. Sử dụng React Hooks để quản lý trạng thái và Tailwind CSS cho thiết kế UI/UX hiện đại, responsive.
- **Backend:** Tuân theo kiến trúc module của NestJS. Bao gồm `PrismaModule` để truy cập DB, `StudentModule` cho logic tra cứu, và `ReportModule` cho phần phân tích.
- **Domain Môn học (OOP):** Chứa `SubjectRegistry` và các class trừu tượng `Subject` (ví dụ: `MathSubject`) đóng gói các quy tắc nghiệp vụ như kiểm tra tính hợp lệ của điểm và phân loại mức điểm.

## 5. Thiết kế Cơ sở dữ liệu
Chúng tôi sử dụng Prisma với MongoDB. Cấu trúc logic là `Student (1) -> (1) Score`.
- `Student`: Lưu trữ `registrationNumber` (Duy nhất) và `foreignLanguageCode`.
- `Score`: Lưu trữ điểm các môn. Các điểm bị thiếu được lưu là `null`. Bảng này cũng chứa một trường `groupATotal` (Toán + Vật lý + Hóa học) được tính toán sẵn, chỉ lưu giá trị nếu học sinh có đủ cả 3 đầu điểm.
- **Tối ưu Hiệu suất:** Các pipeline aggregation để phân loại mức điểm sẽ quét qua collection `Score`. Trường `groupATotal` được tính toán sẵn trong quá trình seed CSV để cho phép truy xuất `Top 10` siêu tốc độ O(log N) thông qua index (`@@index([groupATotal(sort: Desc), studentId])`), tránh việc phải tính tổng on-the-fly (ngay lúc truy vấn) cho 1 triệu bản ghi.

## 6. Tài liệu API
- `GET /api/students/:registrationNumber`: Trả về điểm thi của một học sinh. Trả về 404 nếu không tìm thấy, 400 nếu sai định dạng.
- `GET /api/reports/score-levels`: Trả về dữ liệu phân loại mức điểm tổng hợp cho cả 9 môn học.
- `GET /api/reports/top-group-a`: Trả về mảng 10 học sinh có điểm Khối A cao nhất.

## 7. Cài đặt môi trường Local
1. Đảm bảo bạn đã cài đặt Node.js và MongoDB.
2. Clone repository này và di chuyển vào thư mục gốc của dự án.
3. Khởi động Backend:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
4. Khởi động Frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 8. Biến môi trường
Tạo file `.env` trong thư mục `backend` (xem file `.env.example`):
```env
MONGODB_URI="mongodb://localhost:27017/g-scores"
PORT=3000
```
Tạo file `.env` trong thư mục `frontend`:
```env
VITE_API_URL="http://localhost:3000/api"
```

## 9. Hướng dẫn Import dữ liệu CSV
Đảm bảo bạn đã có file `diem_thi_thpt_2024.csv` trong thư mục `data` của dự án (`/d/PV/Demo/data/`).
Từ thư mục `backend`, chạy lệnh:
```bash
npm run prisma db seed
```
**Quyết định Kỹ thuật:** Script sử dụng Node.js Streams và `csv-parser` để parse các dòng một cách tuần tự mà không cần tải toàn bộ file 42MB vào bộ nhớ. Hệ thống sẽ gom các dòng thành mảng 10,000 phần tử và sử dụng hàm `createMany` của Prisma để chèn dữ liệu hàng loạt.

## 10. Hướng dẫn sử dụng Docker
Bạn có thể khởi động toàn bộ stack bằng Docker Compose:
```bash
docker-compose up --build
```
Lệnh này sẽ khởi chạy:
- MongoDB trên port 27017
- Backend API trên port 3000
- Frontend Web App trên port 8080 (http://localhost:8080)

## 11. Triển khai (Deployment)
- **Frontend:** Có thể deploy lên Vercel hoặc Netlify bằng cách liên kết repository và cấu hình thư mục gốc (root directory) là `frontend`, ghi đè lệnh build thành `npm run build`. Đặt `VITE_API_URL` trỏ tới URL của backend production.
- **Backend:** Có thể deploy lên Render dưới dạng Web Service. Đặt thư mục gốc là `backend`, lệnh khởi động là `npm run start:prod`.
- **Cơ sở dữ liệu:** Host MongoDB trên MongoDB Atlas và cung cấp chuỗi kết nối (connection string) vào biến `MONGODB_URI` cho backend.

## 12. Testing
Các logic nghiệp vụ quan trọng đã được viết test bằng Jest.
Chạy test cho backend:
```bash
cd backend
npm run test
```
Các bài test chủ yếu tập trung vào phần Domain OOP `Subject` (logic phân loại điểm số).

## 13. Ảnh chụp màn hình (Screenshots)
*(Chỗ trống dành cho ảnh chụp màn hình UI. Giao diện bao gồm các biểu đồ cột nhóm động và phong cách thiết kế glass/minimalist hiện đại).*

## 14. Hạn chế đã biết / Giả định
- **Giả định:** Định dạng dữ liệu CSV là cố định và hợp lệ. Các dòng không có số báo danh sẽ bị bỏ qua. Các điểm số trống được xử lý là `null`.
- **Hạn chế:** Raw aggregation của MongoDB được sử dụng trong `/api/reports/score-levels` đã được tối ưu hóa cao bằng `$cond` và `$sum`, nhưng việc chạy động trên 1,000,000 document sẽ mất khoảng 0.5 - 1.5 giây ở local. Đối với ứng dụng production có lưu lượng truy cập cao, kết quả này nên được cache lại bằng Redis.

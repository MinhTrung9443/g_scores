# G-Scores

## Live Demo

- Frontend (Vercel): https://g-scores-virid.vercel.app/

## How to Run Locally

### Prerequisites

- Node.js (v18+) & npm
- MySQL running locally or a TiDB Serverless account (create a database named `test`)

### Environment Variables

Copy the example environment files and update the values:

**Backend:**

```bash
cp backend/.env.example backend/.env
```

*(Configure the `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` inside `backend/.env`)*

**Frontend:**

```bash
cp frontend/.env.example frontend/.env
```

*(Configure the `VITE_API_URL` inside `frontend/.env` if pointing to a non-default API)*

## How to Run

**Run Backend:**

```bash
cd backend
npm install
npm start
npm run seed
```

**Run Frontend:**

```bash
cd ../frontend
npm install
npm run dev
```

## How to Run with Docker

Build and run the Backend API container:

```bash
docker build -t gscores-backend .
docker run -p 3000:3000 --env-file backend/.env gscores-backend
```

Open your browser:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## Technical Details

### Architecture

Ứng dụng sử dụng kiến trúc phân tách rõ ràng:

- **Frontend:** Xây dựng với Vite giúp phát triển nhanh chóng. Sử dụng React Hooks để quản lý trạng thái và Tailwind CSS cho thiết kế UI/UX hiện đại, responsive.
- **Backend:** Tổ chức theo kiến trúc Controller-Service-Repository Pattern. Các logic nghiệp vụ (như đọc CSV, lấy báo cáo) được tách biệt vào các Services riêng rẽ sử dụng **Express.js**.

### Database Design

Sử dụng cơ sở dữ liệu quan hệ MySQL/TiDB thông qua **Sequelize ORM**. Cấu trúc logic bao gồm:

- Bảng `subjects`: Định nghĩa các môn học.
- Bảng `students`: Lưu trữ danh sách thí sinh (số báo danh là duy nhất).
- Bảng `scores`: Bảng trung gian lưu điểm từng môn của từng thí sinh.
- Bảng `report_group_a`: Bảng chứa kết quả đã được tính toán sẵn cho khối A từ lúc nạp CSV để tối ưu truy xuất Bảng xếp hạng Top 10 với tốc độ O(log N) mà không cần tính toán on-the-fly.

### API Documentation

- `GET /api/students/:registrationNumber`: Trả về điểm thi của một học sinh. Trả về 404 nếu không tìm thấy.
- `GET /api/reports/score-levels`: Trả về dữ liệu phân loại mức điểm tổng hợp cho cả 9 môn học (Dữ liệu được Cache 15 phút để tăng tốc Server).
- `GET /api/reports/top-group-a`: Trả về mảng 10 học sinh có điểm Khối A cao nhất.
- `POST /api/seed`: API kích hoạt quá trình đọc file CSV và đẩy vào CSDL tự động.

### Deployment Details

- **Frontend:** Deploy lên Vercel.
- **Backend:** Triển khai trên Render dưới dạng Web Service thông qua Docker.
- **Cơ sở dữ liệu:** Hệ thống sử dụng Database đám mây độc lập (như TiDB Serverless Cloud).

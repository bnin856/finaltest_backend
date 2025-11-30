# Teacher Management Backend

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` từ `.env.example` và cập nhật thông tin kết nối MongoDB:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teacher_management
```

## Chạy server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Teachers
- `GET /api/teachers?page=1&limit=10` - Lấy danh sách giáo viên với phân trang
- `POST /api/teachers` - Tạo mới giáo viên

### Teacher Positions
- `GET /api/teacher-positions` - Lấy danh sách vị trí công tác
- `POST /api/teacher-positions` - Tạo mới vị trí công tác


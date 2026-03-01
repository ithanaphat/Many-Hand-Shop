# 🛍️ Many Hand Shop

ระบบตลาดออนไลน์ (Marketplace) สำหรับซื้อ-ขายสินค้ามือสอง  
สร้างด้วย **React** (Frontend) + **Node.js/Express** (Backend) + **MongoDB Atlas** (Database)

---

## 📁 โครงสร้างโปรเจกต์

```
Many-Hand-Shop/
├── server.js              # Entry point ของ Backend
├── .env                   # Environment variables (MongoDB URL, PORT)
├── package.json
│
├── config/
│   └── db.js              # เชื่อมต่อ MongoDB
│
├── models/
│   └── user.js            # Mongoose schemas (User, Product, Category)
│
├── routes/
│   ├── index.js           # รวม routes ทั้งหมด
│   ├── login.js           # POST /login
│   ├── register.js        # POST /register
│   └── product.js         # CRUD /api/product
│
└── frontend/              # React App (Create React App)
    └── src/
        ├── App.js          # Router หลัก
        ├── pages/
        │   ├── Home.js         # หน้าแรก — แสดงสินค้าทั้งหมด
        │   ├── Login.js        # หน้า Login
        │   ├── Register.js     # หน้าสมัครสมาชิก
        │   ├── ProductDetail.js # หน้ารายละเอียดสินค้า
        │   ├── Profile.js      # หน้าโปรไฟล์
        │   ├── SellerBoard.js  # หน้าจัดการสินค้าของ Seller
        │   └── Checkout.js     # หน้าชำระเงิน
        │
        └── components/
            ├── layout/
            │   ├── Header.js
            │   └── Footer.js
            ├── product/
            │   ├── ProductCard.js
            │   ├── ProductDetail.css
            │   └── ...
            └── shared/
                └── InfoItem.js
```

---

## ⚙️ การติดตั้ง (Setup)

### สิ่งที่ต้องมีก่อน
- [Node.js](https://nodejs.org) (แนะนำ LTS)
- MongoDB Atlas account หรือ MongoDB local

### 1. ติดตั้ง dependencies

```bash
# Backend
cd Many-Hand-Shop
npm install

# Frontend
cd frontend
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `Many-Hand-Shop/`:

```env
URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
PORT=9000
```

> ⚠️ ห้ามมีช่องว่างรอบเครื่องหมาย `=`

---

## 🚀 วิธีรัน

ต้องเปิด **2 terminal** พร้อมกัน

### Terminal 1 — Backend
```bash
cd Many-Hand-Shop
node server.js
```
รอจนขึ้น: `MongoDB connect`

### Terminal 2 — Frontend
```bash
cd Many-Hand-Shop/frontend
npm start
```
รอจนขึ้น: `Compiled successfully!`

### เปิดเว็บ
```
http://localhost:3000
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | สมัครสมาชิก |
| POST | `/login` | เข้าสู่ระบบ |
| GET | `/api/product` | ดึงสินค้าทั้งหมด |
| GET | `/api/product/:id` | ดึงสินค้าตาม ID |
| POST | `/api/product/Addproduct` | เพิ่มสินค้าใหม่ |
| PATCH | `/api/product/:id` | แก้ไขสินค้า |
| DELETE | `/api/product/:id` | ลบสินค้า |

---

## 📄 หน้าต่างๆ ในระบบ

| หน้า | URL | เงื่อนไข |
|------|-----|---------|
| หน้าแรก | `/` | ทุกคนเข้าได้ |
| Login | `/login` | ยังไม่ได้ login |
| Register | `/register` | ยังไม่ได้ login |
| รายละเอียดสินค้า | `/product/:id` | ทุกคนเข้าได้ |
| โปรไฟล์ | `/profile` | ต้อง login |
| จัดการสินค้า | `/seller-board` | ต้อง login |
| ชำระเงิน | `/checkout` | ต้อง login |

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Styling | CSS, Boxicons |
| Auth | localStorage (JWT-ready) |

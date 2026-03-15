# 🛍️ Many Hand Shop

ระบบตลาดออนไลน์ (Marketplace) สำหรับซื้อ-ขายสินค้ามือสอง  
สร้างด้วย **React** (Frontend) + **Node.js/Express** (Backend) + **MongoDB Atlas** (Database)

---

## 📁 โครงสร้างโปรเจกต์

```
Many-Hand-Shop/
├── server.js              # Entry point ของ Backend (port 9000)
├── .env                   # Environment variables
├── package.json
│
├── config/
│   └── db.js              # เชื่อมต่อ MongoDB
│
├── models/
│   └── user.js            # Mongoose schemas (User, Product, Category, Order)
│
├── routes/
│   ├── index.js           # รวม routes ทั้งหมด
│   ├── login.js           # POST /api/login
│   ├── register.js        # POST /api/register
│   ├── product.js         # CRUD /api/product + /api/product/categories
│   └── user.js            # GET/PATCH /api/user/:id
│
└── frontend/              # React App (Create React App)
    └── src/
        ├── App.js          # Router หลัก + Auth state
        ├── pages/
        │   ├── Home.js             # หน้าแรก — แสดงสินค้าทั้งหมด
        │   ├── AllProducts.js      # หน้าสินค้าทั้งหมด (กรอง/เรียงได้)
        │   ├── Login.js            # หน้า Login
        │   ├── Register.js         # หน้าสมัครสมาชิก
        │   ├── ProductDetail.js    # หน้ารายละเอียดสินค้า
        │   ├── Profile.js          # หน้าโปรไฟล์ผู้ใช้
        │   ├── SellerProfile.js    # หน้าโปรไฟล์ Seller (สาธารณะ)
        │   ├── SellerBoard.js      # หน้าจัดการสินค้าของ Seller
        │   ├── Cart.js             # หน้าตะกร้าสินค้า
        │   ├── Checkout.js         # หน้าชำระเงิน
        │   └── Search.js           # หน้าค้นหาสินค้า
        │
        └── components/
            ├── layout/
            │   ├── Header.js
            │   └── Footer.js
            ├── product/
            │   ├── ProductCard.js
            │   ├── ProductDetail.js
            │   ├── ProductGallery.js
            │   ├── ProductInfo.js
            │   ├── ProductItem.js
            │   ├── QuantitySelector.js
            │   └── RelatedProducts.js
            └── shared/
                └── InfoItem.js
```

---

## 🗄️ Data Models

### User
| Field | Type | หมายเหตุ |
|-------|------|---------|
| username | String | 3–40 ตัวอักษร |
| password | String | min 8 ตัว, ไม่แสดงใน query |
| email | String | unique, lowercase |
| images | [String] | รูปโปรไฟล์ (optional) |
| address | String | ที่อยู่ |
| role | String | `User` / `Admin` (default: `User`) |
| phone | String | เบอร์ไทย 10 หลัก (0xxxxxxxxx) |
| rating | Number | 0–5 |
| ratingCount | Number | จำนวนคนที่ให้คะแนน |

### Product
| Field | Type | หมายเหตุ |
|-------|------|---------|
| name | String | 3–300 ตัวอักษร |
| description | String | 10–1000 ตัวอักษร |
| price | Number | ≥ 0, ทศนิยม 2 ตำแหน่ง |
| images | [String] | อย่างน้อย 1 รูป |
| stock | Number | integer ≥ 0 (default: 1) |
| seller | ObjectId | ref User |
| category | ObjectId | ref Category |

### Category (default ที่มีในระบบ)
`sport`, `furniture`, `fashion`, `book`, `electronics`, `beauty`, `baby & kids`, `pet supplies`

### Order
| Field | Type | หมายเหตุ |
|-------|------|---------|
| buyer | ObjectId | ref User |
| items | Array | { product, seller, quantity, price } |
| shippingInfo | Object | { name, phone, address } |
| shippingFee | Number | ค่าจัดส่ง (default: 0) |
| totalPrice | Number | ราคารวม |
| paymentMethod | String | `COD` / `Bank Transfer` / `Credit Card` |

---

## ⚙️ การติดตั้ง (Setup)

### สิ่งที่ต้องมีก่อน
- [Node.js](https://nodejs.org) v18+ (ทดสอบกับ v24)
- MongoDB Atlas account

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
URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

> ⚠️ ห้ามมีช่องว่างรอบเครื่องหมาย `=`

### 3. ตั้งค่า MongoDB Atlas

1. เข้า [cloud.mongodb.com](https://cloud.mongodb.com) → ตรวจว่า Cluster **Active** (ไม่ Paused)
2. เมนู **Network Access** → Add IP Address → ใส่ IP เครื่องของคุณ หรือ `0.0.0.0/0`
3. Copy connection string มาใส่ใน `URL` ของ `.env`

### 4. ตั้งค่า Cloudinary (สำหรับอัปโหลดรูปสินค้า)

1. เข้า Cloudinary Console → **Settings** → **API Keys**
2. คัดลอกค่ามาใส่ใน `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

รูปสินค้าจะถูกอัปโหลดลงโฟลเดอร์ `many-hand-shop/products` ใน Cloudinary

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

> **Windows (PowerShell) — ถ้าขึ้น Invalid Host header:**
> ```powershell
> $env:DANGEROUSLY_DISABLE_HOST_CHECK="true" ; npm start
> ```

รอจนขึ้น: `Compiled successfully!`

### เปิดเว็บ
```
http://localhost:3000
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | `username, email, password` | สมัครสมาชิก |
| POST | `/api/login` | `username, password` | เข้าสู่ระบบ |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/:id` | ดึงข้อมูลโปรไฟล์ผู้ใช้ |
| PATCH | `/api/user/:id` | แก้ไขโปรไฟล์ผู้ใช้ |

### Product
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/product` | ดึงสินค้าทั้งหมด (รองรับ `?seller=id`) |
| GET | `/api/product/categories` | ดึง category ทั้งหมด |
| GET | `/api/product/:id` | ดึงสินค้าตาม ID |
| POST | `/api/product/Addproduct` | เพิ่มสินค้าใหม่ |
| POST | `/api/product/upload-image` | อัปโหลดรูปขึ้น Cloudinary |
| PATCH | `/api/product/:id` | แก้ไขสินค้า |
| DELETE | `/api/product/:id` | ลบสินค้า |

---

## 📄 หน้าต่างๆ ในระบบ

| หน้า | URL | เงื่อนไข |
|------|-----|---------|
| หน้าแรก | `/` หรือ `/home` | ทุกคนเข้าได้ |
| หน้าแรก (logged in) | `/home-user` | ต้อง login |
| สินค้าทั้งหมด | `/products` หรือ `/all-products` | ทุกคนเข้าได้ |
| ค้นหาสินค้า | `/search` | ทุกคนเข้าได้ |
| Login | `/login` | redirect ไป `/home-user` ถ้า login แล้ว |
| Register | `/register` | redirect ไป `/home-user` ถ้า login แล้ว |
| รายละเอียดสินค้า | `/product/:productId` | ทุกคนเข้าได้ |
| โปรไฟล์ Seller | `/seller/:sellerId` | ทุกคนเข้าได้ |
| ตะกร้าสินค้า | `/cart` | ต้อง login |
| ชำระเงิน | `/checkout` | ต้อง login |
| โปรไฟล์ผู้ใช้ | `/profile` | ต้อง login |
| จัดการสินค้า | `/seller-board` | ต้อง login |

---

## 🔑 Auth (localStorage)

Session เก็บไว้ใน localStorage ด้วย key ต่อไปนี้:

| Key | ค่า |
|-----|-----|
| `mhs_logged_in` | `"true"` เมื่อ login |
| `mhs_user_id` | MongoDB `_id` ของ user |
| `mhs_user_name` | username |
| `mhs_user_email` | email |
| `mhs_user_phone` | เบอร์โทร |
| `mhs_user_address` | ที่อยู่ |
| `mhs_user_images` | รูปโปรไฟล์ |
| `mhs_user_rating` | คะแนน |

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React 19, React Router v7, Boxicons |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas, Mongoose 9 |
| Auth | bcrypt 6, localStorage session |
| Image Upload | Cloudinary 2, Multer |
| Styling | CSS |

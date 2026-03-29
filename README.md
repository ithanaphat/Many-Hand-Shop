# 🛍️ Many Hand Shop

ระบบตลาดออนไลน์ (Marketplace) สำหรับซื้อ-ขายสินค้ามือสอง  
สร้างด้วย **React** (Frontend) + **Node.js/Express** (Backend) + **MongoDB Atlas** (Database)

---

## �️ Tech Stack

| ส่วน | เทคโนโลยี | เวอร์ชัน |
|------|-----------|---------|
| Frontend | React, React Router, Boxicons | 19, v7 |
| Backend | Node.js, Express.js | 5 |
| Database | MongoDB Atlas, Mongoose | 9 |
| Auth | bcrypt (hash password), localStorage (session) | 6 |
| Image Upload | Cloudinary, Multer | 2 |
| Email | Nodemailer (forgot password) | - |
| Styling | CSS (ไม่ใช้ framework) | - |

---

## 📁 โครงสร้างโปรเจกต์

```
Many-Hand-Shop/
├── server.js                 # Entry point — Express server (port 9000)
├── .env                      # Environment variables
├── package.json
│
├── config/
│   ├── db.js                 # เชื่อมต่อ MongoDB Atlas
│   └── database/
│       └── users.schema.json # JSON Schema validation rules
│
├── models/
│   └── user.js               # Mongoose schemas ทั้งหมด (User, Product, Order, Category, Cart)
│
├── routes/
│   ├── index.js              # รวม routes ทั้งหมดภายใต้ /api
│   ├── login.js              # POST /api/login
│   ├── register.js           # POST /api/register
│   ├── product.js            # CRUD สินค้า + หมวดหมู่ + อัปโหลดรูป
│   ├── order.js              # สร้าง order + ดูประวัติ + ให้คะแนน
│   └── user.js               # GET/PATCH/DELETE โปรไฟล์ผู้ใช้
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js           # React entry point
        ├── App.js             # Router หลัก + Auth state management
        ├── config.js          # API_BASE_URL + apiCall helper
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Header.js         # Navbar + ค้นหา + cart counter + profile menu
        │   │   └── Footer.js         # Footer
        │   ├── product/
        │   │   ├── ProductCard.js    # การ์ดสินค้า (ใช้ในหน้า listing)
        │   │   ├── ProductItem.js    # รายการสินค้าของ seller (ใช้ในหน้า profile)
        │   │   ├── ProductGallery.js # gallery รูปสินค้า (หน้ารายละเอียด)
        │   │   ├── ProductInfo.js    # ข้อมูลสินค้า + rating modal (หน้ารายละเอียด)
        │   │   ├── QuantitySelector.js # ปุ่มเลือกจำนวน +/-
        │   │   └── RelatedProducts.js  # สินค้าแนะนำ
        │   └── shared/
        │       └── InfoItem.js       # แสดง label + value (ใช้ในหน้า profile)
        │
        └── pages/
            ├── Home.js               # หน้าแรก — สินค้ายอดนิยม + สินค้าทั้งหมด
            ├── AllProducts.js        # สินค้าทั้งหมด (ค้นหา/กรอง/เรียง)
            ├── ProductDetail.js      # รายละเอียดสินค้า
            ├── Login.js              # เข้าสู่ระบบ
            ├── Register.js           # สมัครสมาชิก
            ├── ForgotPassword.js     # ลืมรหัสผ่าน
            ├── Profile.js            # โปรไฟล์ตัวเอง (แก้ไขได้)
            ├── SellerProfile.js      # โปรไฟล์ผู้ขาย (สาธารณะ)
            ├── SellerBoard.js        # แดชบอร์ดจัดการสินค้าของ seller
            ├── Cart.js               # ตะกร้าสินค้า
            ├── Checkout.js           # ชำระเงิน + กรอกที่อยู่จัดส่ง
            └── OrderHistory.js       # ประวัติคำสั่งซื้อ + ให้คะแนน seller
```

---

## 🗄️ Database Models

### User
| Field | Type | Validation | หมายเหตุ |
|-------|------|------------|---------|
| username | String | required, 3–40 chars, trim | ชื่อผู้ใช้ |
| password | String | required, min 8 chars | hash ด้วย bcrypt, `select: false` (ไม่ส่งกลับใน query) |
| email | String | required, unique, lowercase | ใช้ regex validate รูปแบบ email |
| role | String | enum: `User`, `Admin` | default: `User` |
| phone | String | regex: `0` + 9 หลัก | เบอร์โทรไทย |
| address | String | - | ที่อยู่ |
| images | [String] | - | รูปโปรไฟล์ (Cloudinary URL) |
| backgroundImage | String | - | รูปพื้นหลังโปรไฟล์ |
| rating | Number | 0–5 | คะแนนเฉลี่ยของ seller (default: 0) |
| ratingCount | Number | min 0 | จำนวนคนที่ให้คะแนน (default: 0) |

### Product
| Field | Type | Validation | หมายเหตุ |
|-------|------|------------|---------|
| name | String | required, 3–300 chars | ชื่อสินค้า |
| description | String | required, 10–1000 chars | รายละเอียด |
| price | Number | required, min 0 | ราคา (ทศนิยม 2 ตำแหน่ง) |
| images | [String] | required, min 1 รูป | รูปสินค้า (Cloudinary URL) |
| stock | Number | required, min 0, integer | จำนวนสต็อก (default: 1) |
| seller | ObjectId | required, ref: User, indexed | เจ้าของสินค้า |
| category | ObjectId | required, ref: Category | หมวดหมู่ |

### Order
| Field | Type | Validation | หมายเหตุ |
|-------|------|------------|---------|
| buyer | ObjectId | required, ref: User | ผู้ซื้อ |
| items | Array | min 1 item | รายการสินค้าในออเดอร์ |
| items[].product | ObjectId | required, ref: Product | สินค้า |
| items[].productSnapshot | Object | - | ข้อมูลสินค้า ณ ตอนสั่งซื้อ (name, images, price) |
| items[].seller | ObjectId | required, ref: User | ผู้ขาย |
| items[].quantity | Number | required, min 1, integer | จำนวน |
| items[].price | Number | - | ราคาต่อชิ้น ณ ตอนสั่งซื้อ |
| items[].review | Object | - | `{ rating: 1-5, ratedAt: Date }` |
| shippingInfo | Object | required | `{ name, phone, address }` |
| shippingFee | Number | min 0 | ค่าจัดส่ง (default: 0) |
| totalPrice | Number | required, min 0 | ราคารวมทั้งหมด |
| paymentMethod | String | enum | `COD` / `Bank Transfer` / `Credit Card` |

### Category
| Field | Type | หมายเหตุ |
|-------|------|---------|
| name | String | required, unique, lowercase |
| description | String | - |

> **8 หมวดหมู่เริ่มต้น** (สร้างอัตโนมัติ): sport, furniture, fashion, book, electronics, beauty, baby & kids, pet supplies

### Cart
| Field | Type | หมายเหตุ |
|-------|------|---------|
| user | ObjectId | required, unique (1 user = 1 cart) |
| items | Array | `[{ product, seller, quantity, price }]` |

### ความสัมพันธ์ระหว่าง Models

```
User ◄──── Product.seller        (1 user มีได้หลาย product)
User ◄──── Order.buyer           (1 user มีได้หลาย order)
User ◄──── Order.items[].seller  (1 user เป็น seller ได้หลาย item)
User ◄──── Cart.user             (1 user มี 1 cart)
Product ◄── Order.items[].product
Product ◄── Cart.items[].product
Category ◄── Product.category    (1 category มีได้หลาย product)
```

---

## ⚙️ การติดตั้ง (Setup)

### สิ่งที่ต้องมีก่อน
- [Node.js](https://nodejs.org) v18+
- MongoDB Atlas account
- Cloudinary account (สำหรับอัปโหลดรูปสินค้า)

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/ithanaphat/Many-Hand-Shop.git
cd Many-Hand-Shop
```

### 2. ติดตั้ง Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ใน root folder:

```env
URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

> ⚠️ ห้ามมีช่องว่างรอบเครื่องหมาย `=`

### 4. ตั้งค่า MongoDB Atlas

1. เข้า [cloud.mongodb.com](https://cloud.mongodb.com) → ตรวจว่า Cluster **Active** (ไม่ Paused)
2. เมนู **Network Access** → Add IP Address → ใส่ IP เครื่องของคุณ หรือ `0.0.0.0/0`
3. Copy connection string มาใส่ใน `URL` ของ `.env`

### 5. ตั้งค่า Cloudinary

1. เข้า Cloudinary Console → **Settings** → **API Keys**
2. คัดลอกค่ามาใส่ใน `.env`

> รูปสินค้าจะอัปโหลดลงโฟลเดอร์ `many-hand-shop/products` ใน Cloudinary

---

## 🚀 วิธีรัน

### วิธีที่ 1 — Development (แยก 2 terminal)

**Terminal 1 — Backend**
```bash
node server.js
```
> รอจนขึ้น: `MongoDB connect` → Backend พร้อมที่ port 9000

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
```
> รอจนขึ้น: `Compiled successfully!` → เปิด http://localhost:3000

### วิธีที่ 2 — Production (build แล้วรัน server เดียว)

```bash
cd frontend
npm run build
cd ..
node server.js
```
> เปิด http://localhost:9000 — server จะ serve ทั้ง API และหน้าเว็บ

---

## 🌐 API Endpoints

Base URL: `/api`

### Authentication (ไม่ต้อง login)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | `{ username, email, password }` | สมัครสมาชิก |
| POST | `/api/login` | `{ username, password }` | เข้าสู่ระบบ (รับ username หรือ email) |
| POST | `/api/forgot-password/verify` | `{ email }` | ตรวจว่า email มีในระบบ |
| POST | `/api/forgot-password` | `{ email, password, confirmPassword }` | รีเซ็ตรหัสผ่าน |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/:id` | ดึงข้อมูลโปรไฟล์ผู้ใช้ |
| PATCH | `/api/user/:id` | แก้ไขโปรไฟล์ (username, email, phone, address, images, backgroundImage) |
| DELETE | `/api/user/:id` | ลบบัญชีผู้ใช้ + ลบสินค้าทั้งหมดของ user |

### Product

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/product` | ดึงสินค้าทั้งหมด (รองรับ `?seller=<userId>`) |
| GET | `/api/product/popular` | สินค้ายอดนิยม (รองรับ `?limit=4`) |
| GET | `/api/product/categories` | ดึงหมวดหมู่ทั้งหมด (สร้าง default อัตโนมัติถ้ายังไม่มี) |
| GET | `/api/product/:id` | ดึงสินค้าตาม ID |
| POST | `/api/product/Addproduct` | เพิ่มสินค้าใหม่ |
| POST | `/api/product/upload-image` | อัปโหลดรูปขึ้น Cloudinary (multipart/form-data) |
| PATCH | `/api/product/:id` | แก้ไขสินค้า |
| DELETE | `/api/product/:id` | ลบสินค้า |

### Order

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/order` | สร้างคำสั่งซื้อ (ตรวจ stock + คำนวณราคาฝั่ง server) |
| GET | `/api/order/buyer/:buyerId` | ดึงประวัติคำสั่งซื้อของผู้ซื้อ |
| GET | `/api/order/seller/:sellerId/ratings` | ดึงรีวิว/คะแนนทั้งหมดของผู้ขาย |
| POST | `/api/order/:orderId/items/:itemId/rate` | ให้คะแนนผู้ขาย (1-5 ดาว) |

---

## 📄 หน้าเว็บทั้งหมด (Frontend Routes)

### หน้าสาธารณะ (ไม่ต้อง login)

| หน้า | URL | คำอธิบาย |
|------|-----|---------|
| หน้าแรก | `/` | แสดงสินค้ายอดนิยม + สินค้าทั้งหมด |
| สินค้าทั้งหมด | `/products` | ค้นหา / กรองหมวดหมู่ / เรียงลำดับ |
| รายละเอียดสินค้า | `/product/:productId` | รูปสินค้า, ข้อมูล, เลือกจำนวน, สินค้าแนะนำ |
| โปรไฟล์ผู้ขาย | `/seller/:sellerId` | ข้อมูล seller + สินค้าทั้งหมดของ seller |
| Login | `/login` | เข้าสู่ระบบ (redirect ไป `/` ถ้า login แล้ว) |
| Register | `/register` | สมัครสมาชิก (redirect ไป `/` ถ้า login แล้ว) |
| ลืมรหัสผ่าน | `/forgot-password` | ตรวจ email + ตั้งรหัสผ่านใหม่ |

### หน้าที่ต้อง login (Protected Routes)

| หน้า | URL | คำอธิบาย |
|------|-----|---------|
| โปรไฟล์ | `/profile` | ดู/แก้ไขข้อมูลตัวเอง + ดูสินค้าที่ขาย |
| แดชบอร์ด seller | `/seller-board` | จัดการสินค้า (เพิ่ม/แก้/ลบ) |
| ตะกร้าสินค้า | `/cart` | รายการสินค้าในตะกร้า |
| ชำระเงิน | `/checkout` | กรอกที่อยู่จัดส่ง + เลือกวิธีชำระเงิน |
| ประวัติคำสั่งซื้อ | `/orders` | ดูออเดอร์ทั้งหมด + ให้คะแนนผู้ขาย |

> ถ้ายังไม่ login แล้วเข้าหน้า protected → redirect ไปหน้า `/login`

---

## 🔄 System Flow

### Flow การซื้อสินค้า

```
1. ดูสินค้า          → GET /api/product
2. ดูรายละเอียด      → GET /api/product/:id
3. เพิ่มตะกร้า       → เก็บใน localStorage (key: mhs_cart_<userId>)
4. Checkout          → POST /api/order
   ├── ตรวจ buyer มีจริงในระบบ
   ├── ตรวจ buyer ≠ seller (ซื้อของตัวเองไม่ได้)
   ├── ตรวจ stock เพียงพอ
   ├── คำนวณราคารวมฝั่ง server (ป้องกันแก้ราคาจาก client)
   ├── หัก stock ด้วย $inc: { stock: -quantity } (atomic operation)
   ├── เก็บ productSnapshot (ข้อมูลสินค้า ณ ตอนสั่งซื้อ)
   └── สร้าง Order
5. ให้คะแนน seller   → POST /api/order/:orderId/items/:itemId/rate
   ├── ตรวจเป็นเจ้าของ order เท่านั้น
   ├── ตรวจยังไม่เคยให้คะแนน (ให้ซ้ำไม่ได้)
   └── คำนวณ rating ใหม่: (oldTotal + newRating) / (count + 1)
```

### Flow สมัคร/เข้าสู่ระบบ

```
Register:
  กรอก username, email, password
  → POST /api/register
  → ตรวจ email ซ้ำ → hash password (bcrypt 10 rounds) → สร้าง User

Login:
  กรอก username (หรือ email) + password
  → POST /api/login
  → ค้นหา User จาก username หรือ email (ใช้ $or query)
  → bcrypt.compare() เทียบ password
  → ส่ง user data กลับ → Frontend เก็บลง localStorage
```

### Flow สินค้ายอดนิยม

```
GET /api/product/popular
→ Aggregate จาก Order.items นับยอดขายแต่ละสินค้า
→ Sort: totalSold DESC → purchaseCount DESC → latestPurchaseAt DESC
→ ถ้ายังไม่มี order → fallback แสดงสินค้าใหม่สุด
```

---

## 🔑 Authentication (localStorage)

ระบบใช้ localStorage เก็บ session (ไม่ใช้ JWT token)

| Key | ค่า |
|-----|-----|
| `mhs_logged_in` | `"true"` เมื่อ login สำเร็จ |
| `mhs_user_id` | MongoDB `_id` ของ user |
| `mhs_user_name` | username |
| `mhs_user_email` | email |
| `mhs_user_phone` | เบอร์โทร |
| `mhs_user_address` | ที่อยู่ |
| `mhs_user_images` | รูปโปรไฟล์ |
| `mhs_user_rating` | คะแนน |
| `mhs_cart_<userId>` | ข้อมูลตะกร้า (JSON) |

> Logout จะลบ key ทั้งหมดที่ขึ้นต้นด้วย `mhs_`

---

## 🔐 Security

- **Password**: Hash ด้วย bcrypt (10-12 salt rounds), `select: false` ใน schema
- **CORS**: Whitelist เฉพาะ origin ที่อนุญาต (localhost + production domains)
- **Input Validation**: Mongoose schema validators (min/max length, regex, enum)
- **Price Protection**: Server คำนวณราคารวมเอง เทียบกับที่ client ส่งมา
- **Self-Purchase Prevention**: ตรวจ buyer ≠ seller ก่อนสร้าง order
- **Duplicate Rating Prevention**: ตรวจว่ายังไม่เคยให้คะแนนก่อนบันทึก
- **productSnapshot**: เก็บข้อมูลสินค้า ณ ตอนสั่งซื้อ ป้องกันข้อมูลเปลี่ยนแปลงย้อนหลัง

---

## 🌍 Deployment

| Platform | URL |
|----------|-----|
| Vercel (Frontend) | `https://manyhandshop.vercel.app` |
| Render (Backend) | `https://many-hand-shop.onrender.com` |

Server รองรับทั้ง development (แยก frontend/backend) และ production (serve React build จาก Express)

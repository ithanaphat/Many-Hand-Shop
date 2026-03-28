# 🚀 Deployment Guide: Render + Vercel

## 📋 Checklist ก่อน Deploy

### Backend (Render)
- [x] ✅ PORT ใช้ environment variable
- [x] ✅ CORS configuration พร้อม
- [x] ✅ .env variables พร้อม
- [ ] Push code ไป GitHub

### Frontend (Vercel)
- [x] ✅ build script ใช้ `npm run build`
- [x] ✅ output directory = `build`
- [x] ✅ config.js ใช้ `REACT_APP_API_URL`
- [ ] Push code ไป GitHub

---

## 🔥 STEP 1: Deploy Backend ไป Render

### 1.1 เตรียม Backend Code
```bash
# ✅ ผมแก้ให้แล้ว:
# - server.js ใช้ PORT environment variable
# - CORS support Vercel domain
# - Package.json มี start script
```

### 1.2 เข้า Render.com
👉 https://render.com/

1. **Login/Signup**
2. **กด New +** → **Web Service**
3. **เลือก Repository** (GitHub)

### 1.3 ตั้งค่า Render
| Setting | Value |
|---------|-------|
| **Name** | many-hand-shop-api |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Region** | Singapore (ใกล้ไทย) |

### 1.4 ตั้ง Environment Variables
ใน **Environment** section เพิ่ม:
```
PORT=10000
DATABASE_URL=<your_mongodb_url>
CLOUDINARY_NAME=<your_name>
CLOUDINARY_API_KEY=<your_key>
CLOUDINARY_API_SECRET=<your_secret>
JWT_SECRET=<your_secret>
FRONTEND_URL=https://your-app.vercel.app
```

### 1.5 Deploy
- กด **Create Web Service**
- รอให้ build เสร็จ (2-3 นาที)
- ได้ URL เช่น: `https://many-hand-shop-api.onrender.com`

✨ **เก็บ URL นี้ไว้!**

---

## 🌐 STEP 2: Deploy Frontend ไป Vercel

### 2.1 เตรียม Frontend Code
```bash
# ✅ ผมแก้ให้แล้ว:
# - ลบ proxy ออก
# - build script พร้อม
# - config.js ใช้ environment variable
```

### 2.2 เข้า Vercel.com
👉 https://vercel.com/

1. **Login/Signup** (เลือก GitHub)
2. **Add New** → **Project**
3. **เลือก Repository** (Many-Hand-Shop)

### 2.3 ตั้งค่า Project
| Setting | Value |
|---------|-------|
| **Framework** | React |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |

### 2.4 ตั้ง Environment Variables (สำคัญ!)
ใน **Environment Variables** เพิ่ม:
```
REACT_APP_API_URL=https://many-hand-shop-api.onrender.com
```
> ⚠️ ใช้ URL จาก Render ที่ได้ในขั้นตอน 1.5

### 2.5 Deploy
- กด **Deploy**
- รอให้ build เสร็จ
- ได้ URL เช่น: `https://many-hand-shop.vercel.app`

✨ **บันทึก URL นี้!**

---

## 🧪 Test เว็บหลังจาก Deploy

### ทดสอบว่า Frontend เรียก API ได้
```javascript
// เปิด Browser Console (F12)
fetch('https://many-hand-shop-api.onrender.com/api/products')
  .then(r => r.json())
  .then(console.log)
```

หรือ:
```bash
# จาก terminal
curl https://many-hand-shop-api.onrender.com/api/products
```

---

## ❌ Troubleshooting

### ❌ Frontend fetch ไม่ได้ (CORS Error)
**ที่ Backend** → เพิ่ม Vercel URL ใน CORS

### ❌ Images ดึงไม่ได้
**ที่ Frontend config** → ตรวจสอบ `REACT_APP_API_URL`

### ❌ Database ไม่เชื่อมต่อ
**ที่ Render** → ตรวจสอบ `DATABASE_URL` environment variable

### ❌ Render/Vercel sleep mode
**Render FREE tier** จะ sleep หลังจาก 15 นาทีไม่ใช้
→ อัปเกรด เป็น **Pro** (ราคา $7/เดือน)

---

## 📱 URLs ที่สำคัญ
```
🔗 Backend API:    https://many-hand-shop-api.onrender.com
🔗 Frontend:       https://many-hand-shop.vercel.app
```

---

## 🔄 Update Code
### เมื่อต้องการ Deploy ใหม่
1. **Push code ไป GitHub**
   ```bash
   git add .
   git commit -m "Update code"
   git push
   ```
2. **Render & Vercel จะ auto-deploy** 🚀

---

## 💡 Tips
- ✅ ใช้ `process.env` สำหรับ CONFIG (ไม่ hardcode URLs)
- ✅ CORS ต้องตรงกับ Frontend URL
- ✅ Test ใน Local ก่อน deploy
- ✅ Check Render/Vercel Logs เมื่อมี Error

---

## 🎯 สรุป
```
local Dev:    Frontend: http://localhost:3000
              Backend:  http://localhost:9000

Production:   Frontend: https://your-app.vercel.app
              Backend:  https://your-api.onrender.com
```

**ถ้ายังงง ให้ติดต่อ!** 💬

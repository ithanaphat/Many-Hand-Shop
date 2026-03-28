# 🚀 DEPLOYMENT GUIDE - Render + Vercel

## ✅ โค้ดได้ฟิกซ์แล้ว

### Backend (server.js)
- ✅ PORT ใช้ env variable: `process.env.PORT || 9000`
- ✅ CORS ตั้งค่าสำหรับ production
- ✅ รองรับ Render deployment

### Frontend (React)
- ✅ .env ใช้ Production API URL
- ✅ .env.development สำหรับ local dev
- ✅ package.json ลบ proxy ออก
- ✅ API calls ใช้ environment variable

---

## 📋 RENDER DEPLOYMENT (BACKEND)

### 1. เตรียม Git
```bash
git add .
git commit -m "Fix deployment config"
git push
```

### 2. ไป https://render.com/
1. Sign in → Dashboard
2. **New +** → **Web Service**
3. Connect GitHub repo
4. ตั้งค่า:
   - **Name**: `many-hand-shop` (หรือชื่ออื่น)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (ฟรี) หรือ Paid ตามต้องการ

5. **Environment → Add Environment Variable**:
   - ถ้าใช้ MongoDB Atlas ให้เพิ่ม: `MONGODB_URI=...`
   - ถ้ามี env อื่น ให้เพิ่มด้วย

6. **Deploy** → รอ deploy เสร็จ
7. เอา URL (เช่น `https://many-hand-shop.onrender.com/`)

---

## 🌐 VERCEL DEPLOYMENT (FRONTEND)

### 1. ไป https://vercel.com/
1. Sign in → Dashboard
2. **Add New** → **Project**
3. Select repo: `Many-Hand-Shop`
4. ตั้งค่า:
   - **Framework**: React (auto detect)
   - **Output Directory**: `build`
   - **Root Directory**: `./frontend`

5. **Environment Variables** → Add:
   ```
   REACT_APP_API_URL=https://many-hand-shop.onrender.com
   ```

6. **Deploy** → รอสักครู่

---

## 🔗 VERIFY API CONNECTION

หลังจาก deploy เสร็จ:

1. เปิด `https://manyhandshop.vercel.app/`
2. Open DevTools → Console (F12)
3. ทดสอบ fetch:
   ```javascript
   fetch('https://many-hand-shop.onrender.com/api/product').then(r => r.json()).then(d => console.log(d))
   ```

### ❌ ถ้ายังไม่ได้:
- ✓ เช็ค Render running?
- ✓ Backend มี route `/api/product`?
- ✓ CORS ตั้งค่าถูก?

---

## 📝 LOCAL DEVELOPMENT

ตอน dev locally ยังคง work ปกติ:
```bash
# Terminal 1: Backend
npm install
npm start  # หรือ node server.js

# Terminal 2: Frontend
cd frontend
npm install
npm start  # http://localhost:3000
```

.env.development จะ auto ใช้ localhost ✅

---

## 🚨 COMMON ISSUES

| Issue | Fix |
|-------|-----|
| CORS Error | Backend CORS ต้อง include Vercel URL |
| 404 API | Render alive? `/api/...` routes exist? |
| Frontend ใช้ localhost | ✓ Frontend .env ต้อง production URL |
| Build fail | `npm run build` test locally first |
| Connection timeout | Render cold start? (≤30s) |

---

## 💾 FILES READY FOR PRODUCTION

✅ Modified:
- `server.js` - PORT env + CORS config
- `frontend/.env` - Production API URL
- `frontend/package.json` - Removed proxy

✅ Created:
- `frontend/vercel.json` - Vercel config
- `frontend/.env.development` - Dev override
- `frontend/.env.local` - Local test override

---

## 🎯 NEXT STEPS

1. Push code to GitHub
2. Deploy backend on Render
3. Deploy frontend on Vercel
4. Test API connection
5. ใช้งานได้ 🎉

---

Generated: 2026-03-29

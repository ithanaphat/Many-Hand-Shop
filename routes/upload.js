const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// ตั้งค่า storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "img-" + uniqueSuffix + ext)
  },
})

// กรองเฉพาะไฟล์รูปภาพ
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error("อัปโหลดได้เฉพาะไฟล์รูปภาพ (jpg, png, gif, webp)"))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาด 5MB
})

// POST /api/upload — อัปโหลดรูปเดียว
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "กรุณาเลือกไฟล์รูปภาพ" })
  }
  const imageUrl = `/uploads/${req.file.filename}`
  res.status(201).json({ imageUrl })
})

// POST /api/upload/multiple — อัปโหลดหลายรูป (สูงสุด 10)
router.post("/multiple", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "กรุณาเลือกไฟล์รูปภาพอย่างน้อย 1 ไฟล์" })
  }
  const imageUrls = req.files.map((f) => `/uploads/${f.filename}`)
  res.status(201).json({ imageUrls })
})

module.exports = router

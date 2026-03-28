const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const { User } = require("../models/user")

// Step 1 — ตรวจว่า email มีในระบบไหม
// POST /api/forgot-password/verify  { email }
router.post("/verify", async (req, res) => {
  const { email } = req.body
  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required" })
  }
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" })
    }
    return res.status(200).json({ message: "Email verified" })
  } catch (err) {
    console.error("forgot-password/verify:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// Step 2 — reset password โดยตรง (ไม่ต้องใช้ token หรือ email)
// POST /api/forgot-password  { email, password, confirmPassword }
router.post("/", async (req, res) => {
  const { email, password, confirmPassword } = req.body

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" })
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" })
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" })
    }

    const hashed = await bcrypt.hash(password, 12)
    await User.findByIdAndUpdate(user._id, { password: hashed })

    return res.status(200).json({ message: "Password reset successfully" })
  } catch (err) {
    console.error("forgot-password:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

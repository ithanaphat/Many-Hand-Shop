const express = require("express")
const router = express.Router()
const { User, Product } = require("../models/user.js")

// GET user profile by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            images: user.images || [],
            backgroundImage: user.backgroundImage || "",
            rating: user.rating || 0,
            ratingCount: user.ratingCount || 0
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error fetching user" })
    }
})

// UPDATE user profile
router.patch("/:id", async (req, res) => {
    if (String(req.user._id) !== String(req.params.id)) {
        return res.status(403).json({ message: "You can only edit your own profile" })
    }

    const { username, email, phone, address, images, backgroundImage } = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                ...(username !== undefined ? { username } : {}),
                ...(email !== undefined ? { email } : {}),
                ...(phone !== undefined ? { phone } : {}),
                ...(address !== undefined ? { address } : {}),
                ...(images !== undefined ? { images } : {}),
                ...(backgroundImage !== undefined ? { backgroundImage } : {}),
            },
            { new: true, runValidators: true }
        ).select("-password")

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone || "",
            address: updatedUser.address || "",
            images: updatedUser.images || [],
            backgroundImage: updatedUser.backgroundImage || "",
            rating: updatedUser.rating || 0,
            ratingCount: updatedUser.ratingCount || 0
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error updating user" })
    }
})

// DELETE: ลบบัญชีผู้ใช้งาน (Delete Profile)
router.delete('/:id', async (req, res) => {
  if (String(req.user._id) !== String(req.params.id)) {
    return res.status(403).json({ message: "You can only delete your own account" })
  }

  try {
    const userId = req.params.id;
 
    // ค้นหาและลบข้อมูลผู้ใช้จากฐานข้อมูล
    const deletedUser = await User.findByIdAndDelete(userId);
 
    // เช็คว่ามี User นี้ในระบบให้ลบหรือไม่
    if (!deletedUser) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งานนี้ในระบบ' });
    }

    // ลบสินค้าทั้งหมดของผู้ขายคนนี้
    await Product.deleteMany({ seller: userId });
 
    // ส่งข้อความกลับไปที่ Frontend ว่าลบสำเร็จ
    res.status(200).json({ message: 'ลบบัญชีผู้ใช้สำเร็จ' });
   
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดจากฝั่งเซิร์ฟเวอร์' });
  }
});

module.exports = router

const express = require("express")
const router = express.Router()
const { User } = require("../models/user.js")

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
    const { username, email, phone, address, images } = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                ...(username !== undefined ? { username } : {}),
                ...(email !== undefined ? { email } : {}),
                ...(phone !== undefined ? { phone } : {}),
                ...(address !== undefined ? { address } : {}),
                ...(images !== undefined ? { images } : {}),
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
            rating: updatedUser.rating || 0,
            ratingCount: updatedUser.ratingCount || 0
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error updating user" })
    }
})

module.exports = router

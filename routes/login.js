const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = express.Router()
const {User} = require("../models/user.js")


router.post("/", async (req,res)=>{
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required" })
    }

    try {
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        }).select("+password")

        if (!user){
            return res.status(404).json({ message: "User not found" })
        }

        if (!password) {
            return res.status(400).json({ message: "Password missing" })
        }

        const ismatch = await bcrypt.compare(password, user.password)
        if (!ismatch){
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || "7d" }
        )

        res.cookie("mhs_token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        res.status(200).json({
            message: "login success",
            token,
            user: {
                id: user._id,
                _id: user._id,
                username: user.username,
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                images: user.images || [],
                rating: user.rating || 0
            }
        })
    } catch (err){
        console.log(err)
        res.status(500).json({ message: "error" })
    }   

})

module.exports = router
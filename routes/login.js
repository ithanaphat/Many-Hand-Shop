const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const {User} = require("../models/user.js")


router.post("/", async (req,res)=>{
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required" })
    }

    try {
        const user = await User.findOne({username : username}).select("+password")

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

        res.status(200).json({
            message: "login success",
            user: { // ข้อมูลที่ต้องการส่งกลับไปให้ frontend
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
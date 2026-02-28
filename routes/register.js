const express = require("express")
const router = express.Router()

const User = require("../models/user.js")

//ทำการสร้าง Accout
router.post("/", async (req, res)=>{
    const {username, password, email} = req.body

    if (!username || !password || !email) {
        return res.status(400).json({message: "username, email and password are required"})
    }

    const checkEmail = await User.findOne({email})

    if(checkEmail){
        return res.status(400).json({message: "Email นี้ถูกใช้เเล้ว"})
    }

    try{
        await User.create({
            username,
            password,
            email,
            phone: "0000000000"
        })
        res.status(201).json({message: "สมัครสำเร็จ"})
    }catch(err){
        console.log("FULL ERROR ↓↓↓")
        console.log(err.errors)
        res.status(400).json({message : err.message})
    }
})

module.exports = router


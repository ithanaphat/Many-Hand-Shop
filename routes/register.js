const express = require("express")
const router = express.Router()
const User = require("../models/user")

//ทำการสร้าง Accout
router.post("/", async (req, res)=>{
    const {username, password, email} = req.body
    const checkEmail = await User.findOne({email})

    if(checkEmail){
        return res.status(400).json({message: "Email นี้ถูกใช้เเล้ว"})
    }

    try{
        await User.create({
            username,
            password,
            email
        })
        res.send("สมัครสำเร็จ")
    }catch(err){
        console.log("FULL ERROR ↓↓↓")
        console.log(err.errors)
        res.status(400).json({message : err.message})
    }
})

module.exports = router


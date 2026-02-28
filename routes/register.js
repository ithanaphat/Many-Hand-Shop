const express = require("express")
const router = express.Router()
const User = require("../models/user.js")

//ทำการสร้าง Accout
router.post("/regis.html", async (req, res)=>{
    const {Username, Password, Email} = req.body
    const checkEmail = await User.findOne({Email})

    if(checkEmail){
        return res.status(400).json({message: "Email นี้ถูกใช้เเล้ว"})
    }

    try{
        await User.create({
            Username,
            Password,
            Email
        })
        res.send("สมัครสำเร็จ")
    }catch(err){
        res.status(400).json({message : err.message})
    }
})

module.exports = router


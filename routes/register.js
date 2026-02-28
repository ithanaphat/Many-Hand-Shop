const express = require("express")
const router = express.Router()
<<<<<<< HEAD
const User = require("../models/user")
=======
const User = require("../models/user.js")
>>>>>>> 909e2058719d0b26e7874318023d60e476f05b5a

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


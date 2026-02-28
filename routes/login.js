const express = require("express")
const router = express.Router()
const User = require("../models/user.js")


router.post("/", async (req,res)=>{
    const {username, password} = req.body

    try {
        const user = await User.findOne({
            username : username,
            password : password
        })

        if(user){
            res.send("login success")
        }else {
            res.send("loging fail")
        }
    } catch (err){
        console.log(err)
        res.status(500).send("error")
    }   

})

module.exports = router
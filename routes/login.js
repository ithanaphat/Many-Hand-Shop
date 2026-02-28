const express = require("express")
const router = express.Router()
const User = require("../models/user.js")

router.use(express.urlencoded({extended: true}))

router.post("/login", async (req,res)=>{
    const {Username, Password} = req.body

    try {
        const user = await User.findOne({
            username : Username,
            password : Password
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
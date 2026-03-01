const express = require("express")
const router = express.Router()
const {User} = require("../models/user.js")


router.post("/", async (req,res)=>{
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required" })
    }

    try {
        const user = await User.findOne({
            username : username,
            password : password
        })

        if(user){
            res.status(200).json({ message: "login success" })
        }else {
            res.status(401).json({ message: "login fail" })
        }
    } catch (err){
        console.log(err)
        res.status(500).json({ message: "error" })
    }   

})

module.exports = router
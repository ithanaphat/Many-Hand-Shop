const express = require("express")
const router = express.Router()
const User = require("../models/user.js")


router.post("/", async (req,res)=>{
    const {identifier, username, password} = req.body
    const loginIdentifier = (identifier || username || "").trim()

    if (!loginIdentifier || !password) {
        return res.status(400).json({ message: "username/email and password are required" })
    }

    try {
        const user = await User.findOne({
            $or: [
                { username: loginIdentifier },
                { email: loginIdentifier.toLowerCase() }
            ],
            password : password
        }).select("username email name")

        if(user){
            res.status(200).json({
                message: "login success",
                user: {
                    name: user.name || user.username,
                    username: user.username,
                    email: user.email
                }
            })
        }else {
            res.status(401).json({ message: "login fail" })
        }
    } catch (err){
        console.log(err)
        res.status(500).json({ message: "error" })
    }   

})

module.exports = router
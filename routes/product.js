const express = require("express")
const router = express.Router()

const {Product} = require("../models/user")

router.post("/", async (req,res)=>{
    const {name, description, price, images, stock, seller, category} = req.body

    try{
        await Product.create({
            name, 
            description, 
            price, 
            images, 
            stock, 
            seller, 
            category,
        })
        res.status(201).json({message:"สำเร็จ"})
    }catch(err){
        console.log("FULL ERROR:", err)
        console.log("ERRORS:", err.errors)
        res.status(400).json({message : err.message, error: err.errors})
    }
})

module.exports = router
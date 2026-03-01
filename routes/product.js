const express = require("express")
const router = express.Router()

const {Product} = require("../models/user")

router.get("/", async (req, res)=>{
    try{
        const products = await Product.find()
        res.json(products)   
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.get("/:id", async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message : "ไม่มีใน Product"})
        }
        res.json(product)   
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.patch("/:id", async (req, res)=>{
    try{
        const updateproduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new : true})
        if(!updateproduct){
            return res.status(404).json({message : "ไม่มีใน Product"})
        }
        res.json(updateproduct)   
    }catch(err){
        res.status(400).json({message : err.message})
    }
})

router.delete("/:id", async (req, res)=>{
    try{
        const deleteproduct = await Product.findByIdAndDelete(req.params.id)
        if(!deleteproduct){
            return res.status(404).json({message : "ไม่มีใน Product"})
        }
        res.json(deleteproduct)   
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.post("/Addproduct", async (req,res)=>{
    const {name, description, price, images, stock, seller, category} = req.body

    if(!name || !description || !price || !images || !category || !stock){
        return res.status(400).json({message: "ได้โปรดใส่ด้วย"})
    }

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
const express = require("express")
const router = express.Router()
const Product = require("../models/product")

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().limit(10)
        res.json(products)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'username email')
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Create product (for testing)
router.post("/", async (req, res) => {
    try {
        const { name, description, price, images, stock, seller, category, rating, reviews } = req.body
        
        const product = new Product({
            name,
            description,
            price,
            images,
            stock,
            seller,
            category,
            rating,
            reviews
        })
        
        await product.save()
        res.status(201).json(product)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router

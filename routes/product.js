const express = require("express")
const router = express.Router()
const multer = require("multer")
const cloudinary = require("cloudinary").v2

const { Product, User, Category } = require("../models/user")

const upload = multer({ storage: multer.memoryStorage() })

const hasCloudinaryUrl = Boolean(process.env.CLOUDINARY_URL)
const hasCloudinaryParts = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
)

if (hasCloudinaryUrl) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
    })
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
}

const uploadToCloudinary = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "many-hand-shop/products" },
            (error, result) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve(result)
            }
        )
        stream.end(buffer)
    })

router.get("/", async (req, res)=>{
    try{
        const filter = {}
        if (req.query.seller) filter.seller = req.query.seller
        const products = await Product.find(filter).populate('seller', 'username images rating ratingCount')
        res.json(products)   
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.get("/:id", async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id).populate('seller', 'username images rating ratingCount')
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

router.post("/upload-image", upload.single("image"), async (req, res) => {
    if (!hasCloudinaryUrl && !hasCloudinaryParts) {
        const missingVars = [
            "CLOUDINARY_CLOUD_NAME",
            "CLOUDINARY_API_KEY",
            "CLOUDINARY_API_SECRET",
        ].filter((envName) => !process.env[envName])

        return res.status(500).json({
            message: `Cloudinary is not configured. Missing: ${missingVars.join(", ")}`,
        })
    }

    if (!req.file) {
        return res.status(400).json({ message: "กรุณาเลือกไฟล์รูปภาพ" })
    }

    try {
        const uploaded = await uploadToCloudinary(req.file.buffer)
        res.status(201).json({
            message: "อัปโหลดรูปสำเร็จ",
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.post("/Addproduct", async (req,res)=>{
    const {name, description, price, images, stock, seller, category} = req.body
    const normalizedImages = Array.isArray(images)
        ? images.filter(Boolean)
        : images
            ? [images]
            : []

    if(!name || !description || price === undefined || normalizedImages.length === 0 || stock === undefined){
        return res.status(400).json({message: "ได้โปรดใส่ด้วย"})
    }

    try{
        let sellerId = seller
        let categoryId = category

        if (!sellerId) {
            const foundSeller = await User.findOne().select("_id")
            sellerId = foundSeller?._id
        }

        if (!categoryId) {
            const foundCategory = await Category.findOne().select("_id")
            categoryId = foundCategory?._id
        }

        if (!sellerId || !categoryId) {
            return res.status(400).json({ message: "seller/category ไม่ครบ" })
        }

        const createdProduct = await Product.create({
            name, 
            description, 
            price: Number(price), 
            images: normalizedImages,
            stock: Number(stock), 
            seller: sellerId, 
            category: categoryId,
        })
        res.status(201).json({message:"สำเร็จ", product: createdProduct})
    }catch(err){
        console.log("FULL ERROR:", err)
        console.log("ERRORS:", err.errors)
        res.status(400).json({message : err.message, error: err.errors})
    }
})

module.exports = router
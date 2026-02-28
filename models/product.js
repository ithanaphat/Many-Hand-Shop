const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true,
    },
    description : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 1000,
        trim: true,
    },
    price : {
        type : Number,
        required : true,
        min : 0,
        set: v => Math.round(v * 100) / 100
    },
    images: {
        type: [String],
        required : true,
    },
    stock : {
        type : Number ,
        min : 0,
        default : 1
    },
    seller: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        default: "General"
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

productSchema.index({ category: 1 })
productSchema.index({ seller: 1 })

const Product = mongoose.model("Product", productSchema)

module.exports = Product

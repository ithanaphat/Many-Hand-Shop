const { request } = require("express")
const mongoose = require("mongoose")
const { stringify } = require("qs")

//สร้าง schema 

const userSchema = new mongoose.Schema({ 
    username : {
        type : String,
        required: true, 
        trim: true  //กันspaceหน้าหลัง
    },
    password : {
        type : String,
        required : true,
        minlength: 8,
        trim: true,  //กันspaceหน้าหลัง
        select: false //กันแสดงออกมา
    },
    email : {
        type : String,
        required : true,
        unique: true,
        lowercase: true, //กันปัญหาตัวใหญ่ตัวเลิก EX TEST@gmail.com || test@gmail.com
        trim: true,  //กันspaceหน้าหลัง
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //จัดเรียงรูปแบบ
        
    },
    images: {
    type: [String],
    validate: [arr => arr.length = 1, '1 image required'] //กำหนดขั้นต่ำรูปภาพ
    },
    adderss : {
        type : String
    },
    role : {
        type : String,
        enum : ['User','Admin'],
        default: 'User' //ถ้าไม่มีการกำหนดให้เป็น User
    },
    phone : {
     type : String,
     required : true,
     match : /^0\d{9}$/ //จัดเรียงรูปแบบ 0 นำหน้า
    }
}, { timestamps: true } // attrime 
) 

const productSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim: true,  //กันspaceหน้าหลัง
    },
    description : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 1000,
        trim: true,  //กันspaceหน้าหลัง
    },
    price : {
        type : Number,
        required : true,
        min : 0, //กันค่าติดลบ
         set: v => Math.round(v * 100) / 100 //กันทศนิยมยาวเกิน
    },

   images: {
    type: [String],
    required : true,
    validate: [arr => arr.length >= 2, 'At least 2 image required'] //กำหนดขั้นต่ำรูปภาพ
},
    stock : {
        type : Number ,
        min : 0,
        default : 1
    },
    seller: {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'User', //ตัวบอกว่า Obj นี้อ้างอิงไป Model "User"
    required: true
},
category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: true
}  

},{ timestamps: true }
)

const orderSchema = new mongoose.Schema({

       buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
  items: {
    type: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    required: true,
    validate: [
        arr => arr.length > 0,
        'Order must contain at least one item' // ขั้นต่ำ1ชิ้น
    ]
},
    
     shippingInfo: { //เก็บที่อยู่
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            match: /^0\d{9}$/   // เบอร์ไทย 10 หลัก
        },
        address: {
            type: String,
            required: true
        }
    },

    shippingFee: { //ค่าจัดส่ง
        type: Number,
        default: 0,
        min: 0
    },
      totalPrice: {//ค่าของ
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {//การจ่ายตัง
        type: String,
        enum: ['COD', 'Bank Transfer', 'Credit Card'],
        required: true
    },


},{ timestamps: true })

productSchema.index({ category: 1 })
productSchema.index({ seller: 1 })


// Model เอาไว้คุยกับ Database
const User = mongoose.model("User", userSchema) 

module.exports = User
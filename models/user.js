const { request } = require("express")
const mongoose = require("mongoose")
const { stringify } = require("qs")

//สร้าง schema 

const userSchema = new mongoose.Schema({ 
    username : {
        type : String,
        required: true, 
        trim: true,//กันspaceหน้าหลัง
        minlength : 3,
        maxlength : 40,
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
    required : true,
    validate: [arr => arr.length === 1] //กำหนดขั้นต่ำรูปภาพ
    },
    address : {
        type : String
    },
    role : {
        type : String,
        enum : ['User','Admin'],
        default: 'User' //ถ้าไม่มีการกำหนดให้เป็น User
    },
    phone : {
     type : String,
     match : /^0\d{9}$/ //จัดเรียงรูปแบบ 0 นำหน้า
    }
}, { timestamps: true } // attrime 
) 

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true,  //กันspaceหน้าหลัง
        minlength : 3,
        maxlength : 300
    },
    description : {
        type : String,
        required : true,
        minlength : 10, //กำหนดขั้นต่ำ
        maxlength : 1000, // กำหนดมากสุด
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
        default : 1,
          validate: { //กันเลขไม่ใช่จำนวนเต็ม
            validator: Number.isInteger,
            message: 'Stock must be integer'
  }
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
        quantity: { //ปริมาณ
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger, //ต้องเป็นเลขจำนวนเต็มบวก
                message: 'Quantity must be integer'
                }
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

const categorySchema = new mongoose.Schema({
    name : {        
        type : String,
        required : true,
        unique: true, //กันซ้ำ
        enum : ['Sport','Furniture','Fashion','Book','Electronics','Beauty','Baby & Kids','Pet Supplies'],
        lowercase : true, //บันทึกเป็นตัวเล็ก
        trim : true
    },
    description : {
        type :String
    }

},{ timestamps: true })

const cartsSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true   // 1 user มีได้ 1 cart
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
                min: 1,
                validate: {
                    validator: Number.isInteger,
                     message: 'Quantity must be integer'
                }
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }],
        default: []
    },

}, { timestamps: true })

orderSchema.index({ buyer: 1 })
orderSchema.index({ createdAt: -1 })
cartsSchema.index({ user: 1 })

// Model เอาไว้คุยกับ Database
const User = mongoose.model("User", userSchema) 
const Product = mongoose.model("Product", productSchema)

module.exports = {User, Product}
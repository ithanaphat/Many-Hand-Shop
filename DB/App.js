require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true ,
    useUnifiedTopology :true
})

.then(() =>{
    console.log('Connected to MongoDB Atlas!');
})
.catch((err) => 
{
    console.error('Error connectring to MongoDB Atlas :',err);
})

app.use(express.json());

// ================== ENTITY / SCHEMA ==================

// ===== User Entity =====
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['buyer','seller','admin'], default: 'buyer' },
    phone: String,
    created_at: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

// ===== Product Entity =====
const ProductSchema = new mongoose.Schema({
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    price: Number,
    condition: String,
    status: { type: String, enum: ['available','sold'], default: 'available' },
    category: String,
    created_at: { type: Date, default: Date.now }
});
const Product = mongoose.model("Product", ProductSchema);


// ===== Order Entity =====
const OrderSchema = new mongoose.Schema({
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number
        }
    ],
    total_price: Number,
    status: { type: String, enum: ['Pending','Shipped','Completed','Cancelled'], default: 'Pending' },
    order_date: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", OrderSchema);


// ===== Review Entity =====
const ReviewSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    review_date: { type: Date, default: Date.now }
});
const Review = mongoose.model("Review", ReviewSchema);


// ================== API ROUTES ==================

// ---- User CRUD ----
app.post("/users", async(req,res)=>{
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

app.get("/users", async(req,res)=>{
    res.json(await User.find());
});

// Update User
app.put("/users/:id", async (req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );
        res.json(user);
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

// Delete User
app.delete("/users/:id", async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.json({message:"User deleted"});
    }catch(err){
        res.status(400).json({error:err.message});
    }
});


// ---- Product CRUD ----
app.post("/products", async(req,res)=>{
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

app.get("/products", async(req,res)=>{
    res.json(await Product.find().populate("seller_id"));
});

// Update Product
app.put("/products/:id", async (req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );
        res.json(product);
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

// Delete Product
app.delete("/products/:id", async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.json({message:"Product deleted"});
    }catch(err){
        res.status(400).json({error:err.message});
    }
});


// ---- Order CRUD ----
app.post("/orders", async(req,res)=>{
    const order = new Order(req.body);
    await order.save();
    res.json(order);
});

app.get("/orders", async(req,res)=>{
    res.json(await Order.find()
        .populate("buyer_id")
        .populate("products.product_id")
    );
});

// Update Order
app.put("/orders/:id", async (req,res)=>{
    try{
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );
        res.json(order);
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

// Delete Order
app.delete("/orders/:id", async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.json({message:"Order deleted"});
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

// ---- Review CRUD ----
app.post("/reviews", async(req,res)=>{
    const review = new Review(req.body);
    await review.save();
    res.json(review);
});

app.get("/reviews", async(req,res)=>{
    res.json(await Review.find()
        .populate("buyer_id")
        .populate("seller_id")
        .populate("order_id")
    );
});

// Update Review
app.put("/reviews/:id", async (req,res)=>{
    try{
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );
        res.json(review);
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

// Delete Review
app.delete("/reviews/:id", async (req,res)=>{
    try{
        await Review.findByIdAndDelete(req.params.id);
        res.json({message:"Review deleted"});
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

// ================= START SERVER =================
app.listen(PORT, ()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
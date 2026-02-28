const mongoose = require("mongoose")

//สร้าง schema 
const userSchema = new mongoose.Schema({ 
    username : String,
    password : String,
    email : String
})

// Model เอาไว้คุยกับ Database
const User = mongoose.model("User", userSchema) 

module.exports = User
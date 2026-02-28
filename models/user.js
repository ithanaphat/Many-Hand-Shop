const mongoose = require("mongoose")

//สร้าง schema 
const userSchema = new mongoose.Schema({ 
    username: {
    type: String,
    required: true
  },
    password: {
    type: String,
    required: true
  },
    email: {
    type: String,
    required: true
  }
})

// Model เอาไว้คุยกับ Database
const User = mongoose.model("User", userSchema) 

module.exports = User
require('dotenv').config()
const mongoose = require("mongoose")

mongoose.connect(process.env.URL)
.then(() => console.log("MongoDB connect"))
.catch(err => console.log(err))

module.exports = mongoose
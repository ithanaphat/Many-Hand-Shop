require('dotenv').config()
const mongoose = require("mongoose")

const PORT = process.env.PORT || 9000

mongoose.connect(process.env.URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(() => console.log("MongoDB connect"))
.catch(err => console.log(err))

module.exports = mongoose
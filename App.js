const express = require("express")
const path = require("path")
const router = require("./routes/index.js")
const app = express()

require("./config/db.js")
app.use(express.static(path.join(__dirname, "public")))
app.use(router)

app.listen(9000, ()=>{
    console.log("ยินดีเข้าสู่เเก๊งทำไมเป็น step#1 test")
})
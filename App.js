const express = require("express")
const cors = require("cors")
const path = require("path")
const router = require("./routes/index.js")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
require("./config/db.js")
app.use(cors())
app.use(router.loginRouter)
app.use(router.registerRouter)

app.listen(9000, ()=>{
    console.log("ยินดีเข้าสู่เเก๊งทำไมเป็น step#1 test")
})
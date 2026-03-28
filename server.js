require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const router = require("./routes/index.js")

const app = express()

app.use(cors({ credentials: true, origin: true }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require("./config/db.js")

app.use(router)

app.use(express.static(path.join(__dirname, "frontend", "build")))
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
})

app.listen(9000, () => {
    console.log("Many-Hand-Shop server running on port 9000")
})

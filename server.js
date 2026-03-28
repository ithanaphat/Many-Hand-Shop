require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const router = require("./routes/index.js")

const app = express()

// CORS Configuration for production
const allowedOrigins = [
    "http://localhost:3000", // Development
    "http://localhost:9000", // Development
    "https://manyhandshop.vercel.app", // Production Vercel
    "https://many-hand-shop.onrender.com" // Production Render
]

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require("./config/db.js")

app.use(router)

app.use(express.static(path.join(__dirname, "frontend", "build")))
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
})

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
    console.log(`Many-Hand-Shop server running on port ${PORT}`)
})

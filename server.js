require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const router = require("./routes/index.js")

const app = express()

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:9000',
    'https://manyhandshop.vercel.app',
    process.env.FRONTEND_URL || ''
].filter(Boolean)

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
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

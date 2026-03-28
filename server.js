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
    "https://*.vercel.app", // Allow all Vercel deployments
    "https://many-hand-shop.onrender.com" // Production Render
]

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile, curl, etc.)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                // Handle wildcard patterns
                const pattern = new RegExp(allowed.replace(/\./g, '\\.').replace(/\*/g, '.*'));
                return pattern.test(origin);
            }
            return allowed === origin;
        });
        
        if (isAllowed || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('CORS: Origin not allowed'));
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

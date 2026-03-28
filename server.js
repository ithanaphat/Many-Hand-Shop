require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const path = require("path")
const router = require("./routes/index.js")

const app = express()

// ── CORS ───────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())

app.use(cors({
    origin: (origin, callback) => {
        // allow server-to-server / curl with no origin header
        if (!origin) return callback(null, true)
        // in development allow any localhost port
        if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true)
        }
        if (allowedOrigins.includes(origin)) return callback(null, true)
        callback(null, false)
    },
    credentials: true,
}))

// ── Body / Cookie parsers ──────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Rate limiters ──────────────────────────────────────
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { message: "Too many login attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
})

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { message: "Too many registration attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use("/api/login", loginLimiter)
app.use("/api/register", registerLimiter)

// ── DB ─────────────────────────────────────────────────
require("./config/db.js")

// ── API routes ─────────────────────────────────────────
app.use(router)

// ── Serve React build (production / built frontend) ───
app.use(express.static(path.join(__dirname, "frontend", "build")))
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
})

app.listen(9000, () => {
    console.log("Many-Hand-Shop server running on port 9000")
})
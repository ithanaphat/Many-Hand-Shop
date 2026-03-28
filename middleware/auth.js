const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    let token = null

    // 1. ลอง cookie ก่อน
    if (req.cookies && req.cookies.mhs_token) {
        token = req.cookies.mhs_token
    }

    // 2. fallback — Authorization header
    if (!token) {
        const authHeader = req.headers["authorization"]
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7)
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Authentication required" })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { _id: payload.id, username: payload.username }
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

module.exports = auth

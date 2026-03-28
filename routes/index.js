const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")

const loginRouter = require("./login")
const registerRouter = require("./register")
const logoutRouter = require("./logout")
const forgotPasswordRouter = require("./forgot-password")
const productsRouter = require("./product")
const userRouter = require("./user")
const orderRouter = require("./order")

// Public routes
router.use("/api/login", loginRouter)
router.use("/api/register", registerRouter)
router.use("/api/logout", logoutRouter)
router.use("/api/forgot-password", forgotPasswordRouter)

// Product public GETs — auth applied per-method inside product router
router.use("/api/product", productsRouter)

// Protected routes — require valid JWT
router.use("/api/user", auth, userRouter)
router.use("/api/order", auth, orderRouter)

module.exports = router
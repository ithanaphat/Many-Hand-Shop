const express = require("express")
const router = express.Router()

const loginRouter = require("./login")
const registerRouter = require("./register")
const forgotPasswordRouter = require("./forgot-password")
const productsRouter = require("./product")
const userRouter = require("./user")
const orderRouter = require("./order")

router.use("/api/login", loginRouter)
router.use("/api/register", registerRouter)
router.use("/api/forgot-password", forgotPasswordRouter)
router.use("/api/product", productsRouter)
router.use("/api/user", userRouter)
router.use("/api/order", orderRouter)

module.exports = router
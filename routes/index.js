const express = require("express")
const router = express.Router()

const loginRouter = require("./login")
const registerRouter = require("./register")
const productsRouter = require("./product")
const userRouter = require("./user")

router.use("/api/login", loginRouter)
router.use("/api/register", registerRouter)
router.use("/api/product", productsRouter)
router.use("/api/user", userRouter)

module.exports = router
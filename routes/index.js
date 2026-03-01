const express = require("express")
const router = express.Router()

const loginRouter = require("./login")
const registerRouter = require("./register")
const productsRouter = require("./product")

router.use("/login", loginRouter)
router.use("/register", registerRouter)
router.use("/product", productsRouter)

module.exports = router
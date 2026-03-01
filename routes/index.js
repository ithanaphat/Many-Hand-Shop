const express = require("express")
const router = express.Router()

const loginRouter = require("./login")
const registerRouter = require("./register")
const productsRouter = require("./products")

router.use("/login", loginRouter)
router.use("/register", registerRouter)
router.use("/api/products", productsRouter)

module.exports = router
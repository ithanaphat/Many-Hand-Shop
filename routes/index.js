const express = require("express")
const router = express.Router()

const loginRouter = require("./login")
const registerRouter = require("./register")
const productsRouter = require("./product")

router.use("/api/login", loginRouter)
router.use("/api/register", registerRouter)
router.use("/api/product", productsRouter)

module.exports = router
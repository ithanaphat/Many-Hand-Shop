const express = require("express")
const router = express.Router()

const loginRouter = require("./login")
const registerRouter = require("./register")

router.use("/login", loginRouter)
router.use("/register", registerRouter)

module.exports = router
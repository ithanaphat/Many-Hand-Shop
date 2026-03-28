const express = require("express")
const router = express.Router()

router.post("/", (req, res) => {
    res.clearCookie("mhs_token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    })
    res.status(200).json({ message: "Logged out successfully" })
})

module.exports = router

const express = require("express")
const router = express.Router()
const User = require("../models/user.js")

router.get("/", async (req, res) => {
  const identifier = (req.query.identifier || "").trim()

  if (!identifier) {
    return res.status(400).json({ message: "identifier is required" })
  }

  try {
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier.toLowerCase() }
      ]
    }).select("username email name")

    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }

    return res.status(200).json({
      user: {
        name: user.name || user.username,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(500).json({ message: "error" })
  }
})

module.exports = router

// routes/admin.js or controllers/admin.js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, newPassword } = req.body;
  try {


    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });


    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

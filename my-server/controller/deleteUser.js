const express = require("express");
const router = express.Router();
const User = require("../model/user");


router.delete("/delete-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = router;

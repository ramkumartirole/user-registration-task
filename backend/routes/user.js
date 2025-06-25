const router = require("express").Router();
const { User, validate } = require("../module/user");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage config
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = "uploads/";
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath);
		}
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

// Registration route
router.post("/register", upload.single("profilePicture"), async (req, res) => {
	try {
		// Extract form fields from multipart/form-data
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			city,
			state,
			zip,
			country,
			gender,
		} = req.body;

		const areaOfInterest = JSON.parse(req.body.areaOfInterest || "[]");
		const profilePicture = req.file ? req.file.filename : null;

		// Validate input
		const { error } = validate({
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			city,
			state,
			zip,
			country,
			gender,
			areaOfInterest,
		});

		if (error)
			return res.status(400).send({ message: error.details[0].message });

		// Check for duplicate email
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(409).send({ message: "User with given email already exists" });

		// Hash password
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create and save new user
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			city,
			state,
			zip,
			country,
			gender,
			areaOfInterest,
			profilePicture,
		});

		//db call/interaction
		await newUser.save();

		// Optional: generate token
		const token = newUser.generateAuthToken?.();

		res.status(201).send({
			message: "User created successfully",
			token, // Optional
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// GET /api/users/getAllUsers
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Example: routes/userRoutes.js or inside app.js
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Update user (excluding email)
router.put("/updateUser/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        areaOfInterest: req.body.areaOfInterest,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const express = require("express");
const router = express.Router();
const User = require("../models/User"); // adjust path if needed
const nodemailer = require("nodemailer"); // if you're sending reset link

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Example: send reset email (you can replace with real logic)
    console.log(`Send reset link to: ${email}`);
    return res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


module.exports = router;




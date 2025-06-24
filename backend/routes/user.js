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
router.post("/", upload.single("profilePicture"), async (req, res) => {
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
		} = req.body;

		const areaOfInterest = JSON.parse(req.body.areaOfInterest || "[]");

		const profilePicture = req.file ? req.file.filename : null;

		// Validate only required fields for now
		const { error } = validate({ firstName, lastName, email, password });
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(409).send({ message: "User with given email already exists" });

		// Hash password
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			city,
			state,
			zip,
			country,
			areaOfInterest,
			profilePicture,
		});

		await newUser.save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;





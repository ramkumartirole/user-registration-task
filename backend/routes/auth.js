
const router = require("express").Router();
const { User } = require("../module/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/", async (req, res) => {
	try {
		const { error } = validateLogin(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const token = user.generateAuthToken?.();
		res.status(200).send({ data: token, message: "Login successful" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
	const { email } = req.body;
	if (!email) return res.status(400).send({ message: "Email is required" });

	const user = await User.findOne({ email });
	if (!user) return res.status(404).send({ message: "User not found" });

	// Generate reset token
	const token = jwt.sign({ id: user._id }, process.env.JWTPRIVATEKEY, { expiresIn: "15m" });

	// You can send this token via email OR return it in response (for local testing)
	const resetLink = `http://localhost:3000/reset-password/${token}`; // Adjust port/URL as needed

	// In real apps, send email here
	return res.status(200).send({
		message: "Reset link generated successfully",
		resetLink, // return this for now to display on UI
	});
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
	try {
		const { token } = req.params;
		const { newPassword, confirmPassword } = req.body;

		if (!newPassword || !confirmPassword)
			return res.status(400).send({ message: "Both fields are required" });

		if (newPassword !== confirmPassword)
			return res.status(400).send({ message: "Passwords do not match" });

		const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
		const user = await User.findById(decoded.id);
		if (!user) return res.status(404).send({ message: "User not found" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		user.password = hashedPassword;
		await user.save();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (err) {
		console.error(err);
		res.status(400).send({ message: "Invalid or expired token" });
	}
});

transporter.sendMail({
  to: user.email,
  subject: "Password Reset",
  html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
}, (err, info) => {
  if (err) {
    console.error("Reset mail error:", err);
    return res.status(500).send({ message: "Failed to send reset email" });
  }
  console.log("Reset mail sent:", info.response);
  res.status(200).send({ message: "Reset link sent to email" });
});


// Login validation
const validateLogin = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send email


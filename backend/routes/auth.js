
const router = require("express").Router();
const { User } = require("../module/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");

// Login route
router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		// If you have a token method on User model
		const token = user.generateAuthToken?.(); // optional chaining if defined
		res.status(200).send({ data: token, message: "Login successful" });

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"), // FIXED: should NOT be Joi.email()
	});
	return schema.validate(data);
};

module.exports = router;


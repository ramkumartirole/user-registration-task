// const { required } = require("joi");


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	city: { type: String },
	state: { type: String },
	zip: { type: String },
	country: { type: String },
	areaOfInterest: { type: [String] },
	profilePicture: { type: String }, // store filename
});

const User = mongoose.model("User", userSchema);

const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };

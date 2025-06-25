
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

// creates a collection called users (default plural form).
const User = mongoose.model("User", userSchema);

const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

function validate(user) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
    gender: Joi.string().required(),
    areaOfInterest: Joi.array().items(Joi.string()),
    
    // ✅ Add this to allow confirmPassword
    confirmPassword: Joi.string().optional(),
  });

  return schema.validate(user);
}


module.exports = { User, validate };

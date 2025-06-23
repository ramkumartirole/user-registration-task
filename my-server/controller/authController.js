
const User =require("../model/user")
const City = require('../model/city');
const State = require('../model/state');
const bcrypt = require("bcrypt")

exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    email,
    password,
    city: cityName,
    state: stateName,
    zip,
    country,
    activity,
  } = req.body;

  const profileImage = req.file;

  try {

    let state = await State.findOne({ name: stateName });
    if (!state) {
      state = await State.create({ name: stateName });
    }

    let city = await City.findOne({ name: cityName, state: state._id });
    if (!city) {
      city = await City.create({ name: cityName, state: state._id });
    }

    // Hash password (using bcrypt)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with references
    const user = await User.create({
      firstName,
      lastName,
      gender,
      email,
      password: hashedPassword,
      city: city._id,
      state: state._id,
      zip,
      country,
      activity,
      profileImage: profileImage ? profileImage.path : null
    });


    const populatedUser = await User.findById(user._id)
      .populate('city')
      .populate('state')
      .exec();

    res.status(201).json({
      status: 'success',
      data: populatedUser
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'DUPLICATE_EMAIL',
          message: "Email already exists"
        }
      });
    }


    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      });
    }

  if(error.code === 500){
 return res.status(500).json({
      status: 'error',
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }

  }
};
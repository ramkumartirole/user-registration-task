const express = require("express");
const router = express.Router();
const User = require("../model/user")
const storage = require("../services/cloudinaryConfig")
const multer = require("multer");
const State = require("../model/state")
const City = require("../model/city")


const upload = multer({ storage });
router.put('/edit-user/:id', upload.single("profileImage"), async (req, res) => {
  const userId = req.params.id;
  const {
    firstName,
    lastName,
    gender,
    email,
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


    const updateData = {
      firstName,
      lastName,
      gender,
      email,
      city: city._id,
      state: state._id,
      zip,
      country,
      activity,
    };


    if (profileImage) {
      updateData.profileImage = profileImage.path;
    }


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('city')
      .populate('state');

    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }


    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'DUPLICATE_EMAIL',
          message: 'Email already exists',
        },
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors,
        },
      });
    }
    console.error('Edit user error:', error);
    res.status(500).json({
      status: 'error',
      error: {
        code: 'SERVER_ERROR',
        message: error.message,
      },
    });
  }
});

module.exports = router;

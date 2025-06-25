const express = require('express');
const router = express.Router();
const User = require("../model/user")



router.get("/", async(req,res)=>{

 try {
    const allUser = await User.find()
      .populate('city')    // populates city object
      .populate('state');  // populates state object

  res.json({
    allUser:allUser
})
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
})
module.exports= router;
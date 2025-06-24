const express = require('express');
const router = express.Router();
const User = require("../model/user")


router.get("/",async(req,res)=>{
const allUser = await User.find()
res.json({
    allUser:allUser
})
})
module.exports= router;
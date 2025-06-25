const express = require("express");
const router = express.Router();



router.get("/",async(req,res)=>{

  res.clearCookie('token', {
    httpOnly: true,
    // secure: false,
    sameSite: 'lax'
  });

  res.json({ message: 'Logged out successfully' });

})
module.exports= router;
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require("multer");
const mongoose = require('mongoose');
const authController = require("./controller/authController")
const Login = require("./controller/login")
const forgetPassword = require("./controller/forgotPassword")
const resetPassword =require("./controller/resetPassword")
const verifyToken = require("./controller/verifyToken")



const app = express();
const PORT = process.env.PORT ;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://admin:zainikram98@zain.osym9wq.mongodb.net/Full_Stack_Application', {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "D:/user-registration-task/my-server/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Basic route
app.get('/', (req, res) => {
  res.send('Node.js Server is Running!');
});
app.get('/verify',verifyToken, (req, res) => {
  res.send('secure routes!');
});
app.post('/api/submit', upload.single('profileImage'), authController.register);

// login
app.use('/api/login', Login);
app.use('/forgot-password', forgetPassword);
app.use('/reset-password', resetPassword);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
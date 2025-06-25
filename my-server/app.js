require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require("multer");
const mongoose = require('mongoose');
const storage = require("./services/cloudinaryConfig")
const registration = require("./controller/registration")
const Login = require("./controller/login")
const forgetPassword = require("./controller/forgotPassword")
const resetPassword = require("./controller/resetPassword")
const getUsers = require("./controller/getUsers")
const editUser = require("./controller/editUser")
const deleteUser = require("./controller/deleteUser")
const logout = require("./controller/logout")
const resetPasswordAdmin = require("./controller/passwordChange")
const verifyToken = require("./controller/verifyToken")
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASE_URL, {
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const upload = multer({ storage });
app.get('/', (req, res) => {
  res.send('Node.js Server is Running!');
});

app.use('/api/submit', upload.single('profileImage'), registration);
app.use('/api/login', Login);
app.use('/api/logout', logout);
app.use('/forgot-password', forgetPassword);
app.use('/reset-password', resetPassword);
app.use('/get-users',verifyToken, getUsers);
app.use('/', editUser);
app.use('/', deleteUser)
app.use('/admin/change-password', resetPasswordAdmin)



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
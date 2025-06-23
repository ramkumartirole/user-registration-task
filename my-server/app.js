require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require("multer");
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // or '*' for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://admin:zainikram98@zain.osym9wq.mongodb.net/Full_Stack_Application', {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Basic route
app.get('/', (req, res) => {
  res.send('Node.js Server is Running!');
});
// const storage = multer.memoryStorage(); // ya diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "D:/user-registration-task/my-server/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Example API endpoint
app.post("/api/submit", upload.single("profileImage"), (req, res) => {
  const { firstName, email } = req.body;
  const image = req.file;

  console.log("Name:", firstName);       // ✅ aayega
  console.log("Email:", email);     // ✅ aayega
  console.log("Image:", image);     // ✅ aayega

  res.json({ success: true });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
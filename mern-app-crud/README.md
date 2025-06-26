
⸻


#  User Registration & Management MERN App by Hassan Amjad

A full-stack MERN (MongoDB, Express.js, React, Node.js) application that implements secure user registration, authentication, profile management, CRUD operations, and password reset via email using Nodemailer.

---

##  Technologies & Libraries

###  Backend (Node.js + Express)
- `express` – RESTful API routing
- `mongoose` – MongoDB ORM
- `dotenv` – Environment configuration
- `bcrypt` – Password hashing
- `jsonwebtoken` – Authentication (JWT)
- `multer` – File uploads (profile pictures)
- `nodemailer` – Password reset emails

###  Frontend (React)
- `react`, `react-dom`, `react-router-dom`
- `@mui/material` – UI components
- `axios` – HTTP requests

---

##  Database Schema Design

###  User Schema (`models/User.js`)
```js
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  city:      { type: String, required: true },
  state:     { type: String, required: true },
  country:   { type: String, required: true },
  zip:       { type: String, required: true },
  areaOfInterest: { type: [String], required: true },
  gender:    { type: String, required: true },
  profilePicture: { type: String },
  resetToken: String,
  resetTokenExpiration: Date
});

 Country Schema (models/Country.js)

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

  State Schema (models/State.js)

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true }
});


⸻

  Middleware

upload.js

Used to handle image uploads using multer, and store files in /uploads.

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
module.exports = multer({ storage });

In server.js:

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


⸻

 Email Service

Used Gmail + Nodemailer + App Passwords for password reset functionality.
	•	Reset link includes a JWT token with expiration
	•	Token is verified on the reset page to allow secure password update

.env config:

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourapppassword
BASE_URL=http://localhost:5173


⸻

  Password Encryption
	•	Passwords are hashed using bcrypt before saving
	•	On login, the hashed password is compared using bcrypt.compare
	•	JWT tokens are generated on login for authentication and stored in localStorage

⸻

  Setup & Installation

1. Clone & Install

git clone --branch Hassan https://github.com/ramkumartirole/user-registration-task.git
cd user-registration-task

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install


⸻

2. Configure Environment

Create .env inside the backend folder:

DB_URI=mongodb://localhost:27017/your_database_name
PORT=5001
JWT_SECRET=yourSecretKey
EMAIL_USER=yourGmail
EMAIL_PASS=yourAppPassword
BASE_URL=http://localhost:5173


⸻

3. Start the App

# In backend
cd backend
npm start

# In frontend
cd ../frontend
npm start

Visit the app at http://localhost:3000

⸻

 Features

 User Registration (with file upload)
 Secure Login (JWT-based)
 Forgot Password + Reset via Email
 User Profile Management
 Dynamic Country & State Dropdowns
 User List with Edit/Delete
 Protected Routes with localStorage token
 Material UI Design

⸻

 Author

Developed by Hassan Amjad as part of a CRUD MERN App task.

---

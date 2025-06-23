const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./db');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", require("./routes/user"));  // user registration
app.use("/api/auth", require("./routes/auth"));   // login

connection();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');

// models
require("./models/user");

// init Express App
const app = express();


// connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true});

// MongoDB on connected
mongoose.connection.on('connected', () => {
    console.log("Mongo is connected");
});

// MongoDB on error
mongoose.connection.on('error', (err) => {
    console.log("MongoDB Error => "+err);
});

// Middleware
app.use(express.json());
app.use(require('./routes/auth'));



// express server to listen requests
app.listen(process.env.SERVER_PORT, () => {
   console.log(`Server is listing on http://localhost:${process.env.SERVER_PORT}`);
});

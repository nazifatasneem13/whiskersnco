require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./Routes/user.route');
const authRoute = require('./Routes/auth.route');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require('path');

const app = express();

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust this to your frontend URL
  credentials: true,
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/users", userRoute);


// Database connection
mongoose.connect(process.env.MONGODB_URI, { // Use environment variable
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to DB');
    const PORT = process.env.PORT || 4000; // Use environment variable for PORT
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
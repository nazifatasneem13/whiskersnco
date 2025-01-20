// server/server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const petRouter = require("./Routes/PetRoute");
const AdoptFormRoute = require("./Routes/AdoptFormRoute");
const userRoute = require("./Routes/user.route");
const authRoute = require("./Routes/auth.route");
const AdminRoute = require("./Routes/AdminRoute");
const vetRouter = require("./Routes/VetRoute");
const wishlistRouter = require("./Routes/wishlist");
const communicationRouter = require("./Routes/ChatRoutes");
const profilerouter = require("./Routes/profileroute.js");
const msgRouter = require("./Routes/MessageRoutes");
const trainRoute = require("./Routes/TrainRoute");
const notifyroutes = require("./Routes/notifyroutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan"); // For logging
const helmet = require("helmet"); // For security
const createError = require("./utils/createError"); // Ensure this is imported

const app = express();

// Middleware for logging HTTP requests
app.use(morgan("combined"));

// Middleware for securing HTTP headers
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Existing routes
app.use(petRouter);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/api/vets", vetRouter);
app.use("/form", AdoptFormRoute);
app.use("/admin", AdminRoute);
app.use("/train", trainRoute);
app.use("/wishlist", wishlistRouter);
app.use("/profile", profilerouter);
app.use("/chats", communicationRouter);
app.use("/messages", msgRouter);
app.use("/notifications", notifyroutes);
// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
  });

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
  next(createError(404, `Cannot find ${req.originalUrl} on this server!`));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // If the error has a status, use it; otherwise, default to 500
  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});

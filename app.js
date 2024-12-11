require("dotenv").config(); // Load environment variables
require("./startup/db.js")(); // Connect to MongoDB
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./startup/logger"); // Logger utility
const errorHandler = require("./startup/errorHandler.js"); // Custom error handler

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse cookies

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : "*"; // Default to '*' if not set

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        allowedOrigins === "*" ||
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Initialize all API routes
require("./startup/routes.js")(app);

// Fallback route for undefined APIs
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Custom error handler for all other errors
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

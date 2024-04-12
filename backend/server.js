const cors = require("cors");
const express = require("express");
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Load the module dependencies
const configureExpress = require("./config/express");

// Create a new Express application instance
const app = configureExpress();

// Use middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Use the Express application instance to listen to the '5000' port
app.listen(5000);

// Log the server status to the console
console.log("Server running at http://localhost:5000/");

/**
 * Express application setup
 * Main app initialization with middleware and route mounting
 */

const express = require("express");
const config = require("./config");
const healthRoutes = require("./routes/health.routes");

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // JSON parsing middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded parsing middleware

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mount routes
app.use("/", healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;

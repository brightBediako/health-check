const express = require("express");
const healthRoutes = require("./routes/health.routes");

const app = express();

// Basic middleware
app.use(express.json());

// Mount health routes
app.use("/", healthRoutes);

// Error handling
app.use((err, req, res, _next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;

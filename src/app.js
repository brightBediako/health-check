const express = require("express");
const path = require("path");
const healthRoutes = require("./routes/health.routes");

const app = express();

// Basic middleware
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Mount health routes
app.use("/", healthRoutes);

// Serve frontend dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/index.html"));
});

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

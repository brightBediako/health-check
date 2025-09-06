/**
 * HTTP server startup
 * Imports app and starts listening using config port
 */

const app = require("./app");
const config = require("./config");

// Start the server
const server = app.listen(config.port, () => {
  console.log(`Health check service is running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Health endpoint: http://localhost:${config.port}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = server;

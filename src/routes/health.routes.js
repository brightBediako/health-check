const express = require("express");
const service1 = require("../services/service1");
const service2 = require("../services/service2");
const service3 = require("../services/service3");

const router = express.Router();

// GET /api/health - API endpoint for frontend
router.get("/api/health", async (req, res) => {
  try {
    // Call all three service checks in parallel
    const [service1Result, service2Result, service3Result] = await Promise.all([
      service1.check(),
      service2.check(),
      service3.check(),
    ]);

    // Determine overall health status
    const allHealthy =
      service1Result.status === "healthy" &&
      service2Result.status === "healthy" &&
      service3Result.status === "healthy";

    // Aggregate results
    const healthStatus = {
      overall: allHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        service1: service1Result,
        service2: service2Result,
        service3: service3Result,
      },
    };

    // Always return 200 for API endpoint (let frontend handle status)
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      overall: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    });
  }
});

// GET /health - Health check endpoint (for external monitoring)
router.get("/health", async (req, res) => {
  try {
    // Call all three service checks in parallel
    const [service1Result, service2Result, service3Result] = await Promise.all([
      service1.check(),
      service2.check(),
      service3.check(),
    ]);

    // Determine overall health status
    const allHealthy =
      service1Result.status === "healthy" &&
      service2Result.status === "healthy" &&
      service3Result.status === "healthy";

    // Aggregate results
    const healthStatus = {
      overall: allHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        service1: service1Result,
        service2: service2Result,
        service3: service3Result,
      },
    };

    // Return appropriate HTTP status code
    const httpStatus = healthStatus.overall === "healthy" ? 200 : 503;
    res.status(httpStatus).json(healthStatus);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      overall: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    });
  }
});

module.exports = router;

const config = {
  port: process.env.PORT || 3000,
  service1Url: process.env.SERVICE_1_URL || "http://localhost:3001/health",
  service2Url: process.env.SERVICE_2_URL || "http://localhost:3002/health",
  service3Url: process.env.SERVICE_3_URL || "http://localhost:3003/health",
  healthTimeoutMs: parseInt(process.env.HEALTH_TIMEOUT_MS) || 5000,
};

module.exports = config;

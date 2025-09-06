const axios = require("axios");
const config = require("../config");

async function check() {
  const startTime = Date.now();

  try {
    const response = await axios.get(config.service1Url, {
      timeout: config.healthTimeoutMs,
    });

    const latencyMs = Date.now() - startTime;

    return {
      name: "service1",
      status: "healthy",
      latencyMs: latencyMs,
      message: `HTTP ${response.status}`,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const message = error.message.includes("timeout")
      ? "timeout"
      : error.code === "ECONNREFUSED"
        ? "connection refused"
        : error.message;

    return {
      name: "service1",
      status: "unhealthy",
      latencyMs: latencyMs,
      message: message,
    };
  }
}

module.exports = { check };

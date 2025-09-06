const axios = require("axios");
const config = require("../config");

async function check() {
  const startTime = Date.now();

  try {
    const response = await axios.get(config.service3Url, {
      timeout: config.healthTimeoutMs,
    });

    const latencyMs = Date.now() - startTime;

    return {
      name: "service3",
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
      name: "service3",
      status: "unhealthy",
      latencyMs: latencyMs,
      message: message,
    };
  }
}

module.exports = { check };

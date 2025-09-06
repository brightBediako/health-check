/**
 * Service 2 health check
 * Monitors Service 2 endpoint
 */

/**
 * Check the health of Service 2
 * @returns {Promise<Object>} Health check result
 */
async function check() {
  // Stub implementation - always returns healthy
  return {
    status: "healthy",
    latencyMs: 0,
  };
}

module.exports = {
  check,
};

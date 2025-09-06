/**
 * Service 1 health check
 * Monitors Service 1 endpoint
 */

/**
 * Check the health of Service 1
 * @returns {Promise<Object>} Health check result
 */
async function check() {
  // Stub implementation - always returns healthy
  return {
    status: 'healthy',
    latencyMs: 0
  };
}

module.exports = {
  check
};

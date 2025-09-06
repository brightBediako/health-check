/**
 * Service 3 health check
 * Monitors Service 3 endpoint
 */

/**
 * Check the health of Service 3
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

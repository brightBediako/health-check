/**
 * Health check utilities
 * Common functions for timeout handling and result formatting
 */

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} Promise that rejects if timeout is exceeded
 */
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(timeoutId);
      });
  });
}

/**
 * Formats a health check result
 * @param {string} name - Service name
 * @param {boolean} ok - Whether the check passed
 * @param {number} latency - Response latency in milliseconds
 * @param {string} details - Additional details about the result
 * @returns {Object} Formatted result object
 */
function formatResult(name, ok, latency, details) {
  return {
    name,
    status: ok ? 'healthy' : 'unhealthy',
    latencyMs: latency || null,
    message: details || (ok ? 'OK' : 'Check failed')
  };
}

module.exports = {
  withTimeout,
  formatResult
};

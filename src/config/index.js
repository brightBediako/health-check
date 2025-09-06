/**
 * Configuration module for health check service
 * Reads configuration from environment variables with sensible defaults
 */

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  
  // Service URLs to monitor
  service1Url: process.env.SERVICE_1_URL || 'http://localhost:3001/health',
  serviceBUrl: process.env.SERVICE_2_URL || 'http://localhost:3002/health',
  service3Url: process.env.SERVICE_3_URL || 'http://localhost:3003/health',
  
  // Health check configuration
  healthTimeoutMs: parseInt(process.env.HEALTH_TIMEOUT_MS) || 5000,
  healthCacheTtl: parseInt(process.env.HEALTH_CACHE_TTL) || 30,
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;

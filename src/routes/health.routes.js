/**
 * Health check routes
 * Defines the /health endpoint for service monitoring
 */

const express = require('express');
const router = express.Router();

// GET /health - Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ overall: 'unknown' });
});

module.exports = router;

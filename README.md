# Health Check Service

A simple health check service that monitors 3 endpoints and exposes metrics via `/health`.

## Quick Start

This service monitors three internal endpoints and provides aggregated health metrics through a single `/health` endpoint.

## Commands

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm test` - Run the test suite

## Environment Variables

Configure the service using the following environment variables:

- `PORT` - Server port (default: 3000)
- `SERVICE_A_URL` - URL for Service A health check
- `SERVICE_B_URL` - URL for Service B health check  
- `SERVICE_C_URL` - URL for Service C health check
- `HEALTH_TIMEOUT_MS` - Timeout for health checks in milliseconds
- `HEALTH_CACHE_TTL` - Cache TTL for health results in seconds

## Architecture

This service follows the MVC (Model-View-Controller) pattern:

- **Models**: Service health check modules in `src/services/`
- **Views**: JSON response formatting in `src/routes/`
- **Controllers**: Health check orchestration in `src/routes/health.routes.js`

## API Endpoints

### GET /health

Returns the overall health status and individual service statuses.

**Response Format:**
```json
{
  "overall": "healthy|unhealthy",
  "timestamp": "2025-09-05T20:00:00Z",
  "services": {
    "serviceA": { "status": "healthy", "latencyMs": 50 },
    "serviceB": { "status": "unhealthy", "latencyMs": null, "message": "timeout" },
    "serviceC": { "status": "healthy", "latencyMs": 40 }
  }
}
```

**HTTP Status Codes:**
- `200 OK` - All services are healthy
- `503 Service Unavailable` - One or more services are unhealthy

# Health Check Service

A simple health check service that monitors 3 endpoints and exposes metrics via `/health`.

## Features

- ✅ **Simple Health Monitoring**: Monitors 3 configurable endpoints
- ✅ **Parallel Health Checks**: Concurrent execution of all service checks
- ✅ **Timeout Handling**: Configurable timeouts for each health check
- ✅ **Basic Testing**: Essential tests to verify functionality
- ✅ **Graceful Shutdown**: Proper cleanup on SIGINT signals

## Quick Start

### Prerequisites

- Node.js 14+
- npm 6+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd health-check

# Install dependencies
npm install

# Start the server
npm start
```

The service will start on `http://localhost:3000` by default.

## Commands

| Command     | Description                 |
| ----------- | --------------------------- |
| `npm start` | Start the production server |
| `npm test`  | Run the test suite          |

## Configuration

Configure the service using environment variables:

| Variable            | Default                        | Description                              |
| ------------------- | ------------------------------ | ---------------------------------------- |
| `PORT`              | `3000`                         | Server port                              |
| `SERVICE_1_URL`     | `http://localhost:3001/health` | First service health endpoint            |
| `SERVICE_2_URL`     | `http://localhost:3002/health` | Second service health endpoint           |
| `SERVICE_3_URL`     | `http://localhost:3003/health` | Third service health endpoint            |
| `HEALTH_TIMEOUT_MS` | `5000`                         | Timeout for health checks (milliseconds) |

## API Documentation

### GET /health

Returns aggregated health status for all monitored services.

**Request:**

```http
GET /health
```

**Response Format:**

```json
{
  "overall": "healthy|unhealthy",
  "timestamp": "2025-09-06T10:53:25.274Z",
  "services": {
    "service1": {
      "name": "service1",
      "status": "healthy|unhealthy",
      "latencyMs": 150,
      "message": "HTTP 200|timeout|connection refused|..."
    },
    "service2": { ... },
    "service3": { ... }
  }
}
```

**HTTP Status Codes:**

- `200 OK` - All services are healthy
- `503 Service Unavailable` - One or more services are unhealthy
- `500 Internal Server Error` - Health check system error

## Testing

```bash
# Run all tests
npm test
```

**Test Coverage:**

- ✅ **Integration Tests**: 3 tests covering the `/health` endpoint
- ✅ **Mocking**: Proper HTTP client mocking for reliable tests
- ✅ **Error Scenarios**: Timeout and error handling

## File Structure

```
health-check/
├── src/                    # Source code
│   ├── config/            # Configuration
│   ├── services/          # Service health checks
│   ├── routes/            # API routes
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
├── test/                  # Test files
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## License

MIT License - see LICENSE file for details.

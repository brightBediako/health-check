# Health Check Service Architecture

This document describes the architecture of a simple Node.js + Express.js health check service.  
The service monitors three internal endpoints and exposes aggregated health metrics via `/health`.

---

## 1. File and Folder Structure

```
health-check-service/
│
├── src/
│   ├── app.js                # Main Express app initialization
│   ├── routes/
│   │   └── health.routes.js  # Defines the /health endpoint
│   ├── services/
│   │   ├── service-1.js       # Health check logic for Service 1
│   │   ├── service-2.js       # Health check logic for Service 2
│   │   └── service-3.js       # Health check logic for Service 3
│   ├── utils/
│   │   └── healthCheck.js    # Common health check utilities (ping, timeouts, response shaping)
│   └── config/
│       └── index.js          # Central configuration (ports, service URLs, timeouts)
│
├── test/
│   └── health.test.js        # Unit/integration tests for health endpoint
│
├── package.json
├── README.md
└── architecture.md           # This document
```

---

## 2. Components and Responsibilities

### **`src/app.js`**
- Bootstraps the Express server.  
- Registers middleware (JSON parsing, logging, etc).  
- Mounts the `/health` route.  
- Starts listening on the configured port.

### **`src/routes/health.routes.js`**
- Defines the `/health` endpoint.  
- Calls each service health check in parallel.  
- Aggregates results into a single JSON response:
  - `overall` status (healthy/unhealthy).  
  - Per-service statuses.  
  - Optional metadata (timestamp, latency).  

### **`src/services/service-1.js`, `service-2.js`, `service-3.js`**
- Each file contains a function that checks the health of one service.  
- Example checks:
  - Make an HTTP request to a service URL.  
  - Validate expected response code.  
  - Return structured result with status and message.  

### **`src/utils/healthCheck.js`**
- Utility functions used across services.  
- Handles timeouts, error handling, and standardized result formatting.  
- Ensures consistent contract for all checks.

### **`src/config/index.js`**
- Stores all configuration in one place:
  - Service URLs (endpoints being monitored).  
  - Health check timeout values.  
  - Application port.  
- Uses environment variables for flexibility in deployment.

### **`test/health.test.js`**
- Contains tests for the `/health` endpoint.  
- Mocks service responses (healthy/unhealthy).  
- Verifies correct aggregation and HTTP status codes.

---

## 3. State Management

- The service is **stateless**.  
- It does not persist health results in memory or in a database.  
- Each request to `/health` performs checks in real-time and responds with current results.  
- This ensures freshness of health data and allows horizontal scaling with no shared state.

---

## 4. Service Connectivity

- Each service check uses an **HTTP request** to its target endpoint.  
- Connections are lightweight and short-lived, with strict timeouts to prevent hanging requests.  
- If a service does not respond within the configured timeout, it is marked **unhealthy**.  
- All services connect independently, so one slow service does not block others.

---

## 5. Example Flow

1. Client (or monitoring tool) sends `GET /health`.  
2. The route handler calls `service-1.check()`, `service-2.check()`, `service-3.check()` in parallel.  
3. Each service function performs an HTTP request with timeout.  
4. Results are aggregated into a JSON response:  
   ```json
   {
     "overall": "unhealthy",
     "timestamp": "2025-09-05T20:00:00Z",
     "services": {
       "service-1": { "status": "healthy", "latency": 50 },
       "service-2": { "status": "unhealthy", "latency": null, "message": "timeout" },
       "service-3": { "status": "healthy", "latency": 40 }
     }
   }
   ```
5. The response is returned with `200 OK` if all services are healthy, or `503 Service Unavailable` if any critical service is unhealthy.

---

# Task List, health-check-service

This file contains a granular, step-by-step task list to build the health-check-service project.
Each task is single-concern, testable, and has a clear start and end state.
Assign one task at a time to an engineering LLM, complete it, then run the stated tests before moving on.

---

## Format for each task
- ID: Unique short id.
- Title: One line summary.
- Start: What must exist before starting.
- End: Clear acceptance criteria for completion.
- Test: Concrete steps to verify the task is done.

---

### Setup and repository
#### ID: T001
Title: Initialize git repository, create package.json
Start: Empty project folder, no .git
End: `.git` exists, `package.json` exists with `name` set to "health-check-service"
Test: Run `git status` confirms repository, run `cat package.json` to confirm name field.

#### ID: T002
Title: Add .gitignore
Start: Repository initialized
End: `.gitignore` present with node_modules, .env, and dist entries
Test: `git status` shows .gitignore tracked, file content contains node_modules

#### ID: T003
Title: Create folder structure
Start: Repository exists
End: Directories created: src/, src/routes/, src/services/, src/utils/, src/config/, test/
Test: `ls` shows the directories

#### ID: T004
Title: Add README.md skeleton
Start: Repo and folders exist
End: README.md created with project name, quick start stub, and commands section
Test: `cat README.md` shows those sections

#### ID: T005
Title: Add basic npm scripts
Start: package.json exists
End: package.json contains scripts `start`, `dev`, `test`
Test: `jq .scripts package.json` or inspect file to confirm scripts present

#### ID: T006
Title: Add development dependencies for testing and linting
Start: package.json present
End: devDependencies include `jest`, `supertest`, and `eslint`
Test: `npm ls --depth=0` shows jest, supertest, eslint installed

#### ID: T007
Title: Add .env.example
Start: Project root prepared
End: `.env.example` contains placeholders: PORT, SERVICE_1_URL, SERVICE_2_URL, SERVICE_3_URL, HEALTH_TIMEOUT_MS, HEALTH_CACHE_TTL
Test: `cat .env.example` shows those keys

---

### Configuration and bootstrapping
#### ID: T010
Title: Create src/config/index.js stub
Start: src/config directory exists
End: File `src/config/index.js` exists, exports default config object reading from env with sensible defaults
Test: Import the module in node REPL and check exported keys

#### ID: T011
Title: Create src/app.js stub that exports Express app
Start: src/ directory exists
End: `src/app.js` exports an Express app instance, with JSON parsing middleware registered
Test: `node -e "require('./src/app').name || true"` does not throw error

#### ID: T012
Title: Create src/server.js to start the HTTP server
Start: src/app.js exists
End: `src/server.js` imports app and starts listening using config port, logs when ready
Test: Run `node src/server.js` and confirm server listens on configured port

#### ID: T013
Title: Create src/routes/health.routes.js stub
Start: routes folder exists
End: File exists and exports an Express Router with a GET /health handler that returns 200 and a minimal JSON body `{ "overall": "unknown" }`
Test: Import router into app and curl /health to receive the JSON

#### ID: T014
Title: Create service stubs in src/services/
Start: services directory exists
End: Files `service-1.js`, `service-2.js`, `service-3.js` exist, each exports an async `check()` function returning `{ status: "healthy", latencyMs: 0 }`
Test: Require each module and call `check()` in node REPL, assert returned object shape

#### ID: T015
Title: Create src/utils/healthCheck.js utility stub
Start: utils folder exists
End: File exists exporting two functions, `withTimeout(promise, ms)` and `formatResult(name, ok, latency, details)`
Test: Unit test calls `withTimeout` with a delayed promise to ensure timeout rejects

---

### Dependency installation tasks
#### ID: T020
Title: Add `express` dependency
Start: package.json present
End: `express` is added to dependencies
Test: `node -e "require('express')"` does not throw error

#### ID: T021
Title: Add HTTP client dependency `axios` or `node-fetch`
Start: package.json present
End: chosen HTTP client is installed
Test: `node -e "require('axios')"` or corresponding check succeeds

#### ID: T022
Title: Add `prom-client` for metrics collection
Start: package.json present
End: `prom-client` installed as dependency
Test: `node -e "require('prom-client')"` succeeds

---

### Implement health check logic
#### ID: T030
Title: Implement config usage in code
Start: config/index.js stub exists
End: App reads SERVICE_1_URL, SERVICE_2_URL, SERVICE_3_URL, HEALTH_TIMEOUT_MS from env via config module
Test: Start server with environment variables set, read logs or dump config values

#### ID: T031
Title: Implement timeout wrapper in utils
Start: withTimeout stub exists
End: `withTimeout` enforces a timeout and rejects with a clear error when exceeded
Test: Unit test verifies promise rejects with timeout error when delayed beyond timeout value

#### ID: T032
Title: Implement per-service HTTP check in service modules
Start: service stubs exist and axios installed
End: Each service module performs a GET to configured URL, measures latency, returns `{ status: "healthy"|"unhealthy", latencyMs, message? }`
Test: Mock target endpoints, call `check()` and assert returned status and latency fields are present

#### ID: T033
Title: Implement check timeouts per service
Start: service HTTP checks exist
End: Each check uses `withTimeout` and returns unhealthy on timeout
Test: Point service URL to a very slow responder, call `check()` and confirm returned status is unhealthy and message indicates timeout

#### ID: T034
Title: Implement parallel aggregator in health route
Start: route stub exists, service checks implemented
End: `/health` calls all three checks concurrently, aggregates results into structure `{ overall, timestamp, services: { service-1: {...}, ... } }`
Test: Hit `/health` and validate JSON contains all three services and an overall field

#### ID: T035
Title: Implement overall evaluation and HTTP status mapping
Start: aggregator implemented
End: `/health` returns 200 when all are healthy, 503 when any service is unhealthy, body includes per-service detail
Test: Simulate one service unhealthy, curl `/health` and assert HTTP 503 and body shows service status

#### ID: T036
Title: Add latency and timestamp fields to response
Start: aggregator returns service entries
End: Each service entry includes `latencyMs`, and root contains ISO `timestamp`
Test: Curl `/health` and validate presence and format of fields

#### ID: T037
Title: Add brief human-readable messages for failed checks
Start: Aggregator returns service result objects
End: For unhealthy services include `message` explaining cause, for example "timeout", "connection refused", or HTTP status
Test: Simulate failure scenarios, assert message values are descriptive and present

---

### Caching and performance
#### ID: T040
Title: Add optional in-memory cache with TTL for aggregated results
Start: Aggregator implemented and responding correctly
End: When cache TTL set and a request occurs within TTL, aggregated checks are served from cache, otherwise checks run fresh
Test: Set TTL to 10 seconds, record timestamp from response, call `/health` again within 10 seconds and assert timestamp unchanged. Call after TTL and assert timestamp updated

#### ID: T041
Title: Add concurrency limit for outgoing checks
Start: Checks run in parallel with no limit
End: Implement a simple concurrency queue or semaphore limiting concurrent outgoing HTTP checks to a configured value
Test: Configure concurrency to 1, start three slow endpoints, call `/health` and verify checks run sequentially by measuring timestamps or side effects

---

### Testing
#### ID: T050
Title: Add unit tests for utils functions
Start: utils functions implemented
End: Jest tests cover `withTimeout` and `formatResult` with success and timeout cases
Test: `npm test` passes for these unit tests

#### ID: T051
Title: Add unit tests for service modules
Start: service modules implemented
End: Tests mock HTTP client and validate healthy and unhealthy responses, and latency field presence
Test: `npm test` passes for service tests

#### ID: T052
Title: Add integration test for /health route
Start: Route and service modules implemented
End: Integration test spins up app with mocked service endpoints, asserts HTTP 200 and 503 behaviors and response shape
Test: `npm test` integration suite passes

#### ID: T053
Title: Add test for cache behavior
Start: Cache implemented
End: Test validates TTL behavior described in T040
Test: `npm test` cache test passes

---

### Observability and monitoring
#### ID: T060
Title: Add Prometheus metrics endpoint `/metrics`
Start: prom-client installed
End: Endpoint `/metrics` exposes `process_up`, `health_overall` and per-service gauges or labels
Test: Curl `/metrics` and confirm prometheus text exposition format and presence of expected metrics

#### ID: T061
Title: Add structured request logging
Start: app listens and routes respond
End: Each incoming request is logged with timestamp, method, path, and response status, in JSON format
Test: Call `/health` and confirm log line emitted with fields method, path, status

#### ID: T062
Title: Add basic OpenTelemetry trace spans around checks
Start: app and checks implemented
End: Instrumentation creates spans for each service check and exports to console exporter or configured OTLP endpoint
Test: Run app and call `/health`, confirm trace spans appear in configured exporter or console

---

### Security and access control
#### ID: T070
Title: Add optional access token middleware for `/health`
Start: App routing exists
End: Middleware reads `HEALTH_TOKEN` from config, if set requires `Authorization: Bearer <token>` for `/health`, otherwise endpoint remains public
Test: Set HEALTH_TOKEN, curl without header gets 401, curl with header gets 200 or 503 depending on service state

#### ID: T071
Title: Add IP allowlist option for `/health`
Start: Security middleware implemented
End: If `HEALTH_ALLOWLIST` set, requests from other IPs receive 403
Test: Set allowlist to local IP, simulate request from another IP and confirm 403

---

### Containerization and deployment
#### ID: T080
Title: Create Dockerfile for the service
Start: Project compiles locally, `npm start` starts server
End: Dockerfile builds a small production image that runs the app using NODE_ENV=production
Test: Build image locally `docker build -t health-check-service .` and run it, curl `/health` inside container

#### ID: T081
Title: Add .dockerignore
Start: Dockerfile present
End: `.dockerignore` excludes node_modules, .git, and local dev files
Test: `docker build` context size is reduced compared to including node_modules

#### ID: T082
Title: Add Kubernetes manifest examples for liveness and readiness probes
Start: Docker image exists
End: YAML files show Deployment with readinessProbe calling `/health` and livenessProbe using `/health` or a dedicated liveness endpoint
Test: `kubectl apply -f` in a cluster deploys without syntax errors

---

### CI and automation
#### ID: T090
Title: Add GitHub Actions workflow to run tests and lint on push
Start: Repo on GitHub or local action file
End: `.github/workflows/ci.yml` exists, runs `npm ci`, `npm test`, and `npm run lint`
Test: Push branch and confirm workflow runs, or run act locally

#### ID: T091
Title: Add release tag step documentation
Start: CI defined
End: README contains release steps for tagging and publishing a Docker image
Test: Follow steps in README to create a tag locally and confirm commands succeed

---

### Documentation and final checks
#### ID: T100
Title: Finalize README with run, test, build and deploy instructions
Start: README skeleton exists
End: README contains commands to run in dev, run tests, build Docker image, and sample environment variables
Test: Follow README steps to run server locally and pass tests

#### ID: T101
Title: Perform end-to-end smoke test locally
Start: App is implemented, Docker image builds
End: Run app, point service URLs to mock endpoints, call `/health`, assert expected behavior for healthy and unhealthy scenarios
Test: Manual smoke test passes, document steps taken and outcomes in README

#### ID: T102
Title: Create initial project tag, push to remote
Start: Repo has all critical files, tests pass
End: Create annotated git tag `v0.1.0` and push tag to origin
Test: `git tag -l` shows `v0.1.0`, remote contains tag

---

End of task list.
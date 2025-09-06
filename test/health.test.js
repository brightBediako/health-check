const request = require("supertest");
const app = require("../src/app");

// Mock service modules
jest.mock("../src/services/service1");
jest.mock("../src/services/service2");
jest.mock("../src/services/service3");

const service1 = require("../src/services/service1");
const service2 = require("../src/services/service2");
const service3 = require("../src/services/service3");

describe("Health Check Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /health", () => {
    test("should return 200 when all services are healthy", async () => {
      // Mock all services as healthy
      service1.check.mockResolvedValue({
        name: "service1",
        status: "healthy",
        latencyMs: 100,
        message: "HTTP 200",
      });
      service2.check.mockResolvedValue({
        name: "service2",
        status: "healthy",
        latencyMs: 150,
        message: "HTTP 200",
      });
      service3.check.mockResolvedValue({
        name: "service3",
        status: "healthy",
        latencyMs: 200,
        message: "HTTP 200",
      });

      const response = await request(app).get("/health").expect(200);

      expect(response.body).toMatchObject({
        overall: "healthy",
        timestamp: expect.any(String),
        services: {
          service1: {
            name: "service1",
            status: "healthy",
            latencyMs: 100,
            message: "HTTP 200",
          },
          service2: {
            name: "service2",
            status: "healthy",
            latencyMs: 150,
            message: "HTTP 200",
          },
          service3: {
            name: "service3",
            status: "healthy",
            latencyMs: 200,
            message: "HTTP 200",
          },
        },
      });
    });

    test("should return 503 when any service is unhealthy", async () => {
      // Mock service1 as unhealthy, others healthy
      service1.check.mockResolvedValue({
        name: "service1",
        status: "unhealthy",
        latencyMs: null,
        message: "Connection refused",
      });
      service2.check.mockResolvedValue({
        name: "service2",
        status: "healthy",
        latencyMs: 120,
        message: "HTTP 200",
      });
      service3.check.mockResolvedValue({
        name: "service3",
        status: "healthy",
        latencyMs: 180,
        message: "HTTP 200",
      });

      const response = await request(app).get("/health").expect(503);

      expect(response.body).toMatchObject({
        overall: "unhealthy",
        timestamp: expect.any(String),
        services: {
          service1: {
            name: "service1",
            status: "unhealthy",
            latencyMs: null,
            message: "Connection refused",
          },
          service2: {
            name: "service2",
            status: "healthy",
            latencyMs: 120,
            message: "HTTP 200",
          },
          service3: {
            name: "service3",
            status: "healthy",
            latencyMs: 180,
            message: "HTTP 200",
          },
        },
      });
    });

    test("should handle service check errors gracefully", async () => {
      // Mock service1 to throw an error
      service1.check.mockRejectedValue(new Error("Service check failed"));
      service2.check.mockResolvedValue({
        name: "service2",
        status: "healthy",
        latencyMs: 100,
        message: "HTTP 200",
      });
      service3.check.mockResolvedValue({
        name: "service3",
        status: "healthy",
        latencyMs: 150,
        message: "HTTP 200",
      });

      const response = await request(app).get("/health").expect(500);

      expect(response.body).toMatchObject({
        overall: "unhealthy",
        timestamp: expect.any(String),
        error: "Health check failed",
      });
    });
  });
});

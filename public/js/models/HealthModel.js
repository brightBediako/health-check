const createHealthState = () => ({
  healthData: null,
  lastUpdated: null,
});

const fetchHealthData = async () => {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      data,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error fetching health data:", error);
    throw error;
  }
};

const updateHealthState = (state, { data, timestamp }) => ({
  ...state,
  healthData: data,
  lastUpdated: timestamp,
});

const getHealthData = (state) => state.healthData;

const getLastUpdated = (state) => state.lastUpdated;

const getOverallStatus = (state) => {
  if (!state.healthData) {
    return {
      status: "unknown",
      message: "No data available",
      indicator: "⏳",
    };
  }

  const { overall, services } = state.healthData;

  if (overall === "healthy") {
    return {
      status: "healthy",
      message: "All services are running normally",
      indicator: "✅",
    };
  }

  if (overall === "unhealthy") {
    const unhealthyCount = Object.values(services).filter(
      (service) => service.status === "unhealthy"
    ).length;
    return {
      status: "unhealthy",
      message: `${unhealthyCount} service(s) are experiencing issues`,
      indicator: "❌",
    };
  }

  return {
    status: "unknown",
    message: "Status unknown",
    indicator: "❓",
  };
};

const getServiceStats = (state) => {
  if (!state.healthData?.services) {
    return {
      total: 0,
      healthy: 0,
      unhealthy: 0,
      averageLatency: 0,
    };
  }

  const services = Object.values(state.healthData.services);
  const total = services.length;
  const healthy = services.filter((s) => s.status === "healthy").length;
  const unhealthy = services.filter((s) => s.status === "unhealthy").length;

  const healthyServices = services.filter(
    (s) => s.status === "healthy" && s.latencyMs
  );
  const averageLatency =
    healthyServices.length > 0
      ? Math.round(
          healthyServices.reduce((sum, s) => sum + s.latencyMs, 0) /
            healthyServices.length
        )
      : 0;

  return {
    total,
    healthy,
    unhealthy,
    averageLatency,
  };
};

const createHealthModel = () => {
  let state = createHealthState();

  return {
    async fetchHealthData() {
      const result = await fetchHealthData();
      state = updateHealthState(state, result);
      return result.data;
    },
    getHealthData: () => getHealthData(state),
    getLastUpdated: () => getLastUpdated(state),
    getOverallStatus: () => getOverallStatus(state),
    getServiceStats: () => getServiceStats(state),
  };
};

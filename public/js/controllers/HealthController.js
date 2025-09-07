const getElementById = (id) => document.getElementById(id);

const getElements = () => ({
  refreshBtn: getElementById("refreshBtn"),
  lastUpdated: getElementById("lastUpdated"),
  overallStatus: getElementById("overallStatus"),
  statusIndicator: getElementById("statusIndicator"),
  overallText: getElementById("overallText"),
  overallMessage: getElementById("overallMessage"),
  servicesGrid: getElementById("servicesGrid"),
  loadingIndicator: getElementById("loadingIndicator"),
});

const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const formatLatency = (latency) => (latency !== null ? `${latency}ms` : "N/A");

const createServiceCard = (service) => {
  const latency = formatLatency(service.latencyMs);
  const statusClass = service.status || "unknown";
  const serviceName = capitalizeFirst(service.name);
  const serviceStatus = capitalizeFirst(service.status);

  return `
    <div class="service-card ${statusClass}">
      <div class="service-header">
        <div class="service-name">${serviceName}</div>
        <div class="service-status ${statusClass}">${statusClass}</div>
      </div>
      <div class="service-details">
        <div class="detail-item">
          <div class="detail-label">Status</div>
          <div class="detail-value">${serviceStatus}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Latency</div>
          <div class="detail-value">${latency}</div>
        </div>
      </div>
      ${
        service.message
          ? `<div class="service-message">${service.message}</div>`
          : ""
      }
    </div>
  `;
};

const updateElementText = (element, text) => {
  if (element) element.textContent = text;
};

const updateElementClass = (element, className) => {
  if (element) element.className = className;
};

const toggleElementClass = (element, className, show) => {
  if (element) {
    if (show) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
};

const updateElementHTML = (element, html) => {
  if (element) element.innerHTML = html;
};

const showError = (message) => {
  console.error(message);
  alert(message);
};

const addAnimation = (element, className, duration = 600) => {
  if (element) {
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), duration);
  }
};

const createEventHandler = (handler) => (event) => {
  event.preventDefault();
  handler();
};

const bindEvent = (element, event, handler) => {
  if (element) {
    element.addEventListener(event, createEventHandler(handler));
  }
};
const createHealthController = (model) => {
  const elements = getElements();

  const updateOverallStatus = () => {
    const overallStatus = model.getOverallStatus();

    updateElementText(elements.statusIndicator, overallStatus.indicator);
    updateElementText(
      elements.overallText,
      capitalizeFirst(overallStatus.status)
    );
    updateElementText(elements.overallMessage, overallStatus.message);
    updateElementClass(
      elements.overallStatus,
      `overall-status ${overallStatus.status}`
    );
  };

  const updateServicesGrid = () => {
    const healthData = model.getHealthData();
    if (!healthData?.services) return;

    const services = Object.values(healthData.services);
    const html = services.map(createServiceCard).join("");
    updateElementHTML(elements.servicesGrid, html);
  };

  const updateLastUpdated = () => {
    const lastUpdated = model.getLastUpdated();
    if (lastUpdated) {
      updateElementText(elements.lastUpdated, lastUpdated.toLocaleTimeString());
    }
  };

  const showLoading = (show) => {
    toggleElementClass(elements.loadingIndicator, "show", show);
  };

  const addStatusChangeAnimation = () => {
    addAnimation(elements.overallStatus, "status-change");
  };

  const updateView = (data, error = null) => {
    if (error) {
      showError("Failed to update health data");
      return;
    }

    if (!data) return;

    updateOverallStatus();
    updateServicesGrid();
    updateLastUpdated();
    addStatusChangeAnimation();
  };

  const handleRefresh = async () => {
    showLoading(true);
    try {
      const data = await model.fetchHealthData();
      updateView(data);
    } catch (error) {
      showError("Failed to fetch health data. Please try again.");
    } finally {
      showLoading(false);
    }
  };

  const bindEvents = () => {
    bindEvent(elements.refreshBtn, "click", handleRefresh);
  };

  const init = async () => {
    showLoading(true);
    try {
      await model.fetchHealthData();
      updateView(model.getHealthData());
    } catch (error) {
      showError("Failed to load initial health data");
    } finally {
      showLoading(false);
    }
  };

  return {
    init,
    handleRefresh,
    updateView,
    bindEvents,
  };
};

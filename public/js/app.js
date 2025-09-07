const createAppState = () => ({
  model: null,
  controller: null,
  isInitialized: false,
});

const updateAppState = (state, updates) => ({ ...state, ...updates });

const getLoadingElement = () => document.getElementById("loadingIndicator");

const showLoadingState = () => {
  const loadingElement = getLoadingElement();
  if (loadingElement) {
    loadingElement.classList.add("show");
  }
};

const hideLoadingState = () => {
  const loadingElement = getLoadingElement();
  if (loadingElement) {
    loadingElement.classList.remove("show");
  }
};
const createErrorNotification = (message) => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-notification";
  errorDiv.innerHTML = `
    <div class="error-content">
      <span class="error-icon">⚠️</span>
      <span class="error-message">${message}</span>
      <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
    max-width: 400px;
  `;

  return errorDiv;
};

const showErrorMessage = (message) => {
  const errorDiv = createErrorNotification(message);
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
};

const showFatalError = (message) => {
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #27391c 0%, #1f7d53 100%);
      color: white;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div>
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">⚠️</h1>
        <h2 style="margin-bottom: 1rem;">Application Error</h2>
        <p style="margin-bottom: 2rem; opacity: 0.9;">${message}</p>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #333;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        ">Refresh Page</button>
      </div>
    </div>
  `;
};

const getPageLoadTime = () => {
  if (!performance.timing) return null;
  return performance.timing.loadEventEnd - performance.timing.navigationStart;
};

const getMemoryUsage = () => {
  if (!performance.memory) return null;
  return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
};

const logPerformanceMetrics = () => {
  const loadTime = getPageLoadTime();
  if (loadTime) {
    console.log(`Page load time: ${loadTime}ms`);
  }
};

const logMemoryUsage = () => {
  const memoryUsage = getMemoryUsage();
  if (memoryUsage) {
    console.log(`Memory usage: ${memoryUsage}MB`);
  }
};

const createErrorHandler = (context) => (error) => {
  const errorInfo = Utils.handleError(error, context);
  Utils.storage.set("lastError", errorInfo);
  showErrorMessage("An error occurred. Please try refreshing the page.");
};

const createUnhandledRejectionHandler = () => (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  createErrorHandler("Unhandled Promise Rejection")(event.reason);
};

const createErrorEventHandler = () => (event) => {
  console.error("JavaScript error:", event.error);
  createErrorHandler("JavaScript Error")(event.error);
};
const createHealthCheckApp = () => {
  let state = createAppState();

  const setupErrorHandling = () => {
    window.addEventListener(
      "unhandledrejection",
      createUnhandledRejectionHandler()
    );
    window.addEventListener("error", createErrorEventHandler());
  };

  const setupPerformanceMonitoring = () => {
    window.addEventListener("load", logPerformanceMetrics);

    if (performance.memory) {
      setInterval(logMemoryUsage, 30000);
    }
  };

  const init = async () => {
    try {
      showLoadingState();

      const model = createHealthModel();
      const controller = createHealthController(model);

      state = updateAppState(state, { model, controller });

      await controller.init();
      controller.bindEvents();

      setupErrorHandling();
      setupPerformanceMonitoring();

      state = updateAppState(state, { isInitialized: true });

      console.log("Health Check Dashboard initialized successfully");
    } catch (error) {
      console.error("Application initialization failed:", error);
      showFatalError("Failed to initialize the application");
    } finally {
      hideLoadingState();
    }
  };

  const getStatus = () => ({
    initialized: state.isInitialized,
    model: state.model ? "loaded" : "not loaded",
    controller: state.controller ? "loaded" : "not loaded",
  });

  return {
    init,
    getStatus,
  };
};

const initializeApp = () => {
  try {
    const app = createHealthCheckApp();
    app.init();
    return app;
  } catch (error) {
    console.error("Failed to initialize application:", error);
    showFatalError("Failed to load the application. Please refresh the page.");
  }
};

document.addEventListener("DOMContentLoaded", initializeApp);

window.HealthCheckApp = createHealthCheckApp;

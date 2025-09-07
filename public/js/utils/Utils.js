const formatTimestamp = (date) => (date ? date.toLocaleString() : "Never");

const formatLatency = (latency) => {
  if (latency === null || latency === undefined) return "N/A";
  return latency < 1000 ? `${latency}ms` : `${(latency / 1000).toFixed(2)}s`;
};

const getStatusClass = (status) => {
  const statusMap = {
    healthy: "healthy",
    unhealthy: "unhealthy",
    checking: "checking",
  };
  return statusMap[status?.toLowerCase()] || "unknown";
};

const getStatusEmoji = (status) => {
  const emojiMap = {
    healthy: "✅",
    unhealthy: "❌",
    checking: "⏳",
  };
  return emojiMap[status?.toLowerCase()] || "❓";
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const isInViewport = (element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const animateElement = (element, className, duration = 300) => {
  if (!element) return;
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), duration);
};

const generateId = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

const createStorage = () => ({
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
});

const createUrlUtils = () => ({
  getParams: () => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params);
  },
  setParam: (key, value) => {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url);
  },
  removeParam: (key) => {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, "", url);
  },
});

const handleError = (error, context = "Unknown") => {
  console.error(`Error in ${context}:`, error);
  return {
    message: error.message || "An unknown error occurred",
    context,
    timestamp: new Date().toISOString(),
  };
};

const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const map = (fn) => (array) => array.map(fn);
const filter = (predicate) => (array) => array.filter(predicate);
const reduce = (fn, initial) => (array) => array.reduce(fn, initial);

const pick = (keys) => (obj) =>
  keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});

const omit = (keys) => (obj) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};
const Utils = {
  formatTimestamp,
  formatLatency,
  getStatusClass,
  getStatusEmoji,
  debounce,
  throttle,
  isInViewport,
  animateElement,
  generateId,
  storage: createStorage(),
  url: createUrlUtils(),
  handleError,
  pipe,
  compose,
  curry,
  map,
  filter,
  reduce,
  pick,
  omit,
};

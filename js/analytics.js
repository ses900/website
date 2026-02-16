/* Privacy-conscious analytics helper (cookie-free, no local storage). */
(function attachAnalytics(globalScope) {
  const endpointMeta = document.querySelector('meta[name="analytics-endpoint"]');
  const endpoint = endpointMeta ? endpointMeta.getAttribute("content") : "";

  function toSafeProps(rawProps = {}) {
    const safe = {};
    Object.entries(rawProps).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (["string", "number", "boolean"].includes(typeof value)) {
        safe[key] = value;
      }
    });
    return safe;
  }

  function sendEvent(eventName, rawProps = {}) {
    if (!eventName) return;

    const payload = {
      event: eventName,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      props: toSafeProps(rawProps),
    };

    if (!endpoint) {
      return;
    }

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // best effort only
    });
  }

  function toDemoId(pathname) {
    const demoMatch = pathname.match(/\/demos\/([^/]+)\.html$/);
    return demoMatch ? demoMatch[1] : null;
  }

  function initAnalytics() {
    sendEvent("page_view", { entry_page: window.location.pathname });

    const demoId = toDemoId(window.location.pathname);
    if (demoId) {
      sendEvent("demo_page_open", { demo_id: demoId });
    }

    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-analytics-event]");
      if (!target) return;
      const eventName = target.getAttribute("data-analytics-event");
      const eventLabel = target.getAttribute("data-analytics-label") || "";
      sendEvent(eventName, {
        label: eventLabel,
        destination: target.getAttribute("href") || "",
      });
    });
  }

  const api = {
    trackEvent: sendEvent,
    initAnalytics,
  };

  globalScope.siteAnalytics = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnalytics);
  } else {
    initAnalytics();
  }
})(window);

export const trackEvent = (eventName, props = {}) => {
  if (window.siteAnalytics && typeof window.siteAnalytics.trackEvent === "function") {
    window.siteAnalytics.trackEvent(eventName, props);
  }
};

import client from "prom-client";

// Register all default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Custom Metrics
export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

export const alertsTriggeredTotal = new client.Counter({
  name: "alerts_triggered_total",
  help: "Total number of alerts triggered",
  labelNames: ["symbol", "alert_type"],
});

export const cryptoPriceFetchDuration = new client.Histogram({
  name: "crypto_price_fetch_duration_seconds",
  help: "Duration of cryptocurrency price fetches",
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const mongoConnectionStatus = new client.Gauge({
  name: "mongodb_connection_status",
  help: "MongoDB connection status (1 = connected, 0 = disconnected)",
});

export const redisConnectionStatus = new client.Gauge({
  name: "redis_connection_status",
  help: "Redis connection status (1 = connected, 0 = disconnected)",
});

// Expose metrics for Prometheus to scrape
export const register = client.register;

const express = require("express");
const client = require("prom-client");

const app = express();

// Create a registry
const register = new client.Registry();

// Default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metric: request counter
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

register.registerMetric(httpRequestsTotal);

// Middleware to count requests
app.use((req, res, next) => {
  httpRequestsTotal.inc();
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});
const express = require('express');
const path = require('path');
const client = require('prom-client'); // Prometheus client library
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Collect default Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Default system metrics like CPU, memory, etc.

// Custom HTTP request duration metric
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5] // Define custom buckets
});

// Middleware to measure HTTP request durations
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer(); // Start timer
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.url,
      status_code: res.statusCode
    });
  });
  next();
});

// Expose Prometheus metrics at /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;

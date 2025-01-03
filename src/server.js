// server.js
const express = require('express');
const path = require('path');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const app = express();
const port = 3000;

// OpenTelemetry setup
const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'ecommerce-backend',
    }),
});

const exporter = new OTLPTraceExporter({
    url: 'http://<collector-ip>:4318/v1/traces', // Replace <collector-ip> with your OTEL Collector's IP
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

const tracer = provider.getTracer('ecommerce-backend');

// Middleware to create a span for each request
app.use((req, res, next) => {
    const span = tracer.startSpan(`HTTP ${req.method} ${req.path}`);
    res.on('finish', () => span.end());
    next();
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', (req, res) => {
    const span = tracer.startSpan('Serve index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
    span.end();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


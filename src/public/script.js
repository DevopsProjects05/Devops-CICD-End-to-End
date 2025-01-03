document.addEventListener('DOMContentLoaded', () => {
    console.log("E-Commerce website is ready!");
});


import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Initialize OpenTelemetry Tracer Provider
const provider = new WebTracerProvider();
const exporter = new OTLPTraceExporter({
  url: 'http://13.127.152.35:4318/v1/traces', // Replace with your OpenTelemetry Collector's IP
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

const tracer = provider.getTracer('frontend');

// Trace user interactions
document.getElementById('buy-now').addEventListener('click', () => {
  const span = tracer.startSpan('buy-now-click');
  console.log('Buy Now button clicked!');
  span.end();
});


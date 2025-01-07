document.addEventListener('DOMContentLoaded', function () {
    // Fetch products from the API
    fetch('/api/products')
      .then((response) => response.json())
      .then((products) => {
        const productsContainer = document.querySelector('.products');
  
        // Loop through products and render them
        products.forEach((product) => {
          const productElement = document.createElement('div');
          productElement.classList.add('product');
          productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <button class="add-to-cart">Add to Cart</button>
          `;
          productsContainer.appendChild(productElement);
        });
  
        // Add event listener for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach((button) => {
          button.addEventListener('click', function () {
            alert('Added to cart!');
          });
        });
      })
      .catch((error) => console.error('Error fetching products:', error));
  });
  
  // OpenTelemetry Tracing Example
  import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
  import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
  import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
  
  const provider = new WebTracerProvider();
  const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();
  
  const tracer = provider.getTracer('ecommerce-frontend');
  
  document.getElementById('buy-now').addEventListener('click', () => {
    const span = tracer.startSpan('buy-now-click');
    console.log('Buy Now clicked!');
    span.end();
  });
  
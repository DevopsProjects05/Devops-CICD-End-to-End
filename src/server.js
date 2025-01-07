const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Backend API route to fetch products
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Product 1', price: '$100' },
    { id: 2, name: 'Product 2', price: '$150' },
    { id: 3, name: 'Product 3', price: '$200' },
  ];
  res.json(products);
});

// Catch-all route for frontend (Single Page Application support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

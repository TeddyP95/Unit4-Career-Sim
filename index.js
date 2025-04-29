require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Import route handlers
const { authRouter } = require('./api/auth');
const { productsRouter } = require('./api/products');
const { cartRouter } = require('./api/cart');
const { usersRouter } = require('./api/users');

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/users', usersRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource could not be found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
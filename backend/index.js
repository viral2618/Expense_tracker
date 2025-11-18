const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./Models/db'); // make sure your MongoDB connection works

const AuthRouter = require('./Routes/AuthRouter');
const TransactionRouter = require('./Routes/TransactionRouter');
const UserRouter = require('./Routes/UserRouter');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // parse JSON bodies

// Ping route
app.get('/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
});

// Routes
app.use('/auth', AuthRouter);
app.use('/transactions', TransactionRouter);
app.use('/user', UserRouter);

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

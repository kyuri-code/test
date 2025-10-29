const express = require('express');
const path = require('path');
const config = require('./config/config');
const setupMiddleware = require('./middleware/middleware');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// Setup middleware
setupMiddleware(app);

// API Routes
app.use('/api', todoRoutes);

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(config.PORT, () => {
  console.log(`🚀 ToDo App server running on http://localhost:${config.PORT}`);
  console.log(`📝 Visit http://localhost:${config.PORT} to use the app`);
});
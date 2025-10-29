const cors = require('cors');
const express = require('express');

function setupMiddleware(app) {
  // CORS middleware
  app.use(cors());
  
  // JSON parsing middleware
  app.use(express.json());
  
  // Serve static files from public directory
  app.use(express.static('public'));
}

module.exports = setupMiddleware;
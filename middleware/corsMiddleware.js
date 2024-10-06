const cors = require('cors');

const corsOptions = {
  origin: '*', // Specify the allowed origin (or list of origins)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
};

const corsMiddleware = cors(corsOptions);

// Handling preflight requests for all routes
const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('Received an OPTIONS request');
    return res.sendStatus(200); // Always respond with status 200 for OPTIONS
  }
  next();
};

module.exports = { corsMiddleware, handlePreflight };

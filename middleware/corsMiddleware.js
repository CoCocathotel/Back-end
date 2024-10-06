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
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return res.sendStatus(200); // Always respond with status 200 for OPTIONS
  }
  next();
};

module.exports = { corsMiddleware, handlePreflight };

const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { detectObjects } = require('../objectDetection');
const path = require('path');

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Configure rate limiting for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key') || req.query.api_key;
  
  // Simple API key list - in production, use a database
  const validApiKeys = [
    process.env.API_KEY || 'demo-key-123', // Default test key
    'test-key-456'
  ];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or missing API key'
    });
  }
  
  next();
};

// Apply rate limiting to all API endpoints
router.use(apiLimiter);

// Health check endpoint - no authentication needed
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Object Detection API is running',
    version: '1.1.0'
  });
});

// Object detection endpoint - requires authentication
router.post('/detect', validateApiKey, upload.single('image'), async (req, res) => {
  try {
    console.log('Received detection request');
    
    if (!req.file) {
      console.log('No image file provided');
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    console.log(`Processing image: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Process the uploaded image
    const detectedObjects = await detectObjects(req.file.buffer);
    
    console.log('Detection completed, objects found:', detectedObjects.length);
    
    // Ensure we're sending valid data
    if (!Array.isArray(detectedObjects)) {
      console.error('Invalid detection results (not an array):', detectedObjects);
      return res.status(500).json({
        success: false,
        error: 'Detection returned invalid results'
      });
    }

    // Send response with detected objects
    res.json({
      success: true,
      objects: detectedObjects
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process image',
      details: error.message
    });
  }
});

// Debug endpoint - requires authentication
router.get('/debug', validateApiKey, (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// API documentation endpoint - no authentication needed
router.get('/docs', (req, res) => {
  res.json({
    name: "Object Detection API",
    version: "1.1.0",
    description: "API for detecting objects in images using TensorFlow.js",
    endpoints: [
      {
        path: "/api/health",
        method: "GET",
        description: "Check if the API is running",
        authentication: "None",
        parameters: []
      },
      {
        path: "/api/detect",
        method: "POST",
        description: "Detect objects in an uploaded image",
        authentication: "API Key required",
        parameters: [
          {
            name: "image",
            type: "file",
            required: true,
            description: "The image file to analyze"
          },
          {
            name: "X-API-Key",
            type: "header",
            required: true,
            description: "Your API key"
          }
        ]
      },
      {
        path: "/api/debug",
        method: "GET",
        description: "Get debug information about the API",
        authentication: "API Key required",
        parameters: [
          {
            name: "X-API-Key",
            type: "header",
            required: true,
            description: "Your API key"
          }
        ]
      },
      {
        path: "/api/docs",
        method: "GET",
        description: "Get API documentation",
        authentication: "None",
        parameters: []
      }
    ]
  });
});

module.exports = router;

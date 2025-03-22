const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { detectObjects } = require('./objectDetection');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Route for object detection
app.post('/api/detect', upload.single('image'), async (req, res) => {
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

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Object Detection API is running' });
});

// Debug endpoint to test connectivity
app.get('/api/debug', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// New endpoint to test the API with a sample image
app.get('/api/test-detection', async (req, res) => {
  try {
    const { testDetection } = require('./objectDetection');
    const results = await testDetection();
    
    if (results) {
      res.json({
        success: true,
        message: 'Test detection completed',
        objects: results
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Test image not found',
        message: 'Please place a test-image.jpg file in the root directory'
      });
    }
  } catch (error) {
    console.error('Test detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Test detection failed',
      details: error.message
    });
  }
});

// Serve the HTML page for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser to access the application`);
});

# Object Detection API

This application provides an API for detecting objects in images using TensorFlow.js and the COCO-SSD model.

## Features

- **Dual-mode Operation**: Run detection in the browser or via a Node.js API server
- **Netlify Deployment**: Frontend can be deployed to Netlify (static hosting)
- **80 Object Classes**: Detects common objects like people, animals, vehicles, and everyday items
- **Simple API**: Easy-to-use REST API for integration with other applications
- **Web Interface**: Built-in testing interface for quick verification

## Deployment Options

### Frontend (Browser-based detection)

Deploy to Netlify by following the instructions in [deploy-netlify.md](./deploy-netlify.md).

This version:
- Runs TensorFlow.js directly in the browser
- Works offline once the model is loaded
- Doesn't require a backend server

### Backend API (Server-based detection)

Deploy to a Node.js hosting platform like Render, Heroku, or Digital Ocean:

1. Create an account on your preferred hosting platform
2. Deploy the code from this repository
3. Set up environment variables if necessary
4. Start the server with `npm start`

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Open http://localhost:3000 in your browser to use the web interface.

## API Usage

Send a POST request to `/api/detect` with an image file:

```
curl -X POST -F "image=@/path/to/your/image.jpg" http://localhost:3000/api/detect
```

Response format:
```json
{
  "success": true,
  "objects": [
    {
      "object": "person",
      "confidence": 0.95,
      "boundingBox": [x, y, width, height]
    },
    ...
  ]
}
```

## Object Classes

The COCO-SSD model can detect 80 common object classes including person, bicycle, car, motorcycle, airplane, bus, train, truck, boat, and many more.

## Troubleshooting

- **First Detection is Slow**: The first detection will be slower as the model needs to be loaded into memory.
- **Browser Performance**: Browser-based detection requires a modern browser and may be slower than server-based detection.
- **Memory Issues**: TensorFlow.js requires significant memory, especially in the browser.

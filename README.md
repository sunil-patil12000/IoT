# Object Detection API

This application provides a REST API for detecting objects in images using TensorFlow.js and the COCO-SSD model.

## Features

- **REST API**: Comprehensive endpoints with authentication and rate limiting
- **Object Detection**: Detects 80 common object classes including people, animals, vehicles
- **Dual-mode Operation**: Run detection in the browser or via the API server
- **API Documentation**: Built-in documentation and testing tools

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your settings.

3. Start the server:
   ```
   npm start
   ```

4. Access the application:
   - Web interface: http://localhost:3000
   - API documentation: http://localhost:3000/api/docs
   - API client: http://localhost:3000/api-client.html

## API Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| /api/health | GET | Check API status | None |
| /api/detect | POST | Detect objects in image | API Key |
| /api/debug | GET | Get debug information | API Key |
| /api/docs | GET | API documentation | None |

## API Authentication

The API uses API key authentication. Pass your key in either:
- Request header: `X-API-Key: your-api-key`
- Query parameter: `?api_key=your-api-key`

For testing, you can use the demo key: `demo-key-123`

## Using the API

### Object Detection

```bash
curl -X POST \
  -H "X-API-Key: your-api-key" \
  -F "image=@/path/to/your/image.jpg" \
  http://localhost:3000/api/detect
```

Response:
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

## Deployment Options

### Backend API

Deploy to a Node.js hosting platform:
1. Set up environment variables
2. Deploy the code
3. Use your deployed URL as the API endpoint

### Frontend (Browser-based detection)

Deploy to Netlify following the instructions in [deploy-netlify.md](./deploy-netlify.md).

## Rate Limiting

The API has rate limiting to prevent abuse:
- 100 requests per 15-minute window per IP address
- Configure in the `.env` file

## Support

For issues or feature requests, please open an issue in the repository.

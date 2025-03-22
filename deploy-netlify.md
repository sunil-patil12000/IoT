# Deploying to Netlify

This guide explains how to deploy your Object Detection application to Netlify.

## Step 1: Prepare Your Project

The project has been restructured to work on Netlify. The key changes are:

1. TensorFlow.js now runs in the browser instead of on Node.js
2. Detection can be performed locally in the browser or via a remote API
3. Added a netlify.toml configuration file

## Step 2: Deploy to Netlify

### Option 1: Deploy via the Netlify UI

1. Create a Netlify account at [netlify.com](https://www.netlify.com/)
2. Go to the Netlify dashboard
3. Drag and drop your project's "public" folder onto the Netlify dashboard
4. Wait for deployment to complete
5. Your site is now live!

### Option 2: Deploy with Netlify CLI

1. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Login to your Netlify account:
   ```
   netlify login
   ```

3. Deploy the site:
   ```
   netlify deploy --prod
   ```

4. Follow the prompts and select your "public" directory when asked for the publish directory

## Step 3: Configure Your Backend (Optional)

If you want to use the remote API mode, you'll need to deploy your Node.js backend to a suitable platform:

### Deploying the API Backend to Render

1. Create an account at [render.com](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository or upload your code
4. Set the build command to `npm install`
5. Set the start command to `node server.js`
6. Deploy the service
7. Once deployed, update the API endpoint in the frontend to point to your new backend URL

## Step 4: Update Your Frontend

After deploying the backend, update the default API endpoint in your frontend code:

1. Go to your Netlify site
2. Open the site and go to the Object Detection page
3. Enter your backend URL (e.g., https://your-app.onrender.com/api/detect) in the "Remote API Endpoint" field
4. Toggle to "Remote API Mode" when you want to use the backend

## Tips for Netlify Deployment

1. **Custom Domain**: In your Netlify dashboard, go to Site settings > Domain management to set up a custom domain.

2. **Environmental Variables**: If your app needs environment variables, set them in the Netlify dashboard under Site settings > Build & deploy > Environment.

3. **Continuous Deployment**: Connect your GitHub repository to Netlify for automatic deployments whenever you push changes.

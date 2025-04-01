# Deployment Instructions for Camp Explorer Platform

## Render Deployment Setup

### Server (Backend) Deployment

1. **Create a new Web Service on Render**:
   - Connect your GitHub repository
   - Select the repository containing your camp-explorer-platform code
   - Name: `camp-explorer-api`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Plan: Free

2. **Environment Variables**:
   Set the following environment variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key for JWT token encryption
   - `PORT`: Render will set this automatically, no need to specify

3. **CORS Configuration**:
   - Update the origin URLs in `server/app.js` to match your deployed frontend URL 

### Frontend (Client) Deployment

1. **Create a new Static Site on Render**:
   - Name: `camp-explorer-platform` or `camp-explorer-client`
   - Environment: `Static Site`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`
   - Plan: Free

2. **Environment Variables for Frontend**:
   - `VITE_API_URL`: URL of your deployed backend (e.g., `https://camp-explorer-api.onrender.com/api`)

## Configuration Files

The following files were updated to support deployment:

1. `server/app.js`: Added production mode detection and direct server startup
2. `server/db.js`: Improved MongoDB connection error handling
3. `render.yaml`: Added configuration for Render deployment
4. `server/package.json`: Added build script for Render

## Post-Deployment Verification

After deploying, check the following:

1. Verify the server is running by accessing the root URL (e.g., `https://camp-explorer-api.onrender.com/`)
2. Test API endpoints (e.g., `https://camp-explorer-api.onrender.com/api/test`)
3. Ensure the frontend can connect to the backend by checking for CORS issues in the browser console

## Troubleshooting

If you encounter issues:

1. Check Render logs for any error messages
2. Verify environment variables are correctly set
3. Check that MongoDB Atlas allows connections from Render's IP address
4. Ensure your CORS configuration includes your deployed frontend URL

// Centralized API URL configuration
const isDevelopment = import.meta.env.MODE === 'development';

// Get API prefix from environment variable, default to '/api'
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

// Base URL without prefix
const baseUrl = isDevelopment 
    ? 'http://localhost:5001' 
    : 'https://camp-explorer-server.onrender.com';

// Construct full API URL
export const API_URL = `${baseUrl}${API_PREFIX}`;

// Log the API URL in development for debugging
if (isDevelopment) {
    console.log('API URL:', API_URL);
}

// Ensure consistency between development and production environments
// If you see CORS errors, try uncommenting the line below and comment out the line above
// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Production API URL
export const API_URL_PRODUCTION = 'https://camp-explorer-server.onrender.com/api';

// Development API URL (when using Vite proxy)
// export const API_URL = '/api';
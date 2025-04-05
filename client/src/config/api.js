// Centralized API URL configuration
const isDevelopment = import.meta.env.MODE === 'development';
const defaultApiUrl = isDevelopment ? 'http://localhost:5001/api' : '/api';

export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

// Log the API URL in development for debugging
if (isDevelopment) {
    console.log('API URL:', API_URL);
}

// Ensure consistency between development and production environments
// If you see CORS errors, try uncommenting the line below and comment out the line above
// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';    
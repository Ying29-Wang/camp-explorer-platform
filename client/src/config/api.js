// Centralized API URL configuration
const isDevelopment = import.meta.env.MODE === 'development';
console.log('Environment mode:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

const defaultApiUrl = isDevelopment 
    ? 'http://localhost:5001/api' 
    : import.meta.env.VITE_API_URL || '/api';

export const API_URL = defaultApiUrl;

// Log the final API URL for debugging
console.log('Final API_URL:', API_URL);

// Ensure consistency between development and production environments
// If you see CORS errors, try uncommenting the line below and comment out the line above
// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
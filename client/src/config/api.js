// API configuration
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
    console.log('API URL:', API_URL);
}
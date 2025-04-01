// Centralized API URL configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure consistency between development and production environments
// If you see CORS errors, try uncommenting the line below and comment out the line above
// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
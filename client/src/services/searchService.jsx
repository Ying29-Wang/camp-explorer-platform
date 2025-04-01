// Import API URL configuration
import { API_URL } from '../config/api'; // Base URL including /api path

// When using Vite's proxy, use a relative URL instead
const API_BASE = '/api'; // Using relative URL with Vite proxy
// const API_BASE = API_URL; // Commented out absolute URL

const fetchSearchResults = async () => {
    const response = await fetch(`${API_BASE}/camps`); // Use camps endpoint with the proxy-compatible URL
    if (!response.ok) {
        throw new Error('Failed to fetch search results');
    }
    return response.json();
};

export { fetchSearchResults };
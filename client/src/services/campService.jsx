// Import API URL configuration
import { API_URL } from '../config/api';

// When using Vite's proxy, you can use a relative URL instead
const API_BASE = '/api'; // Using relative URL with Vite proxy
// const API_BASE = API_URL; // Commenting out absolute URL

export const fetchCamps = async () => {
    const response = await fetch(`${API_BASE}/camps`);
    if (!response.ok) {
        throw new Error(`Failed to fetch camps: ${response.status} ${response.statusText}`);
    }
    
    // Handle potential HTML responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Invalid content type. Received: ${contentType || 'none'}`);
    }

    return response.json();
};

export const fetchCampById = async (id) => {
    const response = await fetch(`${API_BASE}/camps/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch camp: ${response.status} ${response.statusText}`);
    }
    
    // Same content-type check as above
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Invalid content type. Received: ${contentType || 'none'}`);
    }

    return response.json();
};

// Create new camp
export const createCamp = async (campData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/camps`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campData),
    });

    if (!response.ok) {
        throw new Error(`Failed to create camp: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// Update existing camp
export const updateCamp = async (id, campData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/camps/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campData),
    });

    if (!response.ok) {
        throw new Error(`Failed to update camp: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// Delete camp
export const deleteCamp = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/camps/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete camp: ${response.status} ${response.statusText}`);
    }

    return true;
};

// Fallback data
const fallbackCamps = [
    { _id: 1, name: "Adventure Camp", /*...*/ },
    // ... other fallback camps
];

export const fetchCampsWithFallback = async () => {
    try {
        return await fetchCamps();
    } catch (error) {
        console.error('Using fallback data:', error);
        return fallbackCamps;
    }
};

export const searchCamps = async (searchParams) => {
    try {
        const response = await fetch(`${API_BASE}/camps/search?${new URLSearchParams(searchParams)}`);
        if (!response.ok) {
            throw new Error(`Failed to search camps: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};

export const searchCampsWithFallback = async (searchParams) => {
    try {
        return await searchCamps(searchParams);
    } catch (error) {
        console.error('Using fallback data for search:', error);
        return fallbackCamps;
    }
};

export const fetchCampsByQuickFilter = async (filters) => {
    try {
        const response = await fetch(`${API_BASE}/camps/search?${new URLSearchParams(filters)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch camps by filter: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Filter search error:', error);
        throw error;
    }
};
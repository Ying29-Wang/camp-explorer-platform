// Import API URL configuration
import { API_URL } from '../config/api';

// When using Vite's proxy, use a relative URL instead
const API_BASE = '/api'; // Using relative URL with Vite proxy
// const API_BASE = API_URL; // Commented out absolute URL

// Log the API base URL for verification
console.log('API Base URL:', API_BASE);

export const fetchCamps = async () => {
    try {
        const fullUrl = `${API_BASE}/camps`;
        console.log('Fetching camps from:', fullUrl);
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch camps: ${response.status} ${response.statusText}`);
        }
        
        // Handle potential HTML responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Invalid content type. Received: ${contentType || 'none'}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching camps:', error);
        throw error;
    }
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

export const fetchCampsByOwner = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE}/camps/owner`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to fetch camps: ${response.status}`);
    }

    return response.json();
};

// Create new camp
export const createCamp = async (campData) => {
    const token = localStorage.getItem('token');
    console.log('Creating camp with data:', campData);
    console.log('Token exists:', !!token);
    
    const response = await fetch(`${API_BASE}/camps`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Error response:', errorData);
        if (errorData.errors) {
            throw new Error(`Validation errors: ${errorData.errors.map(e => e.msg).join(', ')}`);
        }
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
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        console.log('Deleting camp with ID:', id);
        console.log('Using token:', token.substring(0, 10) + '...');
        
        const response = await fetch(`${API_BASE}/camps/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Try to get detailed error message from response
            const errorData = await response.json().catch(() => ({ 
                message: 'Unknown server error' 
            }));
            
            console.error('Delete camp error response:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });

            throw new Error(
                errorData.message || 
                `Failed to delete camp: ${response.status} ${response.statusText}`
            );
        }

        return true;
    } catch (error) {
        console.error('Error in deleteCamp:', error);
        throw error;
    }
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
        const data = await response.json();
        return data.camps || []; // Return the camps array from the response
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

// Function to get coordinates from location
export const getCoordinatesFromLocation = async (location) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                type: 'Point',
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
};
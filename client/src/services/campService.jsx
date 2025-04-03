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
        const text = await response.text();
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
        const text = await response.text();
        throw new Error(`Invalid content type. Received: ${contentType || 'none'}`);
    }

    return response.json();
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
    // Convert searchParams to URL query string
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(`${API_BASE}/camps/search?${queryString}`);
    
    if (!response.ok) {
        throw new Error(`Failed to search camps: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid content type. Received: ${contentType || 'none'}`);
    }

    return response.json();
};

export const searchCampsWithFallback = async (searchParams) => {
    try {
        return await searchCamps(searchParams);
    } catch (error) {
        console.error('Search failed, using fallback data:', error);
        // Filter fallback data based on search params
        let filteredCamps = [...fallbackCamps];
        
        if (searchParams.category) {
            filteredCamps = filteredCamps.filter(camp => 
                camp.category === searchParams.category
            );
        }
        
        if (searchParams.location) {
            filteredCamps = filteredCamps.filter(camp => 
                camp.location.toLowerCase().includes(searchParams.location.toLowerCase())
            );
        }
        
        if (searchParams.minPrice) {
            filteredCamps = filteredCamps.filter(camp => 
                camp.price >= parseFloat(searchParams.minPrice)
            );
        }
        
        if (searchParams.maxPrice) {
            filteredCamps = filteredCamps.filter(camp => 
                camp.price <= parseFloat(searchParams.maxPrice)
            );
        }
        
        return {
            camps: filteredCamps,
            pagination: {
                total: filteredCamps.length,
                page: parseInt(searchParams.page) || 1,
                pages: Math.ceil(filteredCamps.length / (parseInt(searchParams.limit) || 10))
            }
        };
    }
};
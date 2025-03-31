const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchSearchResults = async () => {
    const response = await fetch(`${API_URL}/api/camps`); // Use camps endpoint for now
    if (!response.ok) {
        throw new Error('Failed to fetch search results');
    }
    return response.json();
};

export { fetchSearchResults };
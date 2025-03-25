const API_URL = 'http://localhost:5001/api'; // Backend URL
const fetchSearchResults = async () => {
    // Replace with actual API call
    const response = await fetch('/api/search');
    if (!response.ok) {
        throw new Error('Failed to fetch search results');
    }
    return response.json();
};

export { fetchSearchResults };
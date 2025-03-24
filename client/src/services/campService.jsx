const API_URL = 'http://localhost:5001/api'; // Backend URL

export const fetchCamps = async () => {
    const response = await fetch(`${API_URL}/camps`);
    if (!response.ok) throw new Error('Failed to fetch camps');
    return response.json();
};

export const fetchCampById = async (id) => {
    const response = await fetch(`${API_URL}/camps/${id}`);
    if (!response.ok) throw new Error('Failed to fetch camp');
    return response.json();
};
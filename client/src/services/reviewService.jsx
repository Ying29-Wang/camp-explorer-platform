// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { API_URL } from '../config/api'; // Ensure this is the correct path

export const fetchReviewsByCampId = async (campId) => {
    const response = await fetch(`${API_URL}/reviews/${campId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch reviews');
    }
    return response.json();
};

export const createReview = async (reviewData) => {
    const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
        throw new Error('Failed to create review');
    }
    return response.json();
};
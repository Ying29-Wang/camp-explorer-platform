// Import API URL configuration
import { API_URL } from '../config/api'; // Base URL including /api path

// When using Vite's proxy, use a relative URL instead
const API_BASE = '/api'; // Using relative URL with Vite proxy
// const API_BASE = API_URL; // Commented out absolute URL

export const fetchReviewsByCampId = async (campId) => {
    const response = await fetch(`${API_BASE}/reviews/camp/${campId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch reviews');
    }
    return response.json();
};

export const createReview = async (reviewData) => {
    const response = await fetch(`${API_BASE}/reviews`, {
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

export const fetchUserReviews = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reviews/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user reviews');
    }
    return response.json();
};

export const deleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete review');
    }
    return response.json();
};
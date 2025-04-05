import { API_URL } from '../config/api';

export const fetchReviewsByCampId = async (campId) => {
    const response = await fetch(`${API_URL}/reviews/camp/${campId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
};

export const fetchUserReviews = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch user reviews');
    return response.json();
};

export const createReview = async (reviewData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
};

export const updateReview = async (reviewId, reviewData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
};

export const deleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
}; 
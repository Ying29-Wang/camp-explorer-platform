// Import API URL configuration
import { API_URL } from '../config/api';

// When using Vite's proxy, you can use a relative URL instead
const API_BASE = '/api'; // Using relative URL with Vite proxy
// const API_BASE = API_URL; // Commenting out absolute URL

// Helper function to check if user is admin
const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
};

// Helper function to check if user is accessing their own data
const isSelf = (userId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.id === userId;
};

// Helper function to check authorization
const checkAuthorization = (userId = null) => {
    if (!isAdmin() && (userId && !isSelf(userId))) {
        throw new Error('Access denied: You do not have permission to perform this action');
    }
};

export const fetchUsers = async () => {
    if (!isAdmin()) {
        throw new Error('Access denied: Only administrators can fetch all users');
    }
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.status === 403) {
        throw new Error('Access denied: Only administrators can fetch all users');
    }
    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const fetchUserById = async (id) => {
    checkAuthorization(id);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.status === 403) {
        throw new Error('Access denied: You can only view your own profile or need admin privileges');
    }
    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const createUser = async (userData) => {
    // No authorization check needed as this is a public route
    const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to create user: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const updateUser = async (id, userData) => {
    checkAuthorization(id);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });
    
    if (response.status === 403) {
        throw new Error('Access denied: You can only update your own profile or need admin privileges');
    }
    if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const deleteUser = async (id) => {
    checkAuthorization(id);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.status === 403) {
        throw new Error('Access denied: You can only delete your own account or need admin privileges');
    }
    if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
    }
    return true;
}; 
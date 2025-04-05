import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const validateToken = async (token) => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Token validation failed');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Token validation error:', error);
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (!token || !storedUser) {
                    setIsLoggedIn(false);
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                // Set initial state from stored data
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
                setIsLoading(false);

                // Validate token in the background
                try {
                    const userData = await validateToken(token);
                    // Only update if the validation was successful
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error) {
                    console.error('Background token validation failed:', error);
                    // Only clear auth if the token is actually invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLoggedIn(false);
                    setUser(null);
                    navigate('/login');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                setUser(null);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Login failed');
            }

            const { token } = await response.json();
            localStorage.setItem('token', token);

            const userData = await validateToken(token);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsLoggedIn(true);
            setUser(userData);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Registration failed');
            }

            const { token } = await response.json();
            localStorage.setItem('token', token);

            const newUserData = await validateToken(token);
            localStorage.setItem('user', JSON.stringify(newUserData));
            setIsLoggedIn(true);
            setUser(newUserData);
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 
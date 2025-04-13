import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
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

    const fetchRecentlyViewed = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/recently-viewed`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch recently viewed');
            }
            
            const data = await response.json();
            setRecentlyViewed(data);
        } catch (error) {
            console.error('Error fetching recently viewed:', error);
            setRecentlyViewed([]);
        }
    };

    const addToRecentlyViewed = async (camp) => {
        if (!isLoggedIn || !user) return;
        
        try {
            // Update backend
            await fetch(`${API_URL}/recently-viewed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ campId: camp._id })
            });
            
            // Update local state
            setRecentlyViewed(prev => {
                const existingIndex = prev.findIndex(item => item._id === camp._id);
                return existingIndex >= 0 
                    ? [camp, ...prev.filter(item => item._id !== camp._id)].slice(0, 5)
                    : [camp, ...prev].slice(0, 5);
            });
        } catch (error) {
            console.error('Error updating recently viewed:', error);
        }
    };

    const updateUser = async (userData) => {
        try {
            // Update the user state with the complete user data
            setUser(prevUser => ({
                ...prevUser,
                ...userData
            }));
            // Update localStorage with the complete user data
            localStorage.setItem('user', JSON.stringify({
                ...JSON.parse(localStorage.getItem('user')),
                ...userData
            }));
        } catch (error) {
            console.error('Error updating user:', error);
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
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
                
                // Fetch recently viewed if logged in
                await fetchRecentlyViewed(parsedUser._id);
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
                    setRecentlyViewed([]);
                    navigate('/login');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                setUser(null);
                setRecentlyViewed([]);
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
            
            // Fetch recently viewed after login
            await fetchRecentlyViewed(userData._id);
            
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
        setRecentlyViewed([]);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            user, 
            login, 
            register, 
            logout, 
            isLoading,
            recentlyViewed,
            addToRecentlyViewed,
            updateUser
        }}>
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
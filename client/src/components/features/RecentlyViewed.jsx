import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import './RecentlyViewed.css';

const RecentlyViewed = () => {
    const { isLoggedIn } = useAuth();
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            if (!isLoggedIn) {
                console.log('Not fetching - user not logged in');
                setLoading(false);
                return;
            }
            
            try {
                console.log('Fetching recently viewed camps...');
                const response = await api.get('/recently-viewed');
                console.log('Recently viewed response:', response.data);
                
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Invalid response format');
                }
                
                // Validate and filter out any items with missing camp data
                const validItems = response.data.filter(item => 
                    item && 
                    item.campId && 
                    typeof item.campId === 'object' && 
                    item.campId._id && 
                    item.campId.name
                );
                
                console.log('Valid recently viewed items:', validItems);
                setRecentlyViewed(validItems);
            } catch (err) {
                console.error('Error fetching recently viewed:', err);
                console.error('Error details:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                setError(err.response?.data?.error || 'Failed to load recently viewed camps');
            } finally {
                setLoading(false);
            }
        };

        fetchRecentlyViewed();
    }, [isLoggedIn]);

    if (!isLoggedIn) return null;

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <section className="recently-viewed-section">
            <h2>Recently Viewed Camps</h2>
            {recentlyViewed.length === 0 ? (
                <p>You haven't viewed any camps yet.</p>
            ) : (
                <div className="recently-viewed-grid">
                    {recentlyViewed.map(item => {
                        const camp = item.campId;
                        return (
                            <div key={item._id} className="recently-viewed-card">
                                <Link to={`/camp/${camp._id}`}>
                                    <img 
                                        src={camp.image?.[0] || '/default-camp.jpg'} 
                                        alt={camp.name}
                                        className="recently-viewed-image"
                                    />
                                    <h3>{camp.name}</h3>
                                    <p>{camp.location}</p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default RecentlyViewed;
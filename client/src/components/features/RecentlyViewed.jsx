import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecentlyViewed.css';

const RecentlyViewed = () => {
    const { isLoggedIn } = useAuth();
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            if (!isLoggedIn) return;
            
            try {
                const response = await axios.get('/api/recently-viewed');
                setRecentlyViewed(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load recently viewed camps');
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
        return <div className="error-message">{error}</div>;
    }

    return (
        <section className="recently-viewed-section">
            <h2>Recently Viewed Camps</h2>
            {recentlyViewed.length === 0 ? (
                <p>You haven't viewed any camps yet.</p>
            ) : (
                <div className="recently-viewed-grid">
                    {recentlyViewed.map(item => (
                        <div key={item._id} className="recently-viewed-card">
                            <Link to={`/camp/${item.campId._id}`}>
                                <img 
                                    src={item.campId.image[0] || '/default-camp.jpg'} 
                                    alt={item.campId.name}
                                    className="recently-viewed-image"
                                />
                                <h3>{item.campId.name}</h3>
                                <p>{item.campId.location}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RecentlyViewed;
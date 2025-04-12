// src/components/features/RecentlyViewed.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import ErrorMessage from '../common/ErrorMessage';
import './RecentlyViewed.css';

const RecentlyViewed = () => {
    const { recentlyViewed, addToRecentlyViewed } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (recentlyViewed) {
            setLoading(false);
        }
    }, [recentlyViewed]);

    if (loading) return <Spinner size="small" />;
    if (error) return <ErrorMessage message={error} />;
    if (!recentlyViewed || recentlyViewed.length === 0) return null;

    return (
        <section className="recently-viewed-section" aria-labelledby="recently-viewed-heading">
            <h2 id="recently-viewed-heading">Your Recently Viewed Camps</h2>
            <div className="recently-viewed-grid">
                {recentlyViewed.map(camp => (
                    <div key={camp._id} className="recently-viewed-card">
                        <Link 
                            to={`/camps/${camp._id}`} 
                            aria-label={`View details for ${camp.name}`}
                            onClick={() => addToRecentlyViewed(camp)}
                        >
                            <img 
                                src={camp.image?.[0] || '/default-camp.jpg'} 
                                alt={camp.name}
                                className="recently-viewed-image"
                                loading="lazy"
                            />
                            <h3>{camp.name}</h3>
                            <p>{camp.location}</p>
                            {/* Keep any existing camp details you display */}
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
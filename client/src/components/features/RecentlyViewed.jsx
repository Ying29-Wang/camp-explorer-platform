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
    const [camps, setCamps] = useState([]);

    useEffect(() => {
        try {
            if (recentlyViewed && Array.isArray(recentlyViewed)) {
                // Extract camp data from recentlyViewed items and filter out invalid entries
                const campData = recentlyViewed
                    .filter(item => item && item.campId && typeof item.campId === 'object')
                    .map(item => item.campId);
                setCamps(campData);
            } else {
                setCamps([]);
            }
            setLoading(false);
        } catch {
            setError('Failed to load recently viewed camps');
            setLoading(false);
        }
    }, [recentlyViewed]);

    if (loading) return <Spinner size="small" />;
    if (error) return <ErrorMessage message={error} />;
    if (!camps || camps.length === 0) return null;

    return (
        <section className="recently-viewed-section" aria-labelledby="recently-viewed-heading">
            <h2 id="recently-viewed-heading">Your Recently Viewed Camps</h2>
            <div className="recently-viewed-grid">
                {camps.map(camp => {
                    if (!camp || !camp._id) return null;
                    return (
                        <div key={camp._id} className="recently-viewed-card">
                            <Link 
                                to={`/camps/${camp._id}`} 
                                aria-label={`View details for ${camp.name || 'Camp'}`}
                                onClick={() => addToRecentlyViewed(camp)}
                            >
                                <img 
                                    src={camp.image?.[0] || '/default-camp.jpg'} 
                                    alt={camp.name || 'Camp'}
                                    className="recently-viewed-image"
                                    loading="lazy"
                                />
                                <h3>{camp.name || 'Unnamed Camp'}</h3>
                                <p>{camp.location || 'Location not specified'}</p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default RecentlyViewed;
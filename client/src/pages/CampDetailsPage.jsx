import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCampById } from '../services/campService';
import { fetchReviewsByCampId } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import Header from '../components/layout/Header';
import Map from '../components/common/Map.jsx';
import ReviewCard from '../components/features/reviews/ReviewCard.jsx';
import ReviewForm from '../components/features/reviews/ReviewForm.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import AIReviewAnalysis from '../components/AIReviewAnalysis';
import './CampDetailsPage.css';

const CampDetailsPage = () => {
    const { id } = useParams();
    const { isLoggedIn, user, addToRecentlyViewed } = useAuth();
    const [camp, setCamp] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching camp data for ID:', id);
                
                const [campData, reviewData] = await Promise.all([
                    fetchCampById(id),
                    fetchReviewsByCampId(id)
                ]);
                
                console.log('Received camp data:', campData);
                
                if (!campData) {
                    throw new Error('Camp not found');
                }

                setCamp(campData);
                setReviews(reviewData || []);

                // Check if camp is bookmarked
                if (isLoggedIn) {
                    try {
                        const response = await api.get(`/bookmarks/${campData._id}`);
                        setIsBookmarked(response.data.isBookmarked);
                    } catch (error) {
                        console.error('Error checking bookmark status:', error);
                        setIsBookmarked(false);
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message || 'Failed to load camp details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isLoggedIn]);

    // Track camp view
    useEffect(() => {
        const trackView = async () => {
            if (!isLoggedIn || !camp || !user) {
                console.log('Not tracking view - isLoggedIn:', isLoggedIn, 'has camp:', !!camp, 'has user:', !!user);
                return;
            }

            try {
                console.log('Tracking view - User:', user._id, 'Camp ID:', camp._id);
                await addToRecentlyViewed(camp);
            } catch (error) {
                console.error('Error tracking view:', error);
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
        };

        if (camp && isLoggedIn) {
            trackView();
        }
    }, [camp, isLoggedIn, user, addToRecentlyViewed]);

    const handleBookmark = async () => {
        if (!isLoggedIn) {
            window.location.href = '/login';
            return;
        }

        try {
            if (isBookmarked) {
                await api.delete(`/bookmarks/${camp._id}`);
                setIsBookmarked(false);
            } else {
                await api.post('/bookmarks', { campId: camp._id });
                setIsBookmarked(true);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            setError(error.response?.data?.message || 'Failed to update bookmark');
        }
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    ...reviewData, 
                    campId: id
                })
            });
            
            if (!response.ok) throw new Error('Failed to submit review');
            
            const newReview = await response.json();
            setReviews([...reviews, newReview]);
        } catch (err) {
            console.error('Review submission error:', err);
            setError(err.message);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!camp) return <ErrorMessage message="Camp not found" />;

    // Convert location string to coordinates if available
    const getCoordinates = () => {
        if (camp.coordinates && camp.coordinates.coordinates) {
            // Extract the coordinates array from the GeoJSON format and reverse the order
            // GeoJSON uses [longitude, latitude], Leaflet needs [latitude, longitude]
            const [longitude, latitude] = camp.coordinates.coordinates;
            return [latitude, longitude];
        }
        // Fallback coordinates (you can replace these with actual coordinates)
        return [40.7128, -74.0060]; // Default to New York City
    };

    return (
        <div className="camp-details-page">
            <Header />
            <div className="camp-details">
                <div className="camp-header">
                    <h1>{camp.name}</h1>
                    <p className="camp-location">
                        <i className="fas fa-map-marker-alt"></i> {camp.location}
                    </p>
                    {isLoggedIn && (
                        <button 
                            onClick={handleBookmark}
                            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                        >
                            {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                        </button>
                    )}
                </div>

                <div className="camp-content">
                    <div className="camp-section">
                        <h2>About</h2>
                        {camp.image && camp.image.length > 0 && (
                            <img 
                                src={camp.image[0]} 
                                alt={camp.name}
                                className="camp-image"
                            />
                        )}
                        <p>{camp.description}</p>
                    </div>

                    <div className="camp-section">
                        <h2>Location</h2>
                        <Map 
                            center={getCoordinates()}
                            markers={[getCoordinates()]}
                        />
                    </div>

                    <div className="camp-section">
                        <h2>Activities</h2>
                        <ul className="camp-details-list">
                            {camp.activities?.map((activity, index) => (
                                <li key={index}>{activity}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="camp-section">
                        <h2>Contact Information</h2>
                        <ul className="camp-details-list">
                            <li>Email: {camp.contact?.email}</li>
                            <li>Phone: {camp.contact?.phone}</li>
                            <li>Website: <a href={camp.contact?.website} target="_blank" rel="noopener noreferrer">{camp.contact?.website}</a></li>
                        </ul>
                    </div>

                    <div className="camp-reviews">
                        <h3>Reviews</h3>
                        {reviews.length > 0 && (
                            <AIReviewAnalysis campId={id} />
                        )}
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <ReviewCard key={review._id} review={review} />
                            ))
                        ) : (
                            <p>No reviews yet. Be the first to review!</p>
                        )}
                        <ReviewForm campId={id} onReviewSubmit={handleReviewSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampDetailsPage;
import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCampById } from '../services/campService';
import { fetchReviewsByCampId } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import Header from '../components/layout/Header';
import Map from '../components/common/Map.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

// 使用 React.lazy 进行组件代码分割
const ReviewCard = lazy(() => import('../components/features/reviews/ReviewCard.jsx'));
const ReviewForm = lazy(() => import('../components/features/reviews/ReviewForm.jsx'));
const AIReviewAnalysis = lazy(() => import('../components/AIReviewAnalysis'));

import './CampDetailsPage.css';

const CampDetailsPage = () => {
    const { id } = useParams();
    const { isLoggedIn, user, addToRecentlyViewed } = useAuth();
    const [camp, setCamp] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // 添加缓存状态
    const [cache, setCache] = useState({
        camp: null,
        reviews: [],
        timestamp: null
    });

    // 检查缓存是否有效（5分钟）
    const isCacheValid = (timestamp) => {
        if (!timestamp) return false;
        return Date.now() - timestamp < 5 * 60 * 1000;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 检查缓存
                if (cache.camp && cache.reviews && isCacheValid(cache.timestamp)) {
                    setCamp(cache.camp);
                    setReviews(cache.reviews);
                    setLoading(false);
                    return;
                }

                console.log('Fetching camp data for ID:', id);
                
                const [campData, reviewData] = await Promise.all([
                    fetchCampById(id),
                    fetchReviewsByCampId(id)
                ]);
                
                console.log('Received camp data:', campData);
                
                if (!campData) {
                    throw new Error('Camp not found');
                }

                // 更新缓存
                setCache({
                    camp: campData,
                    reviews: reviewData || [],
                    timestamp: Date.now()
                });

                setCamp(campData);
                setReviews(reviewData || []);

                // 预加载相关数据
                if (campData.relatedCamps) {
                    campData.relatedCamps.forEach(campId => {
                        fetchCampById(campId).catch(console.error);
                    });
                }

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
    }, [id, isLoggedIn, cache]);

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

    // Memoize the coordinates to prevent unnecessary re-renders
    const coordinates = useMemo(() => {
        if (camp?.coordinates?.coordinates) {
            const [longitude, latitude] = camp.coordinates.coordinates;
            return [latitude, longitude];
        }
        return null; // Return null if no coordinates available
    }, [camp?.coordinates?.coordinates]);

    if (loading) return <Spinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!camp) return <ErrorMessage message="Camp not found" />;

    return (
        <main id="main-content" lang="en" role="main">
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Header />
            <div className="camp-details">
                <div className="camp-header">
                    <h1 style={{ color: '#000000' }}>{camp.name}</h1>
                    <p className="camp-location" style={{ color: '#000000' }}>
                        <i className="fas fa-map-marker-alt" aria-hidden="true"></i> {camp.location}
                    </p>
                    {isLoggedIn && (
                        <button 
                            onClick={handleBookmark}
                            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                            aria-pressed={isBookmarked}
                        >
                            {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                        </button>
                    )}
                </div>
                <div className="camp-content">
                    <div className="camp-info" role="region" aria-labelledby="about-heading">
                        <h2 id="about-heading" style={{ color: '#000000' }}>About</h2>
                        <p style={{ color: '#000000' }}>{camp.description}</p>
                    </div>

                    <div className="camp-details-section" role="region" aria-labelledby="age-range-heading">
                        <h2 id="age-range-heading" style={{ color: '#000000' }}>Age Range</h2>
                        <ul className="camp-details-list">
                            <li style={{ color: '#000000' }}>
                                <strong>Minimum Age:</strong> {camp.minAge || 'Not specified'}
                            </li>
                            <li style={{ color: '#000000' }}>
                                <strong>Maximum Age:</strong> {camp.maxAge || 'Not specified'}
                            </li>
                            {camp.ageGroups && camp.ageGroups.length > 0 && (
                                <li style={{ color: '#000000' }}>
                                    <strong>Age Groups:</strong> {camp.ageGroups.join(', ')}
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="camp-details-section" role="region" aria-labelledby="schedule-heading">
                        <h2 id="schedule-heading" style={{ color: '#000000' }}>Schedule</h2>
                        <ul className="camp-details-list">
                            <li style={{ color: '#000000' }}>
                                <strong>Start Date:</strong> {camp.startDate ? new Date(camp.startDate).toLocaleDateString() : 'Not specified'}
                            </li>
                            <li style={{ color: '#000000' }}>
                                <strong>End Date:</strong> {camp.endDate ? new Date(camp.endDate).toLocaleDateString() : 'Not specified'}
                            </li>
                            <li style={{ color: '#000000' }}>
                                <strong>Duration:</strong> {camp.duration || 'Not specified'}
                            </li>
                            <li style={{ color: '#000000' }}>
                                <strong>Daily Schedule:</strong> {camp.dailySchedule || 'Not specified'}
                            </li>
                            {camp.dropOffTime && (
                                <li style={{ color: '#000000' }}>
                                    <strong>Drop-off Time:</strong> {camp.dropOffTime}
                                </li>
                            )}
                            {camp.pickUpTime && (
                                <li style={{ color: '#000000' }}>
                                    <strong>Pick-up Time:</strong> {camp.pickUpTime}
                                </li>
                            )}
                        </ul>
                    </div>

                    {camp.activities && camp.activities.length > 0 && (
                        <div className="camp-activities" role="region" aria-labelledby="activities-heading">
                            <h2 id="activities-heading" style={{ color: '#000000' }}>Activities</h2>
                            <ul className="camp-details-list">
                                {camp.activities.map((activity, index) => (
                                    <li key={index} style={{ color: '#000000' }}>{activity}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {camp.amenities && camp.amenities.length > 0 && (
                        <div className="camp-amenities" role="region" aria-labelledby="amenities-heading">
                            <h2 id="amenities-heading" style={{ color: '#000000' }}>Amenities</h2>
                            <ul className="camp-details-list">
                                {camp.amenities.map((amenity, index) => (
                                    <li key={index} style={{ color: '#000000' }}>{amenity}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {camp.contact && (
                        <div className="camp-contact" role="region" aria-labelledby="contact-heading">
                            <h2 id="contact-heading" style={{ color: '#000000' }}>Contact Information</h2>
                            <ul className="camp-details-list">
                                {camp.contact.email && (
                                    <li style={{ color: '#000000' }}>
                                        <strong>Email:</strong> {camp.contact.email}
                                    </li>
                                )}
                                {camp.contact.phone && (
                                    <li style={{ color: '#000000' }}>
                                        <strong>Phone:</strong> {camp.contact.phone}
                                    </li>
                                )}
                                {camp.contact.website && (
                                    <li style={{ color: '#000000' }}>
                                        <strong>Website:</strong>{' '}
                                        <a 
                                            href={camp.contact.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ color: '#1a0dab' }}
                                        >
                                            {camp.contact.website}
                                            <span className="sr-only">(opens in new tab)</span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {coordinates && (
                        <div className="map-section" role="region" aria-label="Map showing camp location">
                            <div className="map-container">
                                <Map 
                                    center={coordinates}
                                    markers={[coordinates]}
                                    zoom={13}
                                    aria-label={`Map showing location of ${camp.name}`}
                                />
                            </div>
                        </div>
                    )}

                    <div className="camp-reviews" role="region" aria-labelledby="reviews-heading">
                        <h2 id="reviews-heading" style={{ color: '#000000' }}>Reviews</h2>
                        {reviews.length > 0 && (
                            <Suspense fallback={<Spinner />}>
                                <AIReviewAnalysis campId={id} />
                            </Suspense>
                        )}
                        {reviews.length > 0 ? (
                            <div className="reviews-list">
                                {reviews.map(review => (
                                    <Suspense key={review._id} fallback={<Spinner />}>
                                        <ReviewCard review={review} />
                                    </Suspense>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#000000' }}>No reviews yet. Be the first to review!</p>
                        )}
                        {isLoggedIn && (
                            <div className="camp-review-form" role="region" aria-labelledby="review-form-heading">
                                <h2 id="review-form-heading" style={{ color: '#000000' }}>Write a Review</h2>
                                <Suspense fallback={<Spinner />}>
                                    <ReviewForm 
                                        campId={id} 
                                        onReviewSubmit={handleReviewSubmit}
                                        aria-label="Submit a review"
                                    />
                                </Suspense>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CampDetailsPage;
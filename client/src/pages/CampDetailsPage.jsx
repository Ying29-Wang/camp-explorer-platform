import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCampById } from '../services/campService';
import { fetchReviewsByCampId } from '../services/reviewService';
import { API_URL } from '../config/api.js';

import Map from '../components/common/Map.jsx';
import ReviewCard from '../components/features/reviews/ReviewCard.jsx';
import ReviewForm from '../components/features/reviews/ReviewForm.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import './CampDetailsPage.css';

const CampDetailsPage = () => {
    const { id } = useParams();
    const [camp, setCamp] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [campData, reviewData] = await Promise.all([
                    fetchCampById(id),
                    fetchReviewsByCampId(id)
                ]);
                
                if (!campData) {
                    throw new Error('Camp not found');
                }

                setCamp(campData);
                setReviews(reviewData || []);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message || 'Failed to load camp details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleReviewSubmit = async (reviewData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/reviews`, {
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
        if (camp.coordinates) {
            return camp.coordinates;
        }
        // Fallback coordinates (you can replace these with actual coordinates)
        return [40.7128, -74.0060]; // Default to New York City
    };

    return (
        <div className="camp-details">
            <div className="camp-header">
                <h1>{camp.name}</h1>
                <p className="camp-location">
                    <i className="fas fa-map-marker-alt"></i> {camp.location}
                </p>
            </div>

            <div className="camp-content">
                <div className="camp-section">
                    <h2>About</h2>
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
    );
};

export default CampDetailsPage;
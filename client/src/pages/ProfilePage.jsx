import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchUserReviews, deleteReview } from '../services/reviewService';
import Header from '../components/layout/Header';
import './ProfilePage.css';

const ProfilePage = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserReviews();
    }
  }, [isLoggedIn]);

  const loadUserReviews = async () => {
    try {
      const data = await fetchUserReviews();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Failed to load reviews');
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (error) {
        setError(error.message || 'Failed to delete review');
      }
    }
  };

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <>
      <Header />
      <div className="profile">
        <h1>Your Profile</h1>
        
        <div className="profile-section">
          <h2>Your Information</h2>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        <div className="profile-section">
          <h2>Your Reviews</h2>
          {loading ? (
            <p>Loading reviews...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : reviews.length === 0 ? (
            <p>You haven't written any reviews yet.</p>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <h3>{review.camp?.name || 'Unknown Camp'}</h3>
                    <span className="review-rating">Rating: {review.rating}/5</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <div className="review-actions">
                    <button 
                      onClick={() => handleDeleteReview(review._id)}
                      className="delete-button"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchUserReviews, deleteReview, updateReview } from '../services/reviewService';
import ReviewCard from '../components/features/reviews/ReviewCard';
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

  const handleEditReview = async (reviewId, reviewData) => {
    try {
      const updatedReview = await updateReview(reviewId, reviewData);
      setReviews(reviews.map(review => 
        review._id === reviewId ? updatedReview : review
      ));
    } catch (error) {
      setError(error.message || 'Failed to update review');
      throw error;
    }
  };

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-content">
        <h1>My Profile</h1>
        <div className="profile-section">
          <div className="user-info">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
          </div>
        </div>

        <h2>My Reviews</h2>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : reviews.length === 0 ? (
          <p>You haven't written any reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <ReviewCard 
                key={review._id} 
                review={review} 
                onDelete={handleDeleteReview}
                onEdit={handleEditReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
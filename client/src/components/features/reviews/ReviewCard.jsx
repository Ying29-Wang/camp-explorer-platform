import React from 'react';
import { format } from 'date-fns';
import './ReviewCard.css'; // We'll create this CSS file next

const ReviewCard = ({ review }) => {
  // Format rating stars
  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`star ${i < rating ? 'filled' : ''}`}
          >
            {i < rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">
          <span className="user-avatar">
            {review.userId?.username?.charAt(0).toUpperCase() || 'U'}
          </span>
          <span className="user-name">
            {review.userId?.username || 'Anonymous'}
          </span>
        </div>
        <div className="review-meta">
          {renderStars(review.rating)}
          <span className="review-date">
            {format(new Date(review.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
      <div className="review-content">
        <p>{review.reviewText}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './ReviewCard.css'; // We'll create this CSS file next

const ReviewCard = ({ review, onDelete }) => {
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
        <div className="review-camp">
          <Link to={`/camps/${review.campId?._id}`}>
            <h3>{review.campId?.name || 'Unknown Camp'}</h3>
          </Link>
          <p className="camp-location">{review.campId?.location || ''}</p>
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
      {onDelete && (
        <div className="review-actions">
          <button 
            onClick={() => onDelete(review._id)}
            className="delete-button"
          >
            Delete Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
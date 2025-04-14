import React, { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './ReviewCard.css'; // We'll create this CSS file next

const ReviewCard = ({ review, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [reviewText, setReviewText] = useState(review.reviewText);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onEdit(review._id, { rating, reviewText });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  // Format rating stars
  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`star ${i < rating ? 'filled' : ''}`}
            onClick={() => setRating(i + 1)}
            style={{
              color: i < rating ? '#000000' : '#666666',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            {i < rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="review-card" role="article">
        <form onSubmit={handleSubmit} aria-labelledby="edit-review-heading">
          <h3 id="edit-review-heading" style={{ color: '#000000' }}>Edit Review</h3>
          <div className="form-group">
            <label htmlFor="edit-rating" style={{ color: '#000000' }}>Rating</label>
            <div className="rating-input" role="radiogroup" aria-labelledby="edit-rating">
              {renderStars(rating)}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="edit-review-text" style={{ color: '#000000' }}>Review</label>
            <textarea
              id="edit-review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              aria-required="true"
              style={{ 
                color: '#000000',
                backgroundColor: '#ffffff',
                border: '1px solid #000000'
              }}
            />
          </div>
          <div className="review-actions">
            <button 
              type="submit" 
              className="edit-button"
              aria-label="Save review changes"
              style={{ 
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Save
            </button>
            <button 
              type="button" 
              className="delete-button"
              onClick={() => setIsEditing(false)}
              aria-label="Cancel editing"
              style={{ 
                backgroundColor: '#666666',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="review-card" role="article">
      <div className="review-header">
        <div className="review-meta">
          <div className="review-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>
            {renderStars(review.rating)}
          </div>
          <span className="review-date" style={{ color: '#000000' }}>
            {format(new Date(review.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
      <div className="review-content">
        <p style={{ color: '#000000' }}>{review.reviewText}</p>
      </div>
      {onDelete && (
        <div className="review-actions">
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-button"
            aria-label="Edit review"
            style={{ 
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(review._id)}
            className="delete-button"
            aria-label="Delete review"
            style={{ 
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
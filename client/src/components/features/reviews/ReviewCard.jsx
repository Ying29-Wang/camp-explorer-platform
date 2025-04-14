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
          >
            {i < rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="review-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {renderStars(rating)}
            </div>
          </div>
          <div className="form-group">
            <label>Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
            />
          </div>
          <div className="review-actions">
            <button type="submit" className="edit-button">Save</button>
            <button 
              type="button" 
              className="delete-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-camp">
          <Link to={`/camps/${review.campId?._id}`}>
            <h3 style={{ color: '#000000' }}>{review.campId?.name || 'Unknown Camp'}</h3>
          </Link>
          <p className="camp-location" style={{ color: '#000000' }}>{review.campId?.location || ''}</p>
        </div>
        <div className="review-meta">
          {renderStars(review.rating)}
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
            style={{ 
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s'
            }}
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(review._id)}
            className="delete-button"
            style={{ 
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s'
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
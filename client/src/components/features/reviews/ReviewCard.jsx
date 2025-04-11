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
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(review._id)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
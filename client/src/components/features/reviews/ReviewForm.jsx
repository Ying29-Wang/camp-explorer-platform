import { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ campId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText.trim()) {
      setError('Please provide a rating and review text');
      return;
    }
    try {
      await onReviewSubmit({ campId, rating, reviewText });
      setRating(0);
      setReviewText('');
      setError('');
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  return (
    <div 
      className="review-form" 
      role="form" 
      aria-labelledby="review-form-heading"
      style={{ 
        backgroundColor: '#ffffff',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #000000'
      }}
    >
      <h3 
        id="review-form-heading" 
        style={{ 
          color: '#000000', 
          backgroundColor: '#ffffff',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}
      >
        Write a Review
      </h3>
      {error && (
        <p 
          className="error-message" 
          style={{ 
            color: '#000000', 
            backgroundColor: '#ffffff',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #000000',
            marginBottom: '1rem'
          }} 
          role="alert"
        >
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div 
          className="rating-input" 
          role="radiogroup" 
          aria-labelledby="rating-label"
          style={{ marginBottom: '1rem' }}
        >
          <label 
            id="rating-label" 
            style={{ 
              color: '#000000', 
              backgroundColor: '#ffffff',
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}
          >
            Rating
          </label>
          <div className="star-container" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                role="radio"
                aria-checked={star <= rating}
                aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRating(star);
                  }
                }}
                style={{ 
                  color: star <= rating ? '#000000' : '#666666',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  padding: '0',
                  marginRight: '0.5rem'
                }}
              >
                {star <= rating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="review-text" 
            style={{ 
              color: '#000000',
              backgroundColor: '#ffffff',
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}
          >
            Review
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            aria-required="true"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #000000',
              borderRadius: '4px',
              color: '#000000',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
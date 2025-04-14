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
    <div className="review-form">
      <h3 style={{ color: '#000000' }}>Write a Review</h3>
      {error && <p className="error-message" style={{ color: '#dc2626' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'filled' : ''}`}
              onClick={() => setRating(star)}
              style={{ 
                color: star <= rating ? '#ffc107' : '#000000',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              {star <= rating ? '★' : '☆'}
            </span>
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #000000',
            borderRadius: '4px',
            color: '#000000',
            backgroundColor: '#ffffff'
          }}
        />
        <button 
          type="submit"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
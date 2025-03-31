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
      <h3>Write a Review</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'filled' : ''}`}
              onClick={() => setRating(star)}
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
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './CampCard.css';

const CampCard = ({ camp, variant = 'default' }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/camps/${camp._id}`);
  };

  return (
    <div 
      className={`camp-card ${variant}`}
      role="article"
      aria-label={`${camp.name} camp information`}
    >
      <div className="card-image-container">
        <img
          src={camp.image?.[0] || '/default-camp.jpg'}
          alt={`${camp.name} - ${camp.location || 'Location not specified'}`}
          className="camp-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/default-camp.jpg';
            e.target.alt = 'Default camp image';
          }}
        />
      </div>

      <div className="card-content">
        <h3 className="camp-name">{camp.name}</h3>
        <p className="camp-location">
          <i className="fas fa-map-marker-alt" aria-hidden="true"></i> {camp.location}
        </p>
        <p className="camp-description">
          {camp.description?.substring(0, 100)}...
        </p>

        <div className="card-actions">
          <button 
            className="view-details-button"
            onClick={handleViewDetails}
            aria-label={`View details of ${camp.name}`}
          >
            View Details
          </button>
          {isLoggedIn && (
            <button 
              className="bookmark-button"
              onClick={(e) => {
                e.stopPropagation();
                // Your bookmark logic here
              }}
              aria-label={`Bookmark ${camp.name}`}
            >
              <i className="far fa-bookmark" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampCard;
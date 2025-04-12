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
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      aria-label={`View ${camp.name} details`}
    >
      <div className="card-image-container">
        <img
          src={camp.image?.[0] || '/default-camp.jpg'}
          alt={camp.name}
          className="camp-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/default-camp.jpg';
          }}
        />
      </div>

      <div className="card-content">
        <h3 className="camp-name">{camp.name}</h3>
        <p className="camp-location">
          <i className="fas fa-map-marker-alt"></i> {camp.location}
        </p>
        <p className="camp-description">
          {camp.description?.substring(0, 100)}...
        </p>

        <div className="card-actions">
          <button 
            className="view-details-button"
            onClick={handleViewDetails}
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
              aria-label="Bookmark this camp"
            >
              <i className="far fa-bookmark"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampCard;
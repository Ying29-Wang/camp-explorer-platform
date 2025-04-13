import PropTypes from 'prop-types';
import './FilterSidebar.css';

const FilterSidebar = ({ filters = {}, onFilterChange = () => {} }) => {
  const handleFilterUpdate = (filterType, value) => {
    try {
      onFilterChange({ ...filters, [filterType]: value });
    } catch (error) {
      console.error('Error updating filter:', error);
    }
  };

  return (
    <div className="filter-sidebar">
      <h3>Filter Camps</h3>
      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          value={filters?.location || ''}
          onChange={(e) => handleFilterUpdate('location', e.target.value)}
          placeholder="City or state"
        />
      </div>
      <div className="filter-group">
        <label>Age Range</label>
        <select 
          value={filters?.ageRange || ''}
          onChange={(e) => handleFilterUpdate('ageRange', e.target.value)}
        >
          <option value="">All Ages</option>
          <option value="5-10">5-10 years</option>
          <option value="11-15">11-15 years</option>
          <option value="16-18">16-18 years</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters?.category || ''}
          onChange={(e) => handleFilterUpdate('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Adventure">Adventure</option>
          <option value="Arts">Arts</option>
          <option value="Sports">Sports</option>
          <option value="Science">Science</option>
          <option value="Technology">Technology</option>
        </select>
      </div>
    </div>
  );
};

FilterSidebar.propTypes = {
  filters: PropTypes.shape({
    location: PropTypes.string,
    ageRange: PropTypes.string,
    category: PropTypes.string
  }),
  onFilterChange: PropTypes.func.isRequired
};

export default FilterSidebar;
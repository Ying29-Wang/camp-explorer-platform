import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FilterSidebar.css';

const CAMP_CATEGORIES = [
    'Adventure',
    'Arts',
    'Science',
    'Technology',
    'Sports',
    'Music',
    'Academic',
    'Nature',
    'Leadership',
    'Special Needs',
    'Language',
    'Religious',
    'Cooking',
    'General'
];

const FilterSidebar = ({ filters, onFilterChange, onSearch, isLoading }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [priceRange, setPriceRange] = useState({
        min: filters.minPrice || '',
        max: filters.maxPrice || ''
    });
    const [dateRange, setDateRange] = useState({
        start: filters.startDate || '',
        end: filters.endDate || ''
    });
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        category: false,
        age: false,
        price: false,
        date: false,
        sort: false
    });

    useEffect(() => {
        setLocalFilters(filters);
        setPriceRange({
            min: filters.minPrice || '',
            max: filters.maxPrice || ''
        });
        setDateRange({
            start: filters.startDate || '',
            end: filters.endDate || ''
        });
    }, [filters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (type, value) => {
        const newPriceRange = { ...priceRange, [type]: value };
        setPriceRange(newPriceRange);
        
        const newFilters = { ...localFilters };
        if (newPriceRange.min) newFilters.minPrice = parseFloat(newPriceRange.min);
        if (newPriceRange.max) newFilters.maxPrice = parseFloat(newPriceRange.max);
        if (!newPriceRange.min) delete newFilters.minPrice;
        if (!newPriceRange.max) delete newFilters.maxPrice;
        
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleDateChange = (type, value) => {
        const newDateRange = { ...dateRange, [type]: value };
        setDateRange(newDateRange);
        
        const newFilters = { ...localFilters };
        if (newDateRange.start) newFilters.startDate = newDateRange.start;
        if (newDateRange.end) newFilters.endDate = newDateRange.end;
        if (!newDateRange.start) delete newFilters.startDate;
        if (!newDateRange.end) delete newFilters.endDate;
        
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSearch = () => {
        if (priceRange.min && priceRange.max && parseFloat(priceRange.min) > parseFloat(priceRange.max)) {
            alert('Minimum price cannot be greater than maximum price');
            return;
        }

        if (dateRange.start && dateRange.end && new Date(dateRange.start) > new Date(dateRange.end)) {
            alert('Start date cannot be after end date');
            return;
        }

        onSearch();
    };

    const handleClearFilters = () => {
        const defaultFilters = {
            location: '',
            ageRange: '',
            category: '',
            searchText: '',
            minAge: '',
            maxAge: '',
            minPrice: '',
            maxPrice: '',
            startDate: '',
            endDate: '',
            sortBy: '',
            sortOrder: 'asc'
        };
        setLocalFilters(defaultFilters);
        setPriceRange({ min: '', max: '' });
        setDateRange({ start: '', end: '' });
        onFilterChange(defaultFilters);
    };

    return (
        <div className="filter-sidebar">
            <h2>Filters</h2>
            
            {/* Always visible basic search */}
            <div className="filter-group">
                <h3>Search</h3>
                <input
                    type="text"
                    placeholder="Search camps..."
                    value={localFilters.searchText || ''}
                    onChange={(e) => handleFilterChange('searchText', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter location..."
                    value={localFilters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                />
            </div>

            {/* Collapsible sections */}
            <div className="filter-section">
                <div className="section-header" onClick={() => toggleSection('category')}>
                    <h3>Category</h3>
                    <span className={`toggle-icon ${expandedSections.category ? 'expanded' : ''}`}>▼</span>
                </div>
                {expandedSections.category && (
                    <div className="section-content">
                        <select
                            value={localFilters.category || ''}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {CAMP_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="filter-section">
                <div className="section-header" onClick={() => toggleSection('age')}>
                    <h3>Age Range</h3>
                    <span className={`toggle-icon ${expandedSections.age ? 'expanded' : ''}`}>▼</span>
                </div>
                {expandedSections.age && (
                    <div className="section-content">
                        <div className="range-inputs">
                            <div className="input-group">
                                <label htmlFor="min-age">Minimum Age</label>
                                <input
                                    id="min-age"
                                    type="number"
                                    placeholder="Min Age"
                                    min="0"
                                    max="100"
                                    value={localFilters.minAge || ''}
                                    onChange={(e) => handleFilterChange('minAge', e.target.value)}
                                    aria-describedby="min-age-description"
                                />
                                <span id="min-age-description" className="visually-hidden">Enter the minimum age for the camp</span>
                            </div>
                            <div className="input-group">
                                <label htmlFor="max-age">Maximum Age</label>
                                <input
                                    id="max-age"
                                    type="number"
                                    placeholder="Max Age"
                                    min="0"
                                    max="100"
                                    value={localFilters.maxAge || ''}
                                    onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                                    aria-describedby="max-age-description"
                                />
                                <span id="max-age-description" className="visually-hidden">Enter the maximum age for the camp</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-section">
                <div className="section-header" onClick={() => toggleSection('price')}>
                    <h3>Price Range</h3>
                    <span className={`toggle-icon ${expandedSections.price ? 'expanded' : ''}`}>▼</span>
                </div>
                {expandedSections.price && (
                    <div className="section-content">
                        <div className="range-inputs">
                            <input
                                type="number"
                                placeholder="Min Price"
                                min="0"
                                value={priceRange.min}
                                onChange={(e) => handlePriceChange('min', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                min="0"
                                value={priceRange.max}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-section">
                <div className="section-header" onClick={() => toggleSection('date')}>
                    <h3>Date Range</h3>
                    <span className={`toggle-icon ${expandedSections.date ? 'expanded' : ''}`}>▼</span>
                </div>
                {expandedSections.date && (
                    <div className="section-content">
                        <div className="date-inputs">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-section">
                <div className="section-header" onClick={() => toggleSection('sort')}>
                    <h3>Sort By</h3>
                    <span className={`toggle-icon ${expandedSections.sort ? 'expanded' : ''}`}>▼</span>
                </div>
                {expandedSections.sort && (
                    <div className="section-content">
                        <select
                            value={localFilters.sortBy || ''}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="price">Price</option>
                            <option value="startDate">Start Date</option>
                            <option value="name">Name</option>
                        </select>
                        <select
                            value={localFilters.sortOrder || 'asc'}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="filter-group">
                <div className="filter-actions">
                    <button 
                        className="btn btn-primary search-btn" 
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                    <button 
                        className="btn btn-secondary clear-btn" 
                        onClick={handleClearFilters}
                        disabled={isLoading}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

FilterSidebar.propTypes = {
    filters: PropTypes.shape({
        location: PropTypes.string,
        ageRange: PropTypes.string,
        category: PropTypes.string,
        minPrice: PropTypes.string,
        maxPrice: PropTypes.string,
        duration: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        sortBy: PropTypes.string
    }),
    onFilterChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

export default FilterSidebar;
// src/components/features/QuickFilters.jsx
import React from 'react';
import { useSearch } from '../context/SearchContext';
import './QuickFilters.css';

const QuickFilters = () => {
    const { setSearchFilters } = useSearch();
    
    const quickFilters = [
        { label: "Ages 5-10", value: { minAge: 5, maxAge: 10 } },
        { label: "Under $500", value: { maxPrice: 500 } },
        { label: "Outdoor", value: { activities: ["hiking", "nature"] } },
        { label: "Arts", value: { activities: ["art", "painting", "music"] } },
        { label: "Sports", value: { activities: ["sports", "swimming"] } },
    ];

    const handleFilterClick = (filter) => {
        setSearchFilters(prev => ({ ...prev, ...filter.value }));
    };

    return (
        <section className="quick-filters" aria-labelledby="quick-filters-heading">
            <h2 id="quick-filters-heading" className="visually-hidden">Quick Filters</h2>
            <div className="filter-chips">
                {quickFilters.map((filter, index) => (
                    <button
                        key={index}
                        className="filter-chip"
                        onClick={() => handleFilterClick(filter)}
                        aria-label={`Filter by ${filter.label}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default QuickFilters;
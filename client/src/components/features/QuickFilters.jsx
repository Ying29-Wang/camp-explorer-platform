// src/components/features/QuickFilters.jsx
import React from 'react';
import { useSearch } from '../../context/SearchContext';
import './QuickFilters.css';

const QuickFilters = () => {
    const { setFilters, searchCamps, filters, setSearchResults } = useSearch();
    
    const sortOptions = [
        { label: "Price: Low to High", value: { sortBy: "price", sortOrder: "asc" } },
        { label: "Price: High to Low", value: { sortBy: "price", sortOrder: "desc" } },
        { label: "Name: A to Z", value: { sortBy: "name", sortOrder: "asc" } },
        { label: "Name: Z to A", value: { sortBy: "name", sortOrder: "desc" } },
        { label: "Start Date: Earliest", value: { sortBy: "startDate", sortOrder: "asc" } },
        { label: "Start Date: Latest", value: { sortBy: "startDate", sortOrder: "desc" } }
    ];

    const handleSortChange = async (e) => {
        const selectedOption = sortOptions.find(option => option.label === e.target.value);
        if (selectedOption) {
            // Create new filters object with updated sort parameters
            const newFilters = {
                ...filters,
                sortBy: selectedOption.value.sortBy,
                sortOrder: selectedOption.value.sortOrder
            };
            
            // Update filters in context
            setFilters(newFilters);
            
            // Execute search with updated filters
            try {
                const results = await searchCamps(newFilters);
                console.log('Search results after sort:', results);
                setSearchResults(results);
            } catch (error) {
                console.error('Error executing search:', error);
            }
        }
    };

    return (
        <div className="sort-container">
            <select 
                className="sort-select"
                onChange={handleSortChange}
                defaultValue=""
            >
                <option value="" disabled>Sort by...</option>
                {sortOptions.map((option, index) => (
                    <option key={index} value={option.label}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default QuickFilters;
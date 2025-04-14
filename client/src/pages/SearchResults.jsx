// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import CampCard from '../components/features/camps/CampCard';
import FilterSidebar from '../components/features/search/FilterSidebar';
import Pagination from '../components/common/Pagination';
import Header from '../components/layout/Header';
import AIRecommendations from '../components/AIRecommendations';
import { searchCamps } from '../services/campService';
import './SearchResults.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Something went wrong</h2>
                    <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const SearchResults = () => {
    const { 
        searchResults, 
        filters, 
        setFilters, 
        isSearching, 
        setSearchResults, 
        setIsSearching 
    } = useSearch();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const resultsPerPage = 8;

    // Pagination logic
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults?.slice(indexOfFirstResult, indexOfLastResult) || [];
    const totalResults = searchResults?.length || 0;

    const handleSearch = async () => {
        try {
            setError(null);
            setIsSearching(true);
            const results = await searchCamps(filters);
            setSearchResults(results);
            setCurrentPage(1); // Reset to first page when new search is performed
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to perform search. Please try again.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Perform initial search when component mounts
    useEffect(() => {
        handleSearch();
    }, []);

    if (isSearching) {
        return (
            <div className="search-results-page">
                <Header />
                <div className="loading">Searching...</div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="search-results-page">
                <Header />
                <div className="search-header">
                    <div className="search-header-content">
                        <h2>Search Results</h2>
                        <div className="results-count">{totalResults} camps found</div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="search-content">
                    <FilterSidebar 
                        filters={filters}
                        onFilterChange={setFilters}
                        onSearch={handleSearch}
                        isLoading={isSearching}
                    />

                    <div className="results-section">
                        <AIRecommendations userPreferences={filters} />
                        
                        <div className="results-grid">
                            {currentResults.length > 0 ? (
                                currentResults.map(camp => (
                                    <CampCard 
                                        key={camp._id}
                                        camp={camp}
                                        variant="search"
                                    />
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>No camps match your search criteria</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {totalResults > resultsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        resultsPerPage={resultsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default SearchResults;
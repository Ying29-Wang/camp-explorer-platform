import React from 'react';
import Header from '../components/layout/Header';
import SearchResultsList from '../components/features/search/SearchResultsList';
import useSearchResults from '../hooks/useSearchResults';
import './SearchResults.css';

const SearchResults = () => {
    const { results, loading, error } = useSearchResults();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Header />
            <div className="search-results-page">
                <div className="search-results-container">
                    <h1>Search Results</h1>
                    {loading && <div className="loading">Loading...</div>}
                    {error && <div className="error-message">Error: {error.message}</div>}
                    {!loading && !error && <SearchResultsList results={results} />}
                </div>
            </div>
        </>
    );
};

export default SearchResults;
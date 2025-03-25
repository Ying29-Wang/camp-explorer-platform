import React from 'react';
import SearchResultsList from '../components/features/search/SearchResultsList'; // Ensure this path is correct
import useSearchResults from '../hooks/useSearchResults'; // Ensure this path is correct

const SearchResults = () => {
    const { results, loading, error } = useSearchResults();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Search Results</h1>
            <SearchResultsList results={results} />
        </div>
    );
};

export default SearchResults; // Ensure this line is present
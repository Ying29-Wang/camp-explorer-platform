import React from 'react';
import SearchResultsList from '../components/features/search/SearchResultsList';
import useSearchResults from '../hooks/useSearchResults';

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

export default SearchResults;
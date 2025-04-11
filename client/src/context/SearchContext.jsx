import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [isSearching, setIsSearching] = useState(false);

    const executeSearch = async (searchFunction) => {
        setIsSearching(true);
        try {
            const results = await searchFunction();
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <SearchContext.Provider value={{
            searchResults,
            setSearchResults,
            searchQuery,
            setSearchQuery,
            activeFilters,
            setActiveFilters,
            isSearching,
            executeSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export default SearchContext;
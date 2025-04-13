import React, { createContext, useState, useContext, useCallback } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        ageRange: '',
        category: ''
    });
    const [isSearching, setIsSearching] = useState(false);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    }, []);

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
            filters,
            setFilters: updateFilters,
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
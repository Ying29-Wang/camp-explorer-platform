import React, { createContext, useState, useContext, useCallback } from 'react';
import { searchCamps } from '../services/campService';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
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

    const handleSearch = async (searchParams) => {
        setIsSearching(true);
        try {
            const results = await searchCamps(searchParams);
            setSearchResults(results);
            return results;
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            throw error;
        } finally {
            setIsSearching(false);
        }
    };

    const value = {
        searchResults,
        setSearchResults,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters: updateFilters,
        isSearching,
        setIsSearching,
        executeSearch,
        searchCamps: handleSearch
    };

    return (
        <SearchContext.Provider value={value}>
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
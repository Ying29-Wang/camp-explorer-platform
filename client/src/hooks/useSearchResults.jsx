import { useState, useEffect, useContext } from 'react';
import { useSearch } from '../context/SearchContext';
import { searchCamps, fetchCampsByQuickFilter } from '../services/campService';

const useSearchResults = () => {
  const {
    searchResults,
    setSearchResults,
    searchQuery,
    activeFilters,
    isSearching,
    executeSearch
  } = useSearch();

  const performTextSearch = async () => {
    if (!searchQuery.trim()) return;
    await executeSearch(() => searchCamps(searchQuery));
  };

  const performFilterSearch = async () => {
    if (Object.keys(activeFilters).length === 0) return;
    await executeSearch(() => fetchCampsByQuickFilter(activeFilters));
  };

  useEffect(() => {
    if (searchQuery) {
      performTextSearch();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      performFilterSearch();
    }
  }, [activeFilters]);

  return {
    results: searchResults,
    loading: isSearching,
    performTextSearch,
    performFilterSearch
  };
};

export default useSearchResults;
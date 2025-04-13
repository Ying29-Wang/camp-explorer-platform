// src/pages/SearchResults.jsx
import { useState } from 'react';
import { useSearch } from '../context/SearchContext';
import CampCard from '../components/features/camps/CampCard';
import FilterSidebar from '../components/features/search/FilterSidebar';
import Pagination from '../components/common/Pagination';
import Header from '../components/layout/Header';
import './SearchResults.css';

const SearchResults = () => {
  const { searchResults, filters, setFilters, isSearching } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalResults = searchResults.length;

  if (isSearching) {
    return (
      <div className="search-results-page">
        <Header />
        <div className="loading">Searching...</div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <Header />
      <div className="search-header">
        <h2>Search Results</h2>
        <div className="results-count">{totalResults} camps found</div>
      </div>

      <div className="search-content">
        <FilterSidebar 
          filters={filters}
          onFilterChange={setFilters}
        />

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

      {totalResults > resultsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default SearchResults;
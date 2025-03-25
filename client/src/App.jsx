import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import FeaturedCamps from './components/features/FeaturedCamps';
import RecentlyViewed from './components/features/RecentlyViewed';
import Footer from './components/common/Footer';
import { SearchProvider } from './context/SearchContext'; // Ensure this path is correct
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const recentlyViewedCamps = []; // Fetch or simulate recently viewed camps

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <div className="homepage">
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <section className="hero">
          <h1>Find the Perfect Camp</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search camps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
        </section>
        <FeaturedCamps />
        {isLoggedIn && <RecentlyViewed camps={recentlyViewedCamps} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
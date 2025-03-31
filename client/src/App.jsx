import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Header from './components/layout/Header';
import FeaturedCamps from './components/features/FeaturedCamps';
import RecentlyViewed from './components/features/RecentlyViewed';
import Footer from './components/common/Footer';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const recentlyViewedCamps = []; // Fetch or simulate recently viewed camps

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <AuthProvider>
      <SearchProvider>
        <div className="homepage">
          <Header /> {/* Removed isLoggedIn prop - now handled by AuthContext */}
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
            {/* RecentlyViewed now checks auth via its own context */}
            <RecentlyViewed camps={recentlyViewedCamps} /> 
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
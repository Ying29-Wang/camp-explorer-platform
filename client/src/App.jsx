import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import FeaturedCamps from './components/features/FeaturedCamps';
import RecentlyViewed from './components/features/RecentlyViewed';
import Footer from './components/common/Footer';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import SearchResults from './pages/SearchResults';
import './App.css';
import './components/common/LoadingSpinner.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const recentlyViewedCamps = []; // Fetch or simulate recently viewed camps

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="homepage">
      <Header />
      <main>
        <section className="hero">
          <h1>Find the Perfect Camp</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              id="search"
              name="search"
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
        <RecentlyViewed camps={recentlyViewedCamps} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
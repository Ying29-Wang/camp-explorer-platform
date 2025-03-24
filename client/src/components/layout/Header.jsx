import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">LOGO</Link>
      </div>
      <nav className="nav-area">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search camps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {isLoggedIn ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login/Register</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
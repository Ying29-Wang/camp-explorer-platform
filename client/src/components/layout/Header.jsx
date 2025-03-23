import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">LOGO</Link>
      </div>
      <nav className="nav-area">
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
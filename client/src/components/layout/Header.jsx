import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">LOGO</Link>
      </div>
      <nav className="nav-area">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile">Profile</Link>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login/Register</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
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
            {(user?.role === 'admin' || user?.role === 'camp_owner') && (
              <Link to="/manage-camps">Manage Camps</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/manage-users">Manage Users</Link>
            )}
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
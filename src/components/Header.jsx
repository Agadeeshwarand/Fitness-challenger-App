import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import accountLogo from '../assets/Account-logo.svg';
import mainLogo from '../assets/Main-logo.svg';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-text">
          <img src={mainLogo} alt="Fitness Challenger Logo" className="main-logo" />
          <span>FITNESS CHALLENGER</span>
        </Link>
      </div>
      <div className="header-right">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          Home
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/challenge" className={`nav-link ${isActive('/challenge')}`}>
              Challenge
            </Link>
            <Link to="/account" className="user-icon">
              <img src={accountLogo} alt="Account" className="account-logo" />
            </Link>
          </>
        ) : (
          <Link to="/login" className={`nav-link ${isActive('/login')}`}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    const path = location.pathname;
    if (['/tracker', '/timer', '/records'].includes(path)) {
      navigate('/?auth=required');
    }
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <span className="hamburger-btn material-symbols-rounded" onClick={() => setMenuOpen(!menuOpen)}>
            menu
          </span>
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <img src="/Fauget.jpg" alt="logo" />
            <h2>MednCare</h2>
          </Link>
          <ul className={`links ${menuOpen ? 'show-menu' : ''}`}>
            <span className="close-btn material-symbols-rounded" onClick={() => setMenuOpen(false)}>
              close
            </span>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            {isAuthenticated() && (
              <>
                <li><Link to="/tracker" onClick={() => setMenuOpen(false)}>Tracker</Link></li>
                <li><Link to="/timer" onClick={() => setMenuOpen(false)}>Timer</Link></li>
                <li><Link to="/records" onClick={() => setMenuOpen(false)}>Records</Link></li>
              </>
            )}
          </ul>
          <button className="login-btn" onClick={isAuthenticated() ? handleLogout : () => setAuthModalOpen(true)}>
            {isAuthenticated() ? 'LOG OUT' : 'LOG IN'}
          </button>
        </nav>
      </header>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}


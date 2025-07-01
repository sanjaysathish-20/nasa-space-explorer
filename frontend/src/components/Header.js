// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../logo.jpg';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  // Optional: Close menu on nav link click (for mobile)
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src={logo} alt="NASA Logo" className="logo" />
        </Link>

        {/* Hamburger button */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <div></div>
          <div></div>
          <div></div>
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {/* Home button removed */}
          <li><Link to="/apod" onClick={closeMenu}>APOD</Link></li>
          <li><Link to="/mars" onClick={closeMenu}>Mars Rover</Link></li>
          <li><Link to="/epic" onClick={closeMenu}>EPIC</Link></li>
          <li><Link to="/neo" onClick={closeMenu}>NeoWs</Link></li>
          <li><Link to="/library" onClick={closeMenu}>Image Library</Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

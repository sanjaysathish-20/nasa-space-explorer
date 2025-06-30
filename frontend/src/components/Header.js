// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../logo.jpg'; // NASA logo from components folder

function Header() {
  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="NASA Logo" className="logo" />
        </Link>
        <ul className="nav-links">
          {/* Home button removed */}
          <li><Link to="/apod">APOD</Link></li>
          <li><Link to="/mars">Mars Rover</Link></li>
          <li><Link to="/epic">EPIC</Link></li>
          <li><Link to="/neo">NeoWs</Link></li>
          <li><Link to="/library">Image Library</Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

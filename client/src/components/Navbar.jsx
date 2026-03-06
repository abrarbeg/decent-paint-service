import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaPaintRoller } from 'react-icons/fa';
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">
        <span className="logo-icon"><FaPaintRoller /></span>
        Decent <span>Paint</span> Service
      </Link>
      
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {navLinks.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link 
          to="/admin/login" 
          className="admin-link"
          onClick={() => setMenuOpen(false)}
        >
          Admin
        </Link>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
}

export default Navbar;


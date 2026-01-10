import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, LogIn, Menu, X } from 'lucide-react'; // Added Menu & X
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Import specific Navbar styles

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMenu = () => setIsMobileOpen(!isMobileOpen);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false); // Close menu on click
  };

  return (
    <nav className="premium-nav">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => handleNavigation('/')}>
          <Shield className="logo-icon" size={28} />
          <span className="logo-text">SafeStay</span>
        </div>
        
        {/* Desktop & Mobile Menu Links */}
        <div className={`nav-links ${isMobileOpen ? 'active' : ''}`}>
          <button onClick={() => handleNavigation('/portal')} className="nav-item">
            Tenant Portal
          </button>
          
          {user ? (
            <button onClick={() => handleNavigation('/dashboard')} className="nav-pill">
              <LayoutDashboard size={18} />
              Dashboard
            </button>
          ) : (
            <button onClick={() => handleNavigation('/login')} className="nav-pill">
              <LogIn size={18} />
              Owner Login
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button className="mobile-toggle" onClick={toggleMenu}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="brand-header">
            <Shield className="brand-icon" size={24} />
            <span className="brand-name">SafeStay</span>
          </div>
          <p className="brand-desc">
            India's most secure digital verification platform. 
            Instant background checks, biometric validation, and paperless agreements.
          </p>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <div className="link-column">
            <h4>Platform</h4>
            <a href="/">Home</a>
            <a href="/portal">Tenant Portal</a>
            <a href="/login">Owner Login</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          
          <div className="link-column">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security Guidelines</a>
          </div>
          
          <div className="link-column">
            <h4>Contact</h4>
            <a href="mailto:support@safestay.in" className="contact-link">
              <Mail size={16} /> support@safestay.in
            </a>
            <div className="social-icons">
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#" aria-label="GitHub"><Github size={18} /></a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SafeStay Systems. All rights reserved.</p>
      </div>
    </footer>
  );
}
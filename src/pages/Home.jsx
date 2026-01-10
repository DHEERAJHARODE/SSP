import React from 'react';
import { ArrowRight, ShieldCheck, UserCheck, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Home.css';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="premium-home-wrapper">
      <Navbar />
      
      {/* Animated Background Elements */}
      <div className="bg-blob blob-purple"></div>
      <div className="bg-blob blob-blue"></div>

      <main className="hero-container">
        <header className="hero-content">
          <div className="premium-badge">Trusted by 10,000+ Owners</div>
          <h1 className="hero-title">
            Smart Tenant <br />
            <span className="gradient-text">Verification System</span>
          </h1>
          <p className="hero-subtitle">
            India's most secure digital verification platform. 
            Instant background checks, biometric validation, and paperless agreements.
          </p>
          
          <div className="hero-actions">
            <a href="/login" className="btn-main">
              Get Started <ArrowRight size={20} />
            </a>
            <a href="/portal" className="btn-glass">Tenant Status</a>
          </div>
        </header>

        <section className="features-grid">
          <div className="feature-card">
            <ShieldCheck className="f-icon" size={32} />
            <h3>Police Verified</h3>
            <p>Direct integration with local authorities for instant checks.</p>
          </div>
          <div className="feature-card">
            <UserCheck className="f-icon" size={32} />
            <h3>Live Identity</h3>
            <p>AI-powered face match and Aadhaar validation.</p>
          </div>
          <div className="feature-card">
            <FileText className="f-icon" size={32} />
            <h3>Digital Contract</h3>
            <p>Legally binding e-agreements generated in seconds.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
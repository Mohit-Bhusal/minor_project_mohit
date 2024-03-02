import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import './Footer.css'; // Your CSS file for styling the footer

const Footer = () => {
  return (
    <footer className="footer-container px-4 py-8">
      <div className="footer-section">
        <h5>About Us</h5>
        <p>This is rac</p>
      </div>
      <div className="footer-section">
        <h5>Contact</h5>
        <a href="mailto:rac@tcioe.edu.np">rac@tcioe.edu.np</a>
        <p>
          {' '}
          <a href="tel:+19864410395">Phone: 9864410395</a>
        </p>
      </div>
      <div className="footer-section social-media-links">
        <h5>Follow Us</h5>
        <a
          href="https://facebook.com/racthapathali"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>

      <div className="footer-section">
        <h5>Quick Links</h5>
        <Link to="/about">About</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import '../css/ComingSoon.css';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [submitted, setSubmitted] = useState(false);

  // Set launch date (modify this date as needed)
  const launchDate = new Date('2025-12-31T23:59:59').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="coming-soon-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Content */}
      <div className="content">
        <div className="logo">
          <h1 className="brand">YourBrand</h1>
        </div>

        <h2 className="main-title">Coming Soon</h2>
        <p className="subtitle">Something amazing is on the way. Get ready for an unforgettable experience.</p>

        {/* Countdown Timer */}
        <div className="countdown">
          <div className="countdown-item">
            <div className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="countdown-label">Days</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="countdown-label">Hours</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="countdown-label">Minutes</div>
          </div>
          <div className="countdown-item">
            <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="countdown-label">Seconds</div>
          </div>
        </div>

        {/* Email Subscription */}
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button type="submit" className="submit-btn">
            Notify Me
          </button>
        </form>

        {submitted && <p className="success-message">✓ Thanks! We'll notify you soon.</p>}

        {/* Social Links */}
        <div className="social-links">
          {/* <a href="#" className="social-link" aria-label="Twitter">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z"/>
            </svg>
          </a> */}
          <a href="https://www.linkedin.com/in/ashmit-aryan/" className="social-link" aria-label="LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a href="https://instagram.com/_the_ashmit_aryan_" className="social-link" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
          </a>

        </div>
      </div>
    </div>
  );
}
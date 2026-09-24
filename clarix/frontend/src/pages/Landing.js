// src/pages/Landing.js
import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🗺️', color: 'purple', title: 'AI Career Roadmap',
    text: 'Get a personalized, week-by-week action plan built around your skills, goals, and timeline — powered by AI.' },
  { icon: '🤝', color: 'green', title: 'Smart Mentor Matching',
    text: 'Connect with verified seniors and mentors matched to your domain, skills, and career targets.' },
  { icon: '📊', color: 'red', title: 'Unified Dashboard',
    text: 'No more scattered apps. All your goals, events, messages, and progress live in one clean space.' },
  { icon: '🎯', color: 'purple', title: 'Skill Gap Analysis',
    text: 'Understand exactly what you\'re missing and get targeted resources to close those gaps fast.' },
  { icon: '📅', color: 'green', title: 'Structured Goal Setting',
    text: 'Weekly, monthly, and semester-level goals keep you on track and moving with intention.' },
  { icon: '📢', color: 'red', title: 'Opportunities Feed',
    text: 'Hackathons, internships, workshops — curated and relevant events posted by your institution\'s admin.' },
];

const Landing = () => {
  return (
    <div id="landing">
      <nav className="landing-nav">
        <div className="logo">CLA<span>RIX</span></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login" className="btn btn-secondary">Log In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-tag">✦ Transforming the Broken College Stack</div>
        <h1>Your Career, <em>Clarified</em>.</h1>
        <p>From scattered confusion to structured growth — CLARIX gives students a personalized roadmap, matched mentors, and a clear path forward.</p>
        <div className="hero-btns">
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '16px', padding: '13px 32px' }}>
            Start Your Journey →
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '16px', padding: '13px 32px' }}>
            Log In
          </Link>
        </div>
      </section>

      <div className="features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className={`feature-icon ${f.color}`}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;

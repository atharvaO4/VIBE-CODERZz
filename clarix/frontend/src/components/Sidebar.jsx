// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  student: [
    { icon: '🏠', label: 'Dashboard',    path: '/student/dashboard' },
    { icon: '🗺️', label: 'My Roadmap',   path: '/roadmap' },
    { icon: '🤝', label: 'Find Mentors', path: '/student/mentors' },
    { icon: '📅', label: 'Events',       path: '/events' },
    { icon: '💬', label: 'Messages',     path: '/messages' },
    { icon: '👤', label: 'Profile',      path: '/profile' },
  ],
  senior: [
    { icon: '🏠', label: 'Dashboard', path: '/senior/dashboard' },
    { icon: '📅', label: 'Events',    path: '/events' },
    { icon: '💬', label: 'Messages',  path: '/messages' },
    { icon: '👤', label: 'Profile',   path: '/profile' },
  ],
  admin: [
    { icon: '🏠', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '📅', label: 'Events',    path: '/events' },
    { icon: '💬', label: 'Messages',  path: '/messages' },
    { icon: '👤', label: 'Profile',   path: '/profile' },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role || 'student';
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.student;
  const initial = (user?.name || 'U').trim()[0].toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo Area */}
      <div className="sidebar-logo">
        CLA<span style={{ color: 'var(--accent)' }}>RIX</span>
      </div>

      {/* User Profile Snippet (clickable → profile) */}
      <Link
        to="/profile"
        className="sidebar-user"
        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
      >
        <div className="avatar avatar-purple">{initial}</div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'Guest'}</div>
          <div className="user-role">{role}</div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="nav-section">
        <div className="nav-label">Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span> {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="sidebar-bottom">
        <button className="nav-item" style={{ color: 'var(--accent2)' }} onClick={handleLogout}>
          <span className="nav-icon">🚪</span> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

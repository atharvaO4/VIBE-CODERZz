import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  // You can easily change these links later based on the user's role!
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', path: '/student/dashboard' },
    { id: 'roadmap', icon: '🗺️', label: 'My Roadmap', path: '/roadmap' },
    { id: 'mentors', icon: '🤝', label: 'Find Mentors', path: '/student/mentors' },
  ];

  return (
    <aside className="sidebar" style={{ width: '240px', borderRight: '1px solid var(--border)', background: 'var(--surface)', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Logo Area */}
      <div className="sidebar-logo" style={{ padding: '24px 20px 16px', fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, borderBottom: '1px solid var(--border)' }}>
        CLA<span style={{ color: 'var(--accent)' }}>RIX</span>
      </div>

      {/* User Profile Snippet */}
      <div className="sidebar-user" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)' }}>
        <div className="avatar avatar-purple" style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, backgroundColor: 'rgba(108,99,255,.25)', color: '#a89dff' }}>
          P
        </div>
        <div className="user-info" style={{ overflow: 'hidden' }}>
          <div className="user-name" style={{ fontSize: '14px', fontWeight: 600 }}>Priya Sharma</div>
          <div className="user-role" style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'capitalize' }}>student</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="nav-section" style={{ padding: '16px 12px 8px' }}>
        <div className="nav-label" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', padding: '0 8px', marginBottom: '4px', textTransform: 'uppercase' }}>
          Menu
        </div>
        
        {navItems.map((item) => (
          <Link 
            key={item.id} 
            to={item.path} 
            className="nav-item" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', textDecoration: 'none', color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}
          >
            <span className="nav-icon">{item.icon}</span> {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="sidebar-bottom" style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <button className="nav-item" style={{ width: '100%', color: 'var(--accent2)', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
          <span className="nav-icon">🚪</span> Log Out
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
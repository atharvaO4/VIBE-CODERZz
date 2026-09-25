// src/pages/senior/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getIncomingReqs, updateRequest } from '../../services/api';

const SeniorDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    try {
      const res = await getIncomingReqs();
      setRequests(res.data?.requests || []);
    } catch (err) {
      setError('Could not load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleRequest = async (id, status) => {
    try {
      await updateRequest(id, status);
      setRequests(prev => prev.map(r => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update request.');
    }
  };

  const pending  = requests.filter(r => r.status === 'pending');
  const accepted = requests.filter(r => r.status === 'accepted');

  const initialsOf = (name) =>
    (name || 'S').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (loading) return <div style={{ padding: '40px', color: 'var(--muted)' }}>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Welcome, {(user?.name || 'Mentor').split(' ')[0]} 👋</h2>
        <p>Your mentorship dashboard</p>
      </div>

      <div className="page-content">
        {error && (
          <div style={{ background: 'rgba(255,107,107,.15)', border: '1px solid rgba(255,107,107,.3)', color: '#ff6b6b', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-label">Pending Requests</div>
            <div className="stat-value">{pending.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Active Students</div>
            <div className="stat-value">{accepted.length}</div>
          </div>
          <div className="stat-card gold">
            <div className="stat-label">Availability</div>
            <div className="stat-value" style={{ fontSize: '22px' }}>{user?.available !== false ? '🟢' : '🔴'}</div>
            <div className="stat-delta">{user?.available !== false ? 'Available' : 'Away'}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Total Requests</div>
            <div className="stat-value">{requests.length}</div>
          </div>
        </div>

        {pending.length > 0 && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="section-row">
              <span className="section-title">📬 Pending Requests</span>
              <span className="badge badge-red">{pending.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pending.map(r => {
                const s = r.student;
                if (!s) return null;
                return (
                  <div className="student-req" key={r._id}>
                    <div className="avatar avatar-purple">{initialsOf(s.name)}</div>
                    <div className="req-info">
                      <div className="req-name">{s.name}</div>
                      <div className="req-goal">
                        {s.goal || 'Goal not specified'} · {(r.message || '').slice(0, 60)}{(r.message || '').length > 60 ? '...' : ''}
                      </div>
                    </div>
                    <div className="req-actions">
                      <button className="btn btn-success" style={{ fontSize: '12px' }} onClick={() => handleRequest(r._id, 'accepted')}>Accept</button>
                      <button className="btn btn-danger" style={{ fontSize: '12px' }} onClick={() => handleRequest(r._id, 'rejected')}>Decline</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="card">
          <div className="section-row"><span className="section-title">👥 Active Students</span></div>
          {accepted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
              No active students yet. Accept requests to start mentoring.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {accepted.map(r => {
                const s = r.student;
                if (!s) return null;
                return (
                  <div className="student-req" key={r._id}>
                    <div className="avatar avatar-green">{initialsOf(s.name)}</div>
                    <div className="req-info">
                      <div className="req-name">{s.name}</div>
                      <div className="req-goal">{s.year || ''} {s.branch || ''} · {s.goal || 'Goal not set'}</div>
                    </div>
                    <div className="req-actions">
                      <Link to="/messages" className="btn btn-secondary" style={{ fontSize: '12px' }}>💬 Message</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeniorDashboard;

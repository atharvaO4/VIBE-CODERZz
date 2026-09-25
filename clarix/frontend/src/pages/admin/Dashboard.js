// src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getAllUsers, getEvents } from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, eventsRes] = await Promise.all([getAllUsers(), getEvents()]);
        setUsers(usersRes.data?.users || []);
        setEvents(eventsRes.data?.events || []);
      } catch (err) {
        setError('Could not load platform data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: '40px', color: 'var(--muted)' }}>Loading dashboard...</div>;

  const students = users.filter(u => u.role === 'student');
  const seniors  = users.filter(u => u.role === 'senior');

  const initialsOf = (name) =>
    (name || 'U').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="page-header">
        <h2>🛡️ Admin Dashboard</h2>
        <p>Platform overview and management</p>
      </div>

      <div className="page-content">
        {error && (
          <div style={{ background: 'rgba(255,107,107,.15)', border: '1px solid rgba(255,107,107,.3)', color: '#ff6b6b', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Students</div>
            <div className="stat-value">{students.length}</div>
          </div>
          <div className="stat-card gold">
            <div className="stat-label">Mentors</div>
            <div className="stat-value">{seniors.length}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Events</div>
            <div className="stat-value">{events.length}</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="section-row"><span className="section-title">👥 All Users</span></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="avatar avatar-purple" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                        {initialsOf(u.name)}
                      </span>
                      {u.name}
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'senior' ? 'badge-green' : 'badge-purple'}`}>{u.role}</span></td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="section-row"><span className="section-title">📅 Upcoming Events</span></div>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No events posted yet.</div>
          ) : (
            <div className="event-list">
              {events.map(e => {
                const d = new Date(e.date);
                return (
                  <div className="event-card" key={e._id}>
                    <div className="event-date">
                      <div className="event-day">{d.getDate()}</div>
                      <div className="event-month">{d.toLocaleString('en', { month: 'short' })}</div>
                    </div>
                    <div className="event-info">
                      <div className="event-title">{e.title}</div>
                      <div className="event-meta">
                        <span className="badge badge-purple">{e.type || 'Event'}</span>
                        <span>{e.desc}</span>
                      </div>
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

export default AdminDashboard;

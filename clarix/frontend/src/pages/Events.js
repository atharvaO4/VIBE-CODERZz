// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEvents, createEvent, deleteEvent } from '../services/api';

const emptyForm = { title: '', desc: '', type: 'Event', date: '' };

const EventsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data?.events || []);
    } catch (err) {
      setError('Could not load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createEvent(form);
      setForm(emptyForm);
      setShowForm(false);
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create event.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete event.');
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--muted)' }}>Loading events...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>📅 Events</h2>
          <p>Hackathons, workshops, and opportunities from your institution</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Close' : '+ Post Event'}
          </button>
        )}
      </div>

      <div className="page-content">
        {error && (
          <div style={{ background: 'rgba(255,107,107,.15)', border: '1px solid rgba(255,107,107,.3)', color: '#ff6b6b', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {isAdmin && showForm && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="section-row"><span className="section-title">➕ New Event</span></div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <div className="label">Title</div>
                <input className="input" required value={form.title}
                       onChange={e => setForm({ ...form, title: e.target.value })}
                       placeholder="e.g. Hackathon 2026" />
              </div>
              <div className="form-group">
                <div className="label">Description</div>
                <textarea className="textarea" value={form.desc}
                          onChange={e => setForm({ ...form, desc: e.target.value })}
                          placeholder="Short description..." />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <div className="label">Type</div>
                  <select className="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option>Event</option>
                    <option>Workshop</option>
                    <option>Hackathon</option>
                    <option>Masterclass</option>
                    <option>Bootcamp</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="label">Date</div>
                  <input className="input" type="datetime-local" required value={form.date}
                         onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Publish Event</button>
            </form>
          </div>
        )}

        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <p style={{ color: 'var(--muted)' }}>No upcoming events right now.</p>
          </div>
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
                      <span>{d.toLocaleString('en', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button className="btn btn-danger" style={{ fontSize: '12px' }} onClick={() => handleDelete(e._id)}>
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

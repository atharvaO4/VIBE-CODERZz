// src/pages/student/Mentors.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSeniors, getMyRequests, sendMentorRequest } from '../../services/api';

const MentorsPage = () => {
  const navigate = useNavigate();
  const [seniors, setSeniors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All Domains');
  const [modalSenior, setModalSenior] = useState(null);
  const [reqMsg, setReqMsg] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [seniorsRes, reqRes] = await Promise.all([getSeniors(), getMyRequests()]);
      setSeniors(seniorsRes.data?.seniors || []);
      setRequests(reqRes.data?.requests || []);
    } catch (err) {
      setError('Could not load mentors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const domains = ['All Domains', ...new Set(seniors.map(s => s.domain).filter(Boolean))];

  const filtered = seniors.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.company || '').toLowerCase().includes(q) ||
      (s.bio || '').toLowerCase().includes(q) ||
      (s.skills || []).some(sk => sk.toLowerCase().includes(q));
    const matchesDomain = domain === 'All Domains' || s.domain === domain;
    return matchesSearch && matchesDomain;
  });

  const requestFor = (seniorId) =>
    requests.find(r => (r.senior?._id || r.senior) === seniorId);

  const submitRequest = async () => {
    if (!reqMsg.trim()) { setError('Please write a message.'); return; }
    try {
      await sendMentorRequest(modalSenior._id, reqMsg.trim());
      setModalSenior(null);
      setReqMsg('');
      setError('');
      const reqRes = await getMyRequests();
      setRequests(reqRes.data?.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send request.');
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--muted)' }}>Loading mentors...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>🤝 Find Mentors</h2>
        <p>Connect with seniors matched to your goals and domain</p>
      </div>

      <div className="page-content">
        {error && (
          <div style={{ background: 'rgba(255,107,107,.15)', border: '1px solid rgba(255,107,107,.3)', color: '#ff6b6b', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            className="input"
            placeholder="🔍 Search by name, company, or skill..."
            style={{ maxWidth: '320px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="select" style={{ width: '160px' }} value={domain} onChange={e => setDomain(e.target.value)}>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
            <p style={{ color: 'var(--muted)' }}>No mentors found. Try a different search.</p>
          </div>
        ) : (
          <div className="mentor-grid">
            {filtered.map(s => {
              const req = requestFor(s._id);
              const initials = (s.name || 'S').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

              let btnHTML = (
                <button className="btn btn-primary" style={{ fontSize: '13px', width: '100%' }}
                        onClick={() => { setModalSenior(s); setReqMsg(''); setError(''); }}>
                  Request Mentorship
                </button>
              );
              if (req?.status === 'pending')
                btnHTML = <button className="btn btn-secondary" style={{ fontSize: '13px', width: '100%', cursor: 'default' }}>⏳ Request Pending</button>;
              if (req?.status === 'accepted')
                btnHTML = <button className="btn btn-success" style={{ fontSize: '13px', width: '100%' }} onClick={() => navigate('/messages')}>💬 Message</button>;

              return (
                <div className="mentor-card" key={s._id}>
                  <div className="mentor-head">
                    <div className="avatar avatar-purple" style={{ width: '42px', height: '42px', fontSize: '15px' }}>
                      {initials}
                    </div>
                    <div>
                      <div className="mentor-name">{s.name}</div>
                      <div className="mentor-role">{s.company || 'Mentor'} · {s.domain || 'General'}</div>
                    </div>
                  </div>
                  <div className="mentor-bio">{s.bio || 'Available to guide students on their career journey.'}</div>
                  <div className="mentor-tags">
                    {(s.skills || []).slice(0, 3).map(sk => <span className="badge badge-purple" key={sk}>{sk}</span>)}
                  </div>
                  <div className="mentor-avail">🟢 Available for mentorship</div>
                  <div style={{ marginTop: '12px' }}>{btnHTML}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {modalSenior && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) setModalSenior(null); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setModalSenior(null)}>×</button>
            <div className="modal-title">Request Mentorship</div>
            <div className="modal-sub">Write a brief message about your goals to {modalSenior.name}</div>
            <div className="form-group">
              <div className="label">Your Message</div>
              <textarea
                className="textarea"
                placeholder="Hi! I'm a 3rd year CSE student aiming for SDE roles at top companies. I'd love guidance on DSA and interview prep..."
                value={reqMsg}
                onChange={e => setReqMsg(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitRequest}>
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorsPage;

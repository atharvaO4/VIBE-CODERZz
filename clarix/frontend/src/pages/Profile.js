// src/pages/Profile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    year: user?.year || '',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    goal: user?.goal || '',
    skills: (user?.skills || []).join(', '),
  });
  const [mentorForm, setMentorForm] = useState({
    company: user?.company || '',
    domain: user?.domain || '',
    bio: user?.bio || '',
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const isMentor = user?.role === 'senior';
  const skills = user?.skills || [];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim() || user?.name,
        year: form.year,
        branch: form.branch,
        cgpa: form.cgpa,
        goal: form.goal,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setShowEdit(false);
      setSuccess('Profile updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchRole = async (newRole) => {
    setError(''); setSuccess(''); setSaving(true);
    try {
      const data = { role: newRole };
      if (newRole === 'senior') {
        if (!mentorForm.company.trim() || !mentorForm.domain.trim()) {
          setError('Please enter your company and domain to become a mentor.');
          setSaving(false);
          return;
        }
        data.company = mentorForm.company.trim();
        data.domain = mentorForm.domain.trim();
        data.bio = mentorForm.bio.trim();
        data.available = true;
      }
      await updateProfile(data);
      setShowRoleSwitch(false);
      setSuccess(newRole === 'senior' ? '🎉 You are now a mentor!' : 'Switched back to student.');
      // Redirect to the matching dashboard
      setTimeout(() => {
        navigate(newRole === 'senior' ? '/senior/dashboard' : '/student/dashboard');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not switch role.');
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || 'U').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const detailRows = isMentor
    ? [['Company', user?.company || 'Not set'], ['Domain', user?.domain || 'Not set'], ['Status', user?.available !== false ? '🟢 Available' : '🔴 Away']]
    : [['Year', user?.year || 'Not set'], ['Branch', user?.branch || 'Not set'], ['CGPA', user?.cgpa || 'Not set'], ['Career Goal', user?.goal || 'Not set']];

  return (
    <div>
      <div className="page-header"><h2>👤 My Profile</h2></div>

      <div className="page-content">
        {error && (
          <div style={{ background: 'rgba(255,107,107,.15)', border: '1px solid rgba(255,107,107,.3)', color: '#ff6b6b', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(67,233,123,.15)', border: '1px solid rgba(67,233,123,.3)', color: '#43e97b', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {success}
          </div>
        )}

        {/* Profile Hero */}
        <div className="profile-hero">
          <div className="avatar avatar-purple profile-avatar">{initials}</div>
          <div>
            <h2 style={{ fontSize: '22px' }}>{user?.name}</h2>
            <p style={{ color: 'var(--muted)', marginTop: '4px' }}>
              {user?.email} · <span className="badge badge-purple">{isMentor ? 'Mentor' : 'Student'}</span>
            </p>
            <p style={{ color: 'var(--accent)', marginTop: '6px', fontSize: '14px' }}>
              🎯 {isMentor ? `Domain: ${user?.domain || 'Not set'}` : `Goal: ${user?.goal || 'Not set'}`}
            </p>
          </div>
          <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => setShowEdit(true)}>
            ✏️ Edit
          </button>
        </div>

        {/* Role Switch Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="section-row">
            <span className="section-title">🔀 Account Type</span>
            <span className={`badge ${isMentor ? 'badge-green' : 'badge-purple'}`}>{isMentor ? 'Mentor' : 'Student'}</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
            {isMentor
              ? "You're currently mentoring students. Switch back to student mode to get your own roadmap and find mentors."
              : "Graduated or want to guide juniors? Switch to mentor mode to accept mentorship requests from students."}
          </p>
          {!showRoleSwitch ? (
            <button
              className={isMentor ? 'btn btn-secondary' : 'btn btn-primary'}
              onClick={() => { setShowRoleSwitch(true); setError(''); setSuccess(''); }}
            >
              {isMentor ? '↩️ Switch to Student' : '🤝 Become a Mentor'}
            </button>
          ) : (
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              {!isMentor && (
                <>
                  <p style={{ fontSize: '14px', marginBottom: '14px', color: 'var(--text)' }}>
                    Tell students a bit about you (required to become a mentor):
                  </p>
                  <div className="form-group">
                    <div className="label">Company</div>
                    <input className="input" placeholder="e.g. Google" value={mentorForm.company}
                           onChange={e => setMentorForm({ ...mentorForm, company: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <div className="label">Domain</div>
                    <input className="input" placeholder="e.g. Frontend Development" value={mentorForm.domain}
                           onChange={e => setMentorForm({ ...mentorForm, domain: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <div className="label">Bio (optional)</div>
                    <textarea className="textarea" placeholder="A short intro about how you can help students..."
                              value={mentorForm.bio}
                              onChange={e => setMentorForm({ ...mentorForm, bio: e.target.value })} />
                  </div>
                </>
              )}
              {isMentor && (
                <p style={{ fontSize: '14px', marginBottom: '14px' }}>
                  You'll lose access to mentor-only features (incoming requests) until you switch back.
                </p>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" disabled={saving} onClick={() => handleSwitchRole(isMentor ? 'student' : 'senior')}>
                  {saving ? 'Switching...' : (isMentor ? 'Yes, switch to Student' : 'Yes, become a Mentor')}
                </button>
                <button className="btn btn-secondary" disabled={saving} onClick={() => setShowRoleSwitch(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details + Skills */}
        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: '14px', fontSize: '15px' }}>📋 Details</h3>
            {detailRows.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '14px', fontSize: '15px' }}>⚡ Current Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.length === 0
                ? <span style={{ color: 'var(--muted)', fontSize: '14px' }}>No skills added yet</span>
                : skills.map(s => <span key={s} className="badge badge-purple" style={{ fontSize: '13px', padding: '5px 12px' }}>{s}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) setShowEdit(false); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowEdit(false)}>×</button>
            <div className="modal-title">Edit Profile</div>
            <div className="modal-sub">Update your personal details</div>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <div className="label">Name</div>
                <input className="input" value={form.name} onChange={set('name')} />
              </div>
              {!isMentor && (
                <>
                  <div className="form-group">
                    <div className="label">Year</div>
                    <input className="input" placeholder="e.g. 3rd" value={form.year} onChange={set('year')} />
                  </div>
                  <div className="form-group">
                    <div className="label">Branch</div>
                    <input className="input" placeholder="e.g. CSE" value={form.branch} onChange={set('branch')} />
                  </div>
                  <div className="form-group">
                    <div className="label">CGPA</div>
                    <input className="input" placeholder="e.g. 8.5" value={form.cgpa} onChange={set('cgpa')} />
                  </div>
                  <div className="form-group">
                    <div className="label">Career Goal</div>
                    <input className="input" placeholder="e.g. SDE at Google" value={form.goal} onChange={set('goal')} />
                  </div>
                </>
              )}
              <div className="form-group">
                <div className="label">Skills (comma-separated)</div>
                <input className="input" placeholder="Python, React, SQL" value={form.skills} onChange={set('skills')} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

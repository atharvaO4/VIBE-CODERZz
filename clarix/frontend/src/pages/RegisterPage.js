import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', year: '', branch: '', goal: '', company: '', domain: ''
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = { name: form.name, email: form.email, password: form.password, role };
      if (role === 'student') {
        data.year = form.year; data.branch = form.branch; data.goal = form.goal;
      } else {
        data.company = form.company; data.domain = form.domain;
      }
      const user = await register(data);
      // Step 8.5: On successful register -> redirect based on role
      const redirects = { student: '/student/dashboard', senior: '/senior/dashboard', admin: '/admin/dashboard' };
      navigate(redirects[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', padding: '20px' }}>
      <div style={{ width:'100%', maxWidth:'480px', padding:'32px', background:'#12121a', borderRadius:'20px', border:'1px solid #2a2a3e' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', color:'#e8e8f0', marginBottom:'8px' }}>Create your account</h2>
        <p style={{ color:'#7a7a9a', fontSize:'14px', marginBottom:'24px' }}>Join CLARIX and get your career roadmap</p>

        {error && (
          <div style={{ background:'rgba(255,107,107,.15)', border:'1px solid rgba(255,107,107,.3)', color:'#ff6b6b', padding:'10px 14px', borderRadius:'10px', marginBottom:'16px', fontSize:'14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Base Fields (Step 8.2) */}
          <div style={{ marginBottom:'16px' }}>
            <label style={labelStyle}>Full Name</label>
            <input placeholder="Your name" required value={form.name} onChange={set('name')} style={inputStyle} />
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@university.edu" required value={form.email} onChange={set('email')} style={inputStyle} />
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="Create a password" required minLength={6} value={form.password} onChange={set('password')} style={inputStyle} />
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={labelStyle}>I am a</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="student">Student</option>
              <option value="senior">Senior / Mentor</option>
            </select>
          </div>

          {/* Conditional Fields for STUDENT (Step 8.4) */}
          {role === 'student' && (
            <div style={{ padding: '16px', background: '#1a1a26', borderRadius: '10px', marginBottom: '20px', border: '1px solid #2a2a3e' }}>
              <div style={{ marginBottom:'12px' }}><label style={labelStyle}>Year</label><input placeholder="e.g. 3rd" required value={form.year} onChange={set('year')} style={inputStyle} /></div>
              <div style={{ marginBottom:'12px' }}><label style={labelStyle}>Branch</label><input placeholder="e.g. CSE" required value={form.branch} onChange={set('branch')} style={inputStyle} /></div>
              <div style={{ marginBottom: 0 }}><label style={labelStyle}>Career Goal</label><input placeholder="e.g. Software Engineer" required value={form.goal} onChange={set('goal')} style={inputStyle} /></div>
            </div>
          )}

          {/* Conditional Fields for SENIOR (Step 8.3) */}
          {role === 'senior' && (
            <div style={{ padding: '16px', background: '#1a1a26', borderRadius: '10px', marginBottom: '20px', border: '1px solid #2a2a3e' }}>
              <div style={{ marginBottom:'12px' }}><label style={labelStyle}>Company</label><input placeholder="e.g. Google" required value={form.company} onChange={set('company')} style={inputStyle} /></div>
              <div style={{ marginBottom: 0 }}><label style={labelStyle}>Domain</label><input placeholder="e.g. Frontend Development" required value={form.domain} onChange={set('domain')} style={inputStyle} /></div>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', background:'#6c63ff', color:'#fff', border:'none', borderRadius:'10px', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'15px', cursor:'pointer', opacity: loading ? .7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'16px', fontSize:'13px', color:'#7a7a9a' }}>
          Already have an account? <Link to="/login" style={{ color:'#6c63ff' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

// Reusable styles to keep the code clean
const inputStyle = { width:'100%', padding:'10px 14px', borderRadius:'10px', background:'#1a1a26', border:'1px solid #2a2a3e', color:'#e8e8f0', fontSize:'14px', outline:'none', boxSizing:'border-box' };
const labelStyle = { display:'block', fontSize:'12px', color:'#7a7a9a', marginBottom:'6px', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' };

export default RegisterPage;

// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirects = { student:'/student/dashboard', senior:'/senior/dashboard', admin:'/admin/dashboard' };
      navigate(redirects[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f' }}>
      <div style={{ width:'100%', maxWidth:'400px', padding:'32px', background:'#12121a', borderRadius:'20px', border:'1px solid #2a2a3e' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', color:'#e8e8f0', marginBottom:'8px' }}>Welcome back</h2>
        <p style={{ color:'#7a7a9a', fontSize:'14px', marginBottom:'24px' }}>Sign in to CLARIX</p>

        {error && (
          <div style={{ background:'rgba(255,107,107,.15)', border:'1px solid rgba(255,107,107,.3)', color:'#ff6b6b', padding:'10px 14px', borderRadius:'10px', marginBottom:'16px', fontSize:'14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'12px', color:'#7a7a9a', marginBottom:'6px', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>Email</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={{ width:'100%', padding:'10px 14px', borderRadius:'10px', background:'#1a1a26', border:'1px solid #2a2a3e', color:'#e8e8f0', fontSize:'14px', outline:'none', boxSizing:'border-box' }}
              placeholder="you@university.edu"
            />
          </div>
          <div style={{ marginBottom:'20px' }}>
            <label style={{ display:'block', fontSize:'12px', color:'#7a7a9a', marginBottom:'6px', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>Password</label>
            <input
              type="password" required value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={{ width:'100%', padding:'10px 14px', borderRadius:'10px', background:'#1a1a26', border:'1px solid #2a2a3e', color:'#e8e8f0', fontSize:'14px', outline:'none', boxSizing:'border-box' }}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{ width:'100%', padding:'12px', background:'#6c63ff', color:'#fff', border:'none', borderRadius:'10px', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'15px', cursor:'pointer' }}
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'16px', fontSize:'13px', color:'#7a7a9a' }}>
          No account? <Link to="/register" style={{ color:'#6c63ff' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

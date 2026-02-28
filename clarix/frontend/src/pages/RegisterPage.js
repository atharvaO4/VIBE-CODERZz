import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Step 8.5: On successful register -> redirect based on role
    if (role === 'student') {
      navigate('/student/dashboard');
    } else if (role === 'senior') {
      navigate('/senior/dashboard');
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', padding: '20px' }}>
      <div style={{ width:'100%', maxWidth:'480px', padding:'32px', background:'#12121a', borderRadius:'20px', border:'1px solid #2a2a3e' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', color:'#e8e8f0', marginBottom:'8px' }}>Create your account</h2>
        <p style={{ color:'#7a7a9a', fontSize:'14px', marginBottom:'24px' }}>Join CLARIX and get your career roadmap</p>

        <form onSubmit={handleRegister}>
          {/* Base Fields (Step 8.2) */}
          <div style={{ marginBottom:'16px' }}>
            <label style={labelStyle}>Full Name</label>
            <input placeholder="Your name" required style={inputStyle} />
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@university.edu" required style={inputStyle} />
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="Create a password" required style={inputStyle} />
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
              <div style={{ marginBottom:'12px' }}><label style={labelStyle}>Year</label><input placeholder="e.g. 3rd" required style={inputStyle} /></div>
              <div style={{ marginBottom:'12px' }}><label style={labelStyle}>Branch</label><input placeholder="e.g. CSE" required style={inputStyle} /></div>
              <div style={{ marginBottom: 0 }}><label style={labelStyle}>Career Goal</label><input placeholder="e.g. Software Engineer" required style={inputStyle} /></div>
            </div>
          )}

          {/* Conditional Fields for SENIOR (Step 8.3) */}
          {role === 'senior' && (
            <div style={{ padding: '16px', background: '#1a1a26', borderRadius: '10px', marginBottom: '20px', border: '1px solid #2a2a3e' }}>
              <div style={{ marginBottom:'12px' }}><label style={labelStyle}>Company</label><input placeholder="e.g. Google" required style={inputStyle} /></div>
              <div style={{ marginBottom: 0 }}><label style={labelStyle}>Domain</label><input placeholder="e.g. Frontend Development" required style={inputStyle} /></div>
            </div>
          )}

          <button type="submit" style={{ width:'100%', padding:'12px', background:'#6c63ff', color:'#fff', border:'none', borderRadius:'10px', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'15px', cursor:'pointer' }}>
            Create Account
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
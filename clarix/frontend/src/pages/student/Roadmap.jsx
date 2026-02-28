// src/pages/student/Roadmap.jsx
// Example of a page that connects to the real backend
import React, { useEffect, useState } from 'react';
import { getRoadmap, toggleTask, regenerateRoadmap } from '../../services/api';

const RoadmapPage = () => {
  const [roadmap,  setRoadmap]  = useState(null);
  const [tab,      setTab]      = useState('weekly');
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await getRoadmap();
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setError('Could not load roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (taskId) => {
    try {
      const res = await toggleTask(taskId);
      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const res = await regenerateRoadmap();
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setError('Regeneration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding:'32px', color:'#7a7a9a' }}>Loading roadmap...</div>;
  if (error)   return <div style={{ padding:'32px', color:'#ff6b6b' }}>{error}</div>;
  if (!roadmap) return null;

  const tasks = roadmap[tab] || [];

  return (
    <div style={{ padding:'28px 32px', fontFamily:'DM Sans, sans-serif', color:'#e8e8f0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'22px', margin:0 }}>🗺️ My Career Roadmap</h2>
          <p style={{ color:'#7a7a9a', fontSize:'14px', marginTop:'4px' }}>Goal: {roadmap.goal}</p>
        </div>
        <button onClick={handleRegenerate} style={{ padding:'10px 20px', background:'#6c63ff', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'14px' }}>
          🔄 Regenerate
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {['weekly','monthly','semester'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'8px 18px', borderRadius:'8px', border:'1px solid', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'13px', cursor:'pointer',
              background: tab===t ? '#6c63ff' : 'none',
              color: tab===t ? '#fff' : '#7a7a9a',
              borderColor: tab===t ? '#6c63ff' : '#2a2a3e'
            }}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {tasks.map((task, i) => (
          <div key={task.id} style={{ background:'#14141e', border:`1px solid ${task.done ? 'rgba(67,233,123,.3)' : '#2a2a3e'}`, borderRadius:'14px', padding:'16px 20px', display:'flex', gap:'16px', alignItems:'flex-start', opacity: task.done ? 0.65 : 1 }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(108,99,255,.15)', color:'#a89dff', fontWeight:700, fontSize:'13px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {i+1}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:'15px', textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#7a7a9a' : '#e8e8f0' }}>
                {task.title}
              </div>
              <div style={{ fontSize:'13px', color:'#7a7a9a', marginTop:'4px', lineHeight:1.4 }}>{task.desc}</div>
              <div style={{ marginTop:'8px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {task.tags.map(tag => (
                  <span key={tag} style={{ background:'rgba(108,99,255,.2)', color:'#a89dff', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600 }}>{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={() => handleToggle(task.id)}
              style={{ background: task.done ? 'rgba(67,233,123,.1)' : 'none', border:`1px solid ${task.done ? 'rgba(67,233,123,.3)' : '#2a2a3e'}`, color: task.done ? '#43e97b' : '#7a7a9a', padding:'5px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}>
              {task.done ? '✓ Done' : 'Mark Done'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;

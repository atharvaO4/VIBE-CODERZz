import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Note: Adjust this import path based on where your api.js file is located in the services folder!
import { getRoadmap, getEvents, getMyRequests } from '../../services/api'; 

const StudentDashboard = () => {
  const { user } = useAuth(); // Gets the logged-in student's info

  // State to hold our backend data
  const [roadmap, setRoadmap] = useState(null);
  const [events, setEvents] = useState([]);
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Steps 9.2, 9.3, 9.4: Call APIs on page load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [roadmapRes, eventsRes, requestsRes] = await Promise.all([
          getRoadmap(),     // Step 9.2
          getEvents(),      // Step 9.3
          getMyRequests()   // Step 9.4
        ]);

        setRoadmap(roadmapRes.data || null);
        setEvents(eventsRes.data || []);
        
        // Check if any request is accepted to find the connected mentor
        const acceptedRequest = requestsRes.data?.find(req => req.status === 'accepted');
        setMentorData(acceptedRequest ? acceptedRequest.mentor : null);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Safe fallbacks while loading or if data is missing
  const tasksDone = roadmap?.tasksDone || 0;
  const totalTasks = roadmap?.totalTasks || 12;
  const roadmapPercent = Math.round((tasksDone / totalTasks) * 100) || 0;
  const upcomingEventsCount = events.length || 0;

  if (loading) return <div style={{ padding: '40px', color: 'var(--text)' }}>Loading your dashboard...</div>;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h2>Good morning, {user?.name?.split(' ')[0] || 'Student'} ✨</h2>
        <p>Here's your career snapshot for today</p>
      </div>

      <div className="page-content">
        
        {/* Step 9.5: Show 4 stat cards */}
        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-label">Tasks Done</div>
            <div className="stat-value">{tasksDone}</div>
            <div className="stat-delta">/ {totalTasks} total</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Roadmap</div>
            <div className="stat-value">{roadmapPercent}%</div>
            <div className="stat-delta">Complete</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Events</div>
            <div className="stat-value">{upcomingEventsCount}</div>
            <div className="stat-delta">Upcoming</div>
          </div>
          <div className="stat-card gold">
            <div className="stat-label">Mentors</div>
            <div className="stat-value">{mentorData ? 1 : 0}</div>
            <div className="stat-delta">Connected</div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          
          {/* Step 9.6: Show progress bar for Weekly/Monthly/Semester */}
          <div className="card">
            <div className="section-row">
              <span className="section-title">📊 Roadmap Progress</span>
              <Link to="/roadmap" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>View All</Link>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Overall Progress</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{roadmapPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${roadmapPercent}%` }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Weekly */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px' }}>Weekly Goals</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{tasksDone >= 4 ? 100 : Math.round((tasksDone/4)*100)}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${tasksDone >= 4 ? 100 : Math.round((tasksDone/4)*100)}%` }}></div></div>
              </div>
              {/* Monthly */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px' }}>Monthly Goals</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{tasksDone >= 8 ? 100 : Math.round((tasksDone/8)*100)}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${tasksDone >= 8 ? 100 : Math.round((tasksDone/8)*100)}%`, background: 'var(--accent3)' }}></div></div>
              </div>
              {/* Semester */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px' }}>Semester Plan</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{Math.round((tasksDone/12)*100)}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.round((tasksDone/12)*100)}%`, background: 'var(--accent2)' }}></div></div>
              </div>
            </div>
          </div>

          {/* Step 9.8: Show mentor card (or "Find a Mentor" button) */}
          <div className="card">
            <div className="section-row"><span className="section-title">🤝 My Mentor</span></div>
            {mentorData ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div className="avatar avatar-green" style={{ width: '48px', height: '48px', fontSize: '20px' }}>{mentorData.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{mentorData.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{mentorData.company} · {mentorData.domain}</div>
                    <div className="mentor-avail">🟢 Available</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>{mentorData.bio || 'Happy to guide you on your journey!'}</p>
                <Link to="/messages" className="btn btn-primary" style={{ fontSize: '13px' }}>💬 Message</Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>You don't have a mentor yet. Find the right senior to guide your journey!</div>
                <Link to="/student/mentors" className="btn btn-primary">Find a Mentor</Link>
              </div>
            )}
          </div>
        </div>

        {/* Step 9.7: Show top 3 upcoming events */}
        <div className="card">
          <div className="section-row">
            <span className="section-title">📅 Upcoming Events</span>
            <Link to="/events" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>View All</Link>
          </div>
          <div className="event-list">
            {events.slice(0, 3).map((e, index) => {
              const d = new Date(e.date || Date.now());
              return (
                <div className="event-card" key={index}>
                  <div className="event-date">
                    <div className="event-day">{d.getDate()}</div>
                    <div className="event-month">{d.toLocaleString('en', { month: 'short' })}</div>
                  </div>
                  <div className="event-info">
                    <div className="event-title">{e.title}</div>
                    <div className="event-meta">
                      <span className="badge badge-purple">{e.type || 'Event'}</span> 
                      <span>{d.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: '12px' }}>Register</button>
                </div>
              );
            })}
            {events.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '14px' }}>No upcoming events right now.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
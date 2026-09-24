// src/pages/Messages.js
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyRequests, getIncomingReqs, getMessages, sendMessage } from '../services/api';

const MessagesPage = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const myId = user?.id || user?._id;

  // Load conversation partners (accepted mentorship connections)
  useEffect(() => {
    (async () => {
      try {
        if (user?.role === 'senior') {
          const res = await getIncomingReqs();
          const accepted = (res.data?.requests || []).filter(r => r.status === 'accepted');
          setPartners(accepted.map(r => r.student).filter(Boolean));
        } else {
          const res = await getMyRequests();
          const accepted = (res.data?.requests || []).filter(r => r.status === 'accepted');
          setPartners(accepted.map(r => r.senior).filter(Boolean));
        }
      } catch (err) {
        setError('Could not load conversations.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.role]);

  // Load messages for active partner (+ light polling)
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }

    const load = async () => {
      try {
        const res = await getMessages(activeId);
        setMessages(res.data?.messages || []);
      } catch (err) {
        setError('Could not load messages.');
      }
    };

    load();
    pollRef.current = setInterval(load, 5000);
    return () => clearInterval(pollRef.current);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    try {
      await sendMessage(activeId, text.trim());
      setText('');
      const res = await getMessages(activeId);
      setMessages(res.data?.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send message.');
    }
  };

  const initialsOf = (name) =>
    (name || 'U').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const activePartner = partners.find(p => p._id === activeId);

  if (loading) return <div style={{ padding: '40px', color: 'var(--muted)' }}>Loading messages...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>💬 Messages</h2>
        <p>Chat with your mentorship connections</p>
      </div>

      <div className="page-content">
        {error && (
          <div style={{ background: 'rgba(255,107,107,.15)', border: '1px solid rgba(255,107,107,.3)', color: '#ff6b6b', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {partners.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>
              No conversations yet. {user?.role === 'senior'
                ? 'Accept mentorship requests to start chatting with students.'
                : 'Find a mentor and get connected to start chatting.'}
            </p>
          </div>
        ) : (
          <div className="chat-layout">
            <div className="chat-sidebar">
              {partners.map(p => (
                <div
                  key={p._id}
                  className={`chat-thread${activeId === p._id ? ' active' : ''}`}
                  onClick={() => setActiveId(p._id)}
                >
                  <div className="chat-thread-name">{p.name}</div>
                  <div className="chat-thread-preview">{p.company || p.role || 'Member'}</div>
                </div>
              ))}
            </div>

            <div className="chat-main">
              {!activeId ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                  Select a conversation to start messaging
                </div>
              ) : (
                <>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                    {activePartner?.name}
                  </div>
                  <div className="chat-messages">
                    {messages.length === 0 && (
                      <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '24px' }}>
                        No messages yet. Say hello 👋
                      </div>
                    )}
                    {messages.map(m => {
                      const mine = String(m.from) === String(myId);
                      return (
                        <div className={`chat-msg ${mine ? 'me' : 'them'}`} key={m._id}>
                          <div className="chat-bubble">{m.text}</div>
                          <div className="chat-time">
                            {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  <form className="chat-input-row" onSubmit={handleSend}>
                    <input
                      className="chat-input"
                      placeholder="Type a message..."
                      value={text}
                      onChange={e => setText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

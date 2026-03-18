import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const method = 'email';
  const [destination, setDestination] = useState('');
  const [code, setCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [verified, setVerified] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const resetMessageForm = () => {
    setSubject('');
    setMessage('');
    setStatus('Message form cleared.');
  };

  const requestCode = async () => {
    setStatus('');
    setSendingCode(true);

    try {
      const res = await fetch('/api/contact/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, destination }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send verification code');
      }

      setSessionId(data.sessionId || '');
      setVerified(false);
      setStatus(data.message || 'Verification code sent.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const verify = async () => {
    setStatus('');
    setVerifyingCode(true);

    try {
      const res = await fetch('/api/contact/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Verification failed');
      }

      setVerified(true);
      setStatus(`Verified. You can now send message to ${data.contactTarget || 'tbudhe@yunextgenai.com'}.`);
    } catch (error) {
      setVerified(false);
      setStatus(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setVerifyingCode(false);
    }
  };

  const sendMessage = async () => {
    setStatus('');
    setSendingMessage(true);

    try {
      const res = await fetch('/api/contact/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send message');
      }

      setStatus(data.message || 'Message sent successfully.');
      setSubject('');
      setMessage('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="ProfilePage" style={{ textAlign: 'left', padding: '12px' }}>
      <div className="panel-card job-carousel-panel" style={{ maxWidth: '900px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>Contact Me</h2>
        <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '0.9rem' }}>
          Two-step flow: verify identity first, then send message to tbudhe@yunextgenai.com.
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', marginBottom: '12px', background: '#fafafa' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Step 1 - Verification</h3>

          <p style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.9rem' }}>
            Email verification is enabled. Phone verification is temporarily disabled.
          </p>

          <div className="job-search-grid" style={{ alignItems: 'end' }}>
            <div className="job-search-field">
              <label>Email address</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="job-search-input"
                placeholder="you@example.com"
              />
            </div>
            <div className="job-search-field">
              <button
                type="button"
                className="resume-action-btn"
                disabled={sendingCode || !destination.trim()}
                onClick={requestCode}
              >
                {sendingCode ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </div>

          <div className="job-search-grid" style={{ marginTop: '10px', alignItems: 'end' }}>
            <div className="job-search-field">
              <label>Verification code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="job-search-input"
                placeholder="Enter 6-digit code"
              />
            </div>
            <div className="job-search-field">
              <button
                type="button"
                className="resume-action-btn"
                disabled={verifyingCode || !sessionId || !code.trim()}
                onClick={verify}
              >
                {verifyingCode ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', background: '#fafafa' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Step 2 - Send Message</h3>

          <div className="job-search-field" style={{ marginBottom: '10px' }}>
            <label>To</label>
            <input type="text" value="tbudhe@yunextgenai.com" className="job-search-input" readOnly />
          </div>

          <div className="job-search-field" style={{ marginBottom: '10px' }}>
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="job-search-input"
              placeholder="Write subject"
            />
          </div>

          <div className="job-search-field">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }}
              placeholder="Write your message"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button type="button" className="resume-action-btn" onClick={resetMessageForm}>Cancel</button>
            <button
              type="button"
              className="resume-action-btn primary"
              disabled={!verified || sendingMessage || !subject.trim() || !message.trim()}
              onClick={sendMessage}
            >
              {sendingMessage ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>

        {status && (
          <p style={{ margin: '12px 0 0', color: '#334155', fontSize: '0.9rem' }}>{status}</p>
        )}
      </div>
    </div>
  );
};

export default ContactPage;

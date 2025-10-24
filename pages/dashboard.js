import { useState } from 'react';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const sendNotification = async () => {
    setStatus('Sending...');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });

      const result = await res.json();
      if (result.success) {
        setStatus('✅ Notification sent!');
      } else {
        setStatus('❌ Failed to send.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error occurred.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📣 Push Notification Dashboard</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%', height: '100px' }}
      />
      <button onClick={sendNotification}>Send Notification</button>
      <p>{status}</p>
    </div>
  );
}

import { useState } from 'react';

export default function Dashboard() {
  const [casino, setCasino] = useState('');
  const [status, setStatus] = useState('');

  const scheduleReminder = async () => {
    setStatus('Scheduling...');
    try {
      const res = await fetch('/api/schedule-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ casino }),
      });

      const result = await res.json();
      if (result.success) {
        const reminderTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();
setStatus(`✅ Reminder set for "${casino}". You’ll get a notification on ${reminderTime}.`);   
   } else {
        setStatus('❌ Failed to schedule.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error occurred.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎰 Casino Reminder Dashboard</h1>
      <input
        type="text"
        placeholder="Which casino?"
        value={casino}
        onChange={e => setCasino(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <button onClick={scheduleReminder}>Schedule Reminder</button>
      <p>{status}</p>
    </div>
  );
}

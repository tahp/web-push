import { useState } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function Dashboard() {
  const [casino, setCasino] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [status, setStatus] = useState('');

  const scheduleReminder = async () => {
    if (!casino || !date || !time) {
      setStatus('❌ Please fill out all fields.');
      return;
    }
    setStatus('Scheduling...');
    try {
      const reminderTime = new Date(`${date}T${time}`);
      const timestamp = reminderTime.getTime();

      if (isNaN(timestamp)) {
        setStatus('❌ Invalid date or time.');
        return;
      }

      const res = await fetch('/api/schedule-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ casino, timestamp }),
      });

      const result = await res.json();
      if (result.success) {
        setStatus(`✅ Reminder set for "${casino}". You’ll get a notification on ${reminderTime.toLocaleString()}.`);
      } else {
        setStatus(`❌ Failed to schedule: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error occurred.');
    }
  };

  const checkReminders = async () => {
    setStatus('Checking reminders...');
    try {
      const res = await fetch('/api/check-reminders');
      const result = await res.json();
      if (result.success) {
        setStatus(`✅ Sent ${result.sent} notifications.`);
      } else {
        setStatus(`❌ Failed to check reminders: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error occurred.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>🎰 Casino Reminder Dashboard</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Which casino?"
          value={casino}
          onChange={e => setCasino(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ padding: '0.5rem', flex: 1 }}
          />
          <TimePicker
            onChange={setTime}
            value={time}
            clearIcon={null}
            clockIcon={null}
            style={{ padding: '0.5rem', flex: 1 }}
          />
        </div>
        <button onClick={scheduleReminder} style={{ padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Schedule Reminder
        </button>
        <button onClick={checkReminders} style={{ padding: '0.75rem', background: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Check Reminders
        </button>
        {status && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{status}</p>}
      </div>
    </div>
  );
}
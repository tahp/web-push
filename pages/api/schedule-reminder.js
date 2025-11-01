import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { casino, timestamp } = req.body;
  if (!casino) return res.status(400).json({ success: false, error: 'Casino name required' });

  console.log('Received timestamp:', timestamp);
  console.log('Server time:', Date.now());

  const reminder = {
    casino,
    timestamp: timestamp || Date.now() + 24 * 60 * 60 * 1000 // Use provided timestamp or default to 24 hours
  };

  const filePath = path.resolve(process.cwd(), 'reminders.json');
  let reminders = [];

  try {
    if (fs.existsSync(filePath)) {
      reminders = JSON.parse(fs.readFileSync(filePath));
    }
    reminders.push(reminder);
    fs.writeFileSync(filePath, JSON.stringify(reminders, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to save reminder:', err);
    res.status(500).json({ success: false, error: 'Failed to save reminder' });
  }
}

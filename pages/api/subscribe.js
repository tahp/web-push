import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const subscription = req.body;
  const filePath = path.resolve(process.cwd(), 'subscription.json');

  try {
    fs.writeFileSync(filePath, JSON.stringify(subscription, null, 2));
    console.log('Subscription saved:', subscription);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to save subscription:', err);
    res.status(500).json({ success: false, error: 'Failed to save subscription' });
  }
}

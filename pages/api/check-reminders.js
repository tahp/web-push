import fs from 'fs';
import path from 'path';
import webpush from 'web-push';

export default async function handler(req, res) {
  const filePath = path.resolve(process.cwd(), 'reminders.json');
  const subPath = path.resolve(process.cwd(), 'subscription.json');

  if (!fs.existsSync(filePath)) return res.status(200).json({ success: true, message: 'No reminders' });
  if (!fs.existsSync(subPath)) return res.status(400).json({ success: false, error: 'Subscription not found' });

  const subscription = JSON.parse(fs.readFileSync(subPath));
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:you@example.com';
  webpush.setVapidDetails(subject, publicKey, privateKey);

  let reminders = JSON.parse(fs.readFileSync(filePath));
  const now = Date.now();
  console.log('Checking reminders at:', now);

  const due = reminders.filter(r => {
    console.log(`Reminder for ${r.casino} is due at ${r.timestamp}`);
    return r.timestamp <= now;
  });
  const remaining = reminders.filter(r => r.timestamp > now);
  const sentCasinos = new Set();

  for (const r of due) {
    if (sentCasinos.has(r.casino)) continue;

    const payload = JSON.stringify({
      title: `⏰ Time to check ${r.casino}`,
      body: `It's been 24 hours since you claimed your reward at ${r.casino}.`,
    });

    try {
      await webpush.sendNotification(subscription, payload);
      sentCasinos.add(r.casino);
    } catch (err) {
      console.error('Push failed:', err);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(remaining, null, 2));
  res.status(200).json({ success: true, sent: sentCasinos.size });
}

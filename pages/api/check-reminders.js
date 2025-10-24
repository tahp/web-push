import fs from 'fs';
import path from 'path';
import webpush from 'web-push';

const subscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/egxXMXehrXU:APA91b...',
  keys: {
    p256dh: 'BLnz_XFzWvWeC8m7fm-b91Cu-eXK8PSoT1gQ2OFnJYO-KiheZJetymclD5Zvdh_Ffwr9oB3Ndq82wA-W6zTwBB0',
    auth: 'YkgowBXWGlo4mGiI29MbkQ'
  }
};

export default async function handler(req, res) {
  const filePath = path.resolve(process.cwd(), 'reminders.json');
  if (!fs.existsSync(filePath)) return res.status(200).json({ success: true, message: 'No reminders' });

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:you@example.com';
  webpush.setVapidDetails(subject, publicKey, privateKey);

  let reminders = JSON.parse(fs.readFileSync(filePath));
  const now = Date.now();
  const due = reminders.filter(r => r.timestamp <= now);
  const remaining = reminders.filter(r => r.timestamp > now);

  for (const r of due) {
    const payload = JSON.stringify({
      title: `⏰ Time to check ${r.casino}`,
      body: `It's been 24 hours since you claimed your reward at ${r.casino}.`,
    });

    try {
      await webpush.sendNotification(subscription, payload);
    } catch (err) {
      console.error('Push failed:', err);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(remaining, null, 2));
  res.status(200).json({ success: true, sent: due.length });
}

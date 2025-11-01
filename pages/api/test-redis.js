import { Redis } from '@upstash/redis';
import webpush from 'web-push';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:you@example.com';
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const reminders = await redis.lrange('reminders', 0, -1);
  const now = Date.now();
  const due = reminders
    .map(r => JSON.parse(r))
    .filter(r => r.timestamp <= now);

  const remaining = reminders
    .map(r => JSON.parse(r))
    .filter(r => r.timestamp > now);

  // Replace with loop over stored subscriptions if needed
  for (const r of due) {
    const payload = JSON.stringify({
      title: `⏰ Time to check ${r.casino}`,
      body: `It's been 24 hours since you claimed your reward at ${r.casino}.`,
    });

    try {
      // FIXME: This is a placeholder subscription object.
      // You should retrieve the actual subscription object from your database
      // and replace this placeholder.
      const subscription = {};
      await webpush.sendNotification(subscription, payload);
    } catch (err) {
      console.error('Push failed:', err);
    }
  }

  // Reset Redis list with remaining reminders
  await redis.del('reminders');
  for (const r of remaining) {
    await redis.rpush('reminders', JSON.stringify(r));
  }

  res.status(200).json({ success: true, sent: due.length });
}

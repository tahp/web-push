import webpush from 'web-push';

export default async function handler(req, res) {
  // Set VAPID details inside the handler
  webpush.setVapidDetails(
    'mailto:you@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const subscription = req.body;
  const payload = JSON.stringify({ title: 'Hello!', body: 'This is a test push.' });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notification', message: err.message });
  }
}

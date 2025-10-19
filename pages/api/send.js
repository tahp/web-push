import webpush from 'web-push';

export default async function handler(req, res) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:you@example.com';
  
  // Debug: Check what we have
  if (!publicKey || !privateKey) {
    return res.status(500).json({ 
      error: 'Environment variables missing',
      debug: {
        publicKeyExists: !!publicKey,
        privateKeyExists: !!privateKey,
        publicKeyLength: publicKey?.length || 0,
        privateKeyLength: privateKey?.length || 0
      }
    });
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    
    const subscription = req.body;
    const payload = JSON.stringify({ title: 'Hello!', body: 'This is a test push.' });

    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Failed to send notification',
      message: err.message 
    });
  }
}

import webpush from 'web-push';

export default async function handler(req, res) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:you@example.com';

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

    const { title, body } = req.body;

    // TODO: Replace this with your actual stored subscription
    const subscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/egxXMXehrXU:APA91bGYgmkSnS6jMtO_Z2rbmrIurRCvIaiEkotD_0emauMfaKLnKuTMUvpwU8DO4N7GMo0tPGUy6xqYBM3K3iuklqBDejTd1q-fAyktYYlFhWoQanPSP0XtAUAcFKHjv_DSOsf1WV_b',
  keys: {
    p256dh: 'BLnz_XFzWvWeC8m7fm-b91Cu-eXK8PSoT1gQ2OFnJYO-KiheZJetymclD5Zvdh_Ffwr9oB3Ndq82wA-W6zTwBB0',
    auth: 'YkgowBXWGlo4mGiI29MbkQ'
  }
};
    const payload = JSON.stringify({ title, body });

    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Push error:', err);
    res.status(500).json({
      error: 'Failed to send notification',
      message: err.message
    });
  }
}

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    async function setupPush() {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });
        await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    setupPush();
  }, []);

  return <h1>Push Notifications Ready</h1>;
}

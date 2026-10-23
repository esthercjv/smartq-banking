// Device alerts for SmartQ — in-app popup event, browser notification and vibration.
// Every alert is deduplicated per user + key, so a ticket never alerts twice.

export interface DeviceAlertParams {
  userId: string;
  key: string;
  title: string;
  body: string;
  urgent?: boolean;
}

const FIRED_PREFIX = 'smartq_fired_alerts_';

export function isAlertSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getAlertPermission(): NotificationPermission | 'unsupported' {
  if (!isAlertSupported()) return 'unsupported';
  return Notification.permission;
}

// Must only be called from a click handler (browsers require a user gesture).
export async function requestAlertPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isAlertSupported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch (err) {
    console.error('ticketAlerts: failed to request notification permission', err);
    return Notification.permission;
  }
}

function readFiredKeys(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_PREFIX + userId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter((k): k is string => typeof k === 'string'));
      }
    }
  } catch (err) {
    console.error('ticketAlerts: failed to read fired alert keys', err);
  }
  return new Set<string>();
}

function writeFiredKeys(userId: string, keys: Set<string>): void {
  try {
    localStorage.setItem(FIRED_PREFIX + userId, JSON.stringify(Array.from(keys)));
  } catch (err) {
    console.error('ticketAlerts: failed to store fired alert keys', err);
  }
}

// Register the service worker once per page load.
let serviceWorkerRegistration: Promise<ServiceWorkerRegistration> | null = null;

function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> | null {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;
  if (!serviceWorkerRegistration) {
    serviceWorkerRegistration = navigator.serviceWorker.register('/sw.js');
  }
  return serviceWorkerRegistration;
}

export async function deviceAlert({ userId, key, title, body, urgent }: DeviceAlertParams): Promise<boolean> {
  // 1. Deduplicate: each key fires at most once per customer per device.
  const fired = readFiredKeys(userId);
  if (fired.has(key)) return false;
  fired.add(key);
  writeFiredKeys(userId, fired);

  // 2. In-app popup — always dispatched, even when notifications are blocked.
  try {
    window.dispatchEvent(
      new CustomEvent('smartq:alert', {
        detail: { key, title, body, urgent: !!urgent },
      })
    );
  } catch (err) {
    console.error('ticketAlerts: failed to dispatch in-app alert', err);
  }

  // 3. System notification when the customer granted permission.
  if (getAlertPermission() === 'granted') {
    const registration = getServiceWorkerRegistration();

    if (registration) {
      try {
        const reg = await registration;
        await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          body,
          tag: key,
          requireInteraction: !!urgent,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.error('ticketAlerts: service worker notification failed', err);
        serviceWorkerRegistration = null;
        try {
          new Notification(title, { body, tag: key, requireInteraction: !!urgent });
        } catch (fallbackErr) {
          console.error('ticketAlerts: fallback notification failed', fallbackErr);
        }
      }
    } else {
      // No service worker support — use the plain constructor.
      try {
        new Notification(title, { body, tag: key, requireInteraction: !!urgent });
      } catch (err) {
        console.error('ticketAlerts: notification failed', err);
      }
    }
  }

  // 4. Vibrate on devices that support it.
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(urgent ? [300, 150, 300, 150, 600] : [200, 100, 200]);
    } catch (err) {
      console.error('ticketAlerts: vibration failed', err);
    }
  }

  return true;
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface StaffNotificationBellProps {
  buttonClassName?: string; // lets the staff pages keep their own bell button styling
}

interface StaffNotification {
  key: string;
  type: 'info' | 'warning';
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}

const DEFAULT_BUTTON_CLASS =
  'relative p-2 text-on-surface-variant hover:text-secondary rounded-lg cursor-pointer';

// Local time hour bucket used to make "long queue" fire at most once per hour.
const localHourKey = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}`;
};

export default function StaffNotificationBell({ buttonClassName }: StaffNotificationBellProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Add a notification once per unique key (deduplication across pages/mounts).
  const addNotification = useCallback((n: StaffNotification) => {
    setNotifications(prev =>
      prev.some(x => x.key === n.key) ? prev : [n, ...prev].slice(0, 20)
    );
  }, []);

  const checkQueues = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('id, ticket_number, service_name, created_at')
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });

      if (error) {
        // Keep the existing notifications and just log the failure.
        console.error('StaffNotificationBell: failed to load waiting queue', error.message);
        return;
      }

      const rows = (data || []) as any[];
      const now = Date.now();
      const TEN_MINUTES = 10 * 60 * 1000;
      const FIFTEEN_MINUTES = 15 * 60 * 1000;

      // New customer: only very recent tickets so existing rows do not flood on first load.
      rows.forEach((row: any) => {
        const createdAt = new Date(row.created_at).getTime();
        if (!Number.isNaN(createdAt) && Date.now() - createdAt <= TEN_MINUTES) {
          addNotification({
            key: `${row.id}:joined`,
            type: 'info',
            title: 'New Customer in Line',
            message: `Ticket ${row.ticket_number} · ${row.service_name}`,
            createdAt: Date.now(),
            read: false,
          });
        }
      });

      // Long queue: at most once per hour (deduplicated by the hour key).
      if (rows.length >= 5) {
        addNotification({
          key: `long-queue:${localHourKey()}`,
          type: 'warning',
          title: 'Long Queue',
          message: `${rows.length} customers are waiting.`,
          createdAt: Date.now(),
          read: false,
        });
      }

      // Long wait: any waiting ticket older than 15 minutes.
      rows.forEach((row: any) => {
        const createdAt = new Date(row.created_at).getTime();
        if (!Number.isNaN(createdAt) && Date.now() - createdAt > FIFTEEN_MINUTES) {
          addNotification({
            key: `${row.id}:longwait`,
            type: 'warning',
            title: 'Customer Waiting Long',
            message: `Ticket ${row.ticket_number} has waited over 15 minutes.`,
            createdAt: Date.now(),
            read: false,
          });
        }
      });
    } catch (err) {
      console.error('StaffNotificationBell: failed to refresh notifications', err);
    }
  }, [addNotification]);

  // Initialise: load persisted notifications, run a check, subscribe to realtime
  // queue changes and poll as a fallback.
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      try {
        const raw = localStorage.getItem(`smartq_staff_notifications_${user.id}`);
        if (raw) setNotifications(JSON.parse(raw) as StaffNotification[]);
      } catch (err) {
        console.error('StaffNotificationBell: failed to read stored notifications', err);
      }

      checkQueues();

      channel = supabase
        .channel(`staff-notification-bell-${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'queues',
        }, () => {
          checkQueues();
        })
        .subscribe();

      interval = setInterval(() => checkQueues(), 10000);
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (interval) clearInterval(interval);
    };
  }, [checkQueues]);

  // Persist notifications whenever they change (capped list, try/catch).
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(
        `smartq_staff_notifications_${userId}`,
        JSON.stringify(notifications.slice(0, 20))
      );
    } catch (err) {
      console.error('StaffNotificationBell: failed to store notifications', err);
    }
  }, [notifications, userId]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (key: string) =>
    setNotifications(prev => prev.map(n => (n.key === key ? { ...n, read: true } : n)));

  const clearAll = () => setNotifications([]);

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const iconFor = (type: StaffNotification['type']) => {
    if (type === 'warning') {
      return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
    }
    return <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />;
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className={buttonClassName || DEFAULT_BUTTON_CLASS}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-xl border border-outline-variant/30 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center">
              <span className="font-bold text-primary text-sm">Notifications</span>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="text-xs font-semibold text-secondary cursor-pointer disabled:text-outline disabled:cursor-default"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                  <Bell className="w-6 h-6 text-outline/50" />
                  <p className="text-xs text-on-surface-variant font-medium">
                    You're all caught up. No notifications yet.
                  </p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.key}
                    onClick={() => markRead(n.key)}
                    className={`p-4 border-b border-outline-variant/10 flex items-start gap-2.5 cursor-pointer ${
                      n.read ? 'bg-white' : 'bg-secondary-container/20'
                    }`}
                  >
                    {iconFor(n.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-primary">{n.title}</p>
                      <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed mt-0.5">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-outline font-medium mt-1">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 bg-error rounded-full shrink-0 mt-1" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-outline-variant/20 text-center">
              <button
                type="button"
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="text-xs font-semibold text-on-surface-variant hover:text-primary cursor-pointer disabled:text-outline disabled:cursor-default"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

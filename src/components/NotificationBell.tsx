import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { deviceAlert, getAlertPermission, requestAlertPermission } from './ticketAlerts';

interface NotificationBellProps {
  buttonClassName?: string; // lets each page keep its current bell button styling
}

interface AppNotification {
  key: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}

interface AlertPopup {
  key: string;
  title: string;
  body: string;
  urgent: boolean;
}

const DEFAULT_BUTTON_CLASS =
  'relative p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-lg cursor-pointer';

export default function NotificationBell({ buttonClassName }: NotificationBellProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [alertPermission, setAlertPermission] = useState<NotificationPermission | 'unsupported'>(
    () => getAlertPermission()
  );
  const [popup, setPopup] = useState<AlertPopup | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastActiveTicketRef = useRef<{ id: string; ticket_number: string } | null>(null);
  // Every key ever added (kept in sync with the persisted list) so callers know
  // whether an event is new and should also fire a device alert.
  const knownKeysRef = useRef<Set<string>>(new Set());

  // Add a notification once per unique key (deduplication across pages/mounts).
  // Returns true when the notification was newly added.
  const addNotification = useCallback((n: AppNotification): boolean => {
    if (knownKeysRef.current.has(n.key)) return false;
    knownKeysRef.current.add(n.key);
    setNotifications(prev =>
      prev.some(x => x.key === n.key) ? prev : [n, ...prev].slice(0, 50)
    );
    return true;
  }, []);

  const checkTicket = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('NotificationBell: failed to load ticket', error.message);
        return;
      }

      const ticket = data && data.length > 0 ? data[0] : null;

      // Detect cancellation: a previously active ticket no longer appears.
      const prevTicket = lastActiveTicketRef.current;
      if (prevTicket && (!ticket || ticket.id !== prevTicket.id)) {
        addNotification({
          key: `${prevTicket.id}:cancelled`,
          type: 'error',
          title: 'Ticket Cancelled',
          message: `Your ticket ${prevTicket.ticket_number} has been cancelled.`,
          createdAt: Date.now(),
          read: false,
        });
        deviceAlert({
          userId: uid,
          key: `${prevTicket.id}:cancelled`,
          title: 'Ticket Cancelled',
          body: `Your ticket ${prevTicket.ticket_number} has been cancelled.`,
        }).catch((err) => console.error('NotificationBell: device alert failed', err));
        lastActiveTicketRef.current = null;
      }

      if (!ticket) return;

      // If current ticket is cancelled, don't generate issued/almost/serving
      if (ticket.status === 'cancelled') {
        addNotification({
          key: `${ticket.id}:cancelled`,
          type: 'error',
          title: 'Ticket Cancelled',
          message: `Your ticket ${ticket.ticket_number} has been cancelled.`,
          createdAt: Date.now(),
          read: false,
        });
        lastActiveTicketRef.current = null;
        return;
      }

      if (ticket.status === 'no_show') {
        addNotification({
          key: `${ticket.id}:no_show`,
          type: 'error',
          title: 'Marked as No-Show',
          message: `Ticket ${ticket.ticket_number} was marked as no-show because you were not present when called.`,
          createdAt: Date.now(),
          read: false,
        });
        deviceAlert({
          userId: uid,
          key: `${ticket.id}:no_show`,
          title: 'Marked as No-Show',
          body: `Ticket ${ticket.ticket_number} was marked as no-show because you were not present when called.`,
        }).catch((err) => console.error('NotificationBell: device alert failed', err));
        lastActiveTicketRef.current = null;
        return;
      }

      // Ticket issued
      addNotification({
        key: `${ticket.id}:issued`,
        type: 'success',
        title: 'Ticket Issued',
        message: `Your ticket ${ticket.ticket_number} for ${ticket.service_name} is confirmed.`,
        createdAt: Date.now(),
        read: false,
      });

      // How many waiting customers are ahead of this ticket?
      let countAhead: number | null = null;
      if (ticket.status === 'waiting') {
        const { count, error: countError } = await supabase
          .from('queues')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'waiting')
          .lt('created_at', ticket.created_at);

        if (countError) {
          console.error('NotificationBell: failed to count customers ahead', countError.message);
          countAhead = ticket.waiting_ahead ?? null;
        } else {
          countAhead = count ?? 0;
        }
      }

      // Almost your turn
      if (ticket.status === 'waiting' && countAhead !== null && countAhead > 0 && countAhead <= 2) {
        const isNew = addNotification({
          key: `${ticket.id}:almost`,
          type: 'warning',
          title: 'Almost Your Turn',
          message: `Only ${countAhead} customer(s) ahead of you. Please stay close to the counters.`,
          createdAt: Date.now(),
          read: false,
        });
        if (isNew) {
          deviceAlert({
            userId: uid,
            key: `${ticket.id}:almost`,
            title: 'Get ready — your turn is very soon',
            body: `Only ${countAhead} customer(s) ahead of you for ticket ${ticket.ticket_number}. Please stay close to the counters.`,
          }).catch((err) => console.error('NotificationBell: device alert failed', err));
        }
      }

      // It's your turn
      if (ticket.status === 'serving') {
        const isNew = addNotification({
          key: `${ticket.id}:serving`,
          type: 'info',
          title: "It's Your Turn!",
          message: `Ticket ${ticket.ticket_number} is now being served. Please proceed to the counter.`,
          createdAt: Date.now(),
          read: false,
        });
        if (isNew) {
          deviceAlert({
            userId: uid,
            key: `${ticket.id}:serving`,
            urgent: true,
            title: "It's your turn!",
            body: `Ticket ${ticket.ticket_number} is now being served at ${ticket.counter_id || 'the counter'}. Please proceed now.`,
          }).catch((err) => console.error('NotificationBell: device alert failed', err));
        }
      }

      // Completed
      if (ticket.status === 'completed') {
        addNotification({
          key: `${ticket.id}:completed`,
          type: 'success',
          title: 'Service Completed',
          message: `Thank you for visiting SmartQ. Ticket ${ticket.ticket_number} has been completed.`,
          createdAt: Date.now(),
          read: false,
        });
        lastActiveTicketRef.current = null;
        return;
      }

      // Remember the active ticket for cancellation detection.
      if (ticket.status === 'waiting' || ticket.status === 'serving') {
        lastActiveTicketRef.current = {
          id: ticket.id,
          ticket_number: ticket.ticket_number,
        };
      } else {
        lastActiveTicketRef.current = null;
      }
    } catch (err) {
      console.error('NotificationBell: checkTicket failed', err);
    }
  }, [addNotification]);

  // Initialise: load persisted notifications, run a check, subscribe to realtime
  // changes and poll as a fallback.
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      try {
        const raw = localStorage.getItem(`smartq_notifications_${user.id}`);
        if (raw) {
          const stored = JSON.parse(raw) as AppNotification[];
          setNotifications(stored);
          const keys = new Set<string>();
          stored.forEach(n => {
            if (n && typeof n.key === 'string') keys.add(n.key);
          });
          knownKeysRef.current = keys;
        }
      } catch (err) {
        console.error('NotificationBell: failed to read stored notifications', err);
      }

      checkTicket(user.id);

      channel = supabase
        .channel(`notification-bell-${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'queues',
          filter: `user_id=eq.${user.id}`,
        }, () => {
          checkTicket(user.id);
        })
        .subscribe();

      interval = setInterval(() => checkTicket(user.id), 10000);
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (interval) clearInterval(interval);
    };
  }, [checkTicket]);

  // Persist notifications whenever they change.
  useEffect(() => {
    if (!userId) return;
    try {
      if (notifications.length === 0) {
        localStorage.removeItem(`smartq_notifications_${userId}`);
        return;
      }
      localStorage.setItem(`smartq_notifications_${userId}`, JSON.stringify(notifications));
    } catch (err) {
      console.error('NotificationBell: failed to store notifications', err);
    }
  }, [notifications, userId]);

  // In-app alert popup — listens for device alerts raised anywhere in the app.
  useEffect(() => {
    const onAlert = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { key?: string; title?: string; body?: string; urgent?: boolean }
        | undefined;
      if (!detail || typeof detail.key !== 'string') return;

      const urgent = !!detail.urgent;
      const title = detail.title ?? '';
      const body = detail.body ?? '';

      // Add it to the list when this key is not there yet.
      if (!knownKeysRef.current.has(detail.key)) {
        addNotification({
          key: detail.key,
          type: detail.key.includes(':serving') ? 'info' : urgent ? 'info' : 'warning',
          title,
          message: body,
          createdAt: Date.now(),
          read: false,
        });
      } else {
        // still show popup for new alerts
      }

      // Only one popup at a time — the newest replaces the older.
      setPopup({ key: detail.key, title, body, urgent });
    };

    window.addEventListener('smartq:alert', onAlert);
    return () => window.removeEventListener('smartq:alert', onAlert);
  }, [addNotification]);

  // Normal popups auto-dismiss after 10 seconds; urgent ones stay until handled.
  useEffect(() => {
    if (!popup || popup.urgent) return;
    const timer = setTimeout(() => setPopup(null), 10000);
    return () => clearTimeout(timer);
  }, [popup]);

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

  const clearAll = () => {
    setNotifications([]);
    knownKeysRef.current = new Set();
  };

  const handleEnableAlerts = async () => {
    const result = await requestAlertPermission();
    setAlertPermission(result);
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const iconFor = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-secondary shrink-0" />;
    }
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
                    No notifications yet.
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

            {/* Device alert permission row */}
            <div className="p-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
              {alertPermission === 'default' && (
                <>
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    Get alerts on this device
                  </span>
                  <button
                    type="button"
                    onClick={handleEnableAlerts}
                    className="text-[11px] font-bold text-secondary hover:underline cursor-pointer shrink-0"
                  >
                    Enable
                  </button>
                </>
              )}
              {alertPermission === 'denied' && (
                <span className="text-[11px] text-outline font-medium">
                  Alerts are blocked in your browser settings.
                </span>
              )}
              {alertPermission === 'unsupported' && (
                <span className="text-[11px] text-outline font-medium">
                  Device alerts are not supported on this browser. Keep this page open.
                </span>
              )}
              {alertPermission === 'granted' && (
                <span className="text-[11px] font-bold text-green-600">Device alerts on ✓</span>
              )}
            </div>

            <div className="p-2 border-t border-outline-variant/20 text-center">
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

      {/* In-app alert popup — the newest alert replaces the older one */}
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup.key}
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ duration: 0.25 }}
            onClick={() => setPopup(null)}
            role="alert"
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-md rounded-xl shadow-2xl border p-4 flex items-start gap-3 cursor-pointer ${
              popup.urgent
                ? 'bg-green-600 border-green-700 text-white'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {popup.urgent ? (
              <CheckCircle2 className="w-6 h-6 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`font-bold ${popup.urgent ? 'text-base' : 'text-sm'}`}>{popup.title}</p>
              <p
                className={`mt-0.5 leading-relaxed ${
                  popup.urgent ? 'text-sm font-semibold' : 'text-xs font-medium'
                }`}
              >
                {popup.body}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPopup(null);
              }}
              aria-label="Dismiss alert"
              className={`shrink-0 cursor-pointer ${
                popup.urgent ? 'text-white/80 hover:text-white' : 'text-amber-700/70 hover:text-amber-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertTriangle, Info, XCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Operational thresholds for the manager/admin alerts.
const LONG_QUEUE = 5;
const LONG_WAIT_MIN = 15;
const NO_SHOW_ALERT = 3;

interface ManagementNotificationBellProps {
  role: 'manager' | 'admin';
  buttonClassName?: string; // lets each page keep its current bell button styling
}

interface ManagementNotification {
  key: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}

const DEFAULT_BUTTON_CLASS =
  'relative p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-lg cursor-pointer';

// Local time buckets — hourly keys fire at most once per hour, daily keys once per day.
const localHourKey = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}`;
};

const localDayKey = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export default function ManagementNotificationBell({ role, buttonClassName }: ManagementNotificationBellProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ManagementNotification[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Add a notification once per unique key (deduplication across checks/mounts).
  const addNotification = useCallback((n: ManagementNotification) => {
    setNotifications(prev =>
      prev.some(x => x.key === n.key) ? prev : [n, ...prev].slice(0, 20)
    );
  }, []);

  // Manager events: real queue, counter and no-show data only.
  const checkManager = useCallback(async () => {
    try {
      const { data: waitingRows, error: waitingError } = await supabase
        .from('queues')
        .select('id, ticket_number, created_at')
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });

      if (waitingError) {
        console.error('ManagementNotificationBell: failed to load waiting queue', waitingError.message);
        return;
      }

      const rows = (waitingRows ?? []) as any[];
      const now = Date.now();

      // Long queue: at least LONG_QUEUE customers waiting (at most once per hour).
      if (rows.length >= LONG_QUEUE) {
        addNotification({
          key: `long-queue:${localHourKey()}`,
          type: 'warning',
          title: 'Long Queue',
          message: `${rows.length} customers are waiting.`,
          createdAt: now,
          read: false,
        });
      }

      // Long wait: a waiting ticket older than LONG_WAIT_MIN minutes.
      rows.forEach((row) => {
        const createdAt = new Date(row.created_at).getTime();
        if (Number.isNaN(createdAt)) return;
        const waitedMinutes = Math.floor((now - createdAt) / 60000);
        if (waitedMinutes > LONG_WAIT_MIN) {
          addNotification({
            key: `${row.id}:longwait`,
            type: 'warning',
            title: 'Customer Waiting Long',
            message: `Ticket ${row.ticket_number} has waited over ${waitedMinutes} minutes.`,
            createdAt: now,
            read: false,
          });
        }
      });

      // No active counter while customers are waiting.
      if (rows.length > 0) {
        const { count: staffedCounters, error: counterError } = await supabase
          .from('counters')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active')
          .not('staff_id', 'is', null);

        if (counterError) {
          console.error('ManagementNotificationBell: failed to count active counters', counterError.message);
        } else if ((staffedCounters ?? 0) === 0) {
          addNotification({
            key: `no-counter:${localHourKey()}`,
            type: 'error',
            title: 'No Counter Available',
            message: 'Customers are waiting but no counter is active.',
            createdAt: now,
            read: false,
          });
        }
      }

      // No-shows created today.
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count: noShowCount, error: noShowError } = await supabase
        .from('queues')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'no_show')
        .gte('created_at', todayStart.toISOString());

      if (noShowError) {
        console.error('ManagementNotificationBell: failed to count no-shows', noShowError.message);
      } else if ((noShowCount ?? 0) >= NO_SHOW_ALERT) {
        addNotification({
          key: `noshow:${localDayKey()}`,
          type: 'warning',
          title: 'High No-Show Count',
          message: `${noShowCount} customers did not show up today.`,
          createdAt: now,
          read: false,
        });
      }
    } catch (err) {
      console.error('ManagementNotificationBell: manager checks failed', err);
    }
  }, [addNotification]);

  // Admin events: real profiles, counters and users from the admin RPC.
  const checkAdmin = useCallback(async () => {
    try {
      const now = Date.now();

      // Lightweight head count — detects a database connection problem.
      const { error: dbError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (dbError) {
        console.error('ManagementNotificationBell: database unreachable', dbError.message);
        addNotification({
          key: `db-down:${localHourKey()}`,
          type: 'error',
          title: 'Database Connection Problem',
          message: 'The system could not reach the database.',
          createdAt: now,
          read: false,
        });
        return;
      }

      // New users registered in the last 24 hours (at most 5 per check).
      const { data: userRows, error: usersError } = await supabase.rpc('get_all_users');
      if (usersError) {
        console.error('ManagementNotificationBell: failed to load users', usersError.message);
      } else {
        const cutoff = now - 24 * 60 * 60 * 1000;
        ((userRows ?? []) as any[])
          .filter((u) => {
            const createdAt = new Date(u.created_at).getTime();
            return !Number.isNaN(createdAt) && createdAt >= cutoff;
          })
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .forEach((u) => {
            addNotification({
              key: `${u.id}:signup`,
              type: 'info',
              title: 'New User Registered',
              message: `${u.full_name || u.email} joined as ${u.role}.`,
              createdAt: now,
              read: false,
            });
          });
      }

      // Counters and their staff assignments.
      const { data: counterRows, error: counterError } = await supabase
        .from('counters')
        .select('id, name, staff_id, status');

      if (counterError) {
        console.error('ManagementNotificationBell: failed to load counters', counterError.message);
      } else {
        const counters = (counterRows ?? []) as any[];

        // Active counters without an assigned staff member.
        counters
          .filter((c) => c.status === 'active' && !c.staff_id)
          .forEach((c) => {
            addNotification({
              key: `counter-nostaff:${c.id}`,
              type: 'warning',
              title: 'Counter Has No Staff',
              message: `${c.name} is active but no staff member is assigned.`,
              createdAt: now,
              read: false,
            });
          });

        // Staff profiles not referenced by any counter.
        const { data: staffRows, error: staffError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'staff');

        if (staffError) {
          console.error('ManagementNotificationBell: failed to load staff profiles', staffError.message);
        } else {
          const assignedStaffIds = new Set(
            counters.map((c) => c.staff_id).filter((id) => !!id)
          );

          ((staffRows ?? []) as any[])
            .filter((p) => !assignedStaffIds.has(p.id))
            .forEach((p) => {
              addNotification({
                key: `staff-nocounter:${p.id}`,
                type: 'warning',
                title: 'Staff Not Assigned',
                message: `${p.full_name || p.email} has no counter and cannot call customers.`,
                createdAt: now,
                read: false,
              });
            });
        }
      }
    } catch (err) {
      console.error('ManagementNotificationBell: admin checks failed', err);
    }
  }, [addNotification]);

  const checkEvents = useCallback(async () => {
    if (role === 'manager') await checkManager();
    else await checkAdmin();
  }, [role, checkManager, checkAdmin]);

  // Initialise: load persisted notifications, run a check, subscribe to realtime
  // changes on the relevant tables and poll as a fallback.
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      setUserId(user.id);

      try {
        const raw = localStorage.getItem(`smartq_mgmt_notifications_${user.id}`);
        if (raw) setNotifications(JSON.parse(raw) as ManagementNotification[]);
      } catch (err) {
        console.error('ManagementNotificationBell: failed to read stored notifications', err);
      }

      checkEvents();

      channel = supabase.channel(`mgmt-notification-bell-${user.id}`);

      if (role === 'manager') {
        channel = channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'queues' }, () => checkEvents())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'counters' }, () => checkEvents());
      } else {
        channel = channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => checkEvents())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'counters' }, () => checkEvents());
      }

      channel = channel.subscribe();

      interval = setInterval(() => checkEvents(), 15000);
    };

    init();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
      if (interval) clearInterval(interval);
    };
  }, [checkEvents, role]);

  // Persist notifications whenever they change (capped list, try/catch).
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(
        `smartq_mgmt_notifications_${userId}`,
        JSON.stringify(notifications.slice(0, 20))
      );
    } catch (err) {
      console.error('ManagementNotificationBell: failed to store notifications', err);
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

  const iconFor = (type: ManagementNotification['type']) => {
    if (type === 'warning') {
      return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
    }
    if (type === 'error') {
      return <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
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

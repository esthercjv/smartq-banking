import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Settings,
  ShieldCheck,
  Activity,
  Users,
  CheckCircle2,
  Clock,
  Sliders
} from 'lucide-react';
import { AdminSidebar } from './AdminSubPages';
import ManagementNotificationBell from './ManagementNotificationBell';

// ─── Branch hour constants ───────────────────────────────────────────────────
const OPEN_HOUR = 8;
const CLOSE_HOUR = 18;
const PAGE_SIZE = 1000;

interface QueueRow {
  ticket_number: string | null;
  service_name: string | null;
  status: string;
  counter_id: string | null;
  issued_time: string | null;
  created_at: string;
  called_at: string | null;
  completed_at: string | null;
}

interface HourBar {
  label: string;
  count: number;
}

interface TrendPoint {
  label: string;
  avgMs: number;
}

interface ManagerData {
  waitingNow: number | null;
  servedToday: number | null;
  avgWaitToday: number | null;
  activeCounters: number | null;
  totalCounters: number | null;
  prevWaiting: number | null;
  prevServed: number | null;
  prevAvgWait: number | null;
  queues: QueueRow[] | null;
  hourly: HourBar[];
  trend: TrendPoint[];
}

interface SignupRow {
  id: string;
  name: string;
  role: string;
}

interface AdminData {
  totalUsers: number | null;
  staffAccounts: number | null;
  activeServices: number | null;
  totalServices: number | null;
  activeCounters: number | null;
  totalCounters: number | null;
  roleCounts: { role: string; count: number }[] | null;
  dbMs: number | null;
  signups: SignupRow[] | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function startOfDay(offsetDays = 0): Date {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() + offsetDays);
  return d;
}

function hourLabel(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}${suffix}`;
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function pctChange(curr: number | null, prev: number | null): number | null {
  if (curr === null || prev === null || prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

async function headCount(build: () => PromiseLike<{ count: number | null; error: { message: string } | null }>): Promise<number | null> {
  try {
    const { count, error } = await build();
    if (error) {
      console.error('Count query failed:', error.message);
      return null;
    }
    return count ?? 0;
  } catch (err) {
    console.error('Count query failed:', err);
    return null;
  }
}

async function fetchQueuesSince(sinceISO: string): Promise<QueueRow[] | null> {
  const rows: QueueRow[] = [];
  let from = 0;
  try {
    for (;;) {
      const { data, error } = await supabase
        .from('queues')
        .select('ticket_number, service_name, status, counter_id, issued_time, created_at, called_at, completed_at')
        .gte('created_at', sinceISO)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (error) {
        console.error('Failed to load queues:', error.message);
        return null;
      }
      const batch = (data ?? []) as QueueRow[];
      rows.push(...batch);
      if (batch.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }
    return rows;
  } catch (err) {
    console.error('Failed to load queues:', err);
    return null;
  }
}

function avgWaitMs(rows: QueueRow[]): number | null {
  let total = 0;
  let n = 0;
  for (const r of rows) {
    if (!r.called_at) continue;
    total += new Date(r.called_at).getTime() - new Date(r.created_at).getTime();
    n++;
  }
  return n > 0 ? total / n : null;
}

async function loadManager(): Promise<ManagerData> {
  const todayStart = startOfDay();
  const prevStart = startOfDay(-1);
  const windowStart = startOfDay(-6);
  const todayISO = todayStart.toISOString();
  const prevISO = prevStart.toISOString();
  const windowISO = windowStart.toISOString();

  const [waitingNow, prevWaiting, servedToday, prevServed, activeCounters, totalCounters, queues] = await Promise.all([
    headCount(() => supabase.from('queues').select('id', { count: 'exact', head: true }).eq('status', 'waiting')),
    headCount(() => supabase.from('queues').select('id', { count: 'exact', head: true }).eq('status', 'waiting').gte('created_at', prevISO).lt('created_at', todayISO)),
    headCount(() => supabase.from('queues').select('id', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', todayISO)),
    headCount(() => supabase.from('queues').select('id', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', prevISO).lt('completed_at', todayISO)),
    headCount(() => supabase.from('counters').select('id', { count: 'exact', head: true }).eq('status', 'active')),
    headCount(() => supabase.from('counters').select('id', { count: 'exact', head: true })),
    fetchQueuesSince(windowISO)
  ]);

  // Today's tickets (created since local midnight)
  const todayRows = queues ? queues.filter(r => new Date(r.created_at).getTime() >= todayStart.getTime()) : null;
  const prevRows = queues
    ? queues.filter(r => {
        const t = new Date(r.created_at).getTime();
        return t >= prevStart.getTime() && t < todayStart.getTime();
      })
    : null;

  const avgWaitToday = todayRows ? avgWaitMs(todayRows) : null;
  const prevAvgWait = prevRows ? avgWaitMs(prevRows) : null;

  // Queue volume by hour (today, extend range if data falls outside branch hours)
  let hourly: HourBar[] = [];
  if (todayRows) {
    const counts = new Map<number, number>();
    let minHour = OPEN_HOUR;
    let maxHour = CLOSE_HOUR;
    for (const r of todayRows) {
      const h = new Date(r.created_at).getHours();
      counts.set(h, (counts.get(h) ?? 0) + 1);
      if (h < minHour) minHour = h;
      if (h > maxHour) maxHour = h;
    }
    for (let h = minHour; h <= maxHour; h++) {
      hourly.push({ label: hourLabel(h), count: counts.get(h) ?? 0 });
    }
  }

  // Wait time trend: average wait per day over the last 7 days
  const trend: TrendPoint[] = [];
  if (queues) {
    for (let i = 6; i >= 0; i--) {
      const dayStart = startOfDay(-i);
      const dayEnd = startOfDay(-i + 1);
      const s = dayStart.getTime();
      const e = dayEnd.getTime();
      const dayRows = queues.filter(r => {
        const t = new Date(r.created_at).getTime();
        return t >= s && t < e && !!r.called_at;
      });
      const avg = avgWaitMs(dayRows);
      if (avg !== null) {
        trend.push({ label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }), avgMs: avg });
      }
    }
  }

  return {
    waitingNow,
    servedToday,
    avgWaitToday,
    activeCounters,
    totalCounters,
    prevWaiting,
    prevServed,
    prevAvgWait,
    queues,
    hourly,
    trend
  };
}

async function loadAdmin(): Promise<AdminData> {
  const [totalUsers, staffAccounts, activeServices, totalServices, activeCounters, totalCounters, cCustomer, cStaff, cManager, cAdmin] = await Promise.all([
    headCount(() => supabase.from('profiles').select('id', { count: 'exact', head: true })),
    headCount(() => supabase.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['staff', 'manager', 'admin'])),
    headCount(() => supabase.from('services').select('id', { count: 'exact', head: true }).eq('status', 'active')),
    headCount(() => supabase.from('services').select('id', { count: 'exact', head: true })),
    headCount(() => supabase.from('counters').select('id', { count: 'exact', head: true }).eq('status', 'active')),
    headCount(() => supabase.from('counters').select('id', { count: 'exact', head: true })),
    headCount(() => supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer')),
    headCount(() => supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'staff')),
    headCount(() => supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'manager')),
    headCount(() => supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin'))
  ]);

  // Measured database round-trip probe
  let dbMs: number | null = null;
  try {
    const t0 = performance.now();
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    if (error) {
      console.error('Database probe failed:', error.message);
      dbMs = null;
    } else {
      dbMs = Math.round(performance.now() - t0);
    }
  } catch (err) {
    console.error('Database probe failed:', err);
    dbMs = null;
  }

  // Recent sign-ups: prefer created_at ordering, fall back to id if the column does not exist
  let signups: SignupRow[] | null = null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) {
      console.warn('created_at ordering unavailable, falling back to id:', error.message);
      const fallback = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('id', { ascending: false })
        .limit(5);
      if (fallback.error) {
        console.error('Failed to load recent sign-ups:', fallback.error.message);
        signups = null;
      } else {
        signups = ((fallback.data ?? []) as { id: string; full_name: string | null; email: string | null; role: string }[])
          .map(p => ({ id: p.id, name: p.full_name || (p.email ? p.email.split('@')[0] : 'Unknown'), role: p.role }));
      }
    } else {
      signups = ((data ?? []) as { id: string; full_name: string | null; email: string | null; role: string }[])
        .map(p => ({ id: p.id, name: p.full_name || (p.email ? p.email.split('@')[0] : 'Unknown'), role: p.role }));
    }
  } catch (err) {
    console.error('Failed to load recent sign-ups:', err);
    signups = null;
  }

  const roleCounts =
    cCustomer === null || cStaff === null || cManager === null || cAdmin === null
      ? null
      : [
          { role: 'Customer', count: cCustomer },
          { role: 'Staff', count: cStaff },
          { role: 'Manager', count: cManager },
          { role: 'Admin', count: cAdmin }
        ];

  return {
    totalUsers,
    staffAccounts,
    activeServices,
    totalServices,
    activeCounters,
    totalCounters,
    roleCounts,
    dbMs,
    signups
  };
}

// ─── Small shared UI pieces ──────────────────────────────────────────────────
function ChangeBadge({ pct, invert = false }: { pct: number | null; invert?: boolean }) {
  if (pct === null) return null;
  const up = pct > 0;
  const good = invert ? !up : up;
  const cls = pct === 0 ? 'bg-slate-100 text-slate-600' : good ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600';
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded ${cls}`}>
      {pct > 0 ? '+' : ''}{pct}%
    </span>
  );
}

function KpiCard({ icon, label, value, badge }: { icon: React.ReactNode; label: string; value: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="p-2 bg-[#ffe08f]/30 rounded-lg">{icon}</span>
        {badge}
      </div>
      <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-extrabold text-primary mt-1">{value}</h3>
    </div>
  );
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  waiting: { label: 'Waiting', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  serving: { label: 'Serving', cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
  completed: { label: 'Completed', cls: 'bg-green-50 text-green-700 border border-green-200' },
  no_show: { label: 'No Show', cls: 'bg-red-50 text-red-600 border border-red-200' }
};

const ROLE_BADGE_CLS: Record<string, string> = {
  customer: 'bg-slate-100 text-slate-600',
  staff: 'bg-blue-50 text-blue-700',
  manager: 'bg-amber-50 text-amber-700',
  admin: 'bg-[#0A1F44] text-[#fed977]'
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ── Secure session verification ──────────────────────────────────────────
  const [verifiedRole, setVerifiedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState('');

  useEffect(() => {
    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email, employee_id')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        await supabase.auth.signOut();
        navigate('/login');
        return;
      }

      const role = profile.role;
      if (role !== 'manager' && role !== 'admin') {
        if (role === 'customer') {
          navigate('/customer-dashboard');
        } else {
          navigate('/queue-control-center');
        }
        return;
      }
      setVerifiedRole(role);
      setEmployeeId(profile.employee_id || (profile.email || '').split('@')[0]);
      setLoading(false);
    };
    verifySession();
  }, [navigate]);

  // ── Live data: loaded on mount, refreshed every 15 seconds ───────────────
  useEffect(() => {
    if (!verifiedRole) return;
    let cancelled = false;

    const load = async () => {
      try {
        if (verifiedRole === 'manager') {
          const data = await loadManager();
          if (!cancelled) setManagerData(data);
        } else {
          const data = await loadAdmin();
          if (!cancelled) setAdminData(data);
        }
      } catch (err) {
        console.error('Dashboard data load failed:', err);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };

    load();
    const intervalId = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [verifiedRole]);

  if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading...</p>
    </div>
  );

  const isManager = verifiedRole === 'manager';
  const pageTitle = isManager ? 'Manager Dashboard' : 'Admin Dashboard';

  // ── Derived manager values ────────────────────────────────────────────────
  const m = managerData;
  const queues = m?.queues ?? null;

  const hourly = m?.hourly ?? null;
  const trend = m?.trend ?? null;
  const recent = queues ? queues.slice(0, 8) : null;
  const totalToday = hourly ? hourly.reduce((sum, h) => sum + h.count, 0) : 0;

  // Wait trend chart geometry
  const trendPoints = (() => {
    if (!trend || trend.length < 2) return null;
    const max = Math.max(...trend.map(t => t.avgMs));
    const min = Math.min(...trend.map(t => t.avgMs));
    return trend.map((t, i) => {
      const x = (i / (trend.length - 1)) * 480 + 10;
      const y = max === min ? 100 : 170 - ((t.avgMs - min) / (max - min)) * 140;
      return { x, y, label: t.label, avgMs: t.avgMs };
    });
  })();
  const linePath = trendPoints ? trendPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') : '';
  const areaPath = trendPoints ? `${linePath} L ${trendPoints[trendPoints.length - 1].x.toFixed(1)} 200 L ${trendPoints[0].x.toFixed(1)} 200 Z` : '';

  const a = adminData;
  const roleMax = a?.roleCounts ? Math.max(1, ...a.roleCounts.map(r => r.count)) : 1;
  const signupsEmpty = a?.signups && a.signups.length === 0;
  const rolesEmpty = a?.roleCounts && a.roleCounts.every(r => r.count === 0);

  const contentLoading = dataLoading && (isManager ? !managerData : !adminData);

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface select-none font-sans">
      {/* Side Navigation Bar (single source of truth) */}
      <AdminSidebar activeItem="dashboard" />

      {/* Top Navigation Bar */}
      <header className="fixed top-0 right-0 h-[60px] ml-[250px] w-[calc(100%-250px)] bg-white border-b border-outline-variant z-40 flex justify-between items-center px-8 shadow-sm">
        <h2 className="text-lg font-bold text-primary">{pageTitle}</h2>
        <div className="flex items-center gap-3">
          <ManagementNotificationBell role={verifiedRole === 'admin' ? 'admin' : 'manager'} />
          <div className="text-right">
            <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">{employeeId}</span>
            <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">{verifiedRole}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-secondary-container shadow-sm flex items-center justify-center text-white font-bold text-sm">
            {employeeId.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-[250px] mt-[60px] p-8 flex-grow">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{pageTitle}</h1>
            <p className="text-xs text-on-surface-variant font-semibold mt-0.5">
              Live overview · refreshes every 15 seconds
            </p>
          </div>
        </header>

        <motion.div
          key={pageTitle}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {contentLoading ? (
            <div className="bg-white p-10 rounded-xl border border-outline-variant/30 text-center">
              <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading live data...</p>
            </div>
          ) : isManager ? (
            /* ── Manager Dashboard ─────────────────────────────────────────── */
            <div className="space-y-8">
              {/* Row 1: KPI Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                  icon={<Activity className="w-5 h-5 text-[#755b00]" />}
                  label="Waiting Now"
                  value={m?.waitingNow === null || m === null ? '—' : m.waitingNow}
                  badge={<ChangeBadge pct={m ? pctChange(m.waitingNow, m.prevWaiting) : null} />}
                />
                <KpiCard
                  icon={<CheckCircle2 className="w-5 h-5 text-[#755b00]" />}
                  label="Served Today"
                  value={m?.servedToday === null || m === null ? '—' : m.servedToday}
                  badge={<ChangeBadge pct={m ? pctChange(m.servedToday, m.prevServed) : null} />}
                />
                <KpiCard
                  icon={<Clock className="w-5 h-5 text-[#0a1f44]" />}
                  label="Avg Wait Today"
                  value={
                    !m || m.avgWaitToday === null
                      ? '—'
                      : (<>{formatDuration(m.avgWaitToday)}<span className="text-sm font-medium ml-1">mm:ss</span></>)
                  }
                  badge={<ChangeBadge pct={m ? pctChange(m.avgWaitToday, m.prevAvgWait) : null} invert />}
                />
                <KpiCard
                  icon={<Sliders className="w-5 h-5 text-[#755b00]" />}
                  label="Active Counters"
                  value={!m || m.activeCounters === null || m.totalCounters === null ? '—' : `${m.activeCounters}/${m.totalCounters}`}
                />
              </section>

              {/* Row 2: Charts */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Queue Volume by Hour (Bar Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Queue Volume by Hour</h3>
                    <span className="text-[10px] bg-[#fed977]/35 text-[#755b00] px-2.5 py-1 rounded-full font-bold">Today</span>
                  </div>
                  {hourly === null ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-xs text-on-surface-variant font-medium">Data unavailable.</p>
                    </div>
                  ) : totalToday === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-xs text-on-surface-variant font-medium">No tickets have been issued today.</p>
                    </div>
                  ) : (
                    <>
                      <div className="h-[200px] flex items-end justify-between gap-2.5 px-1 relative">
                        {hourly.map((bar) => {
                          const maxCount = Math.max(1, ...hourly.map(h => h.count));
                          const heightPercent = `${Math.max(bar.count > 0 ? 4 : 1, (bar.count / maxCount) * 100)}%`;
                          return (
                            <div key={bar.label} className="flex-1 flex flex-col items-center group relative cursor-pointer h-full justify-end">
                              <span className="absolute -top-1 opacity-0 group-hover:opacity-100 text-[9px] font-bold text-primary transition-opacity">
                                {bar.count}
                              </span>
                              <div
                                style={{ height: heightPercent }}
                                className="w-full bg-[#fed977] hover:bg-[#755b00] transition-colors rounded-t-sm shadow-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-4 text-[9px] text-on-surface-variant font-bold border-t border-outline-variant/15 pt-2.5 font-mono">
                        {hourly.map(bar => (
                          <span key={bar.label}>{bar.label}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Wait Time Trend (Line Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Wait Time Trend</h3>
                    <span className="text-[10px] bg-indigo-50 text-[#0a1f44] px-2.5 py-1 rounded-full font-bold">Last 7 days</span>
                  </div>

                  {trend === null ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-xs text-on-surface-variant font-medium">Data unavailable.</p>
                    </div>
                  ) : !trendPoints ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-xs text-on-surface-variant font-medium">Not enough data yet</p>
                    </div>
                  ) : (
                    <>
                      <div className="h-[200px] relative w-full pt-4">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0a1f44" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#0a1f44" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={areaPath} fill="url(#adminChartGrad)" />
                          <path d={linePath} fill="none" stroke="#0a1f44" strokeLinecap="round" strokeWidth="3.5" />
                          {trendPoints.map((p, i) => (
                            <circle
                              key={`${p.label}-${i}`}
                              cx={p.x}
                              cy={p.y}
                              r={i === trendPoints.length - 1 ? 6 : 4.5}
                              fill={i === trendPoints.length - 1 ? '#755b00' : '#0a1f44'}
                            >
                              <title>{`${p.label}: ${formatDuration(p.avgMs)}`}</title>
                            </circle>
                          ))}
                        </svg>
                      </div>
                      <div className="flex justify-between mt-4 text-[9px] text-on-surface-variant font-bold border-t border-outline-variant/15 pt-2.5 font-mono">
                        {trendPoints.map((p, i) => (
                          <span key={`${p.label}-lbl-${i}`}>{p.label} {formatDuration(p.avgMs)}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Row 3: Recent Queue Activity */}
              <section>
                <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Recent Queue Activity</h3>
                    <span className="text-xs text-secondary hover:underline cursor-pointer font-bold select-none" onClick={() => navigate('/status-monitoring')}>View All</span>
                  </div>
                  <div className="overflow-x-auto">
                    {recent === null ? (
                      <p className="p-6 text-xs text-on-surface-variant font-medium">Data unavailable.</p>
                    ) : recent.length === 0 ? (
                      <p className="p-6 text-xs text-on-surface-variant font-medium">No tickets found.</p>
                    ) : (
                      <table className="w-full text-left">
                        <thead className="bg-[#00081e] text-white">
                          <tr className="text-[10px] uppercase font-mono font-bold tracking-wider">
                            <th className="p-4">Ticket ID</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Counter</th>
                            <th className="p-4">Issued</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 text-xs font-semibold text-on-surface-variant">
                          {recent.map((r, i) => {
                            const style = STATUS_STYLES[r.status] ?? { label: r.status, cls: 'bg-slate-100 text-slate-600 border border-slate-200' };
                            return (
                              <tr key={`${r.ticket_number}-${i}`} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono font-bold text-primary">{r.ticket_number || '—'}</td>
                                <td className="p-4 text-primary">{r.service_name || '—'}</td>
                                <td className="p-4">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${style.cls}`}>
                                    {style.label}
                                  </span>
                                </td>
                                <td className="p-4 font-mono">{r.counter_id || '—'}</td>
                                <td className="p-4 font-mono">{r.issued_time || '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* ── Admin Dashboard ───────────────────────────────────────────── */
            <div className="space-y-8">
              {/* Row 1: KPI Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                  icon={<Users className="w-5 h-5 text-[#755b00]" />}
                  label="Total Users"
                  value={!a || a.totalUsers === null ? '—' : a.totalUsers}
                />
                <KpiCard
                  icon={<ShieldCheck className="w-5 h-5 text-[#755b00]" />}
                  label="Staff Accounts"
                  value={!a || a.staffAccounts === null ? '—' : a.staffAccounts}
                />
                <KpiCard
                  icon={<Settings className="w-5 h-5 text-[#0a1f44]" />}
                  label="Active Services"
                  value={!a || a.activeServices === null || a.totalServices === null ? '—' : `${a.activeServices}/${a.totalServices}`}
                />
                <KpiCard
                  icon={<Sliders className="w-5 h-5 text-[#755b00]" />}
                  label="Active Counters"
                  value={!a || a.activeCounters === null || a.totalCounters === null ? '—' : `${a.activeCounters}/${a.totalCounters}`}
                />
              </section>

              {/* Row 2: Users by Role + System Status */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Users by Role</h3>
                    <span className="text-[10px] bg-[#fed977]/35 text-[#755b00] px-2.5 py-1 rounded-full font-bold">Live Data</span>
                  </div>
                  {!a || a.roleCounts === null ? (
                    <p className="text-xs text-on-surface-variant font-medium">—</p>
                  ) : rolesEmpty ? (
                    <p className="text-xs text-on-surface-variant font-medium">No users yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {a.roleCounts.map(r => (
                        <li key={r.role} className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                          <span>{r.role}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#0A1F44] rounded-full" style={{ width: `${(r.count / roleMax) * 100}%` }} />
                            </div>
                            <span className="font-mono text-primary w-8 text-right">{r.count}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">System Status</h3>
                  </div>
                  {contentLoading || (!a && dataLoading) ? (
                    <p className="text-xs text-on-surface-variant font-medium animate-pulse">Checking database...</p>
                  ) : a && a.dbMs !== null ? (
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 bg-slate-100 rounded-md">
                          <Activity className="w-4 h-4 text-slate-600" />
                        </span>
                        <span>Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-green-600">Connected · {a.dbMs} ms</span>
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse"></span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 bg-slate-100 rounded-md">
                          <Activity className="w-4 h-4 text-slate-600" />
                        </span>
                        <span>Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-red-600">Unreachable</span>
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Row 3: Recent Sign-ups */}
              <section>
                <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/30">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Recent Sign-ups</h3>
                  </div>
                  <div className="overflow-x-auto">
                    {!a || a.signups === null ? (
                      <p className="p-6 text-xs text-on-surface-variant font-medium">—</p>
                    ) : signupsEmpty ? (
                      <p className="p-6 text-xs text-on-surface-variant font-medium">No users yet.</p>
                    ) : (
                      <table className="w-full text-left">
                        <thead className="bg-[#00081e] text-white">
                          <tr className="text-[10px] uppercase font-mono font-bold tracking-wider">
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 text-xs font-semibold text-on-surface-variant">
                          {(a.signups ?? []).map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 text-primary font-bold">{s.name}</td>
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${ROLE_BADGE_CLS[s.role] ?? 'bg-slate-100 text-slate-600'}`}>
                                  {s.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

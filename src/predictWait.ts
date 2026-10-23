export type TimeOfDayKey = 'morning' | 'lunch' | 'afternoon' | 'evening';

export const PEAK_FACTORS: Record<TimeOfDayKey, { label: string; factor: number }> = {
  morning:   { label: 'Morning Peak (x1.1)',     factor: 1.1 },
  lunch:     { label: 'Lunch Hour Peak (x1.5)',  factor: 1.5 },
  afternoon: { label: 'Afternoon Steady (x1.0)', factor: 1.0 },
  evening:   { label: 'Evening Rush (x1.3)',     factor: 1.3 },
};

export const DATASET_BASE = 8.2;
export const DATASET_PER_PERSON = 0.3;

export function getTimeOfDayKey(d: Date = new Date()): TimeOfDayKey {
  const h = d.getHours();
  if (h < 12) return 'morning';
  if (h < 14) return 'lunch';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// Unrounded minutes
export function predictWaitMinutes(p: {
  baseWait: number | null;
  peopleAhead: number;
  activeCounters: number;
  timeOfDay?: TimeOfDayKey;
}): number {
  const base = p.baseWait ?? DATASET_BASE;
  const factor = PEAK_FACTORS[p.timeOfDay ?? getTimeOfDayKey()].factor;
  return Math.max(
    0,
    (base + (p.peopleAhead / Math.max(1, p.activeCounters)) * DATASET_PER_PERSON) * factor
  );
}

export function predictWaitRounded(p: Parameters<typeof predictWaitMinutes>[0]): number {
  return Math.max(1, Math.round(predictWaitMinutes(p)));
}

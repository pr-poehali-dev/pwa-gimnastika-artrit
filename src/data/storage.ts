import { ZoneState } from './gymData';

const ZONES_KEY = 'arthro_zones';
const PROGRESS_KEY = 'arthro_progress';
const HISTORY_KEY = 'arthro_history';

export interface Progress {
  points: number;
  leaves: number;
  flowers: number;
  badges: string[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  mode: string;
  modeName: string;
  minutes: number;
  points: number;
  stopped: boolean;
}

export function loadZones(): Record<string, ZoneState> {
  try {
    const raw = localStorage.getItem(ZONES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch { return {}; }
}

export function saveZones(zones: Record<string, ZoneState>): void {
  localStorage.setItem(ZONES_KEY, JSON.stringify(zones));
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { points: 0, leaves: 0, flowers: 0, badges: [] };
    return JSON.parse(raw);
  } catch { return { points: 0, leaves: 0, flowers: 0, badges: [] }; }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function loadHistory(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

export function saveHistory(history: WorkoutSession[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addWorkoutSession(session: WorkoutSession): void {
  const history = loadHistory();
  history.unshift(session);
  if (history.length > 100) history.pop();
  saveHistory(history);
}

export function resetAll(): void {
  localStorage.removeItem(ZONES_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(HISTORY_KEY);
}

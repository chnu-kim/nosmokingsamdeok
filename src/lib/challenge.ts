export const CONFIG = {
  START_DATE: "2026-06-14T00:00:00+09:00",
  PARTICIPANT: "삼덕이",
  BEST_STREAK: 31,
} as const;

export type ChallengeStatus = "before" | "ongoing";

const START_MS = new Date(CONFIG.START_DATE).getTime();

export function getCurrentDay(): number {
  return Math.floor((Date.now() - START_MS) / 86400000) + 1;
}

export function getStatusForDay(day: number): ChallengeStatus {
  if (day < 1) return "before";
  return "ongoing";
}

export function getTimeUntilStart(): number {
  return START_MS - Date.now();
}

export function msToComponents(ms: number) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSec = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function getReward(day?: number): number {
  const d = day ?? getCurrentDay();
  return d < 10 ? 0 : d * 10000;
}

export function isRewardUnlocked(day?: number): boolean {
  return (day ?? getCurrentDay()) >= 10;
}

export function getDaysUntilReward(day?: number): number {
  return Math.max(0, 10 - (day ?? getCurrentDay()));
}

export type BestRecordStatus = {
  isNewRecord: boolean;
  best: number;
  diff: number;
};

export function getBestRecordStatus(
  currentDay: number,
  best: number = CONFIG.BEST_STREAK
): BestRecordStatus {
  const isNewRecord = currentDay > best;
  return { isNewRecord, best, diff: isNewRecord ? currentDay - best : 0 };
}

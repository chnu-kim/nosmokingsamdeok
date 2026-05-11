export const CONFIG = {
  START_DATE: "2026-05-13T00:00:00+09:00",
  TOTAL_DAYS: 31,
  PARTICIPANT: "삼덕이",
  PENALTY: "삼루먼쇼",
  CIGARETTE_PRICE_PER_DAY: 4500,
} as const;

export type ChallengeStatus = "before" | "ongoing" | "success";

export function getCurrentDay(): number {
  const now = Date.now();
  const start = new Date(CONFIG.START_DATE).getTime();
  return Math.floor((now - start) / 86400000) + 1;
}

export function getChallengeStatus(): ChallengeStatus {
  const day = getCurrentDay();
  if (day < 1) return "before";
  if (day <= CONFIG.TOTAL_DAYS) return "ongoing";
  return "success";
}

export function getTimeUntilStart(): number {
  return new Date(CONFIG.START_DATE).getTime() - Date.now();
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

export function getProgress(): number {
  const day = getCurrentDay();
  if (day < 1) return 0;
  if (day > CONFIG.TOTAL_DAYS) return 100;
  return Math.round((day / CONFIG.TOTAL_DAYS) * 100);
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

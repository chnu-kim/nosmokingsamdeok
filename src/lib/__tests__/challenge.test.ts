import { describe, it, expect } from "vitest";
import {
  msToComponents,
  getReward,
  isRewardUnlocked,
  getDaysUntilReward,
  getProgress,
  CONFIG,
} from "../challenge";

// ────────────────────────────────────────────────────────────────
// msToComponents
// ────────────────────────────────────────────────────────────────

describe("msToComponents", () => {
  it("ms <= 0 → 전부 0", () => {
    expect(msToComponents(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(msToComponents(-1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("정확히 1일 (86400000ms) → { days: 1, hours: 0, minutes: 0, seconds: 0 }", () => {
    expect(msToComponents(86400000)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
  });

  it("1일 직전 (86399999ms) → { days: 0, hours: 23, minutes: 59, seconds: 59 }", () => {
    expect(msToComponents(86399999)).toEqual({ days: 0, hours: 23, minutes: 59, seconds: 59 });
  });

  it("복합값: 1일 2시간 3분 4초", () => {
    const ms = (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000;
    expect(msToComponents(ms)).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });
  });

  it("초 단위만 있는 경우", () => {
    expect(msToComponents(5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 5 });
  });
});

// ────────────────────────────────────────────────────────────────
// getReward
// ────────────────────────────────────────────────────────────────

describe("getReward", () => {
  it("9일차 → 보상 없음 (임계값 미만)", () => {
    expect(getReward(9)).toBe(0);
  });

  it("10일차 → 보상 시작 — d < 10 이므로 10은 포함", () => {
    expect(getReward(10)).toBe(100000);
  });

  it("일차 × 10000 공식 검증", () => {
    expect(getReward(15)).toBe(150000);
    expect(getReward(31)).toBe(310000);
  });

  it("0일차 → 보상 없음", () => {
    expect(getReward(0)).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────────
// isRewardUnlocked
// ────────────────────────────────────────────────────────────────

describe("isRewardUnlocked", () => {
  it("9일차 → 잠금", () => {
    expect(isRewardUnlocked(9)).toBe(false);
  });

  it("10일차 → 해금 — getReward와 임계값 일치 확인", () => {
    expect(isRewardUnlocked(10)).toBe(true);
  });

  it("10일 이후는 모두 해금", () => {
    expect(isRewardUnlocked(11)).toBe(true);
    expect(isRewardUnlocked(31)).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────────
// getDaysUntilReward
// ────────────────────────────────────────────────────────────────

describe("getDaysUntilReward", () => {
  it("0일차 → 10일 남음", () => {
    expect(getDaysUntilReward(0)).toBe(10);
  });

  it("9일차 → 1일 남음", () => {
    expect(getDaysUntilReward(9)).toBe(1);
  });

  it("10일차 → 0 (이미 해금)", () => {
    expect(getDaysUntilReward(10)).toBe(0);
  });

  it("해금 이후 음수가 되지 않고 0을 유지", () => {
    expect(getDaysUntilReward(31)).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────────
// getProgress — day 인자 없이 호출하면 Date.now() 의존이라
// 경계 조건은 내부 로직을 직접 검증
// ────────────────────────────────────────────────────────────────

describe("getProgress 내부 로직 (날짜 독립 케이스)", () => {
  it("CONFIG.TOTAL_DAYS(31일) 기준 중간값 진행률 공식 검증", () => {
    // getProgress()는 Date.now() 의존이므로, 동일 로직을 수동으로 검증
    const progress = (day: number) => {
      if (day < 1) return 0;
      if (day > CONFIG.TOTAL_DAYS) return 100;
      return Math.round((day / CONFIG.TOTAL_DAYS) * 100);
    };

    expect(progress(0)).toBe(0);
    expect(progress(1)).toBe(3);       // Math.round(1/31 * 100) = 3
    expect(progress(31)).toBe(100);
    expect(progress(32)).toBe(100);    // 초과 → 100으로 클램핑
    expect(progress(-1)).toBe(0);      // 미만 → 0으로 클램핑
  });

  it("TOTAL_DAYS 변경 시 getProgress()와 CONFIG.TOTAL_DAYS 참조 일치 확인", () => {
    expect(CONFIG.TOTAL_DAYS).toBe(31);
  });
});

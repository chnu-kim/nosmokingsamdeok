"use client";

import { getReward, isRewardUnlocked, getDaysUntilReward, CONFIG } from "@/lib/challenge";
import type { ChallengeStatus } from "@/lib/challenge";

interface Props {
  day: number;
  status: ChallengeStatus;
}

const MAX_REWARD = CONFIG.TOTAL_DAYS * 10000;
const REWARD_START_DAY = 10;

function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export default function RewardSection({ day, status }: Props) {
  const unlocked = isRewardUnlocked(day);
  const rewardAmount = getReward(day);
  const daysUntil = getDaysUntilReward(day);
  const rewardProgress = unlocked
    ? Math.min(((day - REWARD_START_DAY) / (CONFIG.TOTAL_DAYS - REWARD_START_DAY)) * 100, 100)
    : 0;

  return (
    <section className="reward-section">
      <div className="reward-card">
        {!unlocked && (
          <>
            <div className="reward-card__label">누적 보상</div>
            <div className="reward-card__locked">
              {daysUntil}일 후 보상 시작 · 최대 {formatKRW(MAX_REWARD)}
            </div>
          </>
        )}

        {unlocked && status !== "success" && (
          <>
            <div className="reward-card__label">누적 보상</div>
            <div className="reward-card__amount">{formatKRW(rewardAmount)}</div>
            <div className="reward-card__target">목표 {formatKRW(MAX_REWARD)}</div>
            <div className="progress-bar-wrap reward-progress-bar-wrap">
              <div
                className="progress-bar-fill reward-progress-bar-fill"
                style={{ width: `${rewardProgress}%` }}
              />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="reward-card__label">누적 보상 완주</div>
            <div className="reward-card__amount reward-card__amount--complete">
              {formatKRW(MAX_REWARD)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

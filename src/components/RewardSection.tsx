"use client";

import { getReward, isRewardUnlocked, getDaysUntilReward } from "@/lib/challenge";

interface Props {
  day: number;
}

function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export default function RewardSection({ day }: Props) {
  const unlocked = isRewardUnlocked(day);
  const rewardAmount = getReward(day);
  const daysUntil = getDaysUntilReward(day);

  return (
    <section className="reward-section">
      <div className="reward-card">
        {!unlocked && (
          <>
            <div className="reward-card__label">누적 보상</div>
            <div className="reward-card__locked">
              {daysUntil}일 후 보상 시작
            </div>
          </>
        )}

        {unlocked && (
          <>
            <div className="reward-card__label">누적 보상</div>
            <div className="reward-card__amount">{formatKRW(rewardAmount)}</div>
          </>
        )}
      </div>
    </section>
  );
}

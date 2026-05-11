"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CONFIG,
  getCurrentDay,
  getChallengeStatus,
  type ChallengeStatus,
} from "@/lib/challenge";

function calculateOverlayState() {
  const now = new Date();
  const startDate = new Date(CONFIG.START_DATE);
  const diffMs = now.getTime() - startDate.getTime();
  const currentDay = Math.floor(diffMs / 86400000) + 1;

  if (now < startDate) {
    const dDay = Math.ceil((startDate.getTime() - now.getTime()) / 86400000);
    return { status: "before" as const, dDay, currentDay: 0, progress: 0 };
  }

  if (currentDay >= 1 && currentDay <= CONFIG.TOTAL_DAYS) {
    const progress = Math.min((currentDay / CONFIG.TOTAL_DAYS) * 100, 100);
    return { status: "active" as const, currentDay, progress, dDay: 0 };
  }

  return { status: "success" as const, currentDay, progress: 100, dDay: 0 };
}

export default function OverlayPage() {
  const [state, setState] = useState(() => calculateOverlayState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(calculateOverlayState());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const containerClass = `overlay-container ${
    state.status === "before"
      ? "state-before"
      : state.status === "success"
        ? "state-success"
        : "state-active"
  }`;

  return (
    <div className={containerClass}>
      <span className="day-label">
        {state.status === "before"
          ? "금연 챌린지"
          : `${CONFIG.PARTICIPANT} 금연`}
      </span>
      <span className="day-value">
        {state.status === "before" && `D-${state.dDay}`}
        {state.status === "active" && `${state.currentDay}일차`}
        {state.status === "success" && "성공!"}
      </span>
      <div className="overlay-progress-wrap">
        <div className="overlay-progress-bar">
          <div
            className="overlay-progress-fill"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        <span className="overlay-progress-text">
          {state.status === "before" && "시작 대기중"}
          {state.status === "active" &&
            `${state.currentDay} / ${CONFIG.TOTAL_DAYS}일`}
          {state.status === "success" && `${CONFIG.TOTAL_DAYS}일 완료`}
        </span>
      </div>
      <span className="penalty-text">
{`벌칙: ${CONFIG.PENALTY}`}
      </span>
    </div>
  );
}

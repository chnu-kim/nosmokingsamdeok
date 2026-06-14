"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CONFIG,
  getCurrentDay,
  getStatusForDay,
  getTimeUntilStart,
  msToComponents,
  pad2,
  type ChallengeStatus,
} from "@/lib/challenge";
import RewardSection from "@/components/RewardSection";
import OverlayPreviewCard from "@/components/OverlayPreviewCard";

export default function HomePage() {
  const [status, setStatus] = useState<ChallengeStatus>("before");
  const [day, setDay] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [dDayNum, setDDayNum] = useState(0);

  const tick = useCallback(() => {
    const d = getCurrentDay();
    const s = getStatusForDay(d);
    setStatus(s);
    setDay(d);
    if (s === "before") {
      const ms = getTimeUntilStart();
      setCountdown(msToComponents(ms));
      setDDayNum(Math.ceil(ms / 86400000));
    }
  }, []);

  useEffect(() => {
    tick();
    const interval = setInterval(tick, status === "before" ? 1000 : 60000);
    return () => clearInterval(interval);
  }, [tick, status]);

  useEffect(() => {
    const body = document.body;
    body.classList.remove("phase-early", "phase-mid", "phase-late");
    if (status === "ongoing") {
      if (day <= 10) body.classList.add("phase-early");
      else if (day <= 20) body.classList.add("phase-mid");
      else body.classList.add("phase-late");
    }
    return () => body.classList.remove("phase-early", "phase-mid", "phase-late");
  }, [status, day]);

  return (
    <>
      <header className="hero">
        <div className="container">
          <span className="hero__badge">
            {status === "before" && "챌린지 시작 예정"}
            {status === "ongoing" && "진행 중"}
          </span>
          <h1 className="hero__title">
            <em>{CONFIG.PARTICIPANT}</em>의 금연 챌린지
          </h1>

          <div className="day-counter">
            <div className="day-counter__number">
              {status === "before" && `D-${dDayNum}`}
              {status === "ongoing" && day}
            </div>
            <div className="day-counter__label">
              {status === "before" && "곧 시작됩니다"}
              {status === "ongoing" && "일차"}
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {status === "before" && (
          <section className="countdown">
            <p className="countdown__title">챌린지 시작까지</p>
            <div className="countdown__grid">
              <div className="countdown__item">
                <div className="countdown__value">{pad2(countdown.days)}</div>
                <div className="countdown__unit">일</div>
              </div>
              <div className="countdown__item">
                <div className="countdown__value">{pad2(countdown.hours)}</div>
                <div className="countdown__unit">시간</div>
              </div>
              <div className="countdown__item">
                <div className="countdown__value">{pad2(countdown.minutes)}</div>
                <div className="countdown__unit">분</div>
              </div>
              <div className="countdown__item">
                <div className="countdown__value">{pad2(countdown.seconds)}</div>
                <div className="countdown__unit">초</div>
              </div>
            </div>
          </section>
        )}

        {status === "ongoing" && (
          <RewardSection day={day} />
        )}

        <OverlayPreviewCard day={day} status={status} dDay={dDayNum} />

        <section className="health-section" />
        <section className="savings-section" />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__rules">
            <span>시작: 2026.06.14</span>
            <span>규칙: 한 개비라도 피우면 실패</span>
          </div>
        </div>
      </footer>
    </>
  );
}

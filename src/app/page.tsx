"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  CONFIG,
  getCurrentDay,
  getChallengeStatus,
  getTimeUntilStart,
  msToComponents,
  getProgress,
  pad2,
  type ChallengeStatus,
} from "@/lib/challenge";
import RewardSection from "@/components/RewardSection";

export default function HomePage() {
  const [status, setStatus] = useState<ChallengeStatus>("before");
  const [day, setDay] = useState(0);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const tick = useCallback(() => {
    const s = getChallengeStatus();
    const d = getCurrentDay();
    setStatus(s);
    setDay(d);
    setProgress(getProgress());
    if (s === "before") {
      setCountdown(msToComponents(getTimeUntilStart()));
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
    } else if (status === "success") {
      body.classList.add("phase-late");
    }
    return () => body.classList.remove("phase-early", "phase-mid", "phase-late");
  }, [status, day]);

  const confettiPieces = useMemo(() => {
    const colors = ["#ff4444", "#ff8800", "#ffcc00", "#22c55e", "#3b82f6", "#a855f7", "#ff6b35", "#00ffcc"];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${(i * 1.7) % 100}%`,
      width: `${6 + (i % 5) * 2}px`,
      height: `${8 + (i % 4) * 3}px`,
      color: colors[i % colors.length],
      dur: `${2.5 + (i % 10) * 0.3}s`,
      delay: `${(i % 12) * 0.18}s`,
    }));
  }, []);

  return (
    <>
      <header className="hero">
        <div className="container">
          <span className="hero__badge">
            {status === "before" && "챌린지 시작 예정"}
            {status === "ongoing" && "진행 중"}
            {status === "success" && "챌린지 완료"}
          </span>
          <h1 className="hero__title">
            <em>삼덕이</em>의 금연 챌린지
          </h1>

          <div className="day-counter">
            <div className="day-counter__number">
              {status === "before" && "D-Day"}
              {status === "ongoing" && day}
              {status === "success" && "31"}
            </div>
            <div className="day-counter__label">
              {status === "before" && "곧 시작됩니다"}
              {status === "ongoing" && "일차"}
              {status === "success" && "일 완주!"}
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
          <section className="progress-section">
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="progress-text">
              <strong>{day}</strong> / {CONFIG.TOTAL_DAYS}일 ({progress}%)
            </p>
          </section>
        )}

        {status === "success" && (
          <>
            <div className="confetti-wrap" aria-hidden="true">
              {confettiPieces.map((p) => (
                <div
                  key={p.id}
                  className="confetti-piece"
                  style={{
                    left: p.left,
                    width: p.width,
                    height: p.height,
                    background: p.color,
                    ["--cf-dur" as string]: p.dur,
                    ["--cf-delay" as string]: p.delay,
                  }}
                />
              ))}
            </div>
            <section className="success-section">
              <h2 className="success-section__title">금연 성공</h2>
            </section>
          </>
        )}

        <section className="penalty-section">
          <div className="penalty-card">
            <div className="penalty-card__label">실패 시 벌칙</div>
            <div className="penalty-card__name">{CONFIG.PENALTY}</div>
          </div>
        </section>

        <section className="timeline">
          <h2 className="timeline__title">31일 타임라인</h2>
          <div className="timeline__grid">
            {Array.from({ length: CONFIG.TOTAL_DAYS }, (_, i) => {
              const d = i + 1;
              let cls = "timeline__day";
              if (status === "success" || (status === "ongoing" && d < day)) {
                cls += " timeline__day--past";
              } else if (status === "ongoing" && d === day) {
                cls += " timeline__day--today";
              } else {
                cls += " timeline__day--future";
              }
              return (
                <div key={d} className={cls}>
                  {d}
                </div>
              );
            })}
          </div>
        </section>

        {(status === "ongoing" || status === "success") && (
          <RewardSection day={day} status={status} />
        )}

        <section className="health-section" />
        <section className="savings-section" />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__rules">
            <span>기간: 2026.05.13 ~ 2026.06.12 (31일)</span>
            <span>규칙: 한 개비라도 피우면 실패</span>
            <span>벌칙: 삼루먼쇼</span>
          </div>
        </div>
      </footer>
    </>
  );
}

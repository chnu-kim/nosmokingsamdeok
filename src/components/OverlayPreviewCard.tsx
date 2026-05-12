"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { CONFIG, type ChallengeStatus } from "@/lib/challenge";

interface Props {
  day: number;
  status: ChallengeStatus;
  progress: number;
  dDay: number;
}

const PRESET_STYLES = [
  { name: "다크", fg: "#ffffff", bg: "rgba(10,10,14,0.82)", dot: "#0a0a0e" },
  { name: "네온", fg: "#ff4444", bg: "rgba(10,10,14,0.15)", dot: "#ff4444" },
  { name: "투명", fg: "#ffffff", bg: "transparent", dot: "#333" },
];

function OverlayPreviewCard({ day, status, progress, dDay }: Props) {
  const [activePreset, setActivePreset] = useState(0);
  const preset = PRESET_STYLES[activePreset];

  const dayText =
    status === "before"
      ? `D-${dDay}`
      : status === "success"
        ? "성공!"
        : `${day}일차`;

  const progressText =
    status === "before"
      ? "시작 대기중"
      : status === "success"
        ? `${CONFIG.TOTAL_DAYS}일 완료`
        : `${day} / ${CONFIG.TOTAL_DAYS}일`;

  return (
    <section className="overlay-preview-section">
      <div className="overlay-preview-card">
        <div className="overlay-preview-card__header">
          <span className="overlay-preview-card__label">방송 오버레이</span>
          <span className="overlay-preview-card__desc">
            OBS · Streamlabs에서 사용 가능
          </span>
        </div>

        <div className="overlay-preview-card__stage">
          <div className="overlay-preview-card__dots">
            <span />
            <span />
            <span />
          </div>
          <div
            className="overlay-preview-card__mini"
            style={{
              color: preset.fg,
              background: preset.bg,
            }}
          >
            <span className="overlay-mini__title">{CONFIG.PARTICIPANT} 금연</span>
            <span className="overlay-mini__day" style={{ color: preset.fg }}>
              {dayText}
            </span>
            <div className="overlay-mini__bar">
              <div
                className="overlay-mini__bar-fill"
                style={{ width: `${status === "success" ? 100 : progress}%` }}
              />
            </div>
            <span className="overlay-mini__progress">{progressText}</span>
          </div>
        </div>

        <div className="overlay-preview-card__presets">
          {PRESET_STYLES.map((p, i) => (
            <button
              key={p.name}
              className={`preset-chip${i === activePreset ? " preset-chip--active" : ""}`}
              onClick={() => setActivePreset(i)}
            >
              <span
                className="preset-chip__dot"
                style={{ background: p.dot }}
              />
              {p.name}
            </button>
          ))}
        </div>

        <Link href="/overlay/customize" className="overlay-preview-card__cta">
          오버레이 설정
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default memo(OverlayPreviewCard);

import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function DefaultTemplate({ params, state, cssVars }: Props) {
  const containerClass = `overlay-container size-${params.size} ${
    state.status === "before"
      ? "state-before"
      : state.status === "success"
        ? "state-success"
        : "state-active"
  }`;

  return (
    <div className={containerClass} style={cssVars}>
      <span className="day-label">
        {state.status === "before" ? "금연 챌린지" : `${CONFIG.PARTICIPANT} 금연`}
      </span>
      <span className="day-value">
        {state.status === "before" && `D-${state.dDay}`}
        {state.status === "active" && `${state.currentDay}일차`}
        {state.status === "success" && "성공!"}
      </span>
      {state.status !== "success" && (
        <>
          <div className="overlay-progress-wrap">
            <div className="overlay-progress-bar">
              <div
                className="overlay-progress-fill"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <span className="overlay-progress-text">
              {state.status === "before" && "시작 대기중"}
              {state.status === "active" && `${state.currentDay} / ${CONFIG.TOTAL_DAYS}일`}
            </span>
          </div>
          <span className="penalty-text">{`벌칙: ${CONFIG.PENALTY}`}</span>
        </>
      )}
    </div>
  );
}

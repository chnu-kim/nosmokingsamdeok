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
    state.status === "before" ? "state-before" : "state-active"
  }`;

  return (
    <div className={containerClass} style={cssVars}>
      <div className="label-row">
        <span className="day-label">
          {state.status === "before" ? "금연 챌린지" : `${CONFIG.PARTICIPANT} 금연`}
        </span>
        <span className={`best-record${state.bestRecord.isNewRecord ? " is-new-record" : ""}`}>
          {state.bestRecord.isNewRecord
            ? `신기록 (+${state.bestRecord.diff}일)`
            : `최고 기록 ${state.bestRecord.best}일`}
        </span>
      </div>
      <span className="day-value">
        {state.status === "before" && `D-${state.dDay}`}
        {state.status === "active" && `${state.currentDay}일차`}
      </span>
    </div>
  );
}

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
      <span className="day-label">
        {state.status === "before" ? "금연 챌린지" : `${CONFIG.PARTICIPANT} 금연`}
      </span>
      <span className="day-value">
        {state.status === "before" && `D-${state.dDay}`}
        {state.status === "active" && `${state.currentDay}일차`}
      </span>
    </div>
  );
}

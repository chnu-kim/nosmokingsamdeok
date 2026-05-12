import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function MinimalSerif({ params, state, cssVars }: Props) {
  const dayText =
    state.status === "before"
      ? `D-${state.dDay}`
      : state.status === "active"
        ? `${state.currentDay}일차`
        : `${CONFIG.TOTAL_DAYS}일 완주`;

  const labelText =
    state.status === "before" ? "금연 챌린지" : `${CONFIG.PARTICIPANT} 금연`;

  return (
    <div className={`tmpl-minimal-serif size-${params.size}`} style={cssVars}>
      <span className="ms-label">{labelText}</span>
      <span className="ms-day">{dayText}</span>
    </div>
  );
}

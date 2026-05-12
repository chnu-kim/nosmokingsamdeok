import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function BigNumber({ state, cssVars }: Props) {
  const numText =
    state.status === "before"
      ? `D-${state.dDay}`
      : state.status === "active"
        ? String(state.currentDay)
        : String(CONFIG.TOTAL_DAYS);

  const labelText =
    state.status === "before"
      ? "금연 챌린지"
      : state.status === "active"
        ? `${CONFIG.PARTICIPANT} 금연 ${state.currentDay}일차`
        : `${CONFIG.PARTICIPANT} 금연 완주`;

  return (
    <div className="tmpl-big-number" style={cssVars}>
      <span className="bn-num">{numText}</span>
      <span className="bn-label">{labelText}</span>
    </div>
  );
}

import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function BigNumber({ params, state, cssVars }: Props) {
  const numText =
    state.status === "before"
      ? `D-${state.dDay}`
      : String(state.currentDay);

  const labelText =
    state.status === "before"
      ? "금연 챌린지"
      : `${CONFIG.PARTICIPANT} 금연 ${state.currentDay}일차`;

  return (
    <div className={`tmpl-big-number size-${params.size}`} style={cssVars}>
      <span className="bn-num">{numText}</span>
      <span className="bn-label">{labelText}</span>
    </div>
  );
}

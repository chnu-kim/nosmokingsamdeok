import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function BarOnly({ state, cssVars }: Props) {
  const labelText =
    state.status === "before"
      ? `D-${state.dDay}`
      : state.status === "active"
        ? `${state.currentDay}일차`
        : "완주";

  return (
    <div className="tmpl-bar-only" style={cssVars}>
      <div className="bo-bar">
        <div className="bo-fill" style={{ width: `${state.progress}%` }} />
      </div>
      <span className="bo-label">{labelText}</span>
      {state.status === "active" && (
        <span className="bo-total">/ {CONFIG.TOTAL_DAYS}</span>
      )}
    </div>
  );
}

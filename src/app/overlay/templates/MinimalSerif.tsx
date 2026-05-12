import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function MinimalSerif({ params, state, cssVars }: Props) {
  const text =
    state.status === "before"
      ? `금연 D-${state.dDay}`
      : state.status === "active"
        ? `금연 ${state.currentDay}일차`
        : `금연 ${CONFIG.TOTAL_DAYS}일 완주`;

  return (
    <div className={`tmpl-minimal-serif size-${params.size}`} style={cssVars}>
      <span className="ms-day">{text}</span>
    </div>
  );
}

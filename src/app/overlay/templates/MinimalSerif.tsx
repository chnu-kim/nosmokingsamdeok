import type { CSSProperties } from "react";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function MinimalSerif({ params, state, cssVars }: Props) {
  const statusText =
    state.status === "before"
      ? `금연 D-${state.dDay}`
      : `금연 ${state.currentDay}일차`;

  return (
    <div className={`tmpl-minimal-serif size-${params.size}`} style={cssVars}>
      <span className="ms-day">{statusText}</span>
    </div>
  );
}

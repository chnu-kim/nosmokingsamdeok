import type { CSSProperties } from "react";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function BarOnly({ params, state, cssVars }: Props) {
  const labelText =
    state.status === "before"
      ? `D-${state.dDay}`
      : `${state.currentDay}일차`;

  return (
    <div className={`tmpl-bar-only size-${params.size}`} style={cssVars}>
      <span className="bo-label">{labelText}</span>
    </div>
  );
}

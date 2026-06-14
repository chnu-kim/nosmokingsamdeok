import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function OneLine({ params, state, cssVars }: Props) {
  const mainText =
    state.status === "before"
      ? `${CONFIG.PARTICIPANT} 금연 챌린지 D-${state.dDay}`
      : `${CONFIG.PARTICIPANT} 금연 ${state.currentDay}일차`;

  return (
    <div className={`tmpl-one-line size-${params.size}`} style={cssVars}>
      <span className="ol-main">{mainText}</span>
    </div>
  );
}

import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import type { OverlayParams, OverlayState } from "@/lib/overlayParams";

type Props = {
  params: OverlayParams;
  state: OverlayState;
  cssVars: CSSProperties;
};

export default function OneLine({ state, cssVars }: Props) {
  const mainText =
    state.status === "before"
      ? `${CONFIG.PARTICIPANT} 금연 챌린지 D-${state.dDay}`
      : state.status === "active"
        ? `${CONFIG.PARTICIPANT} 금연 ${state.currentDay}일차`
        : `${CONFIG.PARTICIPANT} 금연 ${CONFIG.TOTAL_DAYS}일 완주`;

  return (
    <div className="tmpl-one-line" style={cssVars}>
      <span className="ol-main">{mainText}</span>
      {state.status !== "success" && (
        <>
          <span className="ol-sep">·</span>
          <span className="ol-penalty">벌칙: {CONFIG.PENALTY}</span>
        </>
      )}
    </div>
  );
}

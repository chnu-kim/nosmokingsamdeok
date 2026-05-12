"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";
import { CONFIG } from "@/lib/challenge";
import {
  parseOverlayParams,
  resolveBg,
  type OverlayState,
} from "@/lib/overlayParams";
import DefaultTemplate from "./templates/DefaultTemplate";
import MinimalSerif from "./templates/MinimalSerif";
import BigNumber from "./templates/BigNumber";
import OneLine from "./templates/OneLine";
import BarOnly from "./templates/BarOnly";

const FONT_FAMILY: Record<string, string> = {
  sans: "inherit",
  serif: "var(--font-serif)",
  mono: "monospace",
};

function calculateOverlayState(): OverlayState {
  const now = new Date();
  const startDate = new Date(CONFIG.START_DATE);
  const diffMs = now.getTime() - startDate.getTime();
  const currentDay = Math.floor(diffMs / 86400000) + 1;

  if (now < startDate) {
    const dDay = Math.ceil((startDate.getTime() - now.getTime()) / 86400000);
    return { status: "before", dDay, currentDay: 0, progress: 0 };
  }

  if (currentDay >= 1 && currentDay <= CONFIG.TOTAL_DAYS) {
    const progress = Math.min((currentDay / CONFIG.TOTAL_DAYS) * 100, 100);
    return { status: "active", currentDay, progress, dDay: 0 };
  }

  return { status: "success", currentDay, progress: 100, dDay: 0 };
}

export default function OverlayInner() {
  const searchParams = useSearchParams();
  const params = parseOverlayParams(searchParams);
  const [state, setState] = useState<OverlayState>(() => calculateOverlayState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(calculateOverlayState());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const cssVars: CSSProperties = {
    "--overlay-fg": params.fg,
    "--overlay-bg": resolveBg(params.bg, params.opacity),
    "--overlay-font": FONT_FAMILY[params.font] ?? "inherit",
  } as CSSProperties;

  switch (params.template) {
    case "minimal-serif":
      return <MinimalSerif params={params} state={state} cssVars={cssVars} />;
    case "big-number":
      return <BigNumber params={params} state={state} cssVars={cssVars} />;
    case "one-line":
      return <OneLine params={params} state={state} cssVars={cssVars} />;
    case "bar-only":
      return <BarOnly params={params} state={state} cssVars={cssVars} />;
    default:
      return <DefaultTemplate params={params} state={state} cssVars={cssVars} />;
  }
}

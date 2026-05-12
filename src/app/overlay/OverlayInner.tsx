"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";
import {
  CONFIG,
  getChallengeStatus,
  getCurrentDay,
  getProgress,
  getTimeUntilStart,
} from "@/lib/challenge";
import {
  parseOverlayParams,
  parsePreviewMessage,
  resolveBg,
  resolveOverlayFg,
  type OverlayParams,
  type OverlayState,
} from "@/lib/overlayParams";
import DefaultTemplate from "./templates/DefaultTemplate";
import MinimalSerif from "./templates/MinimalSerif";
import BigNumber from "./templates/BigNumber";
import OneLine from "./templates/OneLine";
import BarOnly from "./templates/BarOnly";

const FONT_FAMILY: Record<string, string> = {
  sans: "inherit",
  serif: "'Gowun Batang', serif",
  mono: "monospace",
};


function calculateOverlayState(): OverlayState {
  const status = getChallengeStatus();
  const currentDay = getCurrentDay();

  if (status === "before") {
    const dDay = Math.ceil(getTimeUntilStart() / 86400000);
    return { status: "before", dDay, currentDay: 0, progress: 0 };
  }

  if (status === "ongoing") {
    return { status: "active", currentDay, progress: getProgress(), dDay: 0 };
  }

  return { status: "success", currentDay, progress: 100, dDay: 0 };
}

export default function OverlayInner() {
  const searchParams = useSearchParams();
  const urlParams = useMemo(() => parseOverlayParams(searchParams), [searchParams]);
  const [previewParams, setPreviewParams] = useState<OverlayParams | null>(null);
  const params = previewParams ?? urlParams;
  const [state, setState] = useState<OverlayState>(() => calculateOverlayState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(calculateOverlayState());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const parsed = parsePreviewMessage(event);
      if (parsed) setPreviewParams(parsed);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const cssVars = {
    "--overlay-fg": resolveOverlayFg(params.fg, state.status),
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

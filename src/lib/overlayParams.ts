import type { BestRecordStatus } from "./challenge";

export type OverlayTemplate = "default" | "minimal-serif" | "big-number" | "one-line" | "bar-only";
export type OverlayFont = "sans" | "serif" | "mono";
export type OverlaySize = "sm" | "md" | "lg";

export type OverlayParams = {
  template: OverlayTemplate;
  fg: string;
  bg: string;
  opacity: number;
  font: OverlayFont;
  size: OverlaySize;
};

export type OverlayState = {
  status: "before" | "active";
  dDay: number;
  currentDay: number;
  bestRecord: BestRecordStatus;
};

export const OVERLAY_DEFAULTS: OverlayParams = {
  template: "default",
  fg: "#ffffff",
  bg: "#0a0a0e",
  opacity: 0.82,
  font: "sans",
  size: "md",
};

const VALID_TEMPLATES: OverlayTemplate[] = ["default", "minimal-serif", "big-number", "one-line", "bar-only"];
const VALID_FONTS: OverlayFont[] = ["sans", "serif", "mono"];
const VALID_SIZES: OverlaySize[] = ["sm", "md", "lg"];
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function resolveBg(bg: string, opacity: number): string {
  if (bg === "transparent") return "transparent";
  if (HEX_RE.test(bg)) return hexToRgba(bg, opacity);
  return bg;
}

export function parseOverlayParams(
  searchParams: Pick<URLSearchParams, "get"> | null
): OverlayParams {
  if (!searchParams) return { ...OVERLAY_DEFAULTS };

  const templateRaw = searchParams.get("template") ?? "";
  const fg = searchParams.get("fg") ?? "";
  const bg = searchParams.get("bg") ?? "";
  const opacityRaw = searchParams.get("opacity");
  const fontRaw = searchParams.get("font") ?? "";
  const sizeRaw = searchParams.get("size") ?? "";

  const opacity =
    opacityRaw !== null && opacityRaw.trim() !== "" && !isNaN(Number(opacityRaw))
      ? Math.min(1, Math.max(0, Number(opacityRaw)))
      : OVERLAY_DEFAULTS.opacity;

  const strings = VALID_TEMPLATES as readonly string[];
  const fontStrings = VALID_FONTS as readonly string[];
  const sizeStrings = VALID_SIZES as readonly string[];

  return {
    template: strings.includes(templateRaw)
      ? (templateRaw as OverlayTemplate)
      : OVERLAY_DEFAULTS.template,
    fg: HEX_RE.test(fg) ? fg : OVERLAY_DEFAULTS.fg,
    bg: bg === "transparent" || HEX_RE.test(bg) ? bg : OVERLAY_DEFAULTS.bg,
    opacity,
    font: fontStrings.includes(fontRaw) ? (fontRaw as OverlayFont) : OVERLAY_DEFAULTS.font,
    size: sizeStrings.includes(sizeRaw) ? (sizeRaw as OverlaySize) : OVERLAY_DEFAULTS.size,
  };
}

export type Preset = {
  name: string;
  params: OverlayParams;
};

export const PRESETS: Preset[] = [
  {
    name: "다크 위젯",
    params: { ...OVERLAY_DEFAULTS },
  },
  {
    name: "클린 세리프",
    params: {
      template: "minimal-serif",
      fg: "#ffffff",
      bg: "transparent",
      opacity: 1,
      font: "serif",
      size: "md",
    },
  },
  {
    name: "네온 레드",
    params: {
      template: "big-number",
      fg: "#ff4444",
      bg: "#0a0a0e",
      opacity: 0.15,
      font: "sans",
      size: "lg",
    },
  },
  {
    name: "방송 바",
    params: {
      template: "bar-only",
      fg: "#ffffff",
      bg: "#000000",
      opacity: 0.7,
      font: "sans",
      size: "sm",
    },
  },
];

export const PREVIEW_MESSAGE_TYPE = "OVERLAY_PARAMS_UPDATE" as const;

export function parsePreviewMessage(event: MessageEvent): OverlayParams | null {
  const data = event.data;
  if (!data || typeof data !== "object") return null;
  if (data.type !== PREVIEW_MESSAGE_TYPE) return null;
  const params = data.params;
  if (!params || typeof params !== "object" || Array.isArray(params)) return null;
  return params as OverlayParams;
}

export function buildOverlayUrl(params: OverlayParams): string {
  const base = "/nosmokingsamdeok/overlay/";
  const p = new URLSearchParams();
  if (params.template !== OVERLAY_DEFAULTS.template) p.set("template", params.template);
  if (params.fg !== OVERLAY_DEFAULTS.fg) p.set("fg", params.fg);
  if (params.bg !== OVERLAY_DEFAULTS.bg) p.set("bg", params.bg);
  if (params.opacity !== OVERLAY_DEFAULTS.opacity) p.set("opacity", String(params.opacity));
  if (params.font !== OVERLAY_DEFAULTS.font) p.set("font", params.font);
  if (params.size !== OVERLAY_DEFAULTS.size) p.set("size", params.size);
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

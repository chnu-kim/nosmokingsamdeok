"use client";

import { useState, useEffect, useRef } from "react";
import {
  buildOverlayUrl,
  OVERLAY_DEFAULTS,
  PRESETS,
  type OverlayParams,
  type OverlayTemplate,
  type OverlayFont,
  type OverlaySize,
} from "@/lib/overlayParams";

const STORAGE_KEY = "overlay-customize-state";

const TEMPLATES: { value: OverlayTemplate; label: string }[] = [
  { value: "default", label: "다크 위젯" },
  { value: "minimal-serif", label: "미니멀 세리프" },
  { value: "big-number", label: "빅 넘버" },
  { value: "one-line", label: "한 줄 배너" },
  { value: "bar-only", label: "바 전용" },
];

const FONTS: { value: OverlayFont; label: string }[] = [
  { value: "sans", label: "고딕" },
  { value: "serif", label: "명조" },
  { value: "mono", label: "모노" },
];

const SIZES: { value: OverlaySize; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
];

function loadSaved(): OverlayParams {
  if (typeof window === "undefined") return { ...OVERLAY_DEFAULTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...OVERLAY_DEFAULTS };
    return { ...OVERLAY_DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...OVERLAY_DEFAULTS };
  }
}

export default function CustomizePage() {
  const [params, setParams] = useState<OverlayParams>({ ...OVERLAY_DEFAULTS });
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>("다크 위젯");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const paramsRef = useRef(params);
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    setParams(loadSaved());
    setIframeSrc(`${window.location.origin}${buildOverlayUrl(OVERLAY_DEFAULTS)}`);
  }, []);

  useEffect(() => {
    paramsRef.current = params;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "OVERLAY_PARAMS_UPDATE", params },
      window.location.origin
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch {}
  }, [params]);

  function handleIframeLoad() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "OVERLAY_PARAMS_UPDATE", params: paramsRef.current },
      window.location.origin
    );
  }

  function set<K extends keyof OverlayParams>(key: K, value: OverlayParams[K]) {
    setActivePreset(null);
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(name: string, presetParams: OverlayParams) {
    setActivePreset(name);
    setParams({ ...presetParams });
  }

  function copyUrl() {
    const url = window.location.origin + buildOverlayUrl(params);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  const bgIsTransparent = params.bg === "transparent";

  return (
    <div style={styles.page}>
      {/* 좌측 사이드바 */}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>오버레이 설정</h2>

        {/* 프리셋 */}
        <section style={styles.section}>
          <label style={styles.label}>프리셋</label>
          <p style={styles.hint}>선택하면 아래 설정이 한 번에 바뀜</p>
          <div style={{ ...styles.group, marginTop: 8 }}>
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.name, preset.params)}
                style={{
                  ...styles.chip,
                  ...(activePreset === preset.name ? styles.chipActive : {}),
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </section>

        <div style={styles.divider} />

        {/* 템플릿 */}
        <section style={styles.section}>
          <label style={styles.label}>템플릿</label>
          <div style={styles.group}>
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                onClick={() => set("template", t.value)}
                style={{
                  ...styles.chip,
                  ...(params.template === t.value ? styles.chipActive : {}),
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* 텍스트 색상 */}
        <section style={styles.section}>
          <label style={styles.label}>텍스트 색상</label>
          <div style={styles.row}>
            <input
              type="color"
              value={params.fg}
              onChange={(e) => set("fg", e.target.value)}
              style={styles.colorPicker}
            />
            <input
              type="text"
              value={params.fg}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))
                  set("fg", e.target.value);
              }}
              onFocus={() => setFocusedInput("fg")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.textInput,
                ...(focusedInput === "fg" ? styles.textInputFocus : {}),
              }}
              maxLength={7}
            />
          </div>
        </section>

        {/* 배경 색상 + 투명 */}
        <section style={styles.section}>
          <label style={styles.label}>배경 색상</label>
          <div style={styles.row}>
            <input
              type="color"
              value={bgIsTransparent ? "#000000" : params.bg}
              onChange={(e) => set("bg", e.target.value)}
              style={{
                ...styles.colorPicker,
                ...(bgIsTransparent ? styles.disabledControl : {}),
              }}
              disabled={bgIsTransparent}
            />
            <input
              type="text"
              value={params.bg}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "transparent" || /^#[0-9a-fA-F]{0,6}$/.test(v))
                  set("bg", v);
              }}
              onFocus={() => setFocusedInput("bg")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.textInput,
                ...(focusedInput === "bg" ? styles.textInputFocus : {}),
              }}
              maxLength={11}
            />
            <button
              onClick={() =>
                set("bg", bgIsTransparent ? OVERLAY_DEFAULTS.bg : "transparent")
              }
              style={{
                ...styles.chip,
                ...(bgIsTransparent ? styles.chipActive : {}),
              }}
            >
              투명
            </button>
          </div>
        </section>

        {/* 투명도 */}
        <section style={styles.section}>
          <label style={styles.label}>
            배경 투명도{" "}
            <span style={styles.labelValue}>{params.opacity.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={params.opacity}
            onChange={(e) => set("opacity", Number(e.target.value))}
            style={{
              ...styles.range,
              ...(bgIsTransparent ? styles.disabledControl : {}),
            }}
            disabled={bgIsTransparent}
          />
        </section>

        {/* 폰트 */}
        <section style={styles.section}>
          <label style={styles.label}>폰트</label>
          <div style={styles.group}>
            {FONTS.map((f) => (
              <button
                key={f.value}
                onClick={() => set("font", f.value)}
                style={{
                  ...styles.chip,
                  ...(params.font === f.value ? styles.chipActive : {}),
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* 사이즈 */}
        <section style={{ ...styles.section, marginBottom: 24 }}>
          <label style={styles.label}>텍스트 크기</label>
          <div style={styles.group}>
            {SIZES.map((s) => (
              <button
                key={s.value}
                onClick={() => set("size", s.value)}
                style={{
                  ...styles.chip,
                  ...(params.size === s.value ? styles.chipActive : {}),
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* OBS URL 복사 — 사이드바 하단 고정 */}
        <div style={styles.copyWrap}>
          <button onClick={copyUrl} style={styles.copyBtn}>
            {copied ? "복사됨 ✓" : "OBS URL 복사"}
          </button>
        </div>
      </div>

      {/* 우측 프리뷰 */}
      <div style={styles.preview}>
        <p style={styles.previewLabel}>미리보기</p>
        <div style={styles.iframeWrap}>
          <iframe
            ref={iframeRef}
            src={iframeSrc || undefined}
            onLoad={handleIframeLoad}
            style={styles.iframe}
            title="오버레이 미리보기"
          />
        </div>
        <p style={styles.sizeNote}>OBS 권장: 너비 300 × 높이 120 px</p>
        <p style={styles.obsHint}>
          OBS &gt; 소스 추가 &gt; 브라우저 &gt; URL에 위 버튼으로 복사한 주소 붙여넣기
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    height: "100vh",
    background: "#0f0f13",
    color: "#e5e5e5",
    fontFamily: "system-ui, sans-serif",
    fontSize: 14,
    overflow: "hidden",
  },
  sidebar: {
    width: 280,
    minWidth: 280,
    padding: "28px 20px 0",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowY: "auto",
  },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 24,
    color: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.07)",
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  labelValue: {
    fontWeight: 400,
    color: "rgba(255,255,255,0.6)",
    textTransform: "none",
    letterSpacing: 0,
  },
  hint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    marginTop: -4,
    lineHeight: 1.4,
  },
  group: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  chip: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    minHeight: 32,
  },
  chipActive: {
    background: "rgba(255,68,68,0.25)",
    border: "1px solid rgba(255,68,68,0.6)",
    color: "#ff8888",
  },
  colorPicker: {
    width: 36,
    height: 32,
    padding: 2,
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 6,
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
    flexShrink: 0,
  },
  disabledControl: {
    opacity: 0.3,
    cursor: "not-allowed",
  },
  textInput: {
    flex: 1,
    padding: "5px 8px",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#e5e5e5",
    fontSize: 12,
    fontFamily: "monospace",
    outline: "none",
    transition: "border-color 0.15s",
    minWidth: 0,
  },
  textInputFocus: {
    border: "1px solid rgba(255,68,68,0.5)",
  },
  range: {
    width: "100%",
    accentColor: "#ff4444",
    cursor: "pointer",
  },
  copyWrap: {
    position: "sticky",
    bottom: 0,
    padding: "12px 0 20px",
    background: "#0f0f13",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    marginTop: "auto",
  },
  copyBtn: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#ff4444",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  preview: {
    flex: 1,
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
  },
  iframeWrap: {
    width: 320,
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    backgroundImage:
      "repeating-conic-gradient(rgba(255,255,255,0.18) 0% 25%, rgba(255,255,255,0.06) 0% 50%)",
    backgroundSize: "16px 16px",
    border: "1px solid rgba(255,255,255,0.10)",
    flexShrink: 0,
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    background: "transparent",
  },
  sizeNote: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    fontFamily: "monospace",
  },
  obsHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    lineHeight: 1.6,
    maxWidth: 400,
  },
};

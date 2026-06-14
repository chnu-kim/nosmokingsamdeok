import { describe, it, expect } from "vitest";
import {
  parseOverlayParams,
  buildOverlayUrl,
  resolveBg,
  parsePreviewMessage,
  OVERLAY_DEFAULTS,
} from "../overlayParams";

// ────────────────────────────────────────────────────────────────
// 헬퍼
// ────────────────────────────────────────────────────────────────

function sp(obj: Record<string, string>): Pick<URLSearchParams, "get"> {
  return { get: (k: string) => obj[k] ?? null };
}

// ────────────────────────────────────────────────────────────────
// resolveBg
// ────────────────────────────────────────────────────────────────

describe("resolveBg", () => {
  it("transparent → 'transparent'을 그대로 반환", () => {
    expect(resolveBg("transparent", 0)).toBe("transparent");
    expect(resolveBg("transparent", 1)).toBe("transparent");
  });

  it("유효한 hex + opacity → rgba 문자열", () => {
    expect(resolveBg("#000000", 1)).toBe("rgba(0,0,0,1)");
    expect(resolveBg("#ffffff", 0)).toBe("rgba(255,255,255,0)");
    expect(resolveBg("#ff4444", 0.82)).toBe("rgba(255,68,68,0.82)");
  });

  it("hex 채널 파싱 정확성 (0a = 10, ff = 255)", () => {
    expect(resolveBg("#0a0a0e", 0.5)).toBe("rgba(10,10,14,0.5)");
  });

  it("유효하지 않은 문자열 → 입력값 그대로 반환 (passthrough)", () => {
    // HEX_RE를 통과하지 못한 값은 as-is로 반환됨
    expect(resolveBg("rgba(0,0,0,0.5)", 0.5)).toBe("rgba(0,0,0,0.5)");
  });
});

// ────────────────────────────────────────────────────────────────
// parseOverlayParams
// ────────────────────────────────────────────────────────────────

describe("parseOverlayParams", () => {
  describe("null 입력", () => {
    it("모든 필드가 기본값", () => {
      expect(parseOverlayParams(null)).toEqual(OVERLAY_DEFAULTS);
    });
  });

  // ── template ──────────────────────────────────────────────────

  describe("template", () => {
    it.each(["default", "minimal-serif", "big-number", "one-line", "bar-only"])(
      "유효한 template '%s' 수락",
      (t) => {
        expect(parseOverlayParams(sp({ template: t })).template).toBe(t);
      }
    );

    it("존재하지 않는 template → 기본값 'default'", () => {
      expect(parseOverlayParams(sp({ template: "neon-glow" })).template).toBe("default");
    });

    it("빈 문자열 template → 기본값", () => {
      expect(parseOverlayParams(sp({ template: "" })).template).toBe("default");
    });

    it("대소문자 다른 template → 기본값 (대소문자 구별)", () => {
      expect(parseOverlayParams(sp({ template: "Default" })).template).toBe("default");
    });
  });

  // ── fg ────────────────────────────────────────────────────────

  describe("fg (텍스트 색상)", () => {
    it("유효한 6자리 소문자 hex 수락", () => {
      expect(parseOverlayParams(sp({ fg: "#ff0000" })).fg).toBe("#ff0000");
    });

    it("유효한 6자리 대문자 hex 수락", () => {
      expect(parseOverlayParams(sp({ fg: "#FF0000" })).fg).toBe("#FF0000");
    });

    it("3자리 short hex → 기본값 (6자리만 유효)", () => {
      expect(parseOverlayParams(sp({ fg: "#fff" })).fg).toBe(OVERLAY_DEFAULTS.fg);
    });

    it("7자리 이상 hex → 기본값", () => {
      expect(parseOverlayParams(sp({ fg: "#ff000000" })).fg).toBe(OVERLAY_DEFAULTS.fg);
    });

    it("# 없는 hex → 기본값", () => {
      expect(parseOverlayParams(sp({ fg: "ff0000" })).fg).toBe(OVERLAY_DEFAULTS.fg);
    });

    it("CSS 색상 이름 → 기본값", () => {
      expect(parseOverlayParams(sp({ fg: "red" })).fg).toBe(OVERLAY_DEFAULTS.fg);
    });

    it("빈 문자열 → 기본값", () => {
      expect(parseOverlayParams(sp({ fg: "" })).fg).toBe(OVERLAY_DEFAULTS.fg);
    });

    it("URL 디코딩된 #ff0000 (원본은 %23ff0000) → 정상 수락", () => {
      // URLSearchParams.get()은 %23 → # 로 자동 디코딩
      const params = new URLSearchParams("fg=%23ff0000");
      expect(parseOverlayParams(params).fg).toBe("#ff0000");
    });
  });

  // ── bg ────────────────────────────────────────────────────────

  describe("bg (배경 색상)", () => {
    it("유효한 hex 수락", () => {
      expect(parseOverlayParams(sp({ bg: "#000000" })).bg).toBe("#000000");
    });

    it("'transparent' 수락", () => {
      expect(parseOverlayParams(sp({ bg: "transparent" })).bg).toBe("transparent");
    });

    it("CSS 색상 이름 → 기본값", () => {
      expect(parseOverlayParams(sp({ bg: "black" })).bg).toBe(OVERLAY_DEFAULTS.bg);
    });

    it("rgba 문자열 → 기본값 (직접 입력 불가)", () => {
      expect(parseOverlayParams(sp({ bg: "rgba(0,0,0,0.5)" })).bg).toBe(OVERLAY_DEFAULTS.bg);
    });
  });

  // ── opacity ───────────────────────────────────────────────────

  describe("opacity (투명도)", () => {
    it("0 수락", () => {
      expect(parseOverlayParams(sp({ opacity: "0" })).opacity).toBe(0);
    });

    it("1 수락", () => {
      expect(parseOverlayParams(sp({ opacity: "1" })).opacity).toBe(1);
    });

    it("0.5 수락", () => {
      expect(parseOverlayParams(sp({ opacity: "0.5" })).opacity).toBe(0.5);
    });

    it("1을 초과하는 값 → 1로 클램핑", () => {
      expect(parseOverlayParams(sp({ opacity: "1.5" })).opacity).toBe(1);
      expect(parseOverlayParams(sp({ opacity: "99" })).opacity).toBe(1);
    });

    it("음수 → 0으로 클램핑", () => {
      expect(parseOverlayParams(sp({ opacity: "-0.1" })).opacity).toBe(0);
      expect(parseOverlayParams(sp({ opacity: "-10" })).opacity).toBe(0);
    });

    it("숫자가 아닌 값 → 기본값", () => {
      expect(parseOverlayParams(sp({ opacity: "high" })).opacity).toBe(OVERLAY_DEFAULTS.opacity);
      expect(parseOverlayParams(sp({ opacity: "" })).opacity).toBe(OVERLAY_DEFAULTS.opacity);
    });
  });

  // ── font ──────────────────────────────────────────────────────

  describe("font", () => {
    it.each(["sans", "serif", "mono"])("유효한 font '%s' 수락", (f) => {
      expect(parseOverlayParams(sp({ font: f })).font).toBe(f);
    });

    it("유효하지 않은 font → 기본값", () => {
      expect(parseOverlayParams(sp({ font: "comic-sans" })).font).toBe(OVERLAY_DEFAULTS.font);
    });
  });

  // ── size ──────────────────────────────────────────────────────

  describe("size", () => {
    it.each(["sm", "md", "lg"])("유효한 size '%s' 수락", (s) => {
      expect(parseOverlayParams(sp({ size: s })).size).toBe(s);
    });

    it("유효하지 않은 size → 기본값", () => {
      expect(parseOverlayParams(sp({ size: "xl" })).size).toBe(OVERLAY_DEFAULTS.size);
      expect(parseOverlayParams(sp({ size: "medium" })).size).toBe(OVERLAY_DEFAULTS.size);
    });
  });
});

// ────────────────────────────────────────────────────────────────
// buildOverlayUrl
// ────────────────────────────────────────────────────────────────

describe("buildOverlayUrl", () => {
  it("모든 기본값 → 쿼리스트링 없는 base URL", () => {
    const url = buildOverlayUrl(OVERLAY_DEFAULTS);
    expect(url).toBe("/nosmokingsamdeok/overlay/");
    expect(url).not.toContain("?");
  });

  it("기본값과 같은 각 필드는 URL에 포함되지 않음", () => {
    const url = buildOverlayUrl({ ...OVERLAY_DEFAULTS, template: "default", size: "md" });
    expect(url).not.toContain("template");
    expect(url).not.toContain("size");
  });

  it("기본값이 아닌 template → URL에 포함", () => {
    const url = buildOverlayUrl({ ...OVERLAY_DEFAULTS, template: "big-number" });
    expect(url).toContain("template=big-number");
  });

  it("fg 색상의 # → %23으로 인코딩", () => {
    const url = buildOverlayUrl({ ...OVERLAY_DEFAULTS, fg: "#ff0000" });
    expect(url).toContain("fg=%23ff0000");
    expect(url).not.toContain("fg=#");
  });

  it("bg='transparent' → bg=transparent (# 인코딩 없음)", () => {
    const url = buildOverlayUrl({ ...OVERLAY_DEFAULTS, bg: "transparent" });
    expect(url).toContain("bg=transparent");
  });

  it("opacity → 문자열로 직렬화", () => {
    const url = buildOverlayUrl({ ...OVERLAY_DEFAULTS, opacity: 0.5 });
    expect(url).toContain("opacity=0.5");
  });

  // ── 라운드트립 ────────────────────────────────────────────────

  describe("라운드트립 (build → parse → build 결과 동일)", () => {
    function roundtrip(params: Parameters<typeof buildOverlayUrl>[0]) {
      const url = buildOverlayUrl(params);
      const qs = url.split("?")[1] ?? "";
      return parseOverlayParams(new URLSearchParams(qs));
    }

    it("기본값 라운드트립", () => {
      expect(roundtrip(OVERLAY_DEFAULTS)).toEqual(OVERLAY_DEFAULTS);
    });

    it("커스텀 설정 라운드트립", () => {
      const custom = {
        template: "one-line" as const,
        fg: "#ff4444",
        bg: "#0a0a0e",
        opacity: 0.7,
        font: "serif" as const,
        size: "lg" as const,
      };
      expect(roundtrip(custom)).toEqual(custom);
    });

    it("transparent bg 라운드트립", () => {
      const params = { ...OVERLAY_DEFAULTS, bg: "transparent" };
      expect(roundtrip(params)).toEqual(params);
    });

    it("opacity 0 라운드트립 (경계값)", () => {
      const params = { ...OVERLAY_DEFAULTS, opacity: 0 };
      expect(roundtrip(params)).toEqual(params);
    });
  });
});

// ────────────────────────────────────────────────────────────────
// parsePreviewMessage
// ────────────────────────────────────────────────────────────────

describe("parsePreviewMessage", () => {
  it("유효한 OVERLAY_PARAMS_UPDATE 메시지 → params 반환", () => {
    const params = { ...OVERLAY_DEFAULTS };
    const event = { data: { type: "OVERLAY_PARAMS_UPDATE", params } } as MessageEvent;
    expect(parsePreviewMessage(event)).toEqual(params);
  });

  it("커스텀 params → 그대로 반환", () => {
    const params = {
      ...OVERLAY_DEFAULTS,
      template: "big-number" as const,
      fg: "#ff4444",
      opacity: 0.5,
    };
    const event = { data: { type: "OVERLAY_PARAMS_UPDATE", params } } as MessageEvent;
    expect(parsePreviewMessage(event)).toEqual(params);
  });

  it("다른 type → null 반환", () => {
    const event = { data: { type: "OTHER_EVENT" } } as MessageEvent;
    expect(parsePreviewMessage(event)).toBeNull();
  });

  it("type 없는 메시지 → null 반환", () => {
    const event = { data: {} } as MessageEvent;
    expect(parsePreviewMessage(event)).toBeNull();
  });

  it("data가 null → null 반환", () => {
    const event = { data: null } as MessageEvent;
    expect(parsePreviewMessage(event)).toBeNull();
  });

  it("data가 string → null 반환 (비객체)", () => {
    const event = { data: "OVERLAY_PARAMS_UPDATE" } as MessageEvent;
    expect(parsePreviewMessage(event)).toBeNull();
  });

  it("params 필드 없는 OVERLAY_PARAMS_UPDATE → null 반환", () => {
    const event = { data: { type: "OVERLAY_PARAMS_UPDATE" } } as MessageEvent;
    expect(parsePreviewMessage(event)).toBeNull();
  });

  it("params: null → null 반환", () => {
    const event = { data: { type: "OVERLAY_PARAMS_UPDATE", params: null } } as MessageEvent;
    expect(parsePreviewMessage(event)).toBeNull();
  });

  it("params: [] (배열) → null 반환 (![] = false 이므로 명시적 Array.isArray 검사 필요)", () => {
    const event = { data: { type: "OVERLAY_PARAMS_UPDATE", params: [] } } as MessageEvent;
    expect(parsePreviewMessage(event)).toBeNull();
  });
});

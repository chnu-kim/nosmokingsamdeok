import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./overlay.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "삼덕이 금연 챌린지 - OBS 오버레이",
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className} style={{ background: "transparent" }}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./overlay.css";

export const metadata: Metadata = {
  title: "삼덕이 금연 챌린지 - OBS 오버레이",
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

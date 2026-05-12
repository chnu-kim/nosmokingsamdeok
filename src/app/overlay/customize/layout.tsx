import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오버레이 커스터마이저 — 삼덕이 금연 챌린지",
};

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

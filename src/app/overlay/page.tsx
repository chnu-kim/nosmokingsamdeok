import { Suspense } from "react";
import OverlayInner from "./OverlayInner";

export default function OverlayPage() {
  return (
    <Suspense fallback={null}>
      <OverlayInner />
    </Suspense>
  );
}

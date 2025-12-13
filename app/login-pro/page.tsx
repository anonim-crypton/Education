"use client";

import dynamic from "next/dynamic";
import LoginProLoading from "./loading";

const LoginCardSection = dynamic(
  () => import("@/components/ui/login-signup"),
  {
    loading: () => <LoginProLoading />,
    ssr: false, // Disable SSR for canvas-based component
  }
);

export default function LoginProPage() {
  return <LoginCardSection />;
}

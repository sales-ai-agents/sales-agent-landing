import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LandingShell } from "@/components/landing/shell";
import { LANDING_METADATA } from "@/components/landing/metadata";

export const metadata: Metadata = LANDING_METADATA;

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <LandingShell animated>{children}</LandingShell>;
}

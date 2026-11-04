import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LandingShell } from "@/components/landing/shell";
import { buildLandingMetadata } from "@/components/landing/metadata";
import { isLocale } from "@/lib/i18n/config";

interface LandingLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Pick<LandingLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildLandingMetadata(locale) : {};
}

export default function LandingLayout({ children }: Pick<LandingLayoutProps, "children">) {
  return <LandingShell animated>{children}</LandingShell>;
}

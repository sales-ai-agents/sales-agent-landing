import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@/components/google-analytics";
import { LandingProviders } from "@/components/landing/providers";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function LandingRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body suppressHydrationWarning>
        <GoogleAnalytics strategy="lazyOnload" />
        <LandingProviders>{children}</LandingProviders>
      </body>
    </html>
  );
}

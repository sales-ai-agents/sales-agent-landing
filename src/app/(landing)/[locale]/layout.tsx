import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getClientCopy } from "@/components/landing/copy";
import { LandingCopyProvider } from "@/components/landing/copy/provider";
import { LandingProviders } from "@/components/landing/providers";
import { isLocale, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export const dynamicParams = false;

export function generateStaticParams(): { locale: string }[] {
  return LOCALES.map((locale) => ({ locale }));
}

interface LandingRootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LandingRootLayout({ children, params }: LandingRootLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={LOCALE_META[locale].hreflang}>
      <body suppressHydrationWarning>
        <GoogleAnalytics strategy="lazyOnload" />
        <LandingProviders>
          <LandingCopyProvider locale={locale} copy={getClientCopy(locale)}>
            {children}
          </LandingCopyProvider>
        </LandingProviders>
      </body>
    </html>
  );
}

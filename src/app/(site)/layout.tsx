import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui";
import { GoogleAnalytics } from "@/components/google-analytics";
import { buildOgImage, NOINDEX_ROBOTS } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const actayWideBold = localFont({
  src: "../../fonts/ActayWide-Bold.woff2",
  variable: "--font-actay-wide",
  weight: "700",
  display: "swap",
  fallback: ["Inter", "sans-serif"],
});

const OG_IMAGE = buildOgImage(SITE_NAME);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  applicationName: SITE_NAME,
  robots: NOINDEX_ROBOTS,
  openGraph: { type: "website", siteName: SITE_NAME, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${actayWideBold.variable}`}>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

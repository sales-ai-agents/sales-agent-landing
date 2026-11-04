import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type AnalyticsStrategy = "afterInteractive" | "lazyOnload";

interface GoogleAnalyticsProps {
  strategy?: AnalyticsStrategy;
}

export function GoogleAnalytics({ strategy = "afterInteractive" }: GoogleAnalyticsProps) {
  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy={strategy} />
      <Script
        id="google-analytics"
        strategy={strategy}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(GA_ID)}, {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

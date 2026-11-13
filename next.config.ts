import type { NextConfig } from "next";
import { DEFAULT_LOCALE } from "./src/lib/i18n/config";
import { SITE_URL } from "./src/lib/site";

const APEX_HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");

const DEFAULT_LOCALE_ROOT = `/${DEFAULT_LOCALE}`;

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: APEX_HOST }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
      { source: DEFAULT_LOCALE_ROOT, destination: "/", permanent: true },
      {
        source: `${DEFAULT_LOCALE_ROOT}/:path+`,
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/", destination: DEFAULT_LOCALE_ROOT },
      { source: "/blog/:path*", destination: `${DEFAULT_LOCALE_ROOT}/blog/:path*` },
    ];
  },
};

export default nextConfig;

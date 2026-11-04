import type { NextConfig } from "next";
import { DEFAULT_LOCALE } from "./src/lib/i18n/config";
import { LANDING_PATH } from "./src/lib/site";

const DEFAULT_LOCALE_ROOT = `/${DEFAULT_LOCALE}`;

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [
      {
        source: `${DEFAULT_LOCALE_ROOT}/:path*`,
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: LANDING_PATH, destination: `${DEFAULT_LOCALE_ROOT}${LANDING_PATH}` },
      { source: "/blog/:path*", destination: `${DEFAULT_LOCALE_ROOT}/blog/:path*` },
    ];
  },
};

export default nextConfig;

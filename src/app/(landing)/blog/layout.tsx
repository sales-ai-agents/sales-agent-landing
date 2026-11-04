import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LandingShell } from "@/components/landing/shell";
import { SITE_NAME } from "@/lib/site";
import "@/components/landing/blog.css";

export const metadata: Metadata = {
  title: { template: `%s | Блог ${SITE_NAME}`, default: `Блог ${SITE_NAME}` },
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <LandingShell>{children}</LandingShell>;
}

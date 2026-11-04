import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLandingCopy } from "@/components/landing/copy";
import { LandingShell } from "@/components/landing/shell";
import { isLocale } from "@/lib/i18n/config";
import { rssPath } from "@/lib/i18n/paths";
import "@/components/landing/blog.css";

interface BlogLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Pick<BlogLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { blog } = getLandingCopy(locale);

  return {
    title: { template: blog.titleTemplate, default: blog.name },
    alternates: { types: { "application/rss+xml": rssPath(locale) } },
  };
}

export default function BlogLayout({ children }: Pick<BlogLayoutProps, "children">) {
  return <LandingShell>{children}</LandingShell>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBottomCta, ArticleSideCta } from "@/components/blog/article-cta";
import { getHeadingId } from "@/components/blog/article-body";
import { ArticleToc } from "@/components/blog/article-toc";
import { ClaudeSections } from "@/components/blog/claude-sections";
import { CopyLinkButton } from "@/components/blog/copy-link-button";
import { RichContent } from "@/components/blog/rich-content";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { buildClaudePageGraph } from "@/components/blog/structured-data";
import { getLandingCopy } from "@/components/landing/copy";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { JsonLd } from "@/components/landing/json-ld";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { getClaudePage } from "@/content/blog/claude";
import {
  CLAUDE_PAGE_SLUG,
  blogPath,
  claudePath,
  claudeUrl,
  homePath,
  languageAlternates,
} from "@/lib/i18n/paths";
import { isLocale } from "@/lib/i18n/config";
import { buildOgImage, buildOgLocales, INDEXABLE_ROBOTS } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

interface ClaudeConnectorPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ClaudeConnectorPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = getClaudePage(locale);
  const image = buildOgImage(getLandingCopy(locale).seo.ogImageAlt);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: claudePath(locale), languages: languageAlternates(claudeUrl) },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "article",
      title: page.metaTitle,
      description: page.metaDescription,
      url: claudeUrl(locale),
      siteName: SITE_NAME,
      images: [image],
      ...buildOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [image.url],
    },
  };
}

export default async function ClaudeConnectorPage({ params }: ClaudeConnectorPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = getLandingCopy(locale);
  const article = copy.blog.article;
  const page = getClaudePage(locale);
  const tocItems = page.sections.map((section, index) => ({
    id: getHeadingId(index + 1),
    label: section.heading,
  }));

  return (
    <>
      <ReadingProgress />
      <LandingNav basePath={homePath(locale)} />
      <main id="main">
        <header className="art-head wrap">
          <nav className="crumbs mono" aria-label={article.crumbsLabel}>
            <Link href={blogPath(locale)}>{copy.blog.index.heading}</Link>
            <span aria-hidden="true">/</span>
            <span className="tag">{page.crumb}</span>
          </nav>
          <h1 className="art-title t1">{page.title}</h1>
          <div className="art-meta">
            <span className="by">
              <span className="av" aria-hidden="true">
                C
              </span>
              {article.team}
            </span>
          </div>
        </header>

        <div className="wrap art-layout">
          <ArticleToc items={tocItems} />
          <article className="prose" data-article-body="">
            <p className="lead-p">
              <RichContent content={page.lead} />
            </p>
            <ClaudeSections sections={page.sections} />
            <ArticleBottomCta locale={locale} slug={CLAUDE_PAGE_SLUG} />
          </article>
          <aside className="art-side">
            <ArticleSideCta locale={locale} slug={CLAUDE_PAGE_SLUG} />
            <div className="share">
              <CopyLinkButton />
            </div>
          </aside>
        </div>

        <FinalCtaSection copy={copy.finalCta} />
      </main>
      <LandingFooter locale={locale} basePath={homePath(locale)} />
      <JsonLd data={buildClaudePageGraph(locale, page)} />
    </>
  );
}

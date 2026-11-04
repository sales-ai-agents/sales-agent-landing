import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, getHeadings } from "@/components/blog/article-body";
import { ArticleToc } from "@/components/blog/article-toc";
import { CopyLinkButton } from "@/components/blog/copy-link-button";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { buildPostGraph } from "@/components/blog/structured-data";
import { getLandingCopy } from "@/components/landing/copy";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { PostCard } from "@/components/landing/post-card";
import { PostCoverArt } from "@/components/landing/post-cover";
import { Arrow, MetaRow, NoWrapAiTerms } from "@/components/landing/typography";
import { JsonLd } from "@/components/landing/json-ld";
import { formatPostDate, getPostBySlug, getPostSlugs, getRelatedPosts } from "@/content/blog/posts";
import { isLocale } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/format";
import { blogPath, landingPath, languageAlternates, postPath, postUrl } from "@/lib/i18n/paths";
import { buildOgImage, buildOgLocales, INDEXABLE_ROBOTS } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

const RELATED_POSTS_COUNT = 3;

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getPostBySlug(locale, slug);
  if (!post) return {};
  const image = buildOgImage(getLandingCopy(locale).seo.ogImageAlt);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: postPath(locale, slug),
      languages: languageAlternates((candidate) => postUrl(candidate, slug)),
    },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: postUrl(locale, slug),
      siteName: SITE_NAME,
      images: [image],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.category,
      authors: [SITE_NAME],
      ...buildOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image.url],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  const copy = getLandingCopy(locale);
  const article = copy.blog.article;
  const readTime = formatMessage(copy.client.blog.readTime, { minutes: post.readMinutes });
  const startTest = `${landingPath(locale)}#top`;

  return (
    <>
      <ReadingProgress />
      <LandingNav basePath={landingPath(locale)} />
      <main id="main">
        <header className="art-head wrap">
          <nav className="crumbs mono" aria-label={article.crumbsLabel}>
            <Link href={blogPath(locale)}>{copy.blog.index.heading}</Link>
            <span aria-hidden="true">/</span>
            <span className="tag">{post.category}</span>
          </nav>
          <h1 className="art-title t1">
            <NoWrapAiTerms text={post.title} />
          </h1>
          <div className="art-meta">
            <span className="by">
              <span className="av" aria-hidden="true">
                C
              </span>
              {article.team}
            </span>
            <time dateTime={post.publishedAt}>{formatPostDate(locale, post.publishedAt)}</time>
            <span>{readTime}</span>
          </div>
        </header>

        <div className="wrap art-cover">
          <PostCoverArt cover={post.cover} copy={copy.client.blog.covers} />
        </div>

        <div className="wrap art-layout">
          <ArticleToc items={getHeadings(post.blocks)} />
          <article className="prose" data-article-body="">
            <ArticleBody blocks={post.blocks} speakers={copy.client.speakers} />
            <div className="art-cta">
              <span className="mono">{article.bottomCtaKicker}</span>
              <b>{article.bottomCtaTitle}</b>
              <p>{article.bottomCtaText}</p>
              <a className="btn btn-white" href={startTest}>
                {article.ctaButton} <Arrow />
              </a>
            </div>
          </article>
          <aside className="art-side">
            <div className="side-cta">
              <span className="mono">{article.sideCtaKicker}</span>
              <b>{article.sideCtaTitle}</b>
              <p>{article.sideCtaText}</p>
              <a className="btn btn-white" href={startTest}>
                {article.sideCtaButton} <Arrow />
              </a>
            </div>
            <div className="share">
              <CopyLinkButton />
            </div>
          </aside>
        </div>

        <section className="sec how related">
          <div className="wrap">
            <MetaRow
              left={article.related}
              right={<Link href={blogPath(locale)}>{article.allArticles}</Link>}
            />
            <div className="posts">
              {getRelatedPosts(locale, post, RELATED_POSTS_COUNT).map((related) => (
                <PostCard
                  key={related.slug}
                  post={related}
                  locale={locale}
                  copy={copy.client.blog}
                />
              ))}
            </div>
          </div>
        </section>

        <FinalCtaSection copy={copy.finalCta} />
      </main>
      <LandingFooter locale={locale} basePath={landingPath(locale)} />
      <JsonLd data={buildPostGraph(locale, post)} />
    </>
  );
}

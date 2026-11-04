import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, getHeadings } from "@/components/blog/article-body";
import { ArticleToc } from "@/components/blog/article-toc";
import { CopyLinkButton } from "@/components/blog/copy-link-button";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { buildPostGraph } from "@/components/blog/structured-data";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { PostCard } from "@/components/landing/post-card";
import { PostCoverArt } from "@/components/landing/post-cover";
import { Arrow, MetaRow, NoWrapAiTerms } from "@/components/landing/typography";
import { JsonLd } from "@/components/landing/json-ld";
import {
  BLOG_BASE_PATH,
  BLOG_POSTS,
  formatPostDate,
  formatReadTime,
  getPostBySlug,
  getPostPath,
  getRelatedPosts,
} from "@/content/blog/posts";
import { INDEXABLE_ROBOTS, OG_IMAGE, OG_LOCALES } from "@/lib/seo";
import { LANDING_PATH, SITE_NAME, SITE_URL } from "@/lib/site";

const RELATED_POSTS_COUNT = 3;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE_URL}${getPostPath(post)}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: getPostPath(post), languages: { "uk-UA": url, "x-default": url } },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.category,
      authors: [SITE_NAME],
      ...OG_LOCALES,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <LandingNav basePath={LANDING_PATH} />
      <main id="main">
        <header className="art-head wrap">
          <nav className="crumbs mono" aria-label="Навігаційний ланцюжок">
            <Link href={BLOG_BASE_PATH}>Блог</Link>
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
              Команда {SITE_NAME}
            </span>
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            <span>{formatReadTime(post)} читання</span>
          </div>
        </header>

        <div className="wrap art-cover">
          <PostCoverArt cover={post.cover} />
        </div>

        <div className="wrap art-layout">
          <ArticleToc items={getHeadings(post.blocks)} />
          <article className="prose" data-article-body="">
            <ArticleBody blocks={post.blocks} />
            <div className="art-cta">
              <span className="mono">Перевірте на практиці</span>
              <b>Почуйте агента на своєму сценарії</b>
              <p>Введіть номер — агент зателефонує за 20 секунд. Без спаму та передачі бази.</p>
              <a className="btn btn-white" href={`${LANDING_PATH}#top`}>
                Запустити тестовий дзвінок <Arrow />
              </a>
            </div>
          </article>
          <aside className="art-side">
            <div className="side-cta">
              <span className="mono">Спробуйте самі</span>
              <b>Агент зателефонує вам за 20 секунд</b>
              <p>Один тестовий дзвінок — і ви почуєте, як звучить розмова з вашими клієнтами.</p>
              <a className="btn btn-white" href={`${LANDING_PATH}#top`}>
                Тестовий дзвінок <Arrow />
              </a>
            </div>
            <div className="share">
              <CopyLinkButton />
            </div>
          </aside>
        </div>

        <section className="sec how related">
          <div className="wrap">
            <MetaRow left="Читайте також" right={<Link href={BLOG_BASE_PATH}>Усі статті →</Link>} />
            <div className="posts">
              {getRelatedPosts(post, RELATED_POSTS_COUNT).map((related) => (
                <PostCard key={related.slug} post={related} />
              ))}
            </div>
          </div>
        </section>

        <FinalCtaSection />
      </main>
      <LandingFooter basePath={LANDING_PATH} />
      <JsonLd data={buildPostGraph(post)} />
    </>
  );
}

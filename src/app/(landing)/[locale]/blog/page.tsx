import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogFilter } from "@/components/blog/blog-filter";
import { buildBlogIndexGraph } from "@/components/blog/structured-data";
import { trackProps } from "@/components/landing/click-tracking";
import { getLandingCopy } from "@/components/landing/copy";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { Arrow, MetaRow } from "@/components/landing/typography";
import { JsonLd } from "@/components/landing/json-ld";
import { getPosts } from "@/content/blog/posts";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { blogPath, blogUrl, homePath, languageAlternates } from "@/lib/i18n/paths";
import { buildOgImage, buildOgLocales, INDEXABLE_ROBOTS } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { blog, seo } = getLandingCopy(locale);
  const image = buildOgImage(seo.ogImageAlt);

  return {
    title: { absolute: blog.index.title },
    description: blog.index.description,
    alternates: { canonical: blogPath(locale), languages: languageAlternates(blogUrl) },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "website",
      title: blog.index.title,
      description: blog.index.description,
      url: blogUrl(locale),
      siteName: SITE_NAME,
      images: [image],
      ...buildOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.index.title,
      description: blog.index.description,
      images: [image.url],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <BlogIndex locale={locale} />;
}

function BlogIndex({ locale }: { locale: Locale }) {
  const { blog } = getLandingCopy(locale);
  const page = blog.index;

  return (
    <>
      <LandingNav basePath={homePath(locale)} />
      <main id="main">
        <section className="blog-hero">
          <div className="wrap">
            <MetaRow left={page.metaLeft} right={page.metaRight} />
            <h1 className="blog-title t1">{page.heading}</h1>
            <div className="blog-intro">
              <p className="t2" data-r="">
                {page.introTitle}
                <em>{page.introAccent}</em>
                {page.introTail}
              </p>
              <p className="lead" data-r="">
                {page.introLead}
              </p>
            </div>
            <BlogFilter posts={getPosts(locale)} />
            <div className="blog-cta" data-r="">
              <div>
                <span className="mono">{page.ctaKicker}</span>
                <h2 className="t1">
                  {page.ctaTitle}
                  <em>{page.ctaAccent}</em>
                </h2>
              </div>
              <div>
                <p>{page.ctaText}</p>
                <a
                  className="btn btn-white"
                  href={`${homePath(locale)}#top`}
                  {...trackProps("blog_cta_click", { location: "blog_index" })}
                >
                  {page.ctaButton} <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter locale={locale} basePath={homePath(locale)} />
      <JsonLd data={buildBlogIndexGraph(locale)} />
    </>
  );
}

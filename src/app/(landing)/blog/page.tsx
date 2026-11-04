import type { Metadata } from "next";
import { BlogFilter } from "@/components/blog/blog-filter";
import { BLOG_URL, buildBlogIndexGraph } from "@/components/blog/structured-data";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { Arrow, MetaRow } from "@/components/landing/typography";
import { JsonLd } from "@/components/landing/json-ld";
import { BLOG_BASE_PATH, BLOG_POSTS } from "@/content/blog/posts";
import { INDEXABLE_ROBOTS, OG_IMAGE, OG_LOCALES } from "@/lib/seo";
import { LANDING_PATH, SITE_NAME } from "@/lib/site";

const TITLE = `Блог ${SITE_NAME} — дзвінки, продажі та ШІ`;
const DESCRIPTION =
  "Гайди, розрахунки і практичні поради про автоматизацію дзвінків, голосових ШІ-агентів і продажі по телефону. Сценарії, економіка, інструкції та міфи.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: BLOG_BASE_PATH,
    languages: { "uk-UA": BLOG_URL, "x-default": BLOG_URL },
  },
  robots: INDEXABLE_ROBOTS,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: BLOG_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    ...OG_LOCALES,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function BlogPage() {
  return (
    <>
      <LandingNav basePath={LANDING_PATH} />
      <main id="main">
        <section className="blog-hero">
          <div className="wrap">
            <MetaRow left="(Блог) Calls4U" right="Гайди · Економіка · Інструкції · Міфи" />
            <h1 className="blog-title t1">Блог</h1>
            <div className="blog-intro">
              <p className="t2" data-r="">
                Про дзвінки, продажі <em>та ШІ</em> — без води і з цифрами
              </p>
              <p className="lead" data-r="">
                Розрахунки, готові сценарії і практичні поради для бізнесу, який не хоче втрачати
                клієнтів на телефоні.
              </p>
            </div>
            <BlogFilter posts={BLOG_POSTS} />
            <div className="blog-cta" data-r="">
              <div>
                <span className="mono">Замість тисячі слів</span>
                <h2 className="t1">
                  Один тестовий дзвінок <em>на свій номер</em>
                </h2>
              </div>
              <div>
                <p>
                  Введіть номер на головній — агент зателефонує за 20 секунд і покаже, як звучить
                  розмова з вашими клієнтами.
                </p>
                <a className="btn btn-white" href={`${LANDING_PATH}#top`}>
                  Запустити тестовий дзвінок <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter basePath={LANDING_PATH} />
      <JsonLd data={buildBlogIndexGraph()} />
    </>
  );
}

import { trackProps } from "@/components/landing/click-tracking";
import { getLandingCopy } from "@/components/landing/copy";
import { Arrow } from "@/components/landing/typography";
import type { Locale } from "@/lib/i18n/config";
import { homePath } from "@/lib/i18n/paths";

interface ArticleCtaProps {
  locale: Locale;
  slug: string;
}

export function ArticleBottomCta({ locale, slug }: ArticleCtaProps) {
  const article = getLandingCopy(locale).blog.article;

  return (
    <div className="art-cta">
      <span className="mono">{article.bottomCtaKicker}</span>
      <b>{article.bottomCtaTitle}</b>
      <p>{article.bottomCtaText}</p>
      <a
        className="btn btn-white"
        href={`${homePath(locale)}#top`}
        {...trackProps("blog_cta_click", { location: "article_bottom", slug })}
      >
        {article.ctaButton} <Arrow />
      </a>
    </div>
  );
}

export function ArticleSideCta({ locale, slug }: ArticleCtaProps) {
  const article = getLandingCopy(locale).blog.article;

  return (
    <div className="side-cta">
      <span className="mono">{article.sideCtaKicker}</span>
      <b>{article.sideCtaTitle}</b>
      <p>{article.sideCtaText}</p>
      <a
        className="btn btn-white"
        href={`${homePath(locale)}#top`}
        {...trackProps("blog_cta_click", { location: "article_side", slug })}
      >
        {article.sideCtaButton} <Arrow />
      </a>
    </div>
  );
}

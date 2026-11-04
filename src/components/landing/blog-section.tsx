import Link from "next/link";
import type { BlogClientCopy } from "@/components/landing/copy/client-types";
import type { BlogTeaserCopy } from "@/components/landing/copy/types";
import { getPosts } from "@/content/blog/posts";
import type { Locale } from "@/lib/i18n/config";
import { blogPath } from "@/lib/i18n/paths";
import { PostCard } from "@/components/landing/post-card";
import { Arrow, CopyHeading, MetaRow } from "@/components/landing/typography";

const HOME_POST_COUNT = 3;

interface BlogSectionProps {
  locale: Locale;
  copy: BlogTeaserCopy;
  cardCopy: BlogClientCopy;
}

export function BlogSection({ locale, copy, cardCopy }: BlogSectionProps) {
  const [featured, ...rest] = getPosts(locale).slice(0, HOME_POST_COUNT);

  return (
    <section className="sec how" id="blog">
      <div className="wrap">
        <MetaRow left={copy.meta} right={copy.metaRight} />
        <div className="sec-head">
          <CopyHeading className="h2 t1" heading={copy.heading} />
          <p className="lead" data-r="">
            {copy.lead}
          </p>
        </div>
        <div className="bp">
          <PostCard post={featured} locale={locale} copy={cardCopy} variant="post--feat" />
          <div className="bp-side">
            {rest.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                copy={cardCopy}
                variant="post--row"
              />
            ))}
          </div>
        </div>
        <div className="bp-foot" data-r="">
          <Link className="btn btn-dark" href={blogPath(locale)}>
            {copy.allPosts} <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

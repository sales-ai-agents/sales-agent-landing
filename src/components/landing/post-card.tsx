import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogClientCopy } from "@/components/landing/copy/client-types";
import type { BlogPost } from "@/content/blog/types";
import type { Locale } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/format";
import { postPath } from "@/lib/i18n/paths";
import { PostCoverArt } from "@/components/landing/post-cover";
import { Arrow, NoWrapAiTerms } from "@/components/landing/typography";

export type PostCardVariant = "default" | "post--feat" | "post--row";

interface PostCardProps {
  post: BlogPost;
  locale: Locale;
  copy: BlogClientCopy;
  variant?: PostCardVariant;
  hidden?: boolean;
}

export function PostCard({
  post,
  locale,
  copy,
  variant = "default",
  hidden = false,
}: PostCardProps) {
  const showsExcerpt = variant !== "default";

  return (
    <Link
      className={cn("post", variant !== "default" && variant, hidden && "is-hidden")}
      href={postPath(locale, post.slug)}
      data-r=""
    >
      <PostCoverArt cover={post.cover} copy={copy.covers} />
      <div className="post-body">
        <div className="post-meta mono">
          <span className="tag">{post.category}</span>
          <span>·</span>
          <span>{formatMessage(copy.readTime, { minutes: post.readMinutes })}</span>
        </div>
        <h3 className="t2">
          <NoWrapAiTerms text={post.title} />
        </h3>
        {showsExcerpt ? <p>{post.excerpt}</p> : null}
        <span className="more">
          {copy.read} <Arrow />
        </span>
      </div>
    </Link>
  );
}

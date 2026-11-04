import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatReadTime, getPostPath } from "@/content/blog/posts";
import type { BlogPost } from "@/content/blog/types";
import { PostCoverArt } from "@/components/landing/post-cover";
import { Arrow, NoWrapAiTerms } from "@/components/landing/typography";

export type PostCardVariant = "default" | "post--feat" | "post--row";

interface PostCardProps {
  post: BlogPost;
  variant?: PostCardVariant;
  hidden?: boolean;
}

export function PostCard({ post, variant = "default", hidden = false }: PostCardProps) {
  const showsExcerpt = variant !== "default";

  return (
    <Link
      className={cn("post", variant !== "default" && variant, hidden && "is-hidden")}
      href={getPostPath(post)}
      data-r=""
    >
      <PostCoverArt cover={post.cover} />
      <div className="post-body">
        <div className="post-meta mono">
          <span className="tag">{post.category}</span>
          <span>·</span>
          <span>{formatReadTime(post)} читання</span>
        </div>
        <h3 className="t2">
          <NoWrapAiTerms text={post.title} />
        </h3>
        {showsExcerpt ? <p>{post.excerpt}</p> : null}
        <span className="more">
          Читати <Arrow />
        </span>
      </div>
    </Link>
  );
}

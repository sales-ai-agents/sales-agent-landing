"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLandingCopy } from "@/components/landing/copy/provider";
import type { BlogPost } from "@/content/blog/types";
import { PostCard } from "@/components/landing/post-card";

interface BlogFilterProps {
  posts: readonly BlogPost[];
}

export function BlogFilter({ posts }: BlogFilterProps) {
  const { locale, copy } = useLandingCopy();
  const [category, setCategory] = useState<string | null>(null);
  const categories = [...new Set(posts.map((post) => post.category))];

  const countFor = (name: string): number => posts.filter((post) => post.category === name).length;

  return (
    <>
      <h2 className="sr-only">{copy.blog.listHeading}</h2>
      <div className="filters" role="group" aria-label={copy.blog.categoriesLabel}>
        <button
          type="button"
          className={cn(category === null && "on")}
          aria-pressed={category === null}
          onClick={() => setCategory(null)}
        >
          {copy.blog.all}
          <span className="cnt">{posts.length}</span>
        </button>
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={cn(name === category && "on")}
            aria-pressed={name === category}
            onClick={() => setCategory(name)}
          >
            {name}
            <span className="cnt">{countFor(name)}</span>
          </button>
        ))}
      </div>
      <div className="posts">
        {posts.map((post, index) => (
          <PostCard
            key={post.slug}
            post={post}
            locale={locale}
            copy={copy.blog}
            variant={index === 0 ? "post--feat" : "default"}
            hidden={category !== null && post.category !== category}
          />
        ))}
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/content/blog/types";
import { PostCard } from "@/components/landing/post-card";

const ALL_CATEGORIES = "Усі";

interface BlogFilterProps {
  posts: readonly BlogPost[];
}

export function BlogFilter({ posts }: BlogFilterProps) {
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const categories = [ALL_CATEGORIES, ...new Set(posts.map((post) => post.category))];

  const countFor = (name: string): number =>
    name === ALL_CATEGORIES ? posts.length : posts.filter((post) => post.category === name).length;

  return (
    <>
      <h2 className="sr-only">Статті блогу</h2>
      <div className="filters" role="group" aria-label="Категорії статей">
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
            variant={index === 0 ? "post--feat" : "default"}
            hidden={category !== ALL_CATEGORIES && post.category !== category}
          />
        ))}
      </div>
    </>
  );
}

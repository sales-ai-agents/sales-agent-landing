import { Fragment } from "react";
import Link from "next/link";
import { BLOG_BASE_PATH, BLOG_POSTS } from "@/content/blog/posts";
import { PostCard } from "@/components/landing/post-card";
import { Arrow, LinesHeading, MetaRow } from "@/components/landing/typography";

const HOME_POST_COUNT = 3;

export function BlogSection() {
  const [featured, ...rest] = BLOG_POSTS.slice(0, HOME_POST_COUNT);

  return (
    <section className="sec how" id="blog">
      <div className="wrap">
        <MetaRow left="(11) Блог" right="Гайди · Економіка · Інструкції" />
        <div className="sec-head">
          <LinesHeading
            className="h2 t1"
            lines={[
              "Блог про дзвінки,",
              <Fragment key="accent">
                <em>продажі</em> та ШІ
              </Fragment>,
            ]}
          />
          <p className="lead" data-r="">
            Розрахунки, сценарії і практичні поради — усе, що допомагає бізнесу не втрачати клієнтів
            на телефоні.
          </p>
        </div>
        <div className="bp">
          <PostCard post={featured} variant="post--feat" />
          <div className="bp-side">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} variant="post--row" />
            ))}
          </div>
        </div>
        <div className="bp-foot" data-r="">
          <Link className="btn btn-dark" href={BLOG_BASE_PATH}>
            Усі статті <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

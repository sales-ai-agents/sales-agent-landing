import { Fragment } from "react";
import Link from "next/link";
import {
  BLOG_BASE_PATH,
  BLOG_POSTS,
  type BlogPost,
  type PostCover,
} from "@/components/landing/posts";
import { Arrow, LinesHeading, MetaRow, NoWrapAiTerms } from "@/components/landing/typography";

const ECON_BAR_COUNT = 34;

const ECON_BARS = Array.from({ length: ECON_BAR_COUNT }, (_, index) =>
  Math.round(18 + Math.abs(Math.sin(index * 0.7) * 55 + Math.sin(index * 0.23) * 25))
);

function Cover({ cover }: { cover: PostCover }) {
  switch (cover) {
    case "five":
      return (
        <div className="cv cv-five">
          <span className="cv-label">Гайд · 5 сценаріїв</span>
          <b>5</b>
          <span className="cv-bub a">Підтверджуємо ваш запис на завтра о 14:00?</span>
          <span className="cv-bub c">Так, буду</span>
        </div>
      );
    case "econ":
      return (
        <div className="cv cv-econ">
          <span className="cv-label">Економіка · приклад</span>
          <div className="cv-bars">
            {ECON_BARS.map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <b>−51 480 ₴</b>
          <small>на місяць іде разом із пропущеними дзвінками</small>
        </div>
      );
    case "vs":
      return (
        <div className="cv cv-vs">
          <span className="cv-label">Порівняння</span>
          <b>Адміністратор</b>
          <em>vs</em>
          <b>ШІ-агент</b>
        </div>
      );
  }
}

function PostCard({ post, variant }: { post: BlogPost; variant: "post--feat" | "post--row" }) {
  return (
    <Link className={`post ${variant}`} href={`${BLOG_BASE_PATH}/${post.slug}`} data-r="">
      <Cover cover={post.cover} />
      <div className="post-body">
        <div className="post-meta mono">
          <span className="tag">{post.category}</span>
          <span>·</span>
          <span>{post.readTime} читання</span>
        </div>
        <h3 className="t2">
          <NoWrapAiTerms text={post.title} />
        </h3>
        <p>{post.excerpt}</p>
        <span className="more">
          Читати <Arrow />
        </span>
      </div>
    </Link>
  );
}

export function BlogSection() {
  const [featured, ...rest] = BLOG_POSTS;

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

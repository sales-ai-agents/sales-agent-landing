import { Fragment } from "react";
import type { RichLink, RichSegment, RichText } from "@/content/blog/claude/types";

const EXTERNAL_LINK_PATTERN = /^https?:\/\//;

function RichLinkNode({ link }: { link: RichLink }) {
  if (!EXTERNAL_LINK_PATTERN.test(link.href)) return <a href={link.href}>{link.label}</a>;

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer">
      {link.label}
    </a>
  );
}

function RichSegmentNode({ segment }: { segment: RichSegment }) {
  if (typeof segment === "string") return segment;
  if ("strong" in segment) return <strong>{segment.strong}</strong>;
  if ("code" in segment) return <code>{segment.code}</code>;
  return <RichLinkNode link={segment} />;
}

export function RichContent({ content }: { content: RichText }) {
  return content.map((segment, index) => (
    <Fragment key={index}>
      <RichSegmentNode segment={segment} />
    </Fragment>
  ));
}

import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";

type HeadingTag = "h2" | "h3";

interface LinesHeadingProps {
  as?: HeadingTag;
  className: string;
  lines: readonly ReactNode[];
  style?: CSSProperties;
}

export function LinesHeading({ as: Tag = "h2", className, lines, style }: LinesHeadingProps) {
  return (
    <Tag className={className} style={style} data-lines="">
      {lines.map((line, index) => (
        <span className="ln" key={index}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

const WORD_PATTERN = /(\s+)/;

export function SplitLetters({ text }: { text: string }) {
  return text.split(WORD_PATTERN).map((part, index) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return <Fragment key={index}> </Fragment>;
    return (
      <span className="w" key={index}>
        {Array.from(part).map((char, charIndex) => (
          <span className="ch" key={charIndex}>
            {char}
          </span>
        ))}
      </span>
    );
  });
}

const AI_TERM = /(ШІ-[^\s,.:;!?»]+)/;

export function NoWrapAiTerms({ text }: { text: string }) {
  return text.split(AI_TERM).map((part, index) =>
    AI_TERM.test(part) ? (
      <span className="nw" key={index}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
}

export function Arrow() {
  return <span className="arr">→</span>;
}

interface MetaRowProps {
  left: string;
  right: ReactNode;
  reveal?: boolean;
}

export function MetaRow({ left, right, reveal = true }: MetaRowProps) {
  return (
    <div className="meta-row mono" data-r={reveal ? "" : undefined}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

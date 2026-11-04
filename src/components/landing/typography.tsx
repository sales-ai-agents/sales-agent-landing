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

interface CountValueProps {
  value: number;
  animated?: boolean;
}

export function CountValue({ value, animated = true }: CountValueProps) {
  return (
    <span
      className="count"
      data-count={animated ? value : undefined}
      style={{ minWidth: `${String(value).length}ch` }}
    >
      {value}
    </span>
  );
}

export const countLetters = (text: string): number => Array.from(text.replace(/\s+/g, "")).length;

interface SplitLettersProps {
  text: string;
  startIndex?: number;
}

const isWhitespace = (value: string): boolean => /^\s+$/.test(value);

export function SplitLetters({ text, startIndex = 0 }: SplitLettersProps) {
  const parts = text.split(WORD_PATTERN).filter(Boolean);
  const offsets = parts.reduce<number[]>((accumulated, part, index) => {
    const previous =
      index === 0 ? startIndex : accumulated[index - 1] + countLetters(parts[index - 1]);
    accumulated.push(previous);
    return accumulated;
  }, []);

  return parts.map((part, index) => {
    if (isWhitespace(part)) return <Fragment key={index}> </Fragment>;
    return (
      <span className="w" key={index}>
        {Array.from(part).map((char, charIndex) => (
          <span
            className="ch"
            key={charIndex}
            style={{ "--i": offsets[index] + charIndex } as CSSProperties}
          >
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

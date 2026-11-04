import { Fragment } from "react";
import type { PostBlock } from "@/content/blog/types";
import { NoWrapAiTerms } from "@/components/landing/typography";

const getHeadingId = (position: number): string => `section-${position}`;

export const getHeadings = (blocks: readonly PostBlock[]): { id: string; label: string }[] =>
  blocks
    .filter((block) => block.type === "heading")
    .map((block, index) => ({ id: getHeadingId(index + 1), label: block.text }));

interface Speakers {
  readonly agent: string;
  readonly client: string;
}

function renderBlock(block: PostBlock, headingPosition: number, speakers: Speakers) {
  switch (block.type) {
    case "lead":
      return <p className="lead-p">{block.text}</p>;
    case "heading":
      return <h2 id={getHeadingId(headingPosition)}>{block.text}</h2>;
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote>
          <NoWrapAiTerms text={block.text} />
        </blockquote>
      );
    case "formula":
      return <div className="formula">{block.text}</div>;
    case "note":
      return <div className="note">{block.text}</div>;
    case "dialog":
      return (
        <div className="dialog">
          {block.lines.map((line) => (
            <div
              key={`${line.speaker}-${line.text}`}
              className={`msg ${line.speaker === "agent" ? "a" : "c"}`}
            >
              <small>{speakers[line.speaker]}</small>
              {line.text}
            </div>
          ))}
        </div>
      );
  }
}

const countHeadingsUpTo = (blocks: readonly PostBlock[]): number[] =>
  blocks.reduce<number[]>((positions, block, index) => {
    const previous = positions[index - 1] ?? 0;
    positions.push(block.type === "heading" ? previous + 1 : previous);
    return positions;
  }, []);

interface ArticleBodyProps {
  blocks: readonly PostBlock[];
  speakers: Speakers;
}

export function ArticleBody({ blocks, speakers }: ArticleBodyProps) {
  const headingPositions = countHeadingsUpTo(blocks);

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block, headingPositions[index], speakers)}</Fragment>
      ))}
    </>
  );
}

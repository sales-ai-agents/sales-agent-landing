import { Fragment } from "react";
import { getHeadingId } from "@/components/blog/article-body";
import { RichContent } from "@/components/blog/rich-content";
import type { ClaudeBlock, ClaudeSection } from "@/content/blog/claude/types";

function ClaudeBlockNode({ block }: { block: ClaudeBlock }) {
  if (block.type === "paragraph") {
    return (
      <p>
        <RichContent content={block.content} />
      </p>
    );
  }

  const List = block.ordered ? "ol" : "ul";

  return (
    <List>
      {block.items.map((item, index) => (
        <li key={index}>
          <RichContent content={item} />
        </li>
      ))}
    </List>
  );
}

export function ClaudeSections({ sections }: { sections: readonly ClaudeSection[] }) {
  return sections.map((section, index) => (
    <Fragment key={section.heading}>
      <h2 id={getHeadingId(index + 1)}>{section.heading}</h2>
      {section.blocks.map((block, blockIndex) => (
        <ClaudeBlockNode key={blockIndex} block={block} />
      ))}
    </Fragment>
  ));
}

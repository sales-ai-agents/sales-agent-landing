export type EmbeddedCover = "five" | "econ" | "vs" | "crm" | "myth" | "script";

export type CoverVariant = "econ" | "five" | "vs" | "myth" | "script" | "photo";

export type DialogSpeaker = "agent" | "client";

export interface CoverBubble {
  readonly role: DialogSpeaker;
  readonly text: string;
}

export interface RemoteCover {
  readonly variant: CoverVariant;
  readonly label: string;
  readonly big?: string;
  readonly caption?: string;
  readonly left?: string;
  readonly right?: string;
  readonly bubbles?: readonly CoverBubble[];
}

export type PostCover = EmbeddedCover | RemoteCover;

export interface DialogLine {
  readonly speaker: DialogSpeaker;
  readonly text: string;
}

export type PostBlock =
  | { readonly type: "lead"; readonly text: string }
  | { readonly type: "heading"; readonly text: string }
  | { readonly type: "paragraph"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[] }
  | { readonly type: "quote"; readonly text: string }
  | { readonly type: "formula"; readonly text: string }
  | { readonly type: "note"; readonly text: string }
  | { readonly type: "dialog"; readonly lines: readonly DialogLine[] };

export interface BlogPostSummary {
  readonly slug: string;
  readonly category: string;
  readonly readMinutes: number;
  readonly cover: PostCover;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
  readonly updatedAt: string;
}

export interface BlogPost extends BlogPostSummary {
  readonly keywords?: readonly string[];
  readonly blocks: readonly PostBlock[];
}

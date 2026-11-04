export type PostCover = "five" | "econ" | "vs" | "crm" | "myth" | "script";

export type DialogSpeaker = "agent" | "client";

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

export interface BlogPost {
  readonly slug: string;
  readonly category: string;
  readonly readMinutes: number;
  readonly cover: PostCover;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly blocks: readonly PostBlock[];
}

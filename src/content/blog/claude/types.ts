export interface RichLink {
  readonly label: string;
  readonly href: string;
}

export type RichSegment =
  string | { readonly strong: string } | { readonly code: string } | RichLink;

export type RichText = readonly RichSegment[];

export type ClaudeBlock =
  | { readonly type: "paragraph"; readonly content: RichText }
  | { readonly type: "list"; readonly ordered?: boolean; readonly items: readonly RichText[] };

export interface ClaudeSection {
  readonly heading: string;
  readonly blocks: readonly ClaudeBlock[];
}

export interface ClaudePage {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly title: string;
  readonly crumb: string;
  readonly lead: RichText;
  readonly sections: readonly ClaudeSection[];
}

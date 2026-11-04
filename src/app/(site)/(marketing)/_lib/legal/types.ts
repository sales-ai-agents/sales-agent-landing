export interface LegalLink {
  readonly label: string;
  readonly href: string;
}

export type LegalInline = string | LegalLink;

export interface LegalParagraph {
  readonly type: "paragraph";
  readonly content: readonly LegalInline[];
}

export interface LegalList {
  readonly type: "list";
  readonly ordered?: boolean;
  readonly items: readonly (readonly LegalInline[])[];
}

export interface LegalContacts {
  readonly type: "contacts";
  readonly rows: readonly { readonly label: string; readonly value: string }[];
}

export type LegalBlock = LegalParagraph | LegalList | LegalContacts;

export interface LegalSection {
  readonly heading?: string;
  readonly blocks: readonly LegalBlock[];
}

export interface LegalDocument {
  readonly slug: string;
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly intro?: readonly LegalInline[];
  readonly updatedNote?: string;
  readonly sections: readonly LegalSection[];
}

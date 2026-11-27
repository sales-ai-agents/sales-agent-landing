import type {
  LegalContacts,
  LegalInline,
  LegalList,
  LegalParagraph,
  LegalSection,
  LegalTable,
} from "./types";

export const paragraph = (...content: LegalInline[]): LegalParagraph => ({
  type: "paragraph",
  content,
});

export const list = (items: readonly (readonly LegalInline[])[], ordered = false): LegalList => ({
  type: "list",
  ordered,
  items,
});

export const contacts = (rows: readonly { label: string; value: string }[]): LegalContacts => ({
  type: "contacts",
  rows,
});

export const section = (
  heading: string | undefined,
  ...blocks: LegalSection["blocks"]
): LegalSection => ({ heading, blocks });

export const table = (
  head: readonly string[],
  rows: readonly (readonly string[])[]
): LegalTable => ({
  type: "table",
  head,
  rows,
});

export const UPDATED_NOTE = "Дата останнього оновлення: у процесі публікації";

export const UPDATED_NOTE_EN = "Last updated: in progress";

export const updatedOn = (date: string): string => `Дата останнього оновлення: ${date}`;

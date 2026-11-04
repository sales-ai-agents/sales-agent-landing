export interface TagColor {
  bg: string;
  text: string;
}

const TAG_COLORS: Record<string, TagColor> = {
  VIP: { bg: "bg-warning/15", text: "text-warning" },
  Новий: { bg: "bg-success/15", text: "text-success" },
  "Прострочена оплата": { bg: "bg-destructive/15", text: "text-destructive" },
  "Постійний клієнт": { bg: "bg-primary/10", text: "text-primary" },
};

const DEFAULT_TAG_COLOR: TagColor = { bg: "bg-muted", text: "text-muted-foreground" };

export const getTagColor = (tag: string): TagColor => {
  return TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR;
};

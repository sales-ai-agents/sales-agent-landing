import type { BadgeProps } from "@/components/ui/badge";

export interface TagColor {
  variant: NonNullable<BadgeProps["variant"]>;
}

const TAG_COLORS: Record<string, TagColor> = {
  VIP: { variant: "warning" },
  Новий: { variant: "success" },
  "Прострочена оплата": { variant: "destructive" },
  "Постійний клієнт": { variant: "secondary" },
  Повторний: { variant: "muted" },
};

const DEFAULT_TAG_COLOR: TagColor = { variant: "secondary" };

export const getTagColor = (tag: string): TagColor => {
  return TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR;
};

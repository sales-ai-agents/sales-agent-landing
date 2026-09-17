export interface TagColor {
  bg: string;
  text: string;
}

const TAG_COLORS: Record<string, TagColor> = {
  VIP: { bg: "bg-orange-100", text: "text-orange-600" },
  Новий: { bg: "bg-green-100", text: "text-green-700" },
  "Прострочена оплата": { bg: "bg-red-100", text: "text-red-600" },
  "Постійний клієнт": { bg: "bg-blue-100", text: "text-blue-600" },
};

const DEFAULT_TAG_COLOR: TagColor = { bg: "bg-gray-100", text: "text-gray-700" };

export const getTagColor = (tag: string): TagColor => {
  return TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR;
};

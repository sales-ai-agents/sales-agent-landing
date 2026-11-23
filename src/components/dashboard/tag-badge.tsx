import { Badge } from "@/components/ui";
import { getTagColor } from "@/app/(site)/(app)/_lib/tag-colors";

export const TagBadge = ({ tag, className }: { tag: string; className?: string }) => (
  <Badge variant={getTagColor(tag).variant} className={className}>
    {tag}
  </Badge>
);

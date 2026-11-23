import { Plus } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { ContactTagCount } from "@dashboard/types";

interface TagFilterBarProps {
  totalContacts: number;
  tags: ContactTagCount[];
  draftTags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
  onCreate: () => void;
}

interface TagFilterButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const TagFilterButton = ({ label, count, isActive, onClick }: TagFilterButtonProps) => (
  <Button
    type="button"
    variant={isActive ? "default" : "outline"}
    size="sm"
    aria-pressed={isActive}
    onClick={onClick}
  >
    {label} <b className="tabular-nums">{formatNumber(count)}</b>
  </Button>
);

export const TagFilterBar = ({
  totalContacts,
  tags,
  draftTags,
  activeTag,
  onSelect,
  onCreate,
}: TagFilterBarProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <TagFilterButton
      label="Усі контакти"
      count={totalContacts}
      isActive={!activeTag}
      onClick={() => onSelect(null)}
    />
    {tags.map(({ tag, count }) => (
      <TagFilterButton
        key={tag}
        label={tag}
        count={count}
        isActive={activeTag === tag}
        onClick={() => onSelect(activeTag === tag ? null : tag)}
      />
    ))}
    {draftTags.map((tag) => (
      <Badge
        key={tag}
        variant="outline"
        className="h-9 px-4 text-sm"
        title="Тег збережеться, коли ви призначите його контакту"
      >
        {tag} <b>0</b>
      </Badge>
    ))}
    <Button type="button" variant="secondary" size="sm" onClick={onCreate}>
      <Plus aria-hidden="true" />
      Створити тег
    </Button>
  </div>
);

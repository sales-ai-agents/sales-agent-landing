import { Plus, X } from "lucide-react";
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
  onDelete: (tag: string) => void;
}

interface TagFilterButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const TagFilterButton = ({ label, count, isActive, onClick, onDelete }: TagFilterButtonProps) => (
  <div className="flex items-center">
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      aria-pressed={isActive}
      onClick={onClick}
      className="rounded-r-none border-r-0"
    >
      {label} <b className="tabular-nums">{formatNumber(count)}</b>
    </Button>
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      aria-label={`Видалити тег ${label}`}
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="rounded-l-none px-2"
    >
      <X className="size-3" aria-hidden="true" />
    </Button>
  </div>
);

export const TagFilterBar = ({
  totalContacts,
  tags,
  draftTags,
  activeTag,
  onSelect,
  onCreate,
  onDelete,
}: TagFilterBarProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <Button
      type="button"
      variant={!activeTag ? "default" : "outline"}
      size="sm"
      aria-pressed={!activeTag}
      onClick={() => onSelect(null)}
    >
      Усі контакти <b className="tabular-nums">{formatNumber(totalContacts)}</b>
    </Button>
    {tags.map(({ tag, count }) => (
      <TagFilterButton
        key={tag}
        label={tag}
        count={count}
        isActive={activeTag === tag}
        onClick={() => onSelect(activeTag === tag ? null : tag)}
        onDelete={() => onDelete(tag)}
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

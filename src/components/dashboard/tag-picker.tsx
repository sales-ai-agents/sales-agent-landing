import { Badge } from "@/components/ui";
import { getTagColor } from "@/app/(site)/(app)/_lib/tag-colors";

interface TagPickerProps {
  options: string[];
  value: string[];
  onChange: (tags: string[]) => void;
}

export const TagPicker = ({ options, value, onChange }: TagPickerProps) => {
  if (options.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Тегів поки немає. Створіть тег у списку контактів.
      </p>
    );
  }

  const toggle = (tag: string): void => {
    onChange(value.includes(tag) ? value.filter((item) => item !== tag) : [...value, tag]);
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Теги контакту">
      {options.map((tag) => {
        const isSelected = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(tag)}
            className="cursor-pointer rounded-full focus-visible:outline-2"
          >
            <Badge variant={isSelected ? getTagColor(tag).variant : "outline"}>{tag}</Badge>
          </button>
        );
      })}
    </div>
  );
};

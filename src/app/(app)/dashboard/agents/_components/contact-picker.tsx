"use client";

import { useMemo, useState } from "react";
import { Search, Tag } from "lucide-react";

import { Checkbox, Input, Toggle, ToggleGroup } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getTagColor } from "@/app/(app)/_lib/tag-colors";
import { useContacts } from "@dashboard/hooks";

const ALL_TAGS_FILTER = "__all__";

interface ContactPickerProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export const ContactPicker = ({ selectedIds, onChange }: ContactPickerProps) => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(ALL_TAGS_FILTER);

  const tag = activeTag === ALL_TAGS_FILTER ? undefined : activeTag;
  const { data, isFetching } = useContacts({ search: search.trim(), tag });

  const contacts = data?.contacts ?? [];
  const totalContacts = data?.stats.total_contacts ?? 0;
  const tagCounts = data?.tags ?? [];

  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allVisibleSelected = contacts.length > 0 && contacts.every((c) => selected.has(c.id));

  const toggleContact = (id: number): void => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  const toggleAllVisible = (): void => {
    const next = new Set(selected);
    if (allVisibleSelected) contacts.forEach((c) => next.delete(c.id));
    else contacts.forEach((c) => next.add(c.id));
    onChange(Array.from(next));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Пошук контактів за ім'ям або телефоном..."
          className="pl-9"
          aria-label="Пошук контактів"
        />
      </div>

      <ToggleGroup
        aria-label="Фільтр за тегом"
        value={[activeTag]}
        onValueChange={(value) => setActiveTag(value.at(-1) ?? ALL_TAGS_FILTER)}
      >
        <Toggle value={ALL_TAGS_FILTER} variant="soft" size="sm">
          <Tag className="h-3 w-3" />
          Усі контакти
          <span className="font-medium">{totalContacts}</span>
        </Toggle>
        {tagCounts.map((item) => (
          <Toggle key={item.tag} value={item.tag} variant="soft" size="sm">
            <Tag className="h-3 w-3" />
            {item.tag}
            <span className="font-medium">{item.count}</span>
          </Toggle>
        ))}
      </ToggleGroup>

      <div className="border-border overflow-hidden rounded-xl border">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="border-b">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={toggleAllVisible}
                    aria-label="Обрати всі контакти"
                    disabled={contacts.length === 0}
                  />
                </th>
                <th className="px-2 py-3 text-left font-medium">Ім&apos;я</th>
                <th className="px-2 py-3 text-left font-medium">Телефон</th>
                <th className="px-2 py-3 text-left font-medium">Теги</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-muted-foreground px-4 py-10 text-center">
                    {isFetching ? "Завантаження..." : "Контактів не знайдено"}
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-muted/20 cursor-pointer border-b last:border-0"
                    onClick={() => toggleContact(contact.id)}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.has(contact.id)}
                        onCheckedChange={() => toggleContact(contact.id)}
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Обрати ${contact.name}`}
                      />
                    </td>
                    <td className="px-2 py-3 font-medium">{contact.name}</td>
                    <td className="text-muted-foreground px-2 py-3">{contact.phone}</td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(contact.tags ?? []).map((tagName) => {
                          const color = getTagColor(tagName);
                          return (
                            <span
                              key={tagName}
                              className={cn(
                                "inline-block rounded px-2 py-0.5 text-xs",
                                color.bg,
                                color.text
                              )}
                            >
                              {tagName}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <p className="text-muted-foreground text-xs">Обрано контактів: {selectedIds.length}</p>
      )}
    </div>
  );
};

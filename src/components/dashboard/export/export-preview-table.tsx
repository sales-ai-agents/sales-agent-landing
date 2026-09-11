import { cn } from "@/lib/utils";
import type { Contact } from "@dashboard/types";
import { formatConsentLabel, getTagColor } from "@/app/(app)/dashboard/contacts/_lib/utils";

interface ExportPreviewTableProps {
  contacts: Contact[];
}

export const ExportPreviewTable = ({ contacts }: ExportPreviewTableProps) => {
  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr className="text-left">
            <th className="px-4 py-2.5 font-medium">Ім&apos;я</th>
            <th className="px-4 py-2.5 font-medium">Телефон</th>
            <th className="px-4 py-2.5 font-medium">Теги</th>
            <th className="px-4 py-2.5 font-medium">Згода</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => {
            const consent = formatConsentLabel(contact.consent);
            const tags = contact.tags ?? [];
            return (
              <tr key={contact.id} className="border-border border-t">
                <td className="px-4 py-2.5 font-medium">{contact.name || "—"}</td>
                <td className="text-muted-foreground px-4 py-2.5">{contact.phone}</td>
                <td className="px-4 py-2.5">
                  {tags.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => {
                        const color = getTagColor(tag);
                        return (
                          <span
                            key={tag}
                            className={cn(
                              "inline-block rounded px-2 py-0.5 text-xs font-normal",
                              color.bg,
                              color.text
                            )}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </td>
                <td className={cn("px-4 py-2.5", consent.color)}>
                  <span className="flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", consent.dot)} />
                    {consent.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Contact } from "@dashboard/types";
import { formatConsentLabel, getTagColor } from "@/app/(app)/dashboard/contacts/_lib/utils";

interface ExportPreviewTableProps {
  contacts: Contact[];
}

export const ExportPreviewTable = ({ contacts }: ExportPreviewTableProps) => {
  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Ім&apos;я</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Теги</TableHead>
            <TableHead>Згода</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => {
            const consent = formatConsentLabel(contact.consent);
            const tags = contact.tags ?? [];
            return (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{contact.phone}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className={consent.color}>
                  <span className="flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", consent.dot)} />
                    {consent.label}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

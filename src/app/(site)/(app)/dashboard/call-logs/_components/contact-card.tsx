import Link from "next/link";
import { Badge, buttonVariants, Card, CardTitle } from "@/components/ui";
import { TagBadge } from "@/components/dashboard";
import type { CallContact } from "@dashboard/types";

interface ContactCardProps {
  contact: CallContact | null | undefined;
  phone: string;
}

const EMPTY_VALUE = "—";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <>
    <dt className="caption text-muted-foreground self-center">{label}</dt>
    <dd className="text-sm">{children}</dd>
  </>
);

const KnownContact = ({ contact, phone }: { contact: CallContact; phone: string }) => (
  <>
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
      <Row label="Ім'я">{contact.name || EMPTY_VALUE}</Row>
      <Row label="Телефон">
        <b className="tabular-nums">{contact.phone || phone}</b>
      </Row>
      <Row label="Email">{contact.email || EMPTY_VALUE}</Row>
      <Row label="Теги">
        {contact.tags.length > 0 ? (
          <span className="flex flex-wrap gap-1.5">
            {contact.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </span>
        ) : (
          EMPTY_VALUE
        )}
      </Row>
    </dl>
    {contact.do_not_call && <Badge variant="destructive">Просив не дзвонити</Badge>}
  </>
);

const UnknownContact = ({ phone }: { phone: string }) => (
  <>
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
      <Row label="Телефон">
        <b className="tabular-nums">{phone}</b>
      </Row>
    </dl>
    <p className="text-muted-foreground text-sm">Цього номера немає у ваших контактах.</p>
    <Link
      className={buttonVariants({ variant: "link", className: "w-fit px-0" })}
      href="/dashboard/contacts"
    >
      Перейти до контактів
    </Link>
  </>
);

export const ContactCard = ({ contact, phone }: ContactCardProps) => (
  <Card className="flex flex-col gap-3 p-6">
    <CardTitle className="text-lg">Пов&apos;язаний контакт</CardTitle>
    {contact ? <KnownContact contact={contact} phone={phone} /> : <UnknownContact phone={phone} />}
  </Card>
);

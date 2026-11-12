import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { COMPANY_INFO, LEGAL_PAGE_LIST } from "@/lib/constants";
import { SITE_CONTACT } from "@/lib/site";

const LINK_CLASS_NAME = "text-sm text-white/90 transition-colors hover:text-white";

export function LegalFooter() {
  return (
    <footer className="bg-primary">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 md:grid-cols-2">
        <nav aria-label="Правові документи">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
            Документи
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {LEGAL_PAGE_LIST.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className={LINK_CLASS_NAME}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
            Контакти
          </h2>
          <ul className="flex flex-col gap-3">
            <li>
              <a href={`mailto:${SITE_CONTACT.email}`} className={`${LINK_CLASS_NAME} flex gap-2`}>
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {SITE_CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE_CONTACT.phone}`} className={`${LINK_CLASS_NAME} flex gap-2`}>
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {COMPANY_INFO.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-5xl px-6 pb-8 text-sm text-white/90">
        © {new Date().getFullYear()}{" "}
        <Link href="/" className="underline">
          {COMPANY_INFO.site}
        </Link>
        . Всі права захищені.
      </p>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_LABEL,
  FOOTER_DOCUMENTS,
  NAV_LINKS,
} from "@/components/landing/data";

export function LandingFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <a href="#top" className="foot-logo">
              <Image className="ic" src="/image/Logo.svg" alt="" width={39} height={40} />
              <Image
                className="word"
                src="/image/calls4u.svg"
                alt="calls4u"
                width={96}
                height={20}
              />
            </a>
            <p>
              ШІ-агент для рутинних дзвінків: підтверджує записи і передає результат у CRM або
              менеджеру.
            </p>
          </div>
          <div>
            <span className="mono">Навігація</span>
            {NAV_LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </div>
          <div>
            <span className="mono">Документи</span>
            {FOOTER_DOCUMENTS.map((document) => (
              <Link key={document.href} href={document.href}>
                {document.label}
              </Link>
            ))}
          </div>
          <div>
            <span className="mono">Контакти</span>
            <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_LABEL}</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <Link href="/contacts">Залишити заявку</Link>
          </div>
        </div>
        <div className="foot-bot">
          <span>© {new Date().getFullYear()} Calls4U. Всі права захищені.</span>
          <span>Зроблено, щоб ваші менеджери займались продажами.</span>
        </div>
      </div>
      <div className="foot-word" aria-hidden="true">
        calls4u
      </div>
    </footer>
  );
}

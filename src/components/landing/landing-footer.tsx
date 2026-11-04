import Image from "next/image";
import { AnchorLink } from "@/components/landing/anchor-link";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_LABEL,
  FOOTER_DOCUMENTS,
  NAV_LINKS,
  resolveLandingHref,
} from "@/components/landing/data";
import { FormDialogTrigger } from "@/components/landing/form-dialog-trigger";

interface LandingFooterProps {
  basePath?: string;
}

export function LandingFooter({ basePath = "" }: LandingFooterProps) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <AnchorLink href={basePath ? basePath : "#top"} className="foot-logo">
              <Image className="ic" src="/image/Logo.svg" alt="" width={39} height={40} />
              <Image
                className="word"
                src="/image/calls4u.svg"
                alt="calls4u"
                width={99}
                height={22}
              />
            </AnchorLink>
            <p>
              ШІ-агент для рутинних дзвінків: підтверджує записи і передає результат у CRM або
              менеджеру.
            </p>
          </div>
          <div>
            <span className="mono">Навігація</span>
            {NAV_LINKS.map((link) => {
              const href = resolveLandingHref(link.href, basePath);
              return (
                <AnchorLink key={link.href} href={href}>
                  {link.label}
                </AnchorLink>
              );
            })}
          </div>
          <div>
            <span className="mono">Документи</span>
            {FOOTER_DOCUMENTS.map((document) => (
              <a key={document.href} href={document.href}>
                {document.label}
              </a>
            ))}
          </div>
          <div>
            <span className="mono">Контакти</span>
            <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_LABEL}</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <FormDialogTrigger kind="lead" source="landing_footer" className="foot-link">
              Залишити заявку
            </FormDialogTrigger>
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

import Image from "next/image";
import { AnchorLink } from "@/components/landing/anchor-link";
import { trackProps } from "@/components/landing/click-tracking";
import { getLandingCopy } from "@/components/landing/copy";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_LABEL,
  FOOTER_DOCUMENTS,
  NAV_ITEMS,
  resolveNavHref,
} from "@/components/landing/data";
import { FormDialogTrigger } from "@/components/landing/form-dialog-trigger";
import type { Locale } from "@/lib/i18n/config";
import { SITE_SOCIAL } from "@/lib/site";

interface LandingFooterProps {
  locale: Locale;
  basePath?: string;
}

export function LandingFooter({ locale, basePath = "" }: LandingFooterProps) {
  const { footer, client } = getLandingCopy(locale);

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
                alt="Calls4U"
                width={99}
                height={22}
              />
            </AnchorLink>
            <p>{footer.about}</p>
          </div>
          <div>
            <span className="mono">{footer.navTitle}</span>
            {NAV_ITEMS.map((item) => (
              <AnchorLink key={item.id} href={resolveNavHref(item, basePath, locale)}>
                {client.nav.links[item.id]}
              </AnchorLink>
            ))}
          </div>
          <div>
            <span className="mono">{footer.documentsTitle}</span>
            {FOOTER_DOCUMENTS.map((document) => (
              <a key={document.id} href={document.href}>
                {footer.documents[document.id]}
              </a>
            ))}
            {footer.documentsNote ? <small>{footer.documentsNote}</small> : null}
          </div>
          <div>
            <span className="mono">{footer.contactsTitle}</span>
            <a
              href={CONTACT_PHONE_HREF}
              {...trackProps("contact_click", { method: "phone", location: "landing_footer" })}
            >
              {CONTACT_PHONE_LABEL}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              {...trackProps("contact_click", { method: "email", location: "landing_footer" })}
            >
              {CONTACT_EMAIL}
            </a>
            <a href={SITE_SOCIAL.linkedin} target="_blank" rel="me noopener noreferrer">
              LinkedIn
            </a>
            <a href={SITE_SOCIAL.instagram} target="_blank" rel="me noopener noreferrer">
              Instagram
            </a>
            <FormDialogTrigger kind="lead" source="landing_footer" className="foot-link">
              {footer.leaveRequest}
            </FormDialogTrigger>
          </div>
        </div>
        <div className="foot-bot">
          <span>
            © {new Date().getFullYear()} Calls4U. {footer.rights}
          </span>
          <span>{footer.tagline}</span>
        </div>
      </div>
      <div className="foot-word" aria-hidden="true">
        calls4u
      </div>
    </footer>
  );
}

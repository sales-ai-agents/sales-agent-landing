import { COMPANY_INFO, LEGAL_PAGES } from "@/lib/constants";

import { contacts, paragraph, section } from "../builders";
import type { LegalDocument } from "../types";

export const contactsDocument: LegalDocument = {
  slug: LEGAL_PAGES.contacts.href,
  title: "Контактна інформація",
  metaTitle: "Контакти",
  metaDescription:
    "Контактні та реєстраційні дані calls4u.ai: найменування, РНОКПП, адреса, телефон, електронна пошта та режим роботи служби підтримки.",
  sections: [
    section(
      undefined,
      contacts([
        { label: "Магазин", value: COMPANY_INFO.site },
        { label: "Повне найменування", value: COMPANY_INFO.legalName },
        { label: "РНОКПП (ІПН)", value: COMPANY_INFO.taxId },
        { label: "Система оподаткування", value: COMPANY_INFO.taxSystem },
        { label: "Юридична адреса", value: COMPANY_INFO.address },
        { label: "Телефон", value: COMPANY_INFO.phone },
        { label: "Електронна пошта", value: COMPANY_INFO.email },
        { label: "Режим роботи підтримки", value: "Пн–Пт, 10:00–19:00 (за київським часом)" },
      ])
    ),
    section(
      undefined,
      paragraph(
        "Діяльність здійснюється дистанційно за адресою реєстрації, зазначеною вище. З усіх питань щодо роботи Сервісу, оплати та обробки персональних даних звертайтесь на ",
        { label: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
        "."
      ),
      paragraph(
        "Правові документи Сервісу: ",
        { label: "Публічна оферта", href: LEGAL_PAGES.offer.href },
        ", ",
        { label: "Умови надання послуг", href: LEGAL_PAGES.serviceTerms.href },
        ", ",
        { label: "Умови повернення коштів", href: LEGAL_PAGES.refundPolicy.href },
        ", ",
        { label: "Політика конфіденційності", href: LEGAL_PAGES.privacyPolicy.href },
        "."
      )
    ),
  ],
};

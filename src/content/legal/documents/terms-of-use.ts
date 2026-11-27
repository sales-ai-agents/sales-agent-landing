import { COMPANY_INFO, LEGAL_PAGES } from "@/lib/constants";

import { contacts, paragraph, section, UPDATED_NOTE, UPDATED_NOTE_EN } from "../builders";
import type { LegalDocument } from "../types";

export const termsOfUse: LegalDocument = {
  slug: LEGAL_PAGES.termsOfUse.href,
  title: "Умови використання сайту",
  metaTitle: "Умови використання сайту",
  metaDescription:
    "Порядок доступу та користування вебсайтом calls4u.ai: права інтелектуальної власності, реєстрація, обмеження відповідальності та застосовне право.",
  updatedNote: UPDATED_NOTE,
  sections: [
    section(
      "1. Загальні положення",
      paragraph(
        "Ці Умови використання регулюють порядок доступу та користування вебсайтом calls4u.ai (далі — «Сайт»)."
      ),
      paragraph(
        `Власником Сайту є ${COMPANY_INFO.legalName}, РНОКПП ${COMPANY_INFO.taxId}, адреса: ${COMPANY_INFO.address} (далі — «Виконавець», «ми»).`
      ),
      paragraph(
        "Ці Умови стосуються користування саме Сайтом як інформаційним ресурсом. Порядок і умови надання самого Сервісу визначаються окремими документами — ",
        { label: "Умовами надання послуг", href: LEGAL_PAGES.serviceTerms.href },
        " та ",
        { label: "Публічною офертою", href: LEGAL_PAGES.offer.href },
        "."
      ),
      paragraph(
        "Розпочинаючи користування Сайтом, ви підтверджуєте свою повну дієздатність та згоду з цими Умовами."
      )
    ),
    section(
      "2. Використання Сайту",
      paragraph(
        "Сайт та всі його елементи (тексти, графіка, логотипи, програмний код, дизайн) є об'єктами права інтелектуальної власності Виконавця або використовуються ним на законних підставах."
      ),
      paragraph(
        "Забороняється: копіювати, відтворювати, розповсюджувати матеріали Сайту без письмової згоди Виконавця; використовувати Сайт для протиправних дій, розповсюдження шкідливого ПЗ, спроб несанкціонованого доступу; здійснювати автоматизований збір даних (парсинг) без дозволу."
      ),
      paragraph(
        "Ми залишаємо за собою право обмежити або припинити доступ користувача до Сайту в разі порушення цих Умов."
      )
    ),
    section(
      "3. Реєстрація та особистий кабінет",
      paragraph(
        "Для доступу до окремих функцій Сайту та Сервісу необхідна реєстрація особистого кабінету."
      ),
      paragraph(
        "Користувач зобов'язується надавати достовірні дані під час реєстрації та нести відповідальність за збереження конфіденційності облікових даних (логін, пароль)."
      ),
      paragraph(
        `Про будь-яке підозріле використання облікового запису необхідно негайно повідомити на ${COMPANY_INFO.email}.`
      )
    ),
    section(
      "4. Обмеження відповідальності",
      paragraph(
        "Сайт та інформація на ньому надаються «як є». Ми докладаємо розумних зусиль для забезпечення точності та актуальності інформації, проте не гарантуємо повну відсутність помилок чи безперебійну роботу Сайту."
      ),
      paragraph(
        "Виконавець не несе відповідальності за тимчасову недоступність Сайту, спричинену технічними роботами, збоями провайдерів зв'язку/хостингу чи обставинами непереборної сили."
      ),
      paragraph(
        "Посилання на сторонні вебсайти надаються виключно для зручності користувачів; ми не несемо відповідальності за зміст та політику конфіденційності сторонніх ресурсів."
      )
    ),
    section(
      "5. Персональні дані та cookie",
      paragraph(
        "Обробка персональних даних користувачів Сайту здійснюється відповідно до ",
        { label: "Політики конфіденційності", href: LEGAL_PAGES.privacyPolicy.href },
        " та ",
        { label: "Політики використання файлів cookie", href: LEGAL_PAGES.cookiePolicy.href },
        "."
      )
    ),
    section(
      "6. Застосовне право та вирішення спорів",
      paragraph("Ці Умови регулюються законодавством України."),
      paragraph(
        "Усі спори, що виникають у зв'язку з використанням Сайту, вирішуються шляхом переговорів, а в разі недосягнення згоди — у судовому порядку відповідно до законодавства України."
      )
    ),
    section(
      "7. Зміни до Умов",
      paragraph(
        "Ми можемо вносити зміни до цих Умов в односторонньому порядку. Актуальна редакція завжди розміщена на цій сторінці. Продовження користування Сайтом після внесення змін означає згоду користувача з оновленими Умовами."
      )
    ),
    section(
      "8. Контакти",
      contacts([
        { label: "Виконавець", value: COMPANY_INFO.legalName },
        { label: "Email", value: COMPANY_INFO.email },
        { label: "Телефон", value: COMPANY_INFO.phone },
        { label: "Адреса", value: COMPANY_INFO.address },
      ])
    ),
  ],
  translations: {
    en: {
      title: "Website Terms of Use",
      metaTitle: "Website Terms of Use",
      metaDescription:
        "Rules for accessing and using calls4u.ai: intellectual property, registration, limitations of liability and governing law.",
      updatedNote: UPDATED_NOTE_EN,
      sections: [
        section(
          "1. General provisions",
          paragraph(
            'These Terms of Use govern access to and use of the calls4u.ai website (the "Website").'
          ),
          paragraph(
            `The Website is owned by ${COMPANY_INFO.legalName}, Tax ID ${COMPANY_INFO.taxId}, address: 24 Yaroslava Hasheka Blvd, Kyiv, 02000, Ukraine (the "Service Provider", "we").`
          ),
          paragraph(
            "These Terms apply to use of the Website as an information resource. The conditions for using the Service itself are set out in separate documents: the ",
            { label: "Terms of Service", href: LEGAL_PAGES.serviceTerms.href },
            " and the ",
            { label: "Public Offer", href: LEGAL_PAGES.offer.href },
            "."
          ),
          paragraph(
            "By starting to use the Website, you confirm that you have full legal capacity and agree to these Terms."
          )
        ),
        section(
          "2. Use of the Website",
          paragraph(
            "The Website and all its elements (text, graphics, logos, source code, design) are protected by the Service Provider's intellectual property rights or are used by the Service Provider on a lawful basis."
          ),
          paragraph(
            "The following are prohibited: copying, reproducing or distributing Website materials without the Service Provider's written consent; using the Website for unlawful purposes, spreading malware or attempting unauthorized access; automated data collection (scraping) without permission."
          ),
          paragraph(
            "We reserve the right to restrict or terminate a user's access to the Website if these Terms are violated."
          )
        ),
        section(
          "3. Registration and account",
          paragraph("An account is required to access certain Website and Service features."),
          paragraph(
            "Users must provide accurate information when registering and are responsible for keeping their credentials (login, password) confidential."
          ),
          paragraph(
            `Any suspected unauthorized use of an account must be reported immediately to ${COMPANY_INFO.email}.`
          )
        ),
        section(
          "4. Limitations of liability",
          paragraph(
            'The Website and the information on it are provided "as is". We make reasonable efforts to ensure the accuracy and currency of information, but we do not guarantee the complete absence of errors or uninterrupted operation of the Website.'
          ),
          paragraph(
            "The Service Provider is not liable for temporary unavailability of the Website caused by maintenance, failures of communication or hosting providers, or force majeure."
          ),
          paragraph(
            "Links to third-party websites are provided for convenience only; we are not responsible for the content or privacy policies of third-party resources."
          )
        ),
        section(
          "5. Personal data and cookies",
          paragraph(
            "The processing of personal data of Website users is governed by the ",
            { label: "Privacy Policy", href: LEGAL_PAGES.privacyPolicy.href },
            " and the ",
            { label: "Cookie Policy", href: LEGAL_PAGES.cookiePolicy.href },
            "."
          )
        ),
        section(
          "6. Governing law and dispute resolution",
          paragraph("These Terms are governed by the law of Ukraine."),
          paragraph(
            "All disputes arising from use of the Website are resolved through negotiation and, if no agreement is reached, through the courts in accordance with the law of Ukraine."
          )
        ),
        section(
          "7. Changes to the Terms",
          paragraph(
            "We may amend these Terms unilaterally. The current version is always available on this page. Continuing to use the Website after an amendment constitutes your agreement to the updated Terms."
          )
        ),
        section(
          "8. Contacts",
          contacts([
            {
              label: "Service Provider",
              value: "Individual entrepreneur (FOP) Bohdan Volodymyrovych Ovsiienko",
            },
            { label: "Email", value: COMPANY_INFO.email },
            { label: "Phone", value: COMPANY_INFO.phone },
            { label: "Address", value: "24 Yaroslava Hasheka Blvd, Kyiv, 02000, Ukraine" },
          ])
        ),
      ],
    },
  },
};

import { COMPANY_INFO, LEGAL_PAGES } from "@/lib/constants";

import { paragraph, section, UPDATED_NOTE, UPDATED_NOTE_EN } from "../builders";
import type { LegalDocument } from "../types";

export const cookiePolicy: LegalDocument = {
  slug: LEGAL_PAGES.cookiePolicy.href,
  title: "Політика використання файлів cookie",
  metaTitle: "Політика використання файлів cookie",
  metaDescription:
    "Як вебсайт calls4u.ai використовує файли cookie та подібні технології, які категорії cookie ми застосовуємо та як керувати згодою.",
  updatedNote: UPDATED_NOTE,
  intro: [
    "Ця Політика пояснює, як вебсайт calls4u.ai (далі — «Сайт», «ми»), що належить ",
    { label: COMPANY_INFO.shortName, href: LEGAL_PAGES.contacts.href },
    ` (РНОКПП ${COMPANY_INFO.taxId}), використовує файли cookie та подібні технології під час вашого користування Сайтом.`,
  ],
  sections: [
    section(
      "1. Що таке файли cookie",
      paragraph(
        "Файли cookie — це невеликі текстові файли, які зберігаються на вашому пристрої (комп'ютері, смартфоні, планшеті) під час відвідування вебсайту. Вони дозволяють Сайту «запам'ятовувати» ваші дії та налаштування протягом певного часу, а також збирати статистичну інформацію про використання Сайту."
      )
    ),
    section(
      "2. Які файли cookie ми використовуємо",
      paragraph(
        "Технічно необхідні (строго обов'язкові) cookie забезпечують базову роботу Сайту: авторизацію в особистому кабінеті, збереження сесії, безпеку форм, оформлення підписки. Без них Сайт може працювати некоректно. Ці cookie не потребують окремої згоди, оскільки є необхідними для надання послуги, яку ви самі запитали."
      ),
      paragraph(
        "Аналітичні (статистичні) cookie використовуються для аналізу відвідуваності Сайту, поведінки користувачів та ефективності сторінок (наприклад, Google Analytics). Дані збираються знеособлено або псевдонімізовано."
      ),
      paragraph(
        "Функціональні cookie запам'ятовують ваші налаштування (мова, регіон, попередньо заповнені поля форм) для зручності повторного використання Сайту."
      ),
      paragraph(
        "Маркетингові / рекламні cookie використовуються для показу релевантної реклами та вимірювання ефективності рекламних кампаній (наприклад, Meta Pixel, Google Ads). Встановлюються лише за вашою згодою."
      )
    ),
    section(
      "3. Правова підстава та згода",
      paragraph(
        "Технічно необхідні cookie встановлюються автоматично. Усі інші категорії (аналітичні, функціональні, маркетингові) встановлюються лише після отримання вашої згоди через банер cookie при першому відвідуванні Сайту. Ви можете змінити або відкликати свою згоду в будь-який момент через налаштування cookie на Сайті або через налаштування вашого браузера."
      )
    ),
    section(
      "4. Файли cookie третіх сторін",
      paragraph(
        "Деякі cookie на Сайті встановлюються не нами напряму, а сервісами, якими ми користуємось для аналітики, реклами чи функціональності Сайту (наприклад, Google, Meta). Ми не контролюємо ці cookie напряму — умови їх використання визначаються відповідними постачальниками послуг."
      )
    ),
    section(
      "5. Як відключити файли cookie",
      paragraph(
        "Ви можете видалити або заблокувати файли cookie через налаштування свого браузера. Зверніть увагу: відключення технічно необхідних cookie може порушити роботу окремих функцій Сайту, зокрема особистого кабінету."
      )
    ),
    section(
      "6. Строк зберігання",
      paragraph(
        "Сесійні cookie видаляються автоматично після закриття браузера. Постійні cookie зберігаються на вашому пристрої протягом строку, визначеного для кожного типу cookie (як правило, від 30 днів до 2 років), або до моменту їх самостійного видалення вами."
      )
    ),
    section(
      "7. Контакти",
      paragraph(
        `З питань щодо цієї Політики звертайтесь: ${COMPANY_INFO.email}, ${COMPANY_INFO.phone}.`
      ),
      paragraph(
        "Ця Політика є частиною ",
        { label: "Політики конфіденційності", href: LEGAL_PAGES.privacyPolicy.href },
        " і застосовується разом із нею."
      )
    ),
  ],
  translations: {
    en: {
      title: "Cookie Policy",
      metaTitle: "Cookie Policy",
      metaDescription:
        "How the calls4u.ai website uses cookies and similar technologies, which cookie categories we use and how to manage your consent.",
      updatedNote: UPDATED_NOTE_EN,
      intro: [
        'This Policy explains how the calls4u.ai website (the "Website", "we"), owned by ',
        { label: "FOP Ovsiienko Bohdan Volodymyrovych", href: LEGAL_PAGES.contacts.href },
        ` (Tax ID ${COMPANY_INFO.taxId}), uses cookies and similar technologies when you use the Website.`,
      ],
      sections: [
        section(
          "1. What are cookies",
          paragraph(
            "Cookies are small text files stored on your device (computer, smartphone or tablet) when you visit a website. They allow the Website to remember your actions and settings for a period of time, and to collect statistical information about how the Website is used."
          )
        ),
        section(
          "2. The cookies we use",
          paragraph(
            "Strictly necessary cookies are required for the Website to function: signing in to your account, maintaining your session, securing forms and processing subscription payments. Without them the Website may not work correctly. These cookies do not require separate consent because they are necessary to deliver the service you requested."
          ),
          paragraph(
            "Analytics (statistical) cookies are used to analyse website traffic, user behaviour and page performance (for example, Google Analytics). Data are collected anonymously or in pseudonymised form."
          ),
          paragraph(
            "Functional cookies remember your preferences (language, region, pre-filled form fields) for a more convenient return visit."
          ),
          paragraph(
            "Marketing / advertising cookies are used to show relevant ads and measure the effectiveness of advertising campaigns (for example, Meta Pixel, Google Ads). They are set only with your consent."
          )
        ),
        section(
          "3. Legal basis and consent",
          paragraph(
            "Strictly necessary cookies are set automatically. All other categories (analytics, functional, marketing) are set only after you give your consent through the cookie banner on your first visit. You can change or withdraw your consent at any time through the cookie settings on the Website or through your browser settings."
          )
        ),
        section(
          "4. Third-party cookies",
          paragraph(
            "Some cookies on the Website are set not by us directly but by services we use for analytics, advertising or Website functionality (for example, Google, Meta). We do not control these cookies directly; their terms of use are determined by the respective service providers."
          )
        ),
        section(
          "5. How to disable cookies",
          paragraph(
            "You can delete or block cookies through your browser settings. Please note that disabling strictly necessary cookies may affect certain Website functions, including your account."
          )
        ),
        section(
          "6. Retention period",
          paragraph(
            "Session cookies are deleted automatically when you close your browser. Persistent cookies are stored on your device for the period specified for each cookie type (typically from 30 days to 2 years), or until you delete them yourself."
          )
        ),
        section(
          "7. Contacts",
          paragraph(
            `For questions about this Policy, contact us: ${COMPANY_INFO.email}, ${COMPANY_INFO.phone}.`
          ),
          paragraph(
            "This Policy is part of the ",
            { label: "Privacy Policy", href: LEGAL_PAGES.privacyPolicy.href },
            " and applies together with it."
          )
        ),
      ],
    },
  },
};

import { COMPANY_INFO, LEGAL_PAGES } from "@/lib/constants";

import { contacts, paragraph, section, UPDATED_NOTE, UPDATED_NOTE_EN } from "../builders";
import type { LegalDocument } from "../types";

export const serviceTerms: LegalDocument = {
  slug: LEGAL_PAGES.serviceTerms.href,
  title: "Умови надання послуг",
  metaTitle: "Умови надання послуг",
  metaDescription:
    "Опис послуги calls4u.ai, порядок оформлення підписки, способи оплати, автоматичне продовження та скасування, строки й географія надання Сервісу.",
  updatedNote: UPDATED_NOTE,
  sections: [
    section(
      "1. Опис послуги",
      paragraph(
        "calls4u.ai — це SaaS-платформа, що надає клієнтам доступ до AI-голосового агента для автоматизації вихідних та вхідних телефонних дзвінків. Послуга надається дистанційно, у вигляді доступу до особистого кабінету та підключення голосового агента до телефонного номера клієнта (фізичного або віртуального)."
      ),
      paragraph("Послуга є цифровою (нематеріальною) і не передбачає фізичної доставки товару.")
    ),
    section(
      "2. Порядок оформлення замовлення (підписки)",
      paragraph(
        "Для початку користування Сервісом користувач реєструє обліковий запис на Сайті calls4u.ai."
      ),
      paragraph(
        "Кожному новому користувачу надається безкоштовний пробний період тривалістю 3 (три) дні з моменту реєстрації, протягом якого доступні базові функції Сервісу."
      ),
      paragraph(
        "Для продовження користування Сервісом після завершення пробного періоду користувач оформлює платну підписку, обираючи тарифний план та розрахунковий період (помісячна або річна оплата). Оформлення підписки та оплата здійснюються онлайн через особистий кабінет."
      )
    ),
    section(
      "3. Способи оплати",
      paragraph(
        "Оплата Сервісу здійснюється виключно безготівковим способом — банківською платіжною картою (Visa/Mastercard) через платіжну систему WayForPay. Готівкова оплата, оплата за реквізитами поза системою WayForPay та накладений платіж не передбачені."
      )
    ),
    section(
      "4. Періодичність оплати та автоматичне продовження",
      paragraph(
        "Підписка оформлюється на помісячній або річній основі — за вибором клієнта на етапі оформлення."
      ),
      paragraph(
        "Підписка автоматично продовжується на наступний розрахунковий період із автоматичним списанням коштів з раніше використаного платіжного засобу, якщо клієнт не скасував автопродовження в особистому кабінеті до дати списання."
      ),
      paragraph(
        "Нагадування про списання: Виконавець зобов'язується надіслати електронного листа (на email, вказаний при реєстрації) з нагадуванням про майбутнє автоматичне списання коштів не пізніше ніж за 3 (три) дні до дати такого списання."
      ),
      paragraph(
        "Клієнт може відключити автоматичне продовження підписки в будь-який момент у налаштуваннях особистого кабінету (розділ «Тарифи і Оплата») — доступ до Сервісу при цьому зберігається до кінця вже оплаченого періоду."
      )
    ),
    section(
      "5. Терміни надання послуги",
      paragraph(
        "Доступ до Сервісу активується автоматично та миттєво після успішного підтвердження оплати платіжною системою WayForPay, за винятком випадків, що потребують додаткового технічного налаштування (наприклад, підключення телефонного номера), яке здійснюється протягом розумного строку, як правило — до 1 (одного) робочого дня."
      )
    ),
    section(
      "6. Територія (географія) надання послуги",
      paragraph(
        "Станом на дату публікації цього документа Сервіс доступний для клієнтів, зареєстрованих в Україні. Найближчим часом Сервіс планується розширити на країни Європейського Союзу; актуальна географія доступності вказується на Сайті на момент реєстрації клієнта. Оскільки послуга є цифровою й надається дистанційно через Інтернет, фізична доставка товарів чи використання кур'єрських/поштових служб не застосовується."
      )
    ),
    section(
      "7. Умови повернення коштів",
      paragraph(
        "Порядок і умови повернення коштів визначені окремим документом — ",
        { label: "Умовами повернення коштів", href: LEGAL_PAGES.refundPolicy.href },
        "."
      )
    ),
    section(
      "8. Контакти",
      contacts([
        { label: "Виконавець", value: COMPANY_INFO.legalName },
        { label: "Email", value: COMPANY_INFO.email },
        { label: "Телефон", value: COMPANY_INFO.phone },
        { label: "Адреса", value: COMPANY_INFO.address },
      ]),
      paragraph(
        "Повний перелік прав та обов'язків сторін визначений ",
        { label: "Публічною офертою", href: LEGAL_PAGES.offer.href },
        "."
      )
    ),
  ],
  translations: {
    en: {
      title: "Terms of Service",
      metaTitle: "Terms of Service",
      metaDescription:
        "Description of the calls4u.ai service, subscription process, payment methods, auto-renewal and cancellation, service availability.",
      updatedNote: UPDATED_NOTE_EN,
      sections: [
        section(
          "1. Description of the Service",
          paragraph(
            "calls4u.ai is a SaaS platform that gives clients access to an AI voice agent for automating outbound and inbound phone calls. The Service is provided remotely, as access to an account and connection of the voice agent to the client's phone number (physical or virtual)."
          ),
          paragraph(
            "The Service is digital (intangible) and does not involve the physical delivery of goods."
          )
        ),
        section(
          "2. Ordering a subscription",
          paragraph(
            "To start using the Service, the user registers an account on the calls4u.ai website."
          ),
          paragraph(
            "Every new user receives a free 3-day trial period from the moment of registration, during which the basic features of the Service are available."
          ),
          paragraph(
            "To continue using the Service after the trial, the user purchases a paid subscription by choosing a plan and a billing period (monthly or annual). The subscription is set up and paid for online through the account."
          )
        ),
        section(
          "3. Payment methods",
          paragraph(
            "Payment for the Service is made exclusively by bank card (Visa/Mastercard) through the WayForPay payment system. Cash payments, bank transfers outside WayForPay and cash on delivery are not available."
          )
        ),
        section(
          "4. Billing cycle and auto-renewal",
          paragraph("Subscriptions are monthly or annual, at the client's choice when purchasing."),
          paragraph(
            "The subscription renews automatically for the next billing period with an automatic charge to the previously used payment method, unless the client has disabled auto-renewal in the account before the charge date."
          ),
          paragraph(
            "Renewal notice: the Service Provider will send an email (to the address provided at registration) reminding the client of the upcoming automatic charge no later than 3 (three) days before the charge date."
          ),
          paragraph(
            "The client can disable auto-renewal at any time in the account settings (Pricing and Billing section); access to the Service continues until the end of the already-paid period."
          )
        ),
        section(
          "5. Service delivery timeline",
          paragraph(
            "Access to the Service is activated automatically and immediately after WayForPay confirms the payment, except where additional technical setup is needed (for example, connecting a phone number), which is completed within a reasonable time, typically within 1 (one) business day."
          )
        ),
        section(
          "6. Service availability",
          paragraph(
            "As of the date this document was published, the Service is available to clients registered in Ukraine. The Service is planned to expand to European Union countries soon; the current availability is shown on the Website at the time of the client's registration. As the service is digital and provided remotely over the internet, physical delivery of goods or the use of courier or postal services is not applicable."
          )
        ),
        section(
          "7. Refunds",
          paragraph(
            "The procedure and conditions for refunds are set out in a separate document — the ",
            { label: "Refund Policy", href: LEGAL_PAGES.refundPolicy.href },
            "."
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
          ]),
          paragraph(
            "The full list of the parties' rights and obligations is set out in the ",
            { label: "Public Offer", href: LEGAL_PAGES.offer.href },
            "."
          )
        ),
      ],
    },
  },
};

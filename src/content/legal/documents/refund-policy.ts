import { COMPANY_INFO, LEGAL_PAGES } from "@/lib/constants";

import { contacts, list, paragraph, section, UPDATED_NOTE, UPDATED_NOTE_EN } from "../builders";
import type { LegalDocument } from "../types";

export const refundPolicy: LegalDocument = {
  slug: LEGAL_PAGES.refundPolicy.href,
  title: "Умови повернення коштів",
  metaTitle: "Умови повернення коштів",
  metaDescription:
    "Правила повернення коштів за підписку calls4u.ai: загальне правило, винятки, помилкові платежі та порядок звернення.",
  updatedNote: UPDATED_NOTE,
  sections: [
    section(
      "1. Загальне правило: повернення коштів не передбачено",
      paragraph(
        "calls4u.ai — це підписка (SaaS) на доступ до AI-голосового агента. Оплата здійснюється за доступ до Сервісу на обраний розрахунковий період (місяць/рік)."
      ),
      paragraph(
        "Кошти, сплачені за підписку на Сервіс, поверненню не підлягають, у тому числі в разі часткового використання оплаченого періоду, невикористання Сервісу протягом оплаченого періоду з причин, що не залежать від Виконавця, або дострокової відмови клієнта від подальшого користування Сервісом."
      ),
      paragraph(
        "Це пов'язано з тим, що перед оформленням платної підписки кожному новому користувачу надається безкоштовний пробний період тривалістю 3 (три) дні, протягом якого можна оцінити функціональність Сервісу до здійснення оплати. Оформлюючи платну підписку, користувач підтверджує свій усвідомлений вибір продовжити користування Сервісом на платній основі."
      )
    ),
    section(
      "2. Винятки, коли повернення можливе",
      paragraph(
        "Кошти повертаються в повному обсязі на реквізити, з яких було здійснено оплату, протягом до 14 (чотирнадцяти) робочих днів з моменту підтвердження відповідного випадку, якщо:"
      ),
      list([
        [
          "Виконавець з власної вини не надав доступ до Сервісу протягом розумного строку після оплати (наприклад, технічна помилка на стороні Виконавця, що унеможливила підключення);",
        ],
        [
          `у роботі Сервісу виявлено істотний дефект, що унеможливлює використання AI-агента відповідно до заявленого функціоналу, і Виконавець не усунув цей дефект протягом 5 (п'яти) робочих днів з моменту звернення клієнта на ${COMPANY_INFO.email}.`,
        ],
      ])
    ),
    section(
      "3. Помилкові та задвоєні платежі",
      paragraph(
        "У разі помилкового або задвоєного списання коштів (технічний збій платіжної системи) кошти повертаються в повному обсязі протягом до 14 (чотирнадцяти) робочих днів з моменту звернення та підтвердження факту помилкового платежу."
      )
    ),
    section(
      "4. Скасування транзакції та шахрайство",
      paragraph(
        "У разі виявлення ознак шахрайського використання платіжного інструменту Виконавець має право ініціювати скасування транзакції відповідно до правил платіжної системи WayForPay."
      )
    ),
    section(
      "5. Для користувачів з Європейського Союзу",
      paragraph(
        "Оформлюючи платну підписку, користувач-споживач з ЄС надає прямо виражену згоду на негайне надання цифрової послуги до закінчення 14-денного строку для відмови від договору та підтверджує, що внаслідок цього втрачає право на відмову від договору відповідно до застосовного законодавства (за аналогією зі ст. 16(m) Директиви (ЄС) 2011/83). Це положення не обмежує обов'язкових прав споживача, які не можуть бути виключені договором."
      )
    ),
    section(
      "6. Порядок звернення",
      paragraph(
        `Звернення щодо оплати (пункти 2–4 цієї Політики) приймаються на ${COMPANY_INFO.email} із зазначенням дати платежу, суми та обставин ситуації. Звернення розглядається протягом 5 (п'яти) робочих днів.`
      )
    ),
    section(
      "7. Контакти",
      contacts([
        { label: "Виконавець", value: COMPANY_INFO.legalName },
        { label: "Email", value: COMPANY_INFO.email },
        { label: "Телефон", value: COMPANY_INFO.phone },
      ])
    ),
  ],
  translations: {
    en: {
      title: "Refund Policy",
      metaTitle: "Refund Policy",
      metaDescription:
        "Refund rules for calls4u.ai subscriptions: general rule, exceptions, erroneous payments and how to contact us.",
      updatedNote: UPDATED_NOTE_EN,
      sections: [
        section(
          "1. General rule: no refunds",
          paragraph(
            "calls4u.ai is a subscription (SaaS) for access to an AI voice agent. Payment is made for access to the Service for the chosen billing period (monthly or annual)."
          ),
          paragraph(
            "Fees paid for a subscription are non-refundable, including where the paid period was only partially used, where the Service was not used during the paid period for reasons outside the Service Provider's control, or where the Client decides to stop using the Service early."
          ),
          paragraph(
            "This policy exists because every new user receives a free 3-day trial period before purchasing a paid subscription, during which they can evaluate the Service before paying. By purchasing a paid subscription, the user confirms their informed decision to continue using the Service on a paid basis."
          )
        ),
        section(
          "2. Exceptions where a refund is available",
          paragraph(
            "A full refund to the original payment method will be made within up to 14 (fourteen) business days of confirming the relevant case, if:"
          ),
          list([
            [
              "The Service Provider failed through its own fault to provide access to the Service within a reasonable time after payment (for example, a technical error on the Service Provider's side that prevented the connection);",
            ],
            [
              `A material defect is found in the Service that prevents use of the AI agent in accordance with its stated features, and the Service Provider does not fix that defect within 5 (five) business days of the Client contacting ${COMPANY_INFO.email}.`,
            ],
          ])
        ),
        section(
          "3. Erroneous and duplicate payments",
          paragraph(
            "If funds are charged erroneously or in duplicate (a technical failure of the payment system), a full refund will be made within up to 14 (fourteen) business days of the request and confirmation of the erroneous payment."
          )
        ),
        section(
          "4. Transaction reversal and fraud",
          paragraph(
            "If signs of fraudulent use of a payment instrument are detected, the Service Provider has the right to initiate a transaction reversal in accordance with the WayForPay payment system rules."
          )
        ),
        section(
          "5. For users in the European Union",
          paragraph(
            "When purchasing a paid subscription, an EU consumer expressly consents to the immediate provision of the digital service before the 14-day withdrawal period expires and confirms that they therefore lose the right of withdrawal under applicable law (by analogy with Article 16(m) of Directive 2011/83/EU). This provision does not limit mandatory consumer rights that cannot be excluded by contract."
          )
        ),
        section(
          "6. How to contact us",
          paragraph(
            `Requests regarding payments (Sections 2–4 of this Policy) should be sent to ${COMPANY_INFO.email} with the payment date, amount and circumstances. Requests are reviewed within 5 (five) business days.`
          )
        ),
        section(
          "7. Contacts",
          contacts([
            {
              label: "Service Provider",
              value: "Individual entrepreneur (FOP) Bohdan Volodymyrovych Ovsiienko",
            },
            { label: "Email", value: COMPANY_INFO.email },
            { label: "Phone", value: COMPANY_INFO.phone },
          ])
        ),
      ],
    },
  },
};

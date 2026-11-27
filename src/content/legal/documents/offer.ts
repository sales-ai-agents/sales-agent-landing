import { COMPANY_INFO, LEGAL_PAGES } from "@/lib/constants";

import { contacts, paragraph, section, UPDATED_NOTE, UPDATED_NOTE_EN } from "../builders";
import type { LegalDocument } from "../types";

export const offer: LegalDocument = {
  slug: LEGAL_PAGES.offer.href,
  title: "Договір публічної оферти",
  metaTitle: "Публічна оферта",
  metaDescription:
    "Публічна оферта на надання доступу до сервісу calls4u.ai: предмет договору, порядок акцепту, права та обов'язки сторін, оплата й розірвання.",
  updatedNote: UPDATED_NOTE,
  intro: [
    `Цей документ є офіційною публічною пропозицією (офертою) ${COMPANY_INFO.legalName} (РНОКПП ${COMPANY_INFO.taxId}), адреса: ${COMPANY_INFO.address} (далі — «Виконавець»), укласти договір про надання послуг доступу до сервісу calls4u.ai (далі — «Сервіс») на умовах, викладених нижче, з будь-якою фізичною чи юридичною особою, фізичною особою-підприємцем (далі — «Замовник»), яка здійснить акцепт цієї оферти. Договір укладається відповідно до статей 633, 641, 642 Цивільного кодексу України.`,
  ],
  sections: [
    section(
      "1. Терміни та визначення",
      paragraph(
        "Оферта — цей документ, розміщений на Сайті calls4u.ai, що містить усі істотні умови договору."
      ),
      paragraph(
        "Акцепт — повне й безумовне прийняття Замовником умов цієї Оферти шляхом реєстрації облікового запису на Сайті та/або оплати підписки на Сервіс."
      ),
      paragraph(
        "Сервіс — програмне забезпечення (SaaS) calls4u.ai, що надає доступ до AI-голосового агента для автоматизації телефонних дзвінків. Особистий кабінет — персональний розділ Замовника на Сайті для керування Сервісом. Підписка — платний доступ до функціоналу Сервісу на визначений розрахунковий період."
      )
    ),
    section(
      "2. Предмет договору",
      paragraph(
        "Виконавець зобов'язується надати Замовнику доступ до Сервісу на умовах цієї Оферти, ",
        { label: "Умов надання послуг", href: LEGAL_PAGES.serviceTerms.href },
        " та ",
        { label: "Політики конфіденційності", href: LEGAL_PAGES.privacyPolicy.href },
        ", що є невід'ємними частинами договору, а Замовник зобов'язується прийняти та оплатити ці послуги на умовах обраного тарифного плану."
      ),
      paragraph(
        "Детальний опис функціоналу, тарифні плани та їх вартість розміщуються на Сайті та можуть змінюватись Виконавцем в односторонньому порядку; зміна вартості не поширюється на вже оплачений розрахунковий період."
      )
    ),
    section(
      "3. Порядок укладення договору (акцепт оферти)",
      paragraph(
        "Договір вважається укладеним з моменту, коли Замовник виконає одну з дій: (а) зареєструє обліковий запис на Сайті та розпочне користування пробним періодом; або (б) здійснить оплату Підписки."
      ),
      paragraph(
        "Акцептуючи Оферту, Замовник підтверджує, що ознайомився та погоджується з умовами договору, ",
        { label: "Умов надання послуг", href: LEGAL_PAGES.serviceTerms.href },
        ", ",
        { label: "Умов повернення коштів", href: LEGAL_PAGES.refundPolicy.href },
        " та ",
        { label: "Політики конфіденційності", href: LEGAL_PAGES.privacyPolicy.href },
        " у повному обсязі."
      )
    ),
    section(
      "4. Права та обов'язки Виконавця",
      paragraph(
        "Виконавець зобов'язується надати доступ до Сервісу відповідно до обраного тарифу, забезпечувати технічну підтримку в розумні строки та вживати заходів для захисту персональних даних Замовника."
      ),
      paragraph(
        "Виконавець має право змінювати функціонал, тарифи та технічні характеристики з попереднім повідомленням; тимчасово призупиняти доступ для проведення технічних робіт; відмовити в наданні Сервісу або призупинити доступ у разі порушення Замовником умов договору, законодавства або використання Сервісу для протиправної діяльності."
      )
    ),
    section(
      "5. Права та обов'язки Замовника",
      paragraph(
        "Замовник зобов'язується надавати достовірні дані, своєчасно оплачувати Підписку, використовувати Сервіс відповідно до призначення та законодавства, самостійно забезпечувати наявність згоди кінцевих абонентів на здійснення й запис телефонних розмов там, де це вимагається, та не використовувати Сервіс для незаконних чи таких, що вводять в оману, дзвінків."
      ),
      paragraph(
        "Замовник має право користуватися Сервісом відповідно до обраного тарифу, отримувати технічну підтримку та звертатися з питаннями щодо роботи Сервісу й обробки персональних даних."
      )
    ),
    section(
      "6. Вартість послуг та порядок розрахунків",
      paragraph(
        "Вартість Підписки визначається згідно з тарифами на Сайті на момент оформлення замовлення."
      ),
      paragraph(
        "Оплата здійснюється в безготівковій формі банківською платіжною карткою через WayForPay відповідно до ",
        { label: "Умов надання послуг", href: LEGAL_PAGES.serviceTerms.href },
        "."
      ),
      paragraph(
        "Підписка може автоматично продовжуватись на наступний розрахунковий період відповідно до умов, обраних Замовником в особистому кабінеті. Виконавець направляє попереднє електронне повідомлення про автоматичне продовження за 3 (три) дні до дати запланованого списання коштів."
      )
    ),
    section(
      "7. Відповідальність сторін",
      paragraph(
        "Сторони несуть відповідальність за невиконання зобов'язань відповідно до чинного законодавства України. Виконавець не несе відповідальності за тимчасову недоступність Сервісу, спричинену діями третіх осіб чи форс-мажором, за зміст телефонних розмов Замовника та дотримання ним законодавства про захист персональних даних кінцевих абонентів."
      ),
      paragraph(
        "Замовник несе повну відповідальність за законність використання Сервісу, зокрема за зміст скриптів дзвінків та дотримання прав кінцевих абонентів."
      )
    ),
    section(
      "8. Обставини непереборної сили (форс-мажор)",
      paragraph(
        "Сторони звільняються від відповідальності за невиконання зобов'язань, якщо це стало наслідком обставин непереборної сили (воєнні дії, надзвичайний або воєнний стан, дії органів влади, масштабні збої мереж зв'язку чи Інтернету, стихійні лиха). Факт настання форс-мажору підтверджується в порядку, встановленому законодавством України."
      )
    ),
    section(
      "9. Строк дії та розірвання договору",
      paragraph(
        "Договір діє з моменту акцепту Оферти протягом усього строку користування Сервісом."
      ),
      paragraph(
        "Замовник має право в будь-який момент припинити користування Сервісом, відключивши автопродовження підписки в особистому кабінеті; договір при цьому вважається припиненим після завершення вже оплаченого розрахункового періоду."
      ),
      paragraph(
        "Виконавець має право в односторонньому порядку розірвати договір у разі істотного порушення Замовником його умов, повідомивши про це на електронну пошту Замовника."
      )
    ),
    section(
      "10. Персональні дані",
      paragraph(
        "Обробка персональних даних Замовника здійснюється відповідно до ",
        { label: "Політики конфіденційності", href: LEGAL_PAGES.privacyPolicy.href },
        ", яка є невід'ємною частиною договору."
      )
    ),
    section(
      "11. Вирішення спорів",
      paragraph(
        "Усі спори вирішуються шляхом переговорів. У разі недосягнення згоди спір передається на розгляд до суду відповідно до законодавства України за місцезнаходженням Виконавця."
      )
    ),
    section(
      "12. Прикінцеві положення",
      paragraph(
        "Цей договір регулюється законодавством України. Виконавець залишає за собою право в односторонньому порядку вносити зміни до Оферти шляхом публікації нової редакції на Сайті. Продовження користування Сервісом після внесення змін означає згоду Замовника з новою редакцією. Якщо будь-яке положення договору буде визнано недійсним, це не тягне недійсності інших положень."
      )
    ),
    section(
      "13. Реквізити Виконавця",
      contacts([
        { label: "Найменування", value: COMPANY_INFO.legalName },
        { label: "РНОКПП (ІПН)", value: COMPANY_INFO.taxId },
        { label: "Система оподаткування", value: COMPANY_INFO.taxSystem },
        { label: "Адреса", value: COMPANY_INFO.address },
        { label: "Телефон", value: COMPANY_INFO.phone },
        { label: "Email", value: COMPANY_INFO.email },
        { label: "Сайт", value: COMPANY_INFO.site },
      ])
    ),
  ],
  translations: {
    en: {
      title: "Public Offer Agreement",
      metaTitle: "Public Offer",
      metaDescription:
        "Public offer for access to the calls4u.ai service: subject matter, acceptance procedure, rights and obligations of the parties, payment and termination.",
      updatedNote: UPDATED_NOTE_EN,
      intro: [
        `This document is a public offer by ${COMPANY_INFO.legalName} (Tax ID ${COMPANY_INFO.taxId}), address: 24 Yaroslava Hasheka Blvd, Kyiv, 02000, Ukraine (the "Service Provider"), to enter into a service agreement for access to calls4u.ai (the "Service") with any individual, legal entity or sole proprietor (the "Client") who accepts this offer. The agreement is governed by Articles 633, 641 and 642 of the Civil Code of Ukraine.`,
      ],
      sections: [
        section(
          "1. Definitions",
          paragraph(
            "Offer — this document, published on the calls4u.ai website, containing all material terms of the agreement."
          ),
          paragraph(
            "Acceptance — the Client's full and unconditional acceptance of this Offer by registering an account on the Website and/or paying for a Subscription."
          ),
          paragraph(
            "Service — the calls4u.ai SaaS software that provides access to an AI voice agent for automating phone calls. Account — the Client's personal area on the Website for managing the Service. Subscription — paid access to the Service for a defined billing period."
          )
        ),
        section(
          "2. Subject matter",
          paragraph(
            "The Service Provider agrees to give the Client access to the Service under the terms of this Offer, the ",
            { label: "Terms of Service", href: LEGAL_PAGES.serviceTerms.href },
            " and the ",
            { label: "Privacy Policy", href: LEGAL_PAGES.privacyPolicy.href },
            ", which are integral parts of the agreement, and the Client agrees to accept and pay for these services under the chosen plan."
          ),
          paragraph(
            "The detailed description of the features, plans and their prices are published on the Website and may be changed unilaterally by the Service Provider; a price change does not apply to an already-paid billing period."
          )
        ),
        section(
          "3. Conclusion of the agreement (acceptance of the offer)",
          paragraph(
            "The agreement is considered concluded when the Client does either of the following: (a) registers an account on the Website and starts using the trial period; or (b) pays for a Subscription."
          ),
          paragraph(
            "By accepting the Offer, the Client confirms that they have read and agree in full to the terms of the agreement, the ",
            { label: "Terms of Service", href: LEGAL_PAGES.serviceTerms.href },
            ", the ",
            { label: "Refund Policy", href: LEGAL_PAGES.refundPolicy.href },
            " and the ",
            { label: "Privacy Policy", href: LEGAL_PAGES.privacyPolicy.href },
            "."
          )
        ),
        section(
          "4. Rights and obligations of the Service Provider",
          paragraph(
            "The Service Provider agrees to provide access to the Service in accordance with the chosen plan, deliver technical support within a reasonable time and take measures to protect the Client's personal data."
          ),
          paragraph(
            "The Service Provider has the right to change features, prices and technical specifications with prior notice; temporarily suspend access for maintenance; refuse or suspend access if the Client breaches the terms of the agreement, applicable law or uses the Service for unlawful purposes."
          )
        ),
        section(
          "5. Rights and obligations of the Client",
          paragraph(
            "The Client agrees to provide accurate information, pay for the Subscription on time, use the Service in accordance with its purpose and applicable law, independently ensure that call recipients have consented to calls and recordings where required, and not use the Service for unlawful or deceptive calls."
          ),
          paragraph(
            "The Client has the right to use the Service in accordance with the chosen plan, receive technical support and raise questions regarding the Service and the processing of personal data."
          )
        ),
        section(
          "6. Pricing and payment",
          paragraph(
            "The Subscription price is determined by the plans published on the Website at the time of placing the order."
          ),
          paragraph(
            "Payment is made by bank card (Visa/Mastercard) through WayForPay in accordance with the ",
            { label: "Terms of Service", href: LEGAL_PAGES.serviceTerms.href },
            "."
          ),
          paragraph(
            "The Subscription may renew automatically for the next billing period in accordance with the options chosen by the Client in the account. The Service Provider sends an advance email notice about the auto-renewal 3 (three) days before the scheduled charge date."
          )
        ),
        section(
          "7. Liability",
          paragraph(
            "The parties are liable for failure to fulfil their obligations in accordance with the applicable law of Ukraine. The Service Provider is not liable for temporary unavailability of the Service caused by third parties or force majeure, for the content of the Client's calls or for the Client's compliance with personal data protection law in relation to call recipients."
          ),
          paragraph(
            "The Client bears full responsibility for the lawfulness of using the Service, including the content of call scripts and respect for the rights of call recipients."
          )
        ),
        section(
          "8. Force majeure",
          paragraph(
            "The parties are released from liability for failure to fulfil their obligations if that failure was caused by force majeure (military action, state of emergency or martial law, government actions, large-scale failures of communications networks or the internet, natural disasters). The occurrence of force majeure is confirmed in the manner established by the law of Ukraine."
          )
        ),
        section(
          "9. Term and termination",
          paragraph(
            "The agreement is effective from the moment the Offer is accepted and continues for the entire duration of the Client's use of the Service."
          ),
          paragraph(
            "The Client may stop using the Service at any time by disabling auto-renewal in the account; the agreement is then considered terminated at the end of the already-paid billing period."
          ),
          paragraph(
            "The Service Provider may unilaterally terminate the agreement in the event of a material breach by the Client, by notifying the Client at their email address."
          )
        ),
        section(
          "10. Personal data",
          paragraph(
            "The processing of the Client's personal data is governed by the ",
            { label: "Privacy Policy", href: LEGAL_PAGES.privacyPolicy.href },
            ", which is an integral part of the agreement."
          )
        ),
        section(
          "11. Dispute resolution",
          paragraph(
            "All disputes are resolved through negotiation. If no agreement is reached, the dispute is submitted to a court of competent jurisdiction under the law of Ukraine at the Service Provider's location."
          )
        ),
        section(
          "12. Final provisions",
          paragraph(
            "This agreement is governed by the law of Ukraine. The Service Provider reserves the right to amend the Offer unilaterally by publishing a new version on the Website. Continuing to use the Service after an amendment constitutes the Client's agreement to the new version. If any provision of the agreement is found invalid, that does not affect the validity of the remaining provisions."
          )
        ),
        section(
          "13. Service Provider details",
          contacts([
            {
              label: "Name",
              value: "Individual entrepreneur (FOP) Bohdan Volodymyrovych Ovsiienko",
            },
            { label: "Tax ID (RNOKPP)", value: COMPANY_INFO.taxId },
            {
              label: "Tax system",
              value: "Simplified taxation system, Group 3, 5% (not a VAT payer)",
            },
            { label: "Address", value: "24 Yaroslava Hasheka Blvd, Kyiv, 02000, Ukraine" },
            { label: "Phone", value: COMPANY_INFO.phone },
            { label: "Email", value: COMPANY_INFO.email },
            { label: "Website", value: COMPANY_INFO.site },
          ])
        ),
      ],
    },
  },
};

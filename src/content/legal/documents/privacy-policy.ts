import { COMPANY_INFO, LEGAL_PAGES } from "@/lib/constants";

import { contacts, list, paragraph, section, table, updatedOn } from "../builders";
import type { LegalDocument } from "../types";

export const privacyPolicy: LegalDocument = {
  slug: LEGAL_PAGES.privacyPolicy.href,
  title: "Політика конфіденційності",
  metaTitle: "Політика конфіденційності",
  metaDescription:
    "Порядок збору, обробки, зберігання та захисту персональних даних користувачів calls4u.ai, перелік субпроцесорів і права суб'єкта даних.",
  updatedNote: updatedOn("16 листопада 2026 р."),
  sections: [
    section(
      "1. Загальні положення",
      paragraph(
        "Ця Політика конфіденційності визначає порядок збору, обробки, зберігання та захисту персональних даних користувачів вебсайту calls4u.ai та однойменного сервісу (далі — «Сервіс»)."
      ),
      contacts([
        { label: "Володілець (розпорядник) даних", value: COMPANY_INFO.legalName },
        { label: "РНОКПП (ІПН)", value: COMPANY_INFO.taxId },
        { label: "Адреса", value: COMPANY_INFO.address },
        { label: "Email", value: COMPANY_INFO.email },
        { label: "Телефон", value: COMPANY_INFO.phone },
      ]),
      paragraph(
        "Використовуючи Сайт та Сервіс, ви підтверджуєте, що ознайомились з цією Політикою та погоджуєтесь з умовами обробки ваших персональних даних. Якщо ви не згодні з умовами Політики, будь ласка, припиніть використання Сайту та Сервісу."
      ),
      paragraph(
        "Ця Політика розроблена відповідно до Закону України «Про захист персональних даних» № 2297-VI, а для користувачів з країн Європейського Союзу — з урахуванням вимог GDPR (Регламент (ЄС) 2016/679) у частині, що застосовується до нашої діяльності."
      )
    ),
    section(
      "2. Які персональні дані ми збираємо",
      paragraph("Дані, які ви надаєте самостійно:"),
      list([
        ["ім'я, прізвище;"],
        ["номер телефону;"],
        ["адреса електронної пошти;"],
        ["назва компанії, посада (для юридичних осіб / ФОП-клієнтів);"],
        ["дані для авторизації в особистому кабінеті;"],
        [
          "платіжні дані в обсязі, необхідному для оплати через WayForPay (calls4u.ai не зберігає повні реквізити банківських карток — їх обробка відбувається на стороні платіжного сервісу відповідно до стандарту PCI DSS).",
        ],
      ]),
      paragraph(
        "Дані, що виникають у процесі використання голосового AI-агента: аудіозаписи телефонних розмов, здійснених через Сервіс; текстові транскрипти цих розмов; метадані дзвінків (дата, час, тривалість, номер телефону, результат); голосові дані, що виникають у процесі синтезу та розпізнавання мовлення."
      ),
      paragraph(
        "Відповідальність за отримання згоди кінцевих співрозмовників на запис розмови покладається на клієнта Сервісу як на ініціатора дзвінків, відповідно до законодавства, що застосовується в юрисдикції клієнта."
      ),
      paragraph(
        "Технічні дані: IP-адреса, тип і версія браузера, дані про пристрій, файли cookie (див. окрему ",
        { label: "Політику cookie", href: LEGAL_PAGES.cookiePolicy.href },
        "), журнали дій у Сервісі."
      )
    ),
    section(
      "3. Мета обробки персональних даних",
      list([
        ["реєстрація та ідентифікація користувача, надання доступу до особистого кабінету;"],
        [
          "надання Сервісу (налаштування й функціонування AI-агента, здійснення й обробка дзвінків);",
        ],
        ["проведення розрахунків та оплати підписки через WayForPay;"],
        ["технічна підтримка та комунікація з користувачем;"],
        ["аналітика та покращення якості Сервісу;"],
        ["виконання вимог законодавства (податкового та бухгалтерського обліку);"],
        ["у разі окремої згоди — надсилання інформаційних та маркетингових повідомлень."],
      ])
    ),
    section(
      "4. Правові підстави обробки",
      paragraph(
        "Обробка здійснюється на підставі: згоди суб'єкта персональних даних; необхідності виконання договору (публічної оферти); виконання законних вимог (зокрема податкових органів); законних інтересів Володільця даних (безпека, запобігання шахрайству, покращення Сервісу)."
      )
    ),
    section(
      "5. Кому передаються дані (субпроцесори)",
      paragraph(
        "Для функціонування Сервісу ми залучаємо технічних партнерів, яким передається обсяг даних, необхідний виключно для виконання відповідної технічної функції:"
      ),
      list([
        ["постачальники моделей штучного інтелекту — зокрема OpenAI, Google (Gemini), Groq;"],
        ["постачальники розпізнавання мовлення (Speech-to-Text) — зокрема Deepgram;"],
        ["постачальники синтезу мовлення (Text-to-Speech) — зокрема ElevenLabs;"],
        [
          "постачальники телефонії та голосової інфраструктури (SIP/VoIP) — зокрема LiveKit, а також провайдери телефонного зв'язку (Twilio, Vonage, Zadarma) залежно від конфігурації;",
        ],
        ["платіжна система — WayForPay (ТОВ «Уейфорпей»);"],
        ["хостинг-провайдер та провайдер серверної інфраструктури;"],
        ["сервіси комунікації — Telegram (сповіщення й бот) та поштовий сервіс."],
      ]),
      paragraph(
        "Частина партнерів може обробляти дані на серверах за межами України, у тому числі в ЄС та США. У таких випадках ми вживаємо розумних заходів для забезпечення належного рівня захисту даних. Ми не продаємо персональні дані третім особам."
      )
    ),
    section(
      "6. Штучний інтелект і запис дзвінків",
      paragraph(
        "Голосовий агент Calls4U — це система штучного інтелекту, а не людина. На початку розмови агент називає себе віртуальним помічником, а на пряме запитання співрозмовника, чи він робот, відповідає чесно."
      ),
      paragraph(
        "Розмови, які ведуться через Сервіс, записуються й автоматично розшифровуються: аудіозапис перетворюється на текстовий транскрипт. Записи й транскрипти доступні клієнту Сервісу в журналі дзвінків і використовуються для надання Сервісу — показу результату розмови, аналітики та передачі даних в інтеграції, які підключив клієнт."
      ),
      paragraph(
        "Для розпізнавання мовлення та формування відповідей агента фрагменти розмов обробляють постачальники, перелічені в розділі 5. Строки зберігання записів і транскриптів наведено в розділі 7."
      )
    ),
    section(
      "7. Строк зберігання даних",
      paragraph(
        "Персональні дані зберігаються протягом строку, необхідного для досягнення мети обробки, зокрема протягом дії договору та після його завершення — у строки, передбачені законодавством України."
      ),
      table(
        ["Дані", "Строк зберігання"],
        [
          [
            "Записи розмов (аудіо)",
            "90 днів за замовчуванням; у налаштуваннях можна встановити від 0 до 365 днів",
          ],
          [
            "Розшифровки та картки результатів дзвінків",
            "Протягом дії акаунта + 30 днів після видалення",
          ],
          ["Контакти", "До видалення вами або до закриття акаунта"],
          ["Журнал викликів інструментів (MCP)", "90 днів"],
          [
            "Платіжні та бухгалтерські документи",
            "3 роки (вимоги податкового законодавства України)",
          ],
        ]
      )
    ),
    section(
      "8. Права суб'єкта персональних даних",
      list([
        ["отримати інформацію про те, які ваші дані обробляються;"],
        ["вимагати виправлення неточних даних;"],
        ["відкликати згоду на обробку даних (де обробка здійснюється на підставі згоди);"],
        [
          "вимагати видалення даних («право бути забутим») у випадках, передбачених законодавством;",
        ],
        ["заперечувати проти обробки даних для маркетингових цілей;"],
        [
          "для користувачів з ЄС — на додаткові права за GDPR, зокрема право на перенесення даних та подання скарги до наглядового органу.",
        ],
      ]),
      paragraph(
        `Реалізувати «право бути забутим» можна безпосередньо в особистому кабінеті (розділ «Налаштування» → «Видалення акаунту») або звернувшись на ${COMPANY_INFO.email}. Видалення є безповоротним: стираються акаунт, агенти, контакти, журнал дзвінків, записи розмов та транскрипти.`
      )
    ),
    section(
      "9. Захист даних",
      paragraph(
        "Ми вживаємо технічних та організаційних заходів для захисту персональних даних від несанкціонованого доступу, втрати, знищення чи розголошення, зокрема шифрування каналів передачі даних, обмеження доступу за принципом необхідної достатності та регулярне резервне копіювання. Аудіозаписи та транскрипти зберігаються у приватних сховищах; доступ до них надається лише через підписані URL-адреси в межах сесії конкретного користувача."
      )
    ),
    section(
      "10. Зміни до Політики",
      paragraph(
        "Ми можемо оновлювати цю Політику. Актуальна версія завжди доступна на цій сторінці Сайту. У разі суттєвих змін ми повідомимо користувачів через Сайт або електронну пошту."
      )
    ),
    section(
      "11. Контакти",
      contacts([
        { label: "Email", value: COMPANY_INFO.email },
        { label: "Телефон", value: COMPANY_INFO.phone },
        { label: "Адреса", value: COMPANY_INFO.address },
      ])
    ),
    section(
      "12. Інтеграція з ШІ-асистентами (Claude, ChatGPT та інші MCP-клієнти)",
      paragraph(
        "12.1. Ви можете підключити свій акаунт Calls4U до ШІ-асистента, що підтримує Model Context Protocol (MCP), зокрема до Claude (Anthropic PBC) та ChatGPT (OpenAI). Підключення ініціює сам користувач: входить у Calls4U і надає явну згоду на доступ."
      ),
      paragraph(
        "12.2. Через підключення ШІ-асистент за вашим запитом отримує дані вашого акаунта: налаштування агентів, журнал і картки результатів дзвінків, розшифровки, записи клієнтів, контакти, налаштування інтеграцій і сповіщень. За вашою командою він також може змінювати ці дані, а після вашого явного підтвердження — ініціювати дзвінки."
      ),
      paragraph(
        "12.3. Ми отримуємо від ШІ-асистента лише параметри конкретного запиту (наприклад, дату, ідентифікатор агента, текст нотатки). Ми не отримуємо й не зберігаємо вашу переписку з асистентом, його пам'ять чи інші ваші файли."
      ),
      paragraph(
        "12.4. Дані, які асистент отримав від Calls4U, обробляє провайдер асистента за його власною політикою конфіденційності: для Claude — ",
        { label: "anthropic.com/legal/privacy", href: "https://www.anthropic.com/legal/privacy" },
        ", для ChatGPT — ",
        {
          label: "openai.com/policies/privacy-policy",
          href: "https://openai.com/policies/privacy-policy",
        },
        ". Провайдер асистента є окремим одержувачем даних. Передача відбувається на ваш запит і в межах наданого вами доступу."
      ),
      paragraph(
        "12.5. Доступ надається токенами OAuth 2.1 з обмеженим строком дії. Відкликати доступ можна будь-коли: у налаштуваннях підключень асистента (у Claude — Settings → Connectors → Disconnect, у ChatGPT — у налаштуваннях застосунків) або в кабінеті Calls4U."
      ),
      paragraph(
        "12.6. Ми ведемо технічний журнал викликів інструментів (час, назва інструмента, результат; без вмісту розмов) для безпеки й підтримки. Строк зберігання — 90 днів."
      ),
      paragraph(
        "12.7. Ключі CRM та інші секрети інтеграцій зберігаються зашифрованими й ніколи не повертаються в чат асистента."
      ),
      paragraph(
        "12.8. На початку дзвінка агент повідомляє співрозмовнику, що з ним говорить віртуальний (ШІ) помічник компанії-клієнта. Клієнт Calls4U відповідає за наявність правової підстави для дзвінків своїм контактам (згода або договір), за повідомлення про запис розмови та за дотримання прохань «не дзвонити». Такі номери позначаються в системі й більше не обдзвонюються."
      )
    ),
  ],
  translations: {
    en: {
      title: "Privacy Policy",
      metaTitle: "Privacy Policy",
      metaDescription:
        "How calls4u.ai collects, processes, stores and protects the personal data of its users, list of subprocessors and data subject rights.",
      updatedNote: "Last updated: 27 November 2026",
      intro: [
        "This is the English version of the Calls4U Privacy Policy. If it differs from the Ukrainian version, the Ukrainian version prevails.",
      ],
      sections: [
        section(
          "1. General provisions",
          paragraph(
            'This Privacy Policy sets out how we collect, process, store and protect the personal data of users of the calls4u.ai website (the "Website") and the Calls4U service of the same name (the "Service").'
          ),
          contacts([
            {
              label: "Data controller",
              value: "Individual entrepreneur (FOP) Bohdan Volodymyrovych Ovsiienko",
            },
            { label: "Tax ID (RNOKPP)", value: COMPANY_INFO.taxId },
            { label: "Address", value: "24 Yaroslava Hasheka Blvd, Kyiv, 02000, Ukraine" },
            { label: "Email", value: COMPANY_INFO.email },
            { label: "Phone", value: COMPANY_INFO.phone },
          ]),
          paragraph(
            "By using the Website and the Service, you confirm that you have read this Policy and agree to the terms on which your personal data are processed. If you do not agree with the terms of this Policy, please stop using the Website and the Service."
          ),
          paragraph(
            'This Policy has been prepared in accordance with the Law of Ukraine "On Personal Data Protection" No. 2297-VI and, for users in the European Union, taking into account the requirements of the GDPR (Regulation (EU) 2016/679) to the extent they apply to our activities.'
          )
        ),
        section(
          "2. Personal data we collect",
          paragraph("Data you provide yourself:"),
          list([
            ["first name and last name;"],
            ["phone number;"],
            ["email address;"],
            [
              "company name and position (for clients that are legal entities or sole proprietors);",
            ],
            ["credentials for signing in to your account;"],
            [
              "payment data to the extent needed to pay through WayForPay (calls4u.ai does not store full bank card details; they are processed by the payment service in line with the PCI DSS standard).",
            ],
          ]),
          paragraph(
            "Data generated when you use the voice AI agent: audio recordings of phone calls made through the Service; text transcripts of these calls; call metadata (date, time, duration, phone number, result); voice data generated during speech synthesis and speech recognition."
          ),
          paragraph(
            "The Service client, as the party that initiates the calls, is responsible for obtaining the consent of the people it calls to the recording of the call, in accordance with the law that applies in the client's jurisdiction."
          ),
          paragraph(
            "Technical data: IP address, browser type and version, device data, cookies (see the separate ",
            { label: "Cookie Policy", href: LEGAL_PAGES.cookiePolicy.href },
            ") and logs of actions in the Service."
          )
        ),
        section(
          "3. Purposes of processing",
          list([
            ["registering and identifying users and giving them access to their account;"],
            [
              "providing the Service (setting up and running the AI agent, placing and processing calls);",
            ],
            ["billing and subscription payments through WayForPay;"],
            ["technical support and communication with users;"],
            ["analytics and improving the quality of the Service;"],
            ["meeting legal requirements (tax and accounting);"],
            ["with separate consent, sending informational and marketing messages."],
          ])
        ),
        section(
          "4. Legal bases for processing",
          paragraph(
            "We process personal data on the following bases: the consent of the data subject; the need to perform a contract (the public offer); compliance with legal obligations (in particular, requirements of the tax authorities); and the legitimate interests of the data controller (security, fraud prevention and improving the Service)."
          )
        ),
        section(
          "5. Who receives the data (subprocessors)",
          paragraph(
            "To run the Service, we engage technical partners. Each partner receives only the data needed for its technical function:"
          ),
          list([
            [
              "providers of artificial intelligence models, including OpenAI, Google (Gemini) and Groq;",
            ],
            ["speech recognition (speech-to-text) providers, including Deepgram;"],
            ["speech synthesis (text-to-speech) providers, including ElevenLabs;"],
            [
              "telephony and voice infrastructure (SIP/VoIP) providers, including LiveKit, and telephone carriers (Twilio, Vonage, Zadarma), depending on the configuration;",
            ],
            ["the payment system WayForPay (WayForPay LLC);"],
            ["the hosting provider and the server infrastructure provider;"],
            ["communication services: Telegram (notifications and bot) and an email service."],
          ]),
          paragraph(
            "Some partners may process data on servers outside Ukraine, including in the EU and the USA. In such cases we take reasonable measures to ensure an adequate level of data protection. We do not sell personal data to third parties."
          )
        ),
        section(
          "6. Artificial intelligence and call recording",
          paragraph(
            "The Calls4U voice agent is an artificial intelligence system, not a human. At the start of a call the agent introduces itself as a virtual assistant, and it answers honestly when the other person asks directly whether it is a robot."
          ),
          paragraph(
            "Calls made through the Service are recorded and transcribed automatically: the audio recording is converted into a text transcript. Recordings and transcripts are available to the Service client in the call log and are used to provide the Service: to show the result of the call, for analytics and to pass data to the integrations the client has connected."
          ),
          paragraph(
            "To recognize speech and generate the agent's replies, parts of the calls are processed by the providers listed in Section 5. Retention periods for recordings and transcripts are set out in Section 7."
          )
        ),
        section(
          "7. Data retention",
          paragraph(
            "Personal data are kept for as long as needed to achieve the purpose of processing, in particular for the term of the contract and, after it ends, for the periods required by the law of Ukraine."
          ),
          table(
            ["Data", "Retention period"],
            [
              [
                "Call recordings (audio)",
                "90 days by default; can be set from 0 to 365 days in the settings",
              ],
              [
                "Transcripts and call result cards",
                "For the life of the account + 30 days after deletion",
              ],
              ["Contacts", "Until you delete them or close the account"],
              ["Tool call log (MCP)", "90 days"],
              ["Payment and accounting documents", "3 years (requirements of Ukrainian tax law)"],
            ]
          )
        ),
        section(
          "8. Your rights",
          list([
            ["obtain information about which of your data are processed;"],
            ["request the correction of inaccurate data;"],
            ["withdraw your consent to processing (where processing is based on consent);"],
            [
              'request the erasure of your data (the "right to be forgotten") in the cases provided for by law;',
            ],
            ["object to the processing of your data for marketing purposes;"],
            [
              "if you are in the EU, exercise the additional rights you have under the GDPR, including the right to data portability and the right to lodge a complaint with a supervisory authority.",
            ],
          ]),
          paragraph(
            `You can exercise the right to be forgotten directly in your account (Settings → Delete account) or by writing to ${COMPANY_INFO.email}. Deletion is irreversible: the account, agents, contacts, call log, call recordings and transcripts are erased.`
          )
        ),
        section(
          "9. Data protection",
          paragraph(
            "We take technical and organizational measures to protect personal data against unauthorized access, loss, destruction or disclosure, including encryption of data in transit, access restricted to those who need it, and regular backups. Audio recordings and transcripts are kept in private storage; access to them is given only through signed URLs within the session of the user concerned."
          )
        ),
        section(
          "10. Changes to this Policy",
          paragraph(
            "We may update this Policy. The current version is always available on this page of the Website. If we make material changes, we will notify users through the Website or by email."
          )
        ),
        section(
          "11. Contacts",
          contacts([
            { label: "Email", value: COMPANY_INFO.email },
            { label: "Phone", value: COMPANY_INFO.phone },
            { label: "Address", value: "24 Yaroslava Hasheka Blvd, Kyiv, 02000, Ukraine" },
          ])
        ),
        section(
          "12. Integration with AI assistants (Claude, ChatGPT and other MCP clients)",
          paragraph(
            "12.1. You can connect your Calls4U account to an AI assistant that supports the Model Context Protocol (MCP), including Claude (Anthropic PBC) and ChatGPT (OpenAI). The connection is started by the user: you sign in to Calls4U and give explicit consent to the access."
          ),
          paragraph(
            "12.2. Through the connection, the AI assistant receives the data of your account when you ask it to: agent settings, the call log and call result cards, transcripts, client bookings, contacts, and integration and notification settings. On your instruction it can also change these data and, after your explicit confirmation, start calls."
          ),
          paragraph(
            "12.3. From the AI assistant we receive only the parameters of a specific request (for example, a date, an agent ID or the text of a note). We do not receive or store your conversations with the assistant, its memory or your other files."
          ),
          paragraph(
            "12.4. Data that the assistant receives from Calls4U are processed by the assistant's provider under its own privacy policy: for Claude — ",
            {
              label: "anthropic.com/legal/privacy",
              href: "https://www.anthropic.com/legal/privacy",
            },
            "; for ChatGPT — ",
            {
              label: "openai.com/policies/privacy-policy",
              href: "https://openai.com/policies/privacy-policy",
            },
            ". The assistant's provider is a separate recipient of the data. The transfer takes place at your request and within the access you have granted."
          ),
          paragraph(
            "12.5. Access is granted with OAuth 2.1 tokens that are valid for a limited time. You can revoke access at any time: in the assistant's connection settings (in Claude: Settings → Connectors → Disconnect; in ChatGPT: in the apps settings) or in your Calls4U account."
          ),
          paragraph(
            "12.6. We keep a technical log of tool calls (time, tool name and result, without the content of conversations) for security and support. The log is kept for 90 days."
          ),
          paragraph(
            "12.7. CRM keys and other integration secrets are stored encrypted and are never returned to the assistant's chat."
          ),
          paragraph(
            '12.8. At the start of a call, the agent tells the other person that they are speaking with a virtual (AI) assistant of the client company. The Calls4U client is responsible for having a legal basis for calling its contacts (consent or a contract), for informing them that the call is recorded and for honoring "do not call" requests. Such numbers are flagged in the system and are not called again.'
          )
        ),
      ],
    },
  },
};

import type { CrmIntegration, CrmProvider, CrmPushMode } from "@dashboard/types";

export interface CrmCredentialField {
  name: "api_key" | "webhook_url";
  label: string;
  placeholder: string;
  isSecret: boolean;
  note: string | null;
}

export interface CrmProviderConfig {
  id: CrmProvider;
  name: string;
  idleDescription: string;
  steps: string[];
  credential: CrmCredentialField;
}

export const CRM_PROVIDERS: Record<CrmProvider, CrmProviderConfig> = {
  bitrix24: {
    id: "bitrix24",
    name: "Bitrix24",
    idleDescription: "Після кожного важливого дзвінка: лід або контакт з угодою в Bitrix24.",
    steps: [
      "У Bitrix24 відкрийте «Розробникам» → «Інше» → «Вхідний вебхук».",
      "У правах доступу позначте CRM і збережіть.",
      "Скопіюйте адресу вебхука й вставте нижче.",
    ],
    credential: {
      name: "webhook_url",
      label: "Адреса вебхука",
      placeholder: "https://ваш.bitrix24.ua/rest/1/abc123/",
      isSecret: false,
      note: "Адресу зберігаємо на сервері й більше ніде не показуємо.",
    },
  },
  keycrm: {
    id: "keycrm",
    name: "KeyCRM",
    idleDescription:
      "Після кожного важливого дзвінка: картка у воронці KeyCRM із часом запису чи передзвону.",
    steps: [
      "У KeyCRM відкрийте «Налаштування» → «Загальні» → «Ключ API».",
      "Переконайтесь, що розділ «Воронки» увімкнено.",
      "Скопіюйте ключ і вставте нижче.",
    ],
    credential: {
      name: "api_key",
      label: "API-ключ",
      placeholder: "Вставте ключ",
      isSecret: true,
      note: null,
    },
  },
};

export const CRM_PROVIDER_IDS: ReadonlySet<string> = new Set(Object.keys(CRM_PROVIDERS));

export const isCrmProvider = (id: string): id is CrmProvider => CRM_PROVIDER_IDS.has(id);

export const CRM_PUSH_OPTIONS: { value: CrmPushMode; title: string; description: string }[] = [
  {
    value: "important",
    title: "Лише важливе",
    description: "запис, передзвін, заявка, оплата, зірваний запис",
  },
  { value: "conversations", title: "Усі розмови", description: "крім недозвонів" },
  { value: "all", title: "Усе", description: "разом із недозвонами" },
];

export const DEFAULT_PUSH_MODE: CrmPushMode = "important";

export const CRM_DEFAULT_OPTION = "default";

const CONNECTED_HINTS = {
  classic: "Класична CRM: після дзвінка створюємо лід",
  simple: "Проста CRM: після дзвінка створюємо контакт і угоду",
  keycrm: "Після дзвінка створюємо картку у воронці",
} as const;

export const describeCrmMode = ({ provider, mode }: CrmIntegration): string | null => {
  if (provider === "keycrm") return CONNECTED_HINTS.keycrm;
  if (mode === "classic" || mode === "simple") return CONNECTED_HINTS[mode];
  return null;
};

const TEST_CREATED_MESSAGES: Record<string, string> = {
  card: "Тестову картку створено.",
  lead: "Тестовий лід створено.",
  deal: "Тестову угоду створено.",
};

export const describeCrmTestCreated = (externalId: string): string => {
  const [kind] = externalId.split(":");
  return TEST_CREATED_MESSAGES[kind] ?? "Тестовий запис створено.";
};

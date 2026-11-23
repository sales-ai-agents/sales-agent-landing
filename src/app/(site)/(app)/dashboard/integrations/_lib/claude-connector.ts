import { CLAUDE_CONNECTOR_URL } from "@/lib/constants";

export const CLAUDE_CODE_COMMAND = `claude mcp add --transport http calls4u ${CLAUDE_CONNECTOR_URL}`;

export const CLAUDE_EXAMPLE_PROMPTS = [
  "Створи агента, який записує клієнтів у мій салон. Ось наш сайт",
  "Скільки дзвінків було вчора і скільки цілей досягнуто?",
  "Покажи клієнтів, які просили передзвонити",
] as const;

export interface ConnectorStep {
  title: string;
  description: string;
}

export const CLAUDE_CHAT_STEPS: readonly ConnectorStep[] = [
  {
    title: "Скопіюйте адресу сервера Calls4U",
    description: "Її треба буде вставити в Claude",
  },
  {
    title: "Відкрийте конектори в Claude",
    description: "На claude.ai або в додатку: Customize → Connectors → Add → Add custom connector",
  },
  {
    title: "Заповніть два поля",
    description:
      "Name: Calls4U. Remote MCP server URL: вставте скопійовану адресу. Натисніть Continue, потім Add",
  },
  {
    title: "Увійдіть у Calls4U",
    description:
      "Натисніть Connect біля конектора. Відкриється вікно Calls4U: увійдіть у свій акаунт і дозвольте доступ",
  },
  {
    title: "Увімкніть у чаті й питайте",
    description:
      "У новому чаті натисніть «+» внизу ліворуч, оберіть Connectors і увімкніть Calls4U. Перед кожною дією Claude спитає дозволу",
  },
];

export const CLAUDE_CODE_STEPS: readonly ConnectorStep[] = [
  {
    title: "Виконайте команду в терміналі",
    description: "Calls4U додасться як MCP-сервер",
  },
  {
    title: "Увійдіть у Calls4U",
    description: "Запустіть Claude Code, введіть /mcp, оберіть calls4u і пройдіть вхід у браузері",
  },
  {
    title: "Питайте про дзвінки",
    description: "Наприклад: «покажи дзвінки з досягнутою ціллю за тиждень»",
  },
];

export const CLAUDE_CAN_SEE: readonly string[] = [
  "Дзвінки за період, агентом і результатом",
  "Розмову: транскрипт, підсумок, чи досягнуто цілі",
  "Агентів та їхню статистику",
  "Контакти й теги",
  "Рахунок, хвилини тарифу й витрати",
  "Номери та хто на них відповідає",
];

export const CLAUDE_CAN_DO: readonly string[] = [
  "Створити агента: голос, сценарій, ціль, номер",
  "Редагувати сценарій і дані про бізнес",
  "Зробити тестовий дзвінок на ваш номер",
  "Додати контакти або поставити тег",
  "Поставити агента на паузу",
];

export interface IntegrationItem {
  readonly title: string;
  readonly description: string;
}

export const INTEGRATIONS: readonly IntegrationItem[] = [
  {
    title: "CRM",
    description: "Результат дзвінка потрапляє в картку клієнта: статус, підсумок і запис розмови.",
  },
  {
    title: "Google Sheets",
    description:
      "Журнал оновлюється в таблиці автоматично: клієнт, статус, підсумок і наступна дія.",
  },
  {
    title: "CSV",
    description:
      "Завантажуйте базу контактів і вивантажуйте результати дзвінків у зручному форматі.",
  },
  {
    title: "Webhooks",
    description:
      "Передавайте події після дзвінка у вашу систему: CRM, чат, аналітику або автоматизацію.",
  },
] as const;

export const VIDEO_ID = "_DNyhjh_eIo";

export interface VideoChapter {
  readonly startSeconds: number;
  readonly label: string;
  readonly badge?: string;
}

export const VIDEO_CHAPTERS: readonly VideoChapter[] = [
  { startSeconds: 26, label: "Де бізнес втрачає гроші на дзвінках" },
  { startSeconds: 77, label: "До 60 000 ₴ втрат щомісяця", badge: "Розрахунок" },
  { startSeconds: 138, label: "Що таке ШІ-агент простими словами" },
  { startSeconds: 174, label: "Реальний дзвінок ШІ-агента", badge: "Слухати" },
  { startSeconds: 202, label: "5 сценаріїв, де агент приносить гроші" },
  { startSeconds: 274, label: "Міфи та заперечення" },
  { startSeconds: 348, label: "Менеджер vs ШІ-агент: економіка" },
  { startSeconds: 390, label: "Кейс: барбершоп", badge: "Кейс" },
] as const;

export type PlanCtaTone = "ghost" | "white";

export interface PricingPlan {
  readonly id: string;
  readonly tagline: string;
  readonly name: string;
  readonly price: string;
  readonly subtitle: string;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  readonly ctaTone: PlanCtaTone;
  readonly featured?: boolean;
  readonly badge?: string;
}

export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "start",
    tagline: "Для першого запуску",
    name: "Start",
    price: "$29",
    subtitle: "Для невеликого потоку дзвінків",
    features: [
      "100 хвилин розмов",
      "1 ШІ-агент",
      "1 телефонний номер",
      "$5 балансу на дзвінки",
      "Журнал і результати розмов",
      "Базове налаштування сценарію",
    ],
    ctaLabel: "Спробувати безкоштовно",
    ctaTone: "ghost",
  },
  {
    id: "business",
    tagline: "Для регулярних звернень",
    name: "Business",
    price: "$79",
    subtitle: "Для бізнесу з постійним потоком клієнтів",
    features: [
      "300 хвилин розмов",
      "До 3 ШІ-агентів",
      "1 телефонний номер",
      "$10 балансу на дзвінки",
      "CSV-кампанії та Webhooks",
      "Кілька сценаріїв дзвінків",
      "Все з тарифу Start",
    ],
    ctaLabel: "Спробувати безкоштовно",
    ctaTone: "white",
    featured: true,
    badge: "Найпопулярніший",
  },
  {
    id: "pro",
    tagline: "Для масштабування",
    name: "Pro",
    price: "$199",
    subtitle: "Для команд із великим обсягом дзвінків",
    features: [
      "800 хвилин розмов",
      "Необмежено ШІ-агентів",
      "До 3 телефонних номерів",
      "$20 балансу на дзвінки",
      "Усі доступні інтеграції",
      "Пріоритетна підтримка",
      "Підключення до бізнес-процесів",
    ],
    ctaLabel: "Обговорити підключення",
    ctaTone: "ghost",
  },
] as const;

export type SecurityIcon = "lock" | "pause" | "users" | "shieldCheck";

export interface SecurityCard {
  readonly icon: SecurityIcon;
  readonly title: string;
  readonly description: string;
}

export const SECURITY_CARDS: readonly SecurityCard[] = [
  {
    icon: "lock",
    title: "Записи у вашому кабінеті",
    description: "Кожна розмова зберігається зі статусом, підсумком і аудіо.",
  },
  {
    icon: "pause",
    title: "Пауза в один клік",
    description: "Зупиніть дзвінки, якщо треба перевірити сценарій чи базу.",
  },
  {
    icon: "users",
    title: "Контроль доступів",
    description: "Ви вирішуєте, хто з команди бачить базу, записи і результати.",
  },
  {
    icon: "shieldCheck",
    title: "Дані під захистом",
    description: "Контакти не передаються третім особам і не використовуються для сторонніх задач.",
  },
] as const;

export type TrustIcon = "shield" | "lock" | "globe";

export interface TrustBadge {
  readonly icon: TrustIcon;
  readonly label: string;
}

export const TRUST_BADGES: readonly TrustBadge[] = [
  { icon: "shield", label: "GDPR Compliant" },
  { icon: "lock", label: "Шифрування даних" },
  { icon: "globe", label: "Сервери зберігання в ЄС" },
] as const;

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Що таке Calls4U і як це працює?",
    answer:
      "Calls4U — це сервіс голосових ШІ-агентів, які телефонують клієнтам за ваш бізнес: підтверджують записи, нагадують про візити, уточнюють замовлення й кваліфікують заявки. Після дзвінка статус, підсумок і запис розмови потрапляють у кабінет, CRM або Google Sheets. Запуск займає один день, програмісти не потрібні.",
  },
  {
    question: "Як правильно пишеться і читається Calls4U?",
    answer:
      "Назва пишеться Calls4U (сайт calls4u.ai) і читається «Коллс фо Ю» — від англійського calls for you, «дзвінки для вас». Нас також шукають як Calls 4U, Calls4You, Каллс4Ю, Коллс4Ю або Колс4Ю. Російською: Calls4U — ИИ-агент для звонков, который подтверждает записи, напоминает о визитах и передаёт результат в CRM.",
  },
  {
    question: "З чого починається запуск агента?",
    answer:
      "Спочатку обираєте сценарій: підтвердження запису, нагадування, замовлення або заявка. Потім налаштовуєте голос, текст інструкції і перевіряєте дзвінок на собі.",
  },
  {
    question: "Чи можна змінити сценарій після запуску?",
    answer:
      "Так. Можна оновити фрази, правила розмови, час дзвінків і логіку передачі менеджеру. Сценарій не прибитий цвяхами, як старий прайс на ресепшені.",
  },
  {
    question: "Як зрозуміти, що агент відпрацював дзвінок добре?",
    answer:
      "Після кожного дзвінка в журналі видно статус, короткий підсумок, аудіозапис і результат синхронізації з CRM або таблицею.",
  },
  {
    question: "Що буде, якщо клієнт не відповів?",
    answer:
      "Агент фіксує статус «Не відповів». Далі можна запланувати повторний дзвінок або передати контакт менеджеру для ручної обробки.",
  },
  {
    question: "Можна спочатку протестувати без дзвінків клієнтам?",
    answer:
      "Так. Перед запуском по базі можна зробити тестовий дзвінок на свій номер і перевірити голос, сценарій та поведінку агента.",
  },
  {
    question: "Куди потрапляють результати дзвінків?",
    answer:
      "У кабінет, CRM, Google Sheets або у вашу систему через webhook. Міняти весь процес заради агента не потрібно.",
  },
  {
    question: "Для яких дзвінків це підходить найкраще?",
    answer:
      "Для рутинних дзвінків: підтвердження замовлень, запис на візит, нагадування і відповіді на часті питання. Якщо запит складний — агент одразу передає дзвінок менеджеру.",
  },
  {
    question: "Скільки це коштує?",
    answer:
      "Від $29 на місяць. Ви сплачуєте лише за використані хвилини розмови — усі сценарії, інтеграції з CRM і тестовий баланс уже включені в тарифи.",
  },
] as const;

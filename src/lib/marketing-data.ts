import type React from "react";
import type {
  DemoCard,
  FaqEntry,
  IndustryCard,
  Integration,
  MockCallLogRow,
  OnboardingStep,
  Scenario,
  TrustItem,
} from "@/types";
import {
  Bell,
  ClipboardCheck,
  Code,
  FileSpreadsheet,
  PhoneCall,
  Settings,
  Sheet,
  ShoppingCart,
  Trophy,
  Users,
} from "lucide-react";

// --- Scenarios Section ---

export const SCENARIOS: readonly Scenario[] = [
  {
    title: "Підтвердження запису",
    icon: ClipboardCheck,
    details: [
      { label: "Для кого:", value: "салони, клініки, СТО" },
      { label: "Питає:", value: "чи клієнт прийде у вибраний час" },
      { label: "Результат:", value: "підтверджено / перенос" },
    ],
  },
  {
    title: "Нагадування про візит",
    icon: Bell,
    details: [
      { label: "Для кого:", value: "послуги за записом" },
      { label: "Робить:", value: "нагадує дату, час і деталі" },
      { label: "Результат:", value: "менше ручних дзвінків" },
    ],
  },
  {
    title: "Уточнення замовлення",
    icon: ShoppingCart,
    details: [
      { label: "Для кого:", value: "інтернет-магазини" },
      { label: "Питає:", value: "товар, адресу, доставку" },
      { label: "Результат:", value: "замовлення готове до обробки" },
    ],
  },
  {
    title: "Кваліфікація ліда",
    icon: Trophy,
    details: [
      { label: "Для кого:", value: "заявки з реклами" },
      { label: "Питає:", value: "потребу, бюджет, термін" },
      { label: "Результат:", value: "тепла заявка для менеджера" },
    ],
  },
  {
    title: "Повторний дзвінок",
    icon: PhoneCall,
    details: [
      { label: "Для кого:", value: "клієнти з бази" },
      { label: "Робить:", value: "пропонує запис або послугу" },
      { label: "Результат:", value: "статус і наступна дія" },
    ],
  },
  {
    title: "Власний сценарій",
    icon: Settings,
    details: [
      { label: "Для кого:", value: "нестандартні процеси" },
      { label: "Робить:", value: "говорить вашими фразами" },
      { label: "Результат:", value: "сценарій під конкретний бізнес" },
    ],
  },
] as const;

// --- Industries Section ---

export const INDUSTRIES: readonly IndustryCard[] = [
  {
    title: "ЛОГІСТИКА",
    task: "Клієнти залишають заявки на перевезення, але менеджери витрачають час на уточнення маршруту, вантажу, дати й деталей оплати.",
    agentDoes:
      "Дзвонить клієнту, уточнює маршрут, тип вантажу, дату відправки, контактну особу та передає готову заявку менеджеру",
    status: "Заявку уточнено / потрібен дзвінок менеджера",
    imageSrc: "/image/industries-logistics.png",
  },
  {
    title: "СЛУЖБА ДОСТАВКИ",
    task: "Оператори вручну підтверджують адресу, час отримання, зміни в замовленні й повторно дзвонять клієнтам.",
    agentDoes:
      "Підтверджує адресу, зручний час доставки, фіксує зміну даних і передає статус в кабінет.",
    status: "Доставку підтверджено / потрібно змінити час",
    imageSrc: "/image/industries-delivery.png",
  },
  {
    title: "АВТОСЕРВІСИ ТА СТО",
    task: "Клієнти дзвонять дізнатися вартість ТО та наявність вільних підйомників. Адміністратор витрачає час на ручний запис.",
    agentDoes: "Звіряє вільні слоти в CRM, уточнює марку авто, записує на час і надсилає SMS.",
    status: "Запис підтверджено / Внесено в CRM",
    imageSrc: "/image/industries-cto.png",
  },
  {
    title: "E-COMMERCE",
    task: "Менеджери витрачають час на уточнення замовлень: адреса, спосіб оплати, наявність товару та зміни у складі замовлення.",
    agentDoes:
      "Дзвонить клієнту, підтверджує склад замовлення, адресу доставки, спосіб оплати та фіксує зміни в системі.",
    status: "Замовлення підтверджено / потрібна корекція",
    imageSrc: "/image/industries-ecommerce.jpg",
  },
] as const;

// --- How It Works Section ---

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  {
    number: "01",
    title: "Оберіть сценарій",
    description: "Готовий шаблон для запису, нагадування, замовлення або заявки.",
  },
  {
    number: "02",
    title: "Налаштуйте агента",
    description: "Виберіть голос, додайте фрази і правила розмови для агента.",
  },
  {
    number: "03",
    title: "Додайте контакти",
    description: "Завантажте номери через CSV, Google Sheets або підключену CRM.",
  },
  {
    number: "04",
    title: "Перевірте дзвінок",
    description: "Перевірте сценарій на собі, і тільки потім запускайте дзвінки клієнтам.",
  },
] as const;

// --- Audio Demo Section ---

export const DEMOS: readonly DemoCard[] = [
  {
    id: "delivery",
    category: "Служба доставки",
    description: "Підтвердження доставки",
    scenario: "Агент підтверджує адресу, зручний час отримання та фіксує статус для оператора",
    result: "Результат:",
    resultBold: "доставку підтверджено",
    src: "/audio/audio.ogg",
  },
  {
    id: "logistics",
    category: "Логістика",
    description: "Уточнення заявки на перевезення",
    scenario:
      "Агент дзвонить клієнту, уточнює маршрут, тип вантажу, дату відправки та передає заявку менеджеру",
    result: "Результат:",
    resultBold: "заявку уточнено",
    src: "/audio/audio.ogg",
  },
  {
    id: "warehouse",
    category: "Склад / B2B-постачання",
    description: "Уточнення замовлення",
    scenario:
      "Агент перевіряє позиції в замовленні, кількість, дату відвантаження та передає зміни в кабінет",
    result: "Результат:",
    resultBold: "замовлення оновлено",
    src: "/audio/audio.ogg",
  },
  {
    id: "service",
    category: "Сервісна компанія",
    description: "Запис на виїзд спеціаліста",
    scenario: "Агент уточнює проблему, адресу, зручний час візиту та створює заявку для майстра",
    result: "Результат:",
    resultBold: "візит заплановано",
    src: "/audio/audio.ogg",
  },
] as const;

// --- Call Logs Preview (landing page showcase table) ---

export const CALL_LOG_PREVIEW: readonly MockCallLogRow[] = [
  {
    id: "1",
    customer: "Олена К.",
    time: "10:24",
    status: "Підтверджено",
    statusVariant: "success",
    summary: "Буде завтра о 14:00",
    duration: "1:02",
    crm: "Оновлено",
  },
  {
    id: "2",
    customer: "Ігор М.",
    time: "10:31",
    status: "Перенесено",
    statusVariant: "secondary",
    summary: "Пʼятниця, 17:30",
    duration: "1:45",
    crm: "Оновлено",
  },
  {
    id: "3",
    customer: "Світлана Т.",
    time: "10:38",
    status: "Не відповіла",
    statusVariant: "warning",
    summary: "Повторний дзвінок заплановано",
    duration: "0:15",
    crm: "Очікує",
  },
  {
    id: "4",
    customer: "Андрій В.",
    time: "10:45",
    status: "Нова заявка",
    statusVariant: "success",
    summary: "Хоче запис на ТО в суботу",
    duration: "2:55",
    crm: "Оновлено",
  },
] as const;

// --- Trust Section ---

export const TRUST_ITEMS: readonly TrustItem[] = [
  {
    icon: "/image/trust-lock.svg",
    title: "Записи у вашому кабінеті",
    description: "Кожна розмова зберігається разом зі статусом, підсумком і записом дзвінка.",
  },
  {
    icon: "/image/trust-pause.svg",
    title: "Пауза в один клік",
    description:
      "Дзвінки можна зупинити або поставити на паузу, якщо потрібно перевірити сценарій чи базу.",
  },
  {
    icon: "/image/trust-scan.svg",
    title: "Контроль доступів",
    description:
      "Ви вирішуєте, хто з команди бачить базу клієнтів, записи розмов і результати дзвінків.",
  },
  {
    icon: "/image/trust-face.svg",
    title: "Дані під захистом",
    description:
      "Контакти клієнтів не передаються третім особам і не використовуються для сторонніх задач.",
  },
] as const;

// --- FAQ Section ---

export const FAQ_ENTRIES: readonly FaqEntry[] = [
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
      'Агент фіксує статус "Не відповів". Далі можна запланувати повторний дзвінок або передати контакт менеджеру для ручної обробки.',
  },
  {
    question: "Можна спочатку протестувати без дзвінків клієнтам?",
    answer:
      "Так. Перед запуском по базі можна зробити тестовий дзвінок на свій номер і перевірити голос, сценарій та поведінку агента.",
  },
  {
    question: "Куди потрапляють результати дзвінків?",
    answer:
      "Результати можна бачити в кабінеті, CRM, Google Sheets або передавати у вашу систему через webhook. Міняти весь процес заради агента не потрібно.",
  },
  {
    question: "Для яких дзвінків це підходить найкраще?",
    answer:
      "Для будь-яких рутинних дзвінків: підтвердження замовлень, запис на візит, нагадування та відповіді на часті питання. Якщо запит складний — ШІ одразу передає дзвінок менеджеру.",
  },
  {
    question: "Скільки це коштує?",
    answer:
      "Ви сплачуєте лише за використані хвилини розмови. Усі сценарії, інтеграції з CRM та тестовий баланс вже включені в тарифи.",
    textAnswer:
      "Ви сплачуєте лише за використані хвилини розмови. Усі сценарії, інтеграції з CRM та тестовий баланс вже включені в тарифи.",
  },
] as const;

// --- Integrations Section ---

export interface MarketingIntegration extends Integration {
  readonly icon: React.ComponentType<{ className?: string }>;
}

export const INTEGRATIONS: readonly MarketingIntegration[] = [
  {
    title: "CRM",
    icon: Users,
    description:
      "Результат дзвінка потрапляє в картку клієнта: статус, короткий підсумок і запис розмови",
  },
  {
    title: "Google Sheets",
    icon: Sheet,
    description:
      "Журнал дзвінків оновлюється в таблиці автоматично: клієнт, статус, підсумок і наступна дія",
  },
  {
    title: "CSV",
    icon: FileSpreadsheet,
    description:
      "Завантажуйте базу контактів і вивантажуйте результати дзвінків у зручному форматі",
  },
  {
    title: "Webhooks",
    icon: Code,
    description:
      "Передавайте події після дзвінка у вашу систему: CRM, чат, аналітику або автоматизацію",
  },
] as const;

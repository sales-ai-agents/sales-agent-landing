export const SIGN_UP_URL = "/sign-up";
export const SIGN_IN_URL = "/sign-in";
export const CONTACT_PHONE_HREF = "tel:+380914810542";
export const CONTACT_PHONE_LABEL = "+380 (91) 481 05 42";
export const CONTACT_EMAIL = "salesagentswork@gmail.com";

export interface LandingLink {
  readonly href: string;
  readonly label: string;
}

export const NAV_LINKS: readonly LandingLink[] = [
  { href: "#demo", label: "Демо" },
  { href: "#scenarios", label: "Сценарії" },
  { href: "#control", label: "Кабінет" },
  { href: "#pricing", label: "Тарифи" },
  { href: "/blog", label: "Блог" },
  { href: "#faq", label: "FAQ" },
] as const;

export const resolveLandingHref = (href: string, basePath: string): string =>
  href.startsWith("#") ? `${basePath}${href}` : href;

export const FOOTER_DOCUMENTS: readonly LandingLink[] = [
  { href: "/offer", label: "Публічна оферта" },
  { href: "/service-terms", label: "Умови надання послуг" },
  { href: "/refund-policy", label: "Умови повернення коштів" },
  { href: "/privacy-policy", label: "Політика конфіденційності" },
  { href: "/cookie-policy", label: "Політика cookie" },
  { href: "/terms-of-use", label: "Умови використання сайту" },
] as const;

export type Speaker = "agent" | "client";

export interface TranscriptLine {
  readonly speaker: Speaker;
  readonly text: string;
}

export const HERO_TRANSCRIPT: readonly TranscriptLine[] = [
  {
    speaker: "agent",
    text: "Добрий день, Олено! Це Марія із салону «Lumi». Підтверджуємо ваш запис на завтра о 14:00?",
  },
  { speaker: "client", text: "Так, усе в силі, буду." },
  { speaker: "agent", text: "Чудово! Нагадаю за дві години до візиту. Гарного дня!" },
  {
    speaker: "agent",
    text: "Вітаю! Дзвоню щодо замовлення №4821. Доставка на відділення 12 — вам зручно?",
  },
  { speaker: "client", text: "Краще курʼєром, на Шевченка, 15." },
  { speaker: "agent", text: "Змінила адресу. Курʼєр буде у четвер з 10:00 до 14:00." },
] as const;

export interface StatCard {
  readonly value: string;
  readonly count?: number;
  readonly unit?: string;
  readonly description: string;
}

export const STAT_CARDS: readonly StatCard[] = [
  {
    value: "20",
    count: 20,
    unit: "сек",
    description: "і агент передзвонює на ваш номер для тесту",
  },
  {
    value: "70",
    count: 70,
    unit: "%",
    description: "часу менеджера звільняється від рутинних дзвінків",
  },
  { value: "24/7", description: "дзвінки без вихідних, лікарняних і черг" },
  { value: "1", count: 1, unit: "день", description: "від реєстрації до перших дзвінків клієнтам" },
] as const;

export type ScenarioTone = "white" | "blue" | "ink" | "soft";

export interface Scenario {
  readonly number: string;
  readonly audience: string;
  readonly title: string;
  readonly askLabel: string;
  readonly ask: string;
  readonly bubble: string;
  readonly result: string;
  readonly tone: ScenarioTone;
}

export const SCENARIOS: readonly Scenario[] = [
  {
    number: "01",
    audience: "Салони · Клініки · СТО",
    title: "Підтвердження запису",
    askLabel: "Питає",
    ask: "Чи прийде клієнт у вибраний час",
    bubble: "Підтверджуємо ваш запис на завтра о 14:00?",
    result: "Підтверджено / перенос",
    tone: "white",
  },
  {
    number: "02",
    audience: "Послуги за записом",
    title: "Нагадування про візит",
    askLabel: "Робить",
    ask: "Нагадує дату, час і деталі",
    bubble: "Нагадую: ваш візит завтра о 10:30. Чекаємо на вас!",
    result: "Менше неявок і ручних дзвінків",
    tone: "blue",
  },
  {
    number: "03",
    audience: "Інтернет-магазини",
    title: "Уточнення замовлення",
    askLabel: "Питає",
    ask: "Товар, адресу, доставку",
    bubble: "Доставка на відділення 12 у Львові — все правильно?",
    result: "Замовлення готове до обробки",
    tone: "ink",
  },
  {
    number: "04",
    audience: "Заявки з реклами",
    title: "Кваліфікація ліда",
    askLabel: "Питає",
    ask: "Потребу, бюджет, термін",
    bubble: "Підкажіть, на коли плануєте старт і який бюджет?",
    result: "Тепла заявка для менеджера",
    tone: "soft",
  },
  {
    number: "05",
    audience: "Клієнти з бази",
    title: "Повторний дзвінок",
    askLabel: "Робить",
    ask: "Пропонує запис або послугу",
    bubble: "Час планового ТО — записати вас на суботу?",
    result: "Статус і наступна дія",
    tone: "blue",
  },
  {
    number: "06",
    audience: "Нестандартні процеси",
    title: "Власний сценарій",
    askLabel: "Робить",
    ask: "Говорить вашими фразами",
    bubble: "Говорю вашими словами і за вашими правилами",
    result: "Сценарій під ваш бізнес",
    tone: "ink",
  },
] as const;

export interface OnboardingStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  {
    number: "01",
    title: "Оберіть сценарій",
    description: "Готовий шаблон для запису, нагадування, замовлення або заявки.",
  },
  {
    number: "02",
    title: "Налаштуйте агента",
    description: "Голос, фрази і правила розмови — звичайною мовою.",
  },
  {
    number: "03",
    title: "Додайте контакти",
    description: "Завантажте номери через CSV, Google Sheets або підключену CRM.",
  },
  {
    number: "04",
    title: "Перевірте дзвінок",
    description: "Спершу на собі — і тільки потім запускайте дзвінки клієнтам.",
  },
] as const;

export const BUILDER_CHECKLIST: readonly string[] = [
  "Жіночий або чоловічий голос",
  "Інструкція звичайною мовою",
  "Готові шаблони під вашу нішу",
  "Миттєва інтеграція з CRM",
  "Тестовий дзвінок перед запуском",
] as const;

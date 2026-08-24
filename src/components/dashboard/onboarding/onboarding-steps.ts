import type { Step } from "onborda";

export const TOUR_NAME = "dashboard-welcome";

export const dashboardWelcomeSteps: Step[] = [
  {
    icon: "👋",
    title: "Ласкаво просимо до Calls4U!",
    content:
      "Це ваш дашборд — тут ви бачите загальну статистику дзвінків та продуктивність ваших AI-агентів. Давайте проведемо короткий тур.",
    selector: "#onboarding-dashboard-header",
    side: "bottom",
    showControls: true,
    pointerPadding: 12,
    pointerRadius: 16,
  },
  {
    icon: "🧭",
    title: "Навігація",
    content:
      "Бічна панель — ваш головний навігатор. Тут ви знайдете всі розділи: дашборд, агенти, контакти, журнал дзвінків та налаштування.",
    selector: "#onboarding-sidebar-nav",
    side: "right",
    showControls: true,
    pointerPadding: 8,
    pointerRadius: 12,
  },
  {
    icon: "🤖",
    title: "Створіть свого першого агента",
    content:
      "Натисніть цю кнопку, щоб створити AI-агента, який буде здійснювати дзвінки за вас. Це займе лише кілька хвилин!",
    selector: "#onboarding-create-agent-btn",
    side: "bottom-right",
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 12,
  },
  {
    icon: "📊",
    title: "Статистика дзвінків",
    content:
      "Тут ви бачите ключові метрики: загальну кількість дзвінків, успішні та пропущені. Після першого дзвінка дані почнуть оновлюватись автоматично.",
    selector: "#onboarding-stats-cards",
    side: "bottom",
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 16,
  },
];

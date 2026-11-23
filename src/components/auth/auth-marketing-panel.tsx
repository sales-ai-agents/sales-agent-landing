import Image from "next/image";
import Link from "next/link";

import { ChartColumn, Clock, Phone, ShieldCheck, type LucideIcon } from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: readonly Benefit[] = [
  {
    icon: Phone,
    title: "ШІ-агенти для дзвінків",
    description: "Приймають, обробляють та телефонують клієнтам 24/7",
  },
  {
    icon: ChartColumn,
    title: "Більше продажів",
    description: "ШІ-агенти кваліфікують ліди та підвищують конверсію",
  },
  {
    icon: Clock,
    title: "Економія часу",
    description: "Автоматизуйте рутинні дзвінки та звільніть час для важливих задач",
  },
  {
    icon: ShieldCheck,
    title: "Безпека даних",
    description: "Ваші дані захищені за найвищими стандартами",
  },
];

type AuthPanelVariant = "sign-in" | "sign-up" | "forgot-password" | "email-confirm" | "verified";

interface PanelCopy {
  heading: React.ReactNode;
  text: string;
}

const PANEL_COPY: Record<AuthPanelVariant, PanelCopy> = {
  "sign-in": {
    heading: (
      <>
        Розумні <em>ШІ-агенти</em>
        <br />
        для ваших дзвінків
      </>
    ),
    text: "Почніть працювати з ШІ-агентами для дзвінків та автоматизуйте рутинні процеси вже сьогодні",
  },
  "sign-up": {
    heading: (
      <>
        Створіть акаунт
        <br />
        <em>за 30 секунд</em>
      </>
    ),
    text: "Почніть працювати з ШІ-агентами для дзвінків та автоматизуйте рутинні процеси вже сьогодні",
  },
  "forgot-password": {
    heading: "Відновлення пароля",
    text: "Ми допоможемо вам повернути доступ. Введіть електронну пошту, і ми надішлемо код для відновлення пароля",
  },
  verified: {
    heading: (
      <>
        Пошту
        <br />
        <em>підтверджено</em>
      </>
    ),
    text: "Ваш акаунт готовий. Створіть першого ШІ-агента за кілька хвилин",
  },
  "email-confirm": {
    heading: "Підтвердіть свою пошту",
    text: "Ваш акаунт майже готовий. Створіть першого ШІ-агента за кілька хвилин",
  },
};

interface AuthMarketingPanelProps {
  variant?: AuthPanelVariant;
}

export function AuthMarketingPanel({ variant = "sign-in" }: AuthMarketingPanelProps) {
  const { heading, text } = PANEL_COPY[variant];
  return (
    <aside className="from-card via-primary/5 to-primary/20 hidden flex-col gap-6 bg-linear-to-br p-10 lg:flex">
      <Link href="/" prefetch={false} className="flex items-center gap-3" aria-label="Calls4U">
        <Image src="/image/Logo.svg" alt="Calls4U" width={34} height={34} />
        <Image src="/image/calls4u.svg" alt="calls4u" width={90} height={21} />
      </Link>
      <h2 className="font-heading [&_em]:text-primary text-4xl [&_em]:not-italic">{heading}</h2>
      <p className="text-muted-foreground">{text}</p>
      <ul className="flex flex-col gap-4">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="bg-card text-primary grid size-10 shrink-0 place-items-center rounded-full shadow-xs">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <b className="text-sm">{title}</b>
              <small className="text-muted-foreground">{description}</small>
            </span>
          </li>
        ))}
      </ul>
      <span className="text-muted-foreground mt-auto inline-flex items-center gap-2 text-sm">
        <ShieldCheck className="size-4" aria-hidden="true" />
        Безпечно та конфіденційно
      </span>
    </aside>
  );
}

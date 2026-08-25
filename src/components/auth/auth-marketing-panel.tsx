import Image from "next/image";
import { Phone, TrendingUp, Clock, ShieldCheck } from "lucide-react";

const BENEFITS = [
  {
    icon: Phone,
    title: "ШІ-агенти для дзвінків",
    description: "Приймають, обробляють та записують дзвінки 24/7",
  },
  {
    icon: TrendingUp,
    title: "Більше продажів",
    description: "ШІ-агенти кваліфікують ліди та підвищують конверсію",
  },
  {
    icon: Clock,
    title: "Економія часу",
    description: "Автоматизація рутини та звільнення часу для важливих завдань",
  },
  {
    icon: ShieldCheck,
    title: "Безпека даних",
    description: "Ваші дані захищені за найвищими стандартами",
  },
] as const;

interface AuthMarketingPanelProps {
  variant?: "sign-in" | "sign-up";
}

export function AuthMarketingPanel({ variant = "sign-in" }: AuthMarketingPanelProps) {
  return (
    <div className="bg-primary/5 relative flex w-full flex-col items-center justify-center overflow-hidden p-8 xl:p-12">
      <div className="flex items-center gap-3">
        <Image
          src="/image/Logo.svg"
          alt="Calls4u.ai logo"
          width={48}
          height={48}
          className="h-12 w-12"
        />
        <Image
          src="/image/calls4u.svg"
          alt="Calls4u"
          width={120}
          height={32}
          className="h-8 w-auto"
        />
      </div>

      <div className="mt-10">
        {variant === "sign-in" ? (
          <h1 className="font-display text-2xl xl:text-3xl">
            Розумні <span className="text-primary">ШІ-агенти</span>
            <br />
            для ваших дзвінків
          </h1>
        ) : (
          <h1 className="font-display text-2xl xl:text-3xl">
            Створіть акаунт
            <br />
            <span className="text-primary">за 30 секунд</span>
          </h1>
        )}
        <p className="text-muted-foreground mt-3 max-w-sm text-sm">
          Почніть працювати з ШІ-агентами для дзвінків та автоматизуйте рутинні процеси вже сьогодні
        </p>

        <div className="border-border/50 mt-8 max-w-xs rounded-lg border bg-white px-5 py-9">
          <div className="space-y-3">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded">
                  <Icon className="text-primary h-5 w-5" />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-normal">{title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 flex items-center gap-2">
        <ShieldCheck className="text-primary h-4 w-4" />
        <span className="text-muted-foreground text-sm">Безпечно та конфіденційно</span>
      </div>

      <div className="pointer-events-none absolute -bottom-40 -left-25 h-96 w-96">
        <Image
          src="/image/rocket.png"
          alt="rocket"
          fill
          className="rotate-300 object-contain opacity-90"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

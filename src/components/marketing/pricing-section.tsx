import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal, StaggerReveal } from "@/components/marketing/scroll-reveal";
import { PricingCardCta } from "@/components/marketing/pricing-card-cta";
import type { PricingPlan } from "@marketing/types";
import { PRICING_PLANS } from "@marketing/data";

export function PricingSection() {
  return (
    <section id="tariffs" className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" distance={30}>
          <h2 className="mx-auto mb-6 max-w-3xl text-center text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">Оберіть тариф під </span> <br />
            <span className="text-primary">кількість ваших дзвінків</span>
          </h2>

          <p className="text-foreground mx-auto mb-25 max-w-2xl text-center text-base md:text-lg">
            У кожному тарифі — <span className="font-semibold">готові хвилини для розмов</span>,
            доступ до ШІ-агентів і журналу дзвінків. Почніть із безкоштовного тестового дзвінка.
          </p>
        </ScrollReveal>

        <div className="relative">
          <Image
            src="/image/tariffs.svg"
            alt=""
            width={1000}
            height={200}
            aria-hidden="true"
            className="absolute -top-10 left-1/2 -z-10 -translate-x-1/2 sm:-top-22"
            style={{ width: "auto", height: "auto" }}
          />

          <StaggerReveal
            staggerDelay={0.12}
            direction="up"
            distance={35}
            className="relative grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-5"
          >
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  readonly plan: PricingPlan;
}

function PricingCard({ plan }: PricingCardProps) {
  const isFeatured = plan.featured === true;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-6 rounded-3xl border p-8 shadow-xl backdrop-blur-xs",
        isFeatured
          ? "border-primary bg-primary/85 shadow-primary/30 text-white md:z-10 md:-mt-5"
          : "border-border bg-card-glass text-foreground"
      )}
    >
      <header className="flex flex-col items-center gap-3 text-center">
        <h3
          className={cn(
            "font-display text-4xl uppercase",
            isFeatured ? "text-white" : "text-foreground"
          )}
        >
          {plan.name}
        </h3>

        {plan.badge ? (
          <span className="border-border/60 rounded-full border bg-transparent px-4 py-1 text-sm font-light text-white italic">
            {plan.badge}
          </span>
        ) : (
          <p className={cn("text-base italic", isFeatured ? "text-white/80" : "text-foreground")}>
            {plan.tagline}
          </p>
        )}
      </header>

      <div className="flex items-baseline justify-center gap-2">
        <span className="text-5xl font-semibold">{plan.price}</span>
        <span
          className={cn("text-4xl font-medium", isFeatured ? "text-white/60" : "text-gray-400")}
        >
          {plan.period}
        </span>
      </div>

      <p className={cn("text-center text-base", isFeatured ? "text-white" : "text-foreground")}>
        {plan.description}
      </p>

      <ul className="flex flex-1 flex-col gap-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-4 text-base">
            <Check
              className={cn(
                "mt-0.5 size-5 shrink-0",
                isFeatured ? "text-white" : "text-foreground"
              )}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <PricingCardCta
        planId={plan.id}
        href={plan.ctaHref}
        label={plan.ctaLabel}
        featured={isFeatured}
      />
    </article>
  );
}

import Image from "next/image";
import { cn } from "@/lib/utils";
import { TRUST_ITEMS } from "@/lib/marketing-data";
import { COMPLIANCE_INDICATORS } from "@/lib/content";
import { ScrollReveal, StaggerReveal } from "@/components/marketing/scroll-reveal";
import type { IconBadge } from "@/types";

function ComplianceIndicator({ icon: Icon, label }: IconBadge) {
  return (
    <div className="flex shrink-0 items-center gap-2 md:gap-3">
      <Icon className="text-primary size-4 md:size-5" aria-hidden="true" />
      <span className="text-foreground text-sm font-medium whitespace-nowrap md:text-base">
        {label}
      </span>
    </div>
  );
}

export function TrustSection() {
  return (
    <section className="relative py-20">
      <div
        className="bg-primary/50 pointer-events-none absolute -top-40 -left-20 -z-20 hidden size-72 rounded-full blur-2xl md:block"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" distance={30}>
          <div className="mb-4 text-center">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
              <span className="text-foreground">Безпека і </span>
              <span className="text-primary">контроль</span>
            </h2>
          </div>

          <p className="text-foreground mx-auto mb-14 max-w-lg text-center text-base md:text-lg">
            Дані клієнтів залишаються у вашому кабінеті. Ви керуєте записами, доступами і запуском
            дзвінків.
          </p>
        </ScrollReveal>

        <div className="relative">
          <StaggerReveal
            staggerDelay={0.15}
            direction="up"
            distance={30}
            className="hidden md:grid md:grid-cols-4 md:gap-8"
          >
            {TRUST_ITEMS.map((item, index) => (
              <div key={item.title} className="relative flex flex-col items-start">
                {index < TRUST_ITEMS.length - 1 && (
                  <div
                    className="absolute top-8 -right-10 left-16 h-px bg-gray-600"
                    aria-hidden="true"
                  />
                )}
                <div className="bg-primary relative z-10 mb-6 flex size-16 items-center justify-center rounded-full">
                  <Image src={item.icon} alt="" width={32} height={32} aria-hidden="true" />
                </div>
                <h3 className="text-foreground font-body mb-2 text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-foreground text-base">{item.description}</p>
              </div>
            ))}
          </StaggerReveal>

          <div className="flex flex-col gap-4 md:hidden">
            {TRUST_ITEMS.map((item, index) => (
              <ScrollReveal
                key={item.title}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 0.1}
                distance={25}
              >
                <div
                  className={cn(
                    "flex flex-col",
                    index % 2 === 0 ? "items-start" : "items-end text-left"
                  )}
                >
                  <div className="flex max-w-2xs flex-col gap-2">
                    <div className="bg-primary flex size-14 items-center justify-center rounded-full">
                      <Image src={item.icon} alt="" width={28} height={28} aria-hidden="true" />
                    </div>
                    <h3 className="text-foreground font-body text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-foreground max-w-xs text-base">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="shadow-primary/30 -mx-6 mt-12 w-screen overflow-hidden bg-white shadow-md md:mt-20 md:ml-[calc(50%-50vw)] md:bg-transparent md:shadow-none">
          <div className="motion-safe:animate-marquee hover:paused flex w-max gap-6 py-2 md:gap-24 md:py-0">
            {[...Array(4)].map((_, i) =>
              COMPLIANCE_INDICATORS.map((indicator) => (
                <ComplianceIndicator key={`${i}-${indicator.label}`} {...indicator} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

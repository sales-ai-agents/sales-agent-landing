import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Scenario, ScenarioDetail } from "@/types";
import { scenarios } from "@/lib/mock-data";

export function ScenariosSection() {
  return (
    <section id="features" className="bg-slate-50 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl md:text-left md:text-5xl">
          <span className="text-primary">Дзвінки,</span>{" "}
          <span className="text-foreground">які агент</span> <br />
          <span className="text-foreground">може забрати одразу</span>
        </h2>

        <p className="text-foreground mb-12 max-w-lg text-center text-base tracking-wide md:text-left md:text-lg">
          Не треба писати сценарій з нуля. Виберіть тип дзвінка, адаптуйте кілька фраз під бізнес і
          запускайте тест.
        </p>

        <div className="mb-12 grid auto-rows-[1fr] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.title}
              scenario={scenario}
              alignRight={index % 2 !== 0}
              isLast={index === scenarios.length - 1}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <p className="text-muted-foreground w-full max-w-sm text-center text-base md:text-start">
            Почніть з готового сценарію, фрази <br />
            <span className="font-medium">можна змінити під ваш бізнес.</span>
          </p>
          <a
            href="#builder"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary hover:bg-primary/90 font-body h-12 rounded-3xl px-8 font-normal text-white sm:w-auto sm:text-lg"
            )}
          >
            Вибрати сценарій і запустити тест
            <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

interface ScenarioCardProps {
  readonly scenario: Scenario;
  readonly alignRight?: boolean;
  readonly isLast?: boolean;
}

function ScenarioCard({ scenario, alignRight, isLast }: ScenarioCardProps) {
  const Icon = scenario.icon;

  return (
    <div
      className={`relative min-h-50 pt-4 sm:pl-4 ${alignRight ? "pr-20 sm:pr-0" : "pl-20 sm:pl-0"}`}
    >
      {!isLast && (
        <Image
          src={alignRight ? "/image/scenarios-arrow-right.svg" : "/image/scenarios-arrow-left.svg"}
          alt=""
          width={alignRight ? 80 : 95}
          height={90}
          aria-hidden="true"
          className={`absolute top-2/3 sm:hidden ${alignRight ? "right-0" : "left-0"}`}
        />
      )}

      <div
        className={`bg-primary shadow-primary/30 absolute top-0 z-10 flex size-14 items-center justify-center rounded-full shadow-lg sm:left-0 ${alignRight ? "right-15 sm:right-auto" : "left-15"}`}
        aria-hidden="true"
      >
        {Icon && <Icon className="size-6 text-white" />}
      </div>

      <div
        className={`border-border bg-card-glass h-full rounded-2xl border py-5 backdrop-blur-sm sm:pr-6 sm:pl-14 ${alignRight ? "pr-14 pl-6 sm:pr-6 sm:pl-14" : "pr-6 pl-14"}`}
      >
        <h3 className="text-foreground mb-3 text-xl font-medium">{scenario.title}</h3>

        <div className="space-y-1">
          {scenario.details.map((detail: ScenarioDetail) => (
            <p key={detail.label} className="text-foreground text-sm">
              <span className="font-medium">{detail.label}</span>{" "}
              <span className="font-light">{detail.value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

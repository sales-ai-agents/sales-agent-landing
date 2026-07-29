import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Scenario, ScenarioDetail } from "@/types";
import { scenarios } from "@/lib/mock-data";

export function ScenariosSection() {
  return (
    <section id="features" className="bg-slate-50 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
          <span className="text-primary">Дзвінки,</span>{" "}
          <span className="text-foreground">які агент</span> <br />
          <span className="text-foreground">може забрати одразу</span>
        </h2>

        <p className="text-foreground mb-12 max-w-lg text-base tracking-wide md:text-lg">
          Не треба писати сценарій з нуля. Виберіть тип дзвінка, адаптуйте кілька фраз під бізнес і
          запускайте тест.
        </p>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <ScenarioCard key={scenario.title} scenario={scenario} alignRight={index % 2 !== 0} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-end md:gap-10">
          <div className="flex w-full flex-col gap-4 md:w-fit">
            <p className="text-muted-foreground max-w-sm text-center text-base md:text-start">
              Почніть з готового сценарію, фрази <br />
              <span className="font-medium">можна змінити під ваш бізнес.</span>
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 font-body h-12 w-full rounded-3xl px-8 text-lg font-normal text-white sm:w-auto"
            >
              <Link href="#builder">
                Вибрати сценарій і запустити тест
                <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="border-foreground text-foreground hover:bg-foreground/5 font-body h-12 w-full rounded-3xl border bg-transparent px-8 text-lg font-normal sm:w-auto"
          >
            <Link href="#builder">
              Створити власний сценарій
              <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

interface ScenarioCardProps {
  readonly scenario: Scenario;
  readonly alignRight?: boolean;
}

function ScenarioCard({ scenario, alignRight }: ScenarioCardProps) {
  const Icon = scenario.icon;

  return (
    <div className={`relative pt-4 sm:pl-4 ${alignRight ? "pr-20 sm:pr-0" : "pl-20 sm:pl-0"}`}>
      <div
        className={`bg-primary shadow-primary/30 absolute top-0 z-10 flex size-14 items-center justify-center rounded-full shadow-lg sm:left-0 ${alignRight ? "right-15 sm:right-auto" : "left-15"}`}
        aria-hidden="true"
      >
        {Icon && <Icon className="size-6 text-white" />}
      </div>

      <div
        className={`border-border bg-card-glass rounded-2xl border py-5 backdrop-blur-sm sm:pr-6 sm:pl-14 ${alignRight ? "pr-14 pl-6 sm:pr-6 sm:pl-14" : "pr-6 pl-14"}`}
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

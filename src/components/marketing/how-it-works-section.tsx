import Image from "next/image";
import { ONBOARDING_STEPS } from "@/lib/marketing-data";
import { cn } from "@/lib/utils";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl text-center md:text-left">
          <h2 className="font-display mb-4 text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">До першого тестового дзвінка - </span>
            <span className="text-primary">4 кроки</span>
          </h2>
          <p className="text-foreground mx-auto max-w-lg text-lg md:mx-0">
            Оберіть сценарій, налаштуйте голос, додайте контакти і перевірте дзвінок на собі перед
            запуском.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-4">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "flex items-center gap-3",
                index % 2 === 0 ? "pr-20 sm:pr-0" : "pl-20 sm:pl-0"
              )}
            >
              <div className="flex flex-col">
                <h3 className="text-foreground font-body text-md mb-6 font-semibold md:text-lg">
                  {step.title}
                </h3>

                <div className="relative">
                  <span
                    className="font-gilroy pointer-events-none absolute -top-10 left-0 text-8xl leading-tight font-semibold tracking-wide text-transparent uppercase [-webkit-text-stroke-color:#E6E6E6] [-webkit-text-stroke-width:2px]"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  <div className="border-border bg-card-glass relative flex flex-col justify-between rounded-2xl border pt-4 pr-2 pl-4 opacity-80 shadow-md backdrop-blur-sm">
                    <p className="text-foreground text-base">{step.description}</p>
                    <div className="flex justify-end">
                      <span className="font-gilroy text-primary text-2xl font-semibold">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {index < ONBOARDING_STEPS.length - 1 && (
                <div className="shrink-0 self-end" aria-hidden="true">
                  <Image
                    src="/image/how-arrow.svg"
                    alt=""
                    width={30}
                    height={40}
                    aria-hidden="true"
                    className="pointer-events-none"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollReveal, ScaleReveal } from "@/components/marketing/scroll-reveal";

interface CalculationResult {
  hoursPerMonth: string;
  costPerMonth: string;
}

export function CalculatorSection() {
  const [callsPerMonth, setCallsPerMonth] = useState(1000);
  const [avgDuration, setAvgDuration] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(800);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = useCallback((): void => {
    const rawHours = (callsPerMonth * avgDuration) / 60;
    const hoursPerMonth = (Math.floor(rawHours * 10) / 10).toFixed(1);
    const costPerMonth = Math.round(parseFloat(hoursPerMonth) * hourlyRate).toLocaleString("uk-UA");

    setResult({ hoursPerMonth, costPerMonth });
  }, [callsPerMonth, avgDuration, hourlyRate]);

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" distance={30}>
          <p className="text-muted-foreground mb-4 text-center text-base font-light tracking-wide uppercase">
            Порахуємо разом
          </p>

          <h2 className="font-display mx-auto mb-6 max-w-3xl text-center text-3xl sm:text-4xl md:text-5xl">
            <span className="text-foreground">Скільки </span>
            <span className="text-primary">часу забирають </span>
            <span className="text-foreground">рутинні </span>
            <span className="text-primary">дзвінки</span>
          </h2>

          <p className="text-foreground mx-auto mb-12 max-w-lg text-center text-base md:text-lg">
            Вкажіть кількість дзвінків, середню тривалість і вартість години адміністратора.{" "}
            <span className="font-medium">Калькулятор покаже</span>, скільки часу йде на повторювані
            розмови.
          </p>
        </ScrollReveal>

        <ScaleReveal delay={0.15} duration={0.7}>
          <div className="border-border bg-card-glass mx-auto w-full max-w-4xl rounded-2xl border shadow-md backdrop-blur-sm">
            <div className="px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8 md:px-10">
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between md:mb-4">
                  <span className="text-foreground text-sm md:text-lg">Дзвінків на місяць</span>
                  <span className="text-foreground text-sm md:text-lg">{callsPerMonth}</span>
                </div>
                <Slider
                  value={callsPerMonth}
                  onValueChange={setCallsPerMonth}
                  min={100}
                  max={2000}
                  aria-label="Кількість дзвінків на місяць"
                />
              </div>

              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between md:mb-4">
                  <span className="text-foreground text-sm md:text-lg">
                    Середня тривалість дзвінка, хв
                  </span>
                  <span className="text-foreground text-sm md:text-lg">{avgDuration}</span>
                </div>
                <Slider
                  value={avgDuration}
                  onValueChange={setAvgDuration}
                  min={1}
                  max={80}
                  aria-label="Середня тривалість дзвінка в хвилинах"
                />
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between md:mb-4">
                  <span className="text-foreground text-sm md:text-lg">
                    Вартість години менеджера, ₴
                  </span>
                  <span className="text-foreground text-sm md:text-lg">{hourlyRate}</span>
                </div>
                <Slider
                  value={hourlyRate}
                  onValueChange={setHourlyRate}
                  min={50}
                  max={1000}
                  aria-label="Ставка менеджера в гривнях за годину"
                />
              </div>

              {result && (
                <div
                  className="bg-primary mb-8 w-full rounded-xl px-4 py-6 text-center"
                  role="region"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label="Результати калькулятора"
                >
                  <p className="text-3xl font-bold text-white md:text-4xl">
                    {result.hoursPerMonth}
                  </p>
                  <p className="mt-2 text-base text-white/80">год/міс йде на рутинні дзвінки</p>
                  <p className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                    ≈ {result.costPerMonth} ₴/місяць
                  </p>
                  <p className="mt-2 text-base text-white/80">орієнтовна вартість цього часу</p>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleCalculate}
                  className="bg-primary shadow-primary/30 hover:bg-primary/90 font-body h-12 w-full max-w-xl rounded-2xl px-12 text-lg font-medium text-white shadow-lg sm:h-14"
                >
                  Порахувати для мого бізнесу
                </Button>
              </div>
            </div>
          </div>
        </ScaleReveal>
      </div>
    </section>
  );
}

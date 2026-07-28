"use client";

import { useState } from "react";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { CalculatorInputs } from "@/types";
import { calcHoursPerDay, calcCostPerDay } from "@/lib/utils";

export function CalculatorSection() {
  const [callsPerMonth, setCallsPerMonth] = useState(2000);
  const [avgDuration, setAvgDuration] = useState(80);
  const [hourlyRate, setHourlyRate] = useState(1000);

  const rawHours = callsPerMonth * avgDuration / 60;
  const hoursPerMonth = (Math.floor(rawHours * 10) / 10).toFixed(1);
  const costPerMonth = Math.round(
    parseFloat(hoursPerMonth) * hourlyRate
  ).toLocaleString("uk-UA");

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Eyebrow */}
        <p className="mb-4 text-center text-base font-light uppercase tracking-wide text-black/60">
          Порахуємо разом
        </p>

        {/* Heading */}
        <h2 className="mx-auto mb-6 max-w-2xl text-center font-display text-3xl sm:text-4xl md:text-5xl">
          <span className="text-black">Скільки </span>
          <span className="text-primary">часу забирають </span>
          <span className="text-black">рутинні </span>
          <span className="text-primary">дзвінки</span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-lg text-center text-base text-black md:text-lg">
          Вкажіть кількість дзвінків, середню тривалість і вартість години
          адміністратора.{" "}
          <span className="font-medium">Калькулятор покаже</span>, скільки
          часу йде на повторювані розмови.
        </p>

        {/* Calculator Card */}
        <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card-glass backdrop-blur-sm">
          <div className="px-6 pb-8 pt-12 md:px-14">
            {/* Slider: Calls per month */}
            <div className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <span
                  id="calls-per-month-label"
                  className="text-base text-black md:text-lg"
                >
                  Дзвінків на місяць
                </span>
                <span className="text-base text-black md:text-lg">
                  {callsPerMonth}
                </span>
              </div>
              <Slider
                value={callsPerMonth}
                onValueChange={setCallsPerMonth}
                min={100}
                max={2000}
                aria-label="Кількість дзвінків на місяць"
                aria-labelledby="calls-per-month-label"
              />
            </div>

            {/* Slider: Avg call duration */}
            <div className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <span
                  id="avg-duration-label"
                  className="text-base text-black md:text-lg"
                >
                  Середня тривалість дзвінка, хв
                </span>
                <span className="text-base text-black md:text-lg">
                  {avgDuration}
                </span>
              </div>
              <Slider
                value={avgDuration}
                onValueChange={setAvgDuration}
                min={1}
                max={80}
                aria-label="Середня тривалість дзвінка в хвилинах"
                aria-labelledby="avg-duration-label"
              />
            </div>

            {/* Slider: Hourly rate */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <span
                  id="hourly-rate-label"
                  className="text-base text-black md:text-lg"
                >
                  Вартість години менеджера, ₴
                </span>
                <span className="text-base text-black md:text-lg">
                  {hourlyRate}
                </span>
              </div>
              <Slider
                value={hourlyRate}
                onValueChange={setHourlyRate}
                min={50}
                max={1000}
                aria-label="Ставка менеджера в гривнях за годину"
                aria-labelledby="hourly-rate-label"
              />
            </div>

            {/* Result Card */}
            <div
              className="w-full rounded-xl bg-primary px-6 py-8 text-center"
              role="region"
              aria-live="polite"
              aria-atomic="true"
              aria-label="Результати калькулятора"
            >
              <p className="text-3xl font-bold text-white md:text-4xl">
                {hoursPerMonth}
              </p>
              <p className="mt-2 text-base text-white/80">
                год/міс йде на рутинні дзвінки
              </p>
              <p className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                ≈ {costPerMonth} ₴/місяць
              </p>
              <p className="mt-2 text-base text-white/80">
                орієнтовна вартість цього часу
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="h-14 rounded-2xl bg-primary px-12 text-lg font-medium text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
          >
            <Link href="/sign-up">Порахувати для мого бізнесу</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function CalculatorSection() {
  const [callsPerDay, setCallsPerDay] = useState(40);
  const [avgDuration, setAvgDuration] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(150);

  const hoursPerDay = Number(((callsPerDay * avgDuration) / 60).toFixed(1));
  const costPerDay = Math.round(hoursPerDay * hourlyRate);

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Eyebrow */}
        <p className="text-text-secondary mb-4 text-center text-sm font-light uppercase">
          Порахуємо разом
        </p>

        {/* Heading */}
        <h2 className="font-display mx-auto mb-6 max-w-2xl text-center text-4xl tracking-tight md:text-5xl">
          Скільки <span className="text-primary">часу забирають</span> рутинні{" "}
          <span className="text-primary">дзвінки</span>
        </h2>

        {/* Subtitle */}
        <p className="text-text-secondary mx-auto mb-12 max-w-lg text-center text-lg">
          Вкажіть кількість дзвінків, середню тривалість і вартість години адміністратора.{" "}
          <span className="font-medium">Калькулятор покаже</span>, скільки часу йде на повторювані
          розмови.
        </p>

        {/* Calculator Card */}
        <div className="rounded-card border-border bg-card-glass backdrop-blur-card mx-auto w-full max-w-4xl overflow-hidden border">
          <div className="px-6 pt-16 pb-7 md:px-14">
            {/* Slider: Calls per day */}
            <div className="mb-16">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-text-primary text-lg">Дзвінків на день</label>
                <span className="text-text-primary text-lg">{callsPerDay}</span>
              </div>
              <Slider
                value={callsPerDay}
                onValueChange={setCallsPerDay}
                min={5}
                max={200}
                aria-label="Кількість дзвінків на день"
              />
            </div>

            {/* Slider: Avg call duration */}
            <div className="mb-16">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-text-primary text-lg">Середня тривалість дзвінка, хв</label>
                <span className="text-text-primary text-lg">{avgDuration}</span>
              </div>
              <Slider
                value={avgDuration}
                onValueChange={setAvgDuration}
                min={1}
                max={15}
                aria-label="Середня тривалість дзвінка в хвилинах"
              />
            </div>

            {/* Slider: Hourly rate */}
            <div className="mb-7">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-text-primary text-lg">Вартість години менеджера, ₴</label>
                <span className="text-text-primary text-lg">{hourlyRate}</span>
              </div>
              <Slider
                value={hourlyRate}
                onValueChange={setHourlyRate}
                min={50}
                max={500}
                aria-label="Ставка менеджера в гривнях за годину"
              />
            </div>

            {/* Result Card */}
            <div
              className="rounded-inner-card bg-primary mx-auto w-full max-w-3xl px-6 py-8 text-center"
              role="region"
              aria-live="polite"
              aria-atomic="true"
              aria-label="Результати калькулятора"
            >
              <p className="text-3xl font-semibold text-white">{hoursPerDay}</p>
              <p className="mt-2 text-base text-white/80">год/день йде на рутинні дзвінки</p>
              <p className="mt-4 text-3xl font-semibold text-white">≈ {costPerDay} ₴/день</p>
              <p className="mt-2 text-base text-white/80">орієнтовна вартість цього часу</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

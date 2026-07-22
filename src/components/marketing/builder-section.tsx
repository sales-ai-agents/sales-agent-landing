"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const voiceOptions = ["Жіночий", "Чоловічий"] as const;

export function BuilderSection() {
  const [name, setName] = useState("Марія");
  const [voice, setVoice] = useState<string>("Жіночий");
  const [scenario, setScenario] = useState(
    "Агент уточнить маршрут, тип вантажу, дату, контактну особу та передасть заявку менеджеру"
  );

  const scenarioOptions = [
    "Агент уточнить маршрут, тип вантажу, дату, контактну особу та передасть заявку менеджеру",
    "Агент підтвердить адресу, час отримання, контактний номер і зафіксує результат дзвінка",
    "Агент нагадає про запис, запитає підтвердження та передасть відповідь менеджеру",
  ];

  return (
    <section className="relative py-20">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/image/builder-line.svg"
          alt=""
          width={1400}
          height={600}
          className="absolute top-1/2 left-0 h-auto w-full -translate-y-1/2 opacity-60"
        />
        <Image
          src="/image/builder-circle.jpg"
          alt=""
          width={400}
          height={400}
          className="absolute -top-20 -right-50 size-96 rounded-full opacity-40 blur-sm"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left text column */}
          <div className="max-w-md text-center lg:text-left">
            <h2 className="font-display mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Конструктор агента <span className="text-primary">без коду</span>
            </h2>

            <p className="text-text-secondary mb-10 text-lg">
              Дайте агенту імʼя, оберіть голос і опишіть задачу простими словами. Перед дзвінками
              клієнтам сценарій можна перевірити на собі.
            </p>

            {/* Checklist — using builder-checklist.svg */}
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <Image
                  src="/image/builder-checklist.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className="text-text-secondary text-lg">Голос: жіночий або чоловічий</span>
              </li>
              <li className="flex items-center gap-4">
                <Image
                  src="/image/builder-checklist.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className="text-text-secondary text-lg">Інструкція звичайною мовою</span>
              </li>
              <li className="flex items-center gap-4">
                <Image
                  src="/image/builder-checklist.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className="text-text-secondary text-lg">Тестовий дзвінок перед запуском</span>
              </li>
            </ul>
          </div>

          {/* Right form card — interactive, glassmorphism like hero card */}
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="rounded-card border-border bg-card-glass relative overflow-hidden border p-8 backdrop-blur-2xl">
              {/* Blurred border effect — same as hero card */}
              <div className="rounded-card border-border/20 pointer-events-none absolute inset-0 border-4 blur-sm" />
              {/* Card title */}
              <h3 className="text-text-primary mb-6 text-base font-semibold">
                Налаштування агента
              </h3>

              {/* Agent Name Field */}
              <div className="mb-6">
                <label htmlFor="agent-name" className="text-text-primary mb-2 block text-sm">
                  Імʼя агента
                </label>
                <input
                  id="agent-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-input border-border text-text-primary focus:ring-primary flex h-10 w-full border bg-white px-4 text-base focus:ring-2 focus:outline-none"
                />
              </div>

              {/* Voice Selection */}
              <div className="mb-6">
                <p className="text-text-primary mb-2 text-sm">Голос</p>
                <div className="flex gap-3">
                  {voiceOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setVoice(option)}
                      className={cn(
                        "rounded-input border-border relative flex h-10 items-center justify-center border px-8 text-base transition-all",
                        voice === option
                          ? "text-text-primary shadow-primary/20 bg-white shadow-md"
                          : "text-text-secondary hover:bg-muted bg-white"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenario Selection */}
              <div className="mb-6">
                <label htmlFor="agent-scenario" className="text-text-primary mb-2 block text-sm">
                  Вибрати сценарій
                </label>
                <select
                  id="agent-scenario"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="rounded-input border-border text-text-primary focus:ring-primary flex h-auto w-full appearance-none border bg-white px-4 py-3 text-base focus:ring-2 focus:outline-none"
                >
                  {scenarioOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <p className="text-text-secondary mt-2 text-xs">
                  Агент підтвердить адресу, час отримання, контактний номер і зафіксує результат
                  дзвінка
                </p>
              </div>

              {/* Test Call Button */}
              <button
                type="button"
                className="rounded-badge bg-primary hover:bg-primary-hover flex h-12 w-full items-center justify-center text-base font-medium text-white transition-colors"
              >
                Перевірити дзвінок
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

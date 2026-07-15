import { Check } from "lucide-react";

export function BuilderSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left text column */}
          <div className="max-w-md">
            <h2 className="mb-6 text-4xl font-light leading-tight tracking-tight md:text-5xl">
              Конструктор агента{" "}
              <span className="font-medium">без коду</span>
            </h2>

            <p className="mb-10 text-lg leading-snug tracking-wide text-text-secondary">
              Дайте агенту імʼя, оберіть голос і опишіть задачу простими словами. Перед дзвінками
              клієнтам сценарій можна перевірити на собі.
            </p>

            {/* Checklist */}
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="size-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-lg tracking-wide text-text-secondary">
                  Голос: жіночий або чоловічий
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="size-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-lg tracking-wide text-text-secondary">
                  Інструкція звичайною мовою
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="size-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-lg tracking-wide text-text-secondary">
                  Тестовий дзвінок перед запуском
                </span>
              </li>
            </ul>
          </div>

          {/* Right form card - static mockup */}
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="rounded-2xl border border-border bg-card-glass p-8 shadow-elevated backdrop-blur-sm">
              {/* Card title */}
              <h3 className="mb-6 text-lg font-semibold tracking-wide text-text-primary">
                Налаштування агента
              </h3>

              {/* Agent Name Field */}
              <div className="mb-6">
                <p className="mb-2 text-lg tracking-wide text-text-primary">
                  Імʼя агента
                </p>
                <div className="flex h-9 items-center rounded-lg border border-border bg-white px-4 text-lg tracking-wide text-text-secondary">
                  Марія
                </div>
              </div>

              {/* Voice Selection */}
              <div className="mb-6">
                <p className="mb-2 text-lg tracking-wide text-text-primary">
                  Голос
                </p>
                <div className="flex gap-4">
                  {/* Selected toggle - Жіночий */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" aria-hidden="true" />
                    <div className="relative flex h-9 items-center justify-center rounded-lg border border-border bg-white px-10 text-lg tracking-wide text-text-secondary">
                      Жіночий
                    </div>
                  </div>
                  {/* Unselected toggle - Чоловічий */}
                  <div className="flex h-9 items-center justify-center rounded-lg border border-border bg-white px-10 text-lg tracking-wide text-text-secondary">
                    Чоловічий
                  </div>
                </div>
              </div>

              {/* Instructions Textarea */}
              <div className="mb-6">
                <p className="mb-2 text-lg tracking-wide text-text-primary">
                  Інструкція
                </p>
                <div className="flex min-h-28 items-start rounded-lg border border-border bg-white px-6 py-3 text-lg leading-snug tracking-wide text-text-secondary">
                  Ти адміністратор стоматології &quot;Дентал&quot;. Телефонуй клієнтам напередодні
                  візиту, підтверджуй запис і пропонуй перенести час, якщо клієнту незручно.
                </div>
              </div>

              {/* Test Call Button */}
              <div className="flex h-9 w-full items-center justify-center rounded-lg bg-primary text-lg tracking-wide text-white">
                Перевірити дзвінок
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

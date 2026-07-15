import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Eyebrow */}
        <p className="mb-6 text-lg tracking-wide text-black">
          Голосовий <span className="font-semibold">ШІ-агент</span>
        </p>

        {/* Heading */}
        <h1 className="mb-8 text-4xl font-semibold uppercase leading-tight tracking-tight text-black md:text-5xl md:leading-tight">
          ШI-агент, який{" "}
          <span className="font-bold text-primary">телефонує клієнтам</span>{" "}
          і фіксує результат у <span className="font-bold">CRM</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed tracking-wide text-black">
          Підтверджує записи, нагадує про візити й уточнює деталі замовлень.
          Результат кожного дзвінка одразу потрапляє у CRM або кабінет.{" "}
          <span className="font-medium">
            Без програмістів і без додаткової людини
          </span>{" "}
          на рутинні дзвінки.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-lg text-white transition-colors hover:bg-primary-hover"
          >
            Створити агента
          </Link>

          <a
            href="#audio-demo"
            aria-label="Прослухати демо дзвінок"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card-glass px-6 text-lg text-black backdrop-blur-sm transition-colors hover:bg-card-glass-hover"
          >
            <svg
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="M10 6L0 12V0L10 6Z" fill="black" opacity="0.7" />
            </svg>
            Прослухати демо
          </a>
        </div>
      </div>
    </section>
  );
}

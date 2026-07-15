import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-primary py-16">
          {/* Content */}
          <div className="flex flex-col items-center px-8">
            {/* Heading */}
            <h2 className="text-center text-3xl font-medium leading-snug tracking-wide text-white md:text-4xl">
              Запустіть тестовий дзвінок на своєму сценарії
            </h2>

            {/* Subtitle */}
            <p className="mt-4 max-w-2xl text-center text-lg leading-snug tracking-wide text-white/80">
              Оберіть задачу, додайте коротку інструкцію і перевірте, як агент
              говорить з клієнтом до запуску на реальну базу
            </p>

            {/* Button Row */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-10">
              {/* Primary button: white bg, dark text */}
              <Link
                href="/sign-up"
                className="flex h-12 w-72 items-center justify-center rounded-full bg-white text-center text-lg font-normal text-black transition-opacity hover:opacity-90"
              >
                Запустити тестовий дзвінок
              </Link>

              {/* Ghost button: transparent bg, white border, white text */}
              <Link
                href="/sign-up"
                className="flex h-12 w-72 items-center justify-center rounded-full border border-white/50 bg-transparent text-center text-lg font-normal text-white transition-opacity hover:bg-white/10"
              >
                Запустити тестовий дзвінок
              </Link>
            </div>

            {/* Microtext */}
            <p className="mt-6 text-center text-xs leading-snug tracking-wide text-white/60">
              Для першого тесту достатньо одного сценарію і вашого номера
              телефону
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

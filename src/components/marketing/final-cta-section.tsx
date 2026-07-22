import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-card bg-primary mx-auto w-full max-w-7xl overflow-hidden py-16">
          {/* Content */}
          <div className="flex flex-col items-center px-8">
            {/* Heading */}
            <h2 className="font-heading text-center text-3xl font-medium text-white md:text-4xl">
              Запустіть тестовий дзвінок на своєму сценарії
            </h2>

            {/* Subtitle */}
            <p className="mt-4 max-w-2xl text-center text-lg text-white/80">
              Оберіть задачу, додайте коротку інструкцію і перевірте, як агент говорить з клієнтом
              до запуску на реальну базу
            </p>

            {/* Button Row */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-10">
              {/* Primary button: white bg, dark text */}
              <Link
                href="/sign-up"
                className="rounded-badge flex h-12 w-72 items-center justify-center bg-white text-center text-lg font-normal text-black transition-opacity hover:opacity-90"
              >
                Запустити тестовий дзвінок
              </Link>

              {/* Ghost button: transparent bg, white border, white text */}
              <Link
                href="/sign-up"
                className="rounded-badge flex h-12 w-72 items-center justify-center border border-white/50 bg-transparent text-center text-lg font-normal text-white transition-opacity hover:bg-white/10"
              >
                Запустити тестовий дзвінок
              </Link>
            </div>

            {/* Microtext */}
            <p className="mt-6 text-center text-xs text-white/60">
              Для першого тесту достатньо одного сценарію і вашого номера телефону
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

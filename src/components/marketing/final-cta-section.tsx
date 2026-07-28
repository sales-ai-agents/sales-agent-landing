import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-primary px-6 py-14 text-center text-white sm:px-12">
        {/* Heading */}
        <h2 className="mb-4 text-2xl font-normal tracking-wide sm:text-3xl md:text-4xl">
          Запустіть тестовий дзвінок на своєму сценарії
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-lg text-base text-white/90 md:text-lg">
          Оберіть задачу, додайте коротку інструкцію і перевірте, як агент
          говорить з клієнтом до запуску на реальну базу
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-2xl bg-white px-7 text-base text-black hover:bg-gray-100 sm:w-64"
          >
            <Link href="/sign-up">Запустити тестовий дзвінок</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 w-full rounded-2xl border-gray-300 bg-transparent px-7 text-base text-white hover:bg-white/10 sm:w-64"
          >
            <Link href="/sign-up">Забронювати демо</Link>
          </Button>
        </div>

        {/* Footer text */}
        <p className="mx-auto mt-6 max-w-md text-base text-white/80">
          Для першого тесту достатньо одного сценарію і вашого номера
          телефону
        </p>
      </div>
    </section>
  );
}

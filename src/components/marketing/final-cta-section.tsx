import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="bg-primary mx-auto max-w-5xl rounded-3xl px-6 py-14 text-center sm:px-12">
        <h2 className="font-display mb-4 text-2xl tracking-wide text-white sm:text-3xl md:text-4xl">
          Запустіть тестовий дзвінок на своєму сценарії
        </h2>

        <p className="mx-auto mb-8 max-w-lg text-base tracking-wide text-white/90 md:text-lg">
          Оберіть задачу, додайте коротку інструкцію і перевірте, як агент говорить з клієнтом до
          запуску на реальну базу
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="font-body h-12 w-full rounded-full bg-white px-7 text-lg font-normal text-black hover:bg-gray-100 sm:w-72"
          >
            <Link href="/sign-up">Запустити тестовий дзвінок</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-body h-12 w-full rounded-full border-white/30 bg-transparent px-7 text-lg font-normal text-white hover:bg-white/10 sm:w-72"
          >
            <Link href="/sign-up">Забронювати демо</Link>
          </Button>
        </div>

        <p className="mx-auto mt-6 max-w-md text-sm tracking-wide text-white/80">
          Для першого тесту достатньо одного сценарію і вашого номера телефону
        </p>
      </div>
    </section>
  );
}

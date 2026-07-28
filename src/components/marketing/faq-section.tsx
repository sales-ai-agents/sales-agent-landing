import { X } from "lucide-react";
import type { FaqEntry } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs: readonly FaqEntry[] = [
  {
    question: "З чого починається запуск агента?",
    answer:
      "Спочатку обираєте сценарій: підтвердження запису, нагадування, замовлення або заявка. Потім налаштовуєте голос, текст інструкції і перевіряєте дзвінок на собі.",
  },
  {
    question: "Чи можна змінити сценарій після запуску?",
    answer:
      "Так. Можна оновити фрази, правила розмови, час дзвінків і логіку передачі менеджеру. Сценарій не прибитий цвяхами, як старий прайс на ресепшені.",
  },
  {
    question: "Як зрозуміти, що агент відпрацював дзвінок добре?",
    answer:
      "Після кожного дзвінка в журналі видно статус, короткий підсумок, аудіозапис і результат синхронізації з CRM або таблицею.",
  },
  {
    question: "Що буде, якщо клієнт не відповів?",
    answer:
      'Агент фіксує статус "Не відповів". Далі можна запланувати повторний дзвінок або передати контакт менеджеру для ручної обробки.',
  },
  {
    question: "Можна спочатку протестувати без дзвінків клієнтам?",
    answer:
      "Так. Перед запуском по базі можна зробити тестовий дзвінок на свій номер і перевірити голос, сценарій та поведінку агента.",
  },
  {
    question: "Куди потрапляють результати дзвінків?",
    answer:
      "Результати можна бачити в кабінеті, CRM, Google Sheets або передавати у вашу систему через webhook. Міняти весь процес заради агента не потрібно.",
  },
  {
    question: "Для яких дзвінків це підходить найкраще?",
    answer:
      "Для будь-яких рутинних дзвінків: підтвердження замовлень, запис на візит, нагадування та відповіді на часті питання. Якщо запит складний — ШІ одразу передає дзвінок менеджеру.",
  },
  {
    question: "Скільки це коштує?",
    answer: (
      <>
        Ви сплачуєте лише за використані хвилини розмови. Усі сценарії, інтеграції з CRM та тестовий баланс вже включені в тарифи.{" "}
        <span className="text-primary">Тут будуть правки, коли будуть тарифи</span>
      </>
    ),
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl">
          <span className="text-black">Часті </span>
          <span className="text-primary">питання</span>
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => {
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group border-b border-black py-0"
              >
                <AccordionTrigger
                  hideIcon
                  className="py-5 text-left no-underline hover:no-underline"
                >
                  <span className="text-xl font-medium tracking-tight text-black uppercase md:pr-8 md:text-3xl">
                    {faq.question}
                  </span>
                  <X
                    className="size-5 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base text-black md:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}

import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
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
      "Агент фіксує статус \"Не відповів\". Далі можна запланувати повторний дзвінок або передати контакт менеджеру для ручної обробки.",
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
      "Для повторюваних сценаріїв: підтвердження запису, нагадування, уточнення замовлення, кваліфікація лідів, повторні дзвінки клієнтам з бази.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-12 text-4xl font-semibold leading-snug tracking-wide md:text-5xl">
          Часті питання
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-border py-0"
            >
              <AccordionTrigger
                hideIcon
                className="py-5 text-left no-underline hover:no-underline [&[data-state=open]>.faq-icon]:rotate-45"
              >
                <span className="text-2xl font-medium uppercase leading-snug tracking-tight text-black md:pr-8 md:text-3xl">
                  {faq.question}
                </span>
                <Plus
                  className="faq-icon size-5 shrink-0 transition-transform duration-200"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-lg font-normal leading-snug tracking-wide text-black">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

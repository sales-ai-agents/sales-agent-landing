import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ENTRIES } from "@/lib/marketing-data";

export function FaqSection() {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-display mb-12 text-center text-3xl sm:text-4xl md:text-left md:text-5xl">
          <span className="text-foreground">Часті </span>
          <span className="text-primary">питання</span>
        </h2>

        <Accordion className="w-full">
          {FAQ_ENTRIES.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-foreground border-b py-0"
            >
              <AccordionTrigger className="min-h-11 cursor-pointer py-5 text-left no-underline hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                <span className="text-foreground font-body cursor-pointer text-xl font-medium uppercase md:pr-8 md:text-3xl">
                  {faq.question}
                </span>
                <X
                  className="size-5 shrink-0 cursor-pointer transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-90 md:size-7"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </AccordionTrigger>
              <AccordionContent className="text-foreground pb-6 text-base md:text-lg">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

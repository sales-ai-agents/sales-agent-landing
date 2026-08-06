"use client";

import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { LeadFormModal } from "@/components/marketing/lead-form-card";
import { ScaleReveal } from "@/components/marketing/scroll-reveal";

export function FinalCtaSection() {
  const [leadFormOpen, setLeadFormOpen] = useState(false);

  return (
    <section className="px-4 py-20 sm:px-6">
      <ScaleReveal duration={0.7}>
        <div className="bg-primary mx-auto max-w-7xl rounded-3xl px-6 py-14 text-center sm:px-12">
          <h2 className="font-gilroy mb-4 text-2xl text-white sm:text-3xl md:text-4xl">
            Запустіть тестовий дзвінок на своєму сценарії
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-base text-white/90 md:text-lg">
            Оберіть задачу, додайте коротку інструкцію і перевірте, як агент говорить з клієнтом до
            запуску на реальну базу
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#hero"
              onClick={() => trackEvent("footer_start_test_call")}
              className={cn(
                buttonVariants(),
                "font-body h-12 w-full rounded-xl bg-white px-7 text-lg font-normal text-black hover:bg-gray-100 sm:w-sm"
              )}
            >
              Запустити тестовий дзвінок
            </a>

            <Button
              variant="outline"
              onClick={() => {
                trackEvent("footer_lead_form");
                setLeadFormOpen(true);
              }}
              className="font-body h-12 w-full rounded-xl border-white/30 bg-transparent px-7 text-lg font-normal text-white hover:bg-white/10 sm:w-sm"
            >
              Забронювати демо
            </Button>
          </div>

          <p className="mx-auto mt-6 text-sm text-white">
            Для першого тесту достатньо одного сценарію і вашого номера телефону
          </p>
        </div>
      </ScaleReveal>

      <LeadFormModal
        open={leadFormOpen}
        onClose={() => setLeadFormOpen(false)}
        sourcePage="final-cta"
      />
    </section>
  );
}

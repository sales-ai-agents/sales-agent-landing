"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui";
import { LeadFormModal } from "@/components/marketing/lead-form-card";
import { trackEvent } from "@/lib/analytics";

export function FooterLeadFormLink() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleOpen = (): void => {
    trackEvent("lead_modal_open", { location: "footer" });
    setIsLeadFormOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleOpen}
        className="h-auto gap-2 px-0 text-base font-normal text-white transition-colors hover:bg-transparent hover:text-white/80"
      >
        <SquarePen className="size-4 shrink-0" aria-hidden="true" />
        Залишити заявку
      </Button>

      <LeadFormModal
        open={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        sourcePage="footer"
      />
    </>
  );
}

"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface PricingCardCtaProps {
  planId: string;
  href: string;
  label: string;
  featured: boolean;
}

export function PricingCardCta({ planId, href, label, featured }: PricingCardCtaProps) {
  return (
    <Link
      href={href}
      onClick={() => trackEvent("pricing_plan_click", { plan: planId })}
      className={cn(
        buttonVariants({ size: "lg" }),
        "font-body h-12 w-full rounded-full text-base font-semibold",
        featured
          ? "text-primary bg-white hover:bg-white/90"
          : "border-primary text-foreground hover:bg-primary/5 bg-transparent"
      )}
    >
      {label}
    </Link>
  );
}

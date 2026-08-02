"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/components/marketing/lead-form-card";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { NAV_LINKS } from "@/lib/content";

export function Navbar() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  return (
    <>
      <ScrollReveal
        direction="down"
        distance={20}
        duration={0.6}
        delay={0.3}
        className="fixed top-6 left-1/2 z-50 hidden w-full max-w-5xl -translate-x-1/2 px-4 md:block"
      >
        <nav
          aria-label="Головне меню"
          className="border-border bg-card-glass flex w-full items-center justify-between rounded-2xl border px-8 py-2 backdrop-blur-lg"
        >
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-5">
              <Image
                src="/image/Logo.svg"
                alt="Calls4u.ai"
                width={40}
                height={40}
                className="h-auto w-auto"
              />
              <Image
                src="/image/calls4u.svg"
                alt="Calls4u.ai"
                width={40}
                height={40}
                className="h-auto w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-foreground hover:text-foreground/70 text-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button
              className="rounded-full px-5 py-5 text-lg"
              onClick={() => setIsLeadFormOpen(true)}
            >
              Реєстрація
            </Button>
          </div>
        </nav>
      </ScrollReveal>

      <LeadFormModal
        open={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        sourcePage="navbar"
      />
    </>
  );
}

export function MobileNavbar() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  return (
    <>
      <ScrollReveal
        direction="down"
        distance={15}
        duration={0.5}
        delay={0.2}
        className="absolute top-0 z-50 w-full md:hidden"
      >
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Image
              src="/image/Logo.svg"
              alt="Calls4u.ai"
              width={40}
              height={40}
              className="h-auto w-auto"
            />
          </Link>

          <Button
            size="sm"
            className="rounded-full px-5 py-4 text-sm"
            onClick={() => setIsLeadFormOpen(true)}
          >
            Реєстрація
          </Button>
        </div>
      </ScrollReveal>

      <LeadFormModal
        open={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        sourcePage="navbar-mobile"
      />
    </>
  );
}

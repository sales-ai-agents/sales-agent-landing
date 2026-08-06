import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { ScrollReveal, StaggerReveal } from "@/components/marketing/scroll-reveal";

export function Footer() {
  return (
    <footer className="bg-primary" itemScope itemType="https://schema.org/Organization">
      <meta itemProp="name" content="Calls4U" />
      <meta itemProp="url" content="https://www.calls4u.ai" />
      <div
        className="@container pointer-events-none relative h-[10cqw] overflow-hidden bg-linear-to-b from-white to-transparent select-none"
        aria-hidden="true"
      >
        <p className="font-gilroy absolute bottom-0 w-full text-center text-[17cqw] leading-[0.8] font-semibold tracking-wide text-white/70">
          CALLS4U.AI
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-10">
        <StaggerReveal
          staggerDelay={0.12}
          direction="up"
          distance={25}
          threshold={0.15}
          className="grid grid-cols-1 gap-10 md:grid-cols-3"
        >
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-base font-semibold text-white">
              <Image
                src="/image/Logo.svg"
                alt="Calls4u.ai"
                width={40}
                height={40}
                className="h-auto w-auto"
              />
            </Link>
            <p className="max-w-xs text-base text-white">
              AI-агент для рутинних дзвінків: підтверджує записи та передає в CRM або менеджеру.
            </p>
          </div>

          <nav aria-label="Навігація по сайту">
            <h3 className="font-body mb-4 text-white uppercase">Навігація</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="#features"
                  className="text-base text-white transition-colors hover:text-white/80"
                >
                  Можливості
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-base text-white transition-colors hover:text-white/80"
                >
                  Калькулятор
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-base text-white transition-colors hover:text-white/80"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-body mb-4 text-white uppercase">Контакти</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:salesagentswork@gmail.com"
                  itemProp="email"
                  className="flex items-center gap-2 text-base text-white transition-colors hover:text-white/80"
                >
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  salesagentswork@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+380914810542"
                  itemProp="telephone"
                  className="flex items-center gap-2 text-base text-white transition-colors hover:text-white/80"
                >
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  +380 (91) 481 05 42
                </a>
              </li>
            </ul>
          </div>
        </StaggerReveal>

        <ScrollReveal direction="up" delay={0.3} distance={15}>
          <p className="mt-10 text-base text-white">
            © 2026{" "}
            <Link href="/" className="underline">
              Calls4u.ai
            </Link>{" "}
            Всі права захищені.
          </p>
        </ScrollReveal>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary relative overflow-hidden">
      <div className="pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white to-transparent" />
          <p className="font-display text-center text-6xl font-medium text-white/80 uppercase sm:text-7xl md:text-8xl lg:text-9xl xl:text-[16rem]">
            CALLS4U.AI
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-base font-semibold text-white">
              Logo
            </Link>
            <p className="max-w-xs text-base text-white">
              AI-агент для рутинних дзвінків: підтверджує записи та передає в CRM або менеджеру.
            </p>
          </div>

          <nav aria-label="Навігація по сайту">
            <h3 className="font-body mb-4 text-xl text-white uppercase">Навігація</h3>
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
            <h3 className="font-body mb-4 text-xl text-white uppercase">Контакти</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:salesagentswork@gmail.com"
                  className="flex items-center gap-2 text-base text-white transition-colors hover:text-white/80"
                >
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  salesagentswork@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+380914810542"
                  className="flex items-center gap-2 text-base text-white transition-colors hover:text-white/80"
                >
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  +380 (91) 481 05 42
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-base text-white">
          © 2026{" "}
          <Link href="/" className="underline">
            Calls4u.ai
          </Link>{" "}
          Всі права захищені.
        </p>
      </div>
    </footer>
  );
}

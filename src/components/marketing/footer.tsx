import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary">
      {/* Large watermark text */}
      <div className="pointer-events-none select-none">
        <p
          className="text-center text-8xl font-medium tracking-widest text-white/20 uppercase md:text-9xl lg:text-[12rem]"
          aria-hidden="true"
        >
          CALLS4U.AI
        </p>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Company description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-base font-semibold text-white">
              Logo
            </Link>
            <p className="max-w-xs text-base text-white">
              AI-агент для рутинних дзвінків: підтверджує записи та передає
              в CRM або менеджеру.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Навігація по сайту">
            <h3 className="mb-4 text-base font-normal uppercase text-white">
              Навігація
            </h3>
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

          {/* Contacts */}
          <div>
            <h3 className="mb-4 text-base font-normal uppercase text-white">
              Контакти
            </h3>
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

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:text-white/80"
              >
                <Image
                  src="/image/hero-inst.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:text-white/80"
              >
                <Image
                  src="/image/hero-tg.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
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

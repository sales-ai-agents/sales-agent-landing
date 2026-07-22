import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "#features", label: "Продукт" },
  { href: "#pricing", label: "Тарифи" },
  { href: "#partners", label: "Партнерам" },
  { href: "#blog", label: "Блог" },
];

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 pt-5 md:px-12 md:pt-10">
      <Link href="/" className="text-lg font-bold text-black">
        LOGO
      </Link>

      <nav
        aria-label="Головне меню"
        className="rounded-card border-border bg-card-glass backdrop-blur-card hidden items-center gap-5 border px-10 py-2 md:flex"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-primary text-lg whitespace-nowrap text-black transition-colors"
          >
            {link.label}
          </a>
        ))}
        <Link
          href="/sign-up"
          className="rounded-button bg-primary hover:bg-primary-hover px-4 py-1.5 text-lg whitespace-nowrap text-white transition-colors"
        >
          Реєстрація
        </Link>
      </nav>

      {/* Social icons — desktop */}
      <div className="hidden items-center gap-4 md:flex">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="transition-opacity hover:opacity-70"
        >
          <Image
            src="/image/hero-inst.svg"
            alt="Instagram"
            width={33}
            height={33}
            aria-hidden="true"
          />
        </a>
        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="transition-opacity hover:opacity-70"
        >
          <Image
            src="/image/hero-tg.svg"
            alt="Telegram"
            width={33}
            height={33}
            aria-hidden="true"
          />
        </a>
      </div>

      {/* Mobile: Registration button + hamburger */}
      <div className="flex items-center gap-4 md:hidden">
        <Link
          href="/sign-up"
          className="rounded-button bg-primary hover:bg-primary-hover px-4 py-1.5 text-xs whitespace-nowrap text-white transition-colors"
        >
          Реєстрація
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle>Навігація</SheetTitle>
            <div className="mt-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex min-h-11 items-center text-lg font-medium text-black"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-opacity hover:opacity-70"
                >
                  <Image
                    src="/image/hero-inst.svg"
                    alt=""
                    width={33}
                    height={33}
                    aria-hidden="true"
                  />
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="transition-opacity hover:opacity-70"
                >
                  <Image
                    src="/image/hero-tg.svg"
                    alt=""
                    width={33}
                    height={33}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

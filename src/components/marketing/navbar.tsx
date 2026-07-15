import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "#features", label: "Продукт" },
  { href: "#pricing", label: "Тарифи" },
  { href: "#partners", label: "Партнерам" },
  { href: "#blog", label: "Блог" },
];

function InstagramIcon() {
  return (
    <svg
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="32" height="32" rx="8" stroke="currentColor" />
      <circle cx="16.5" cy="16.5" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="23.5" cy="9.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16.5" cy="16.5" r="16" stroke="currentColor" />
      <path
        d="M22.5 11L10.5 16L14.5 17.5L16 22L18.5 18.5L22.5 11Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide text-primary"
        >
          Logo
        </Link>

        {/* Center nav pill — desktop */}
        <nav
          aria-label="Головне меню"
          className="hidden items-center gap-5 rounded-2xl border border-border bg-card-glass px-6 py-2 backdrop-blur-sm md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-lg text-black transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-2xl bg-primary px-5 text-lg capitalize text-white transition-colors hover:bg-primary-hover"
          >
            Реєстрація
          </Link>
        </nav>

        {/* Social icons — desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-8 items-center justify-center text-black transition-colors hover:text-primary"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="flex size-8 items-center justify-center text-black transition-colors hover:text-primary"
          >
            <TelegramIcon />
          </a>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-black">
              <Menu className="size-5" />
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
              <div className="mt-4">
                <Button
                  asChild
                  className="h-9 rounded-2xl bg-primary px-5 text-lg text-white hover:bg-primary-hover"
                >
                  <Link href="/sign-up">Реєстрація</Link>
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-8 items-center justify-center text-black"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex size-8 items-center justify-center text-black"
                >
                  <TelegramIcon />
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

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
  // { href: "#", label: "Партнерам" },
  // { href: "#", label: "Блог" },
] as const;

export function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden w-full max-w-5xl px-4 md:block">
      <div className="flex w-full items-center justify-between rounded-2xl border border-border bg-card-glass backdrop-blur-lg px-8 py-2">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-black">
          LOGO
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Головне меню" className="flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-lg text-black transition-colors hover:text-gray-600"
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            className="rounded-2xl bg-primary px-5 text-lg text-white hover:bg-primary/90"
          >
            <Link href="/sign-up">Реєстрація</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function MobileNavbar() {
  return (
    <header className="absolute top-0 z-50 w-full md:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-base font-bold text-black">
          LOGO
        </Link>

        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="rounded-full bg-primary px-4 text-xs text-white hover:bg-primary/90"
          >
            <Link href="/sign-up">Реєстрація</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Відкрити меню"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Навігація</SheetTitle>
              <nav
                aria-label="Мобільне меню"
                className="mt-6 flex flex-col gap-4"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-lg text-black transition-colors hover:text-gray-600"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

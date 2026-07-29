import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "#features", label: "Продукт" },
  { href: "#pricing", label: "Тарифи" },
] as const;

export function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 z-50 hidden w-full max-w-5xl -translate-x-1/2 px-4 md:block">
      <nav
        aria-label="Головне меню"
        className="border-border bg-card-glass flex w-full items-center justify-between rounded-2xl border px-8 py-2 backdrop-blur-lg"
      >
        <Link href="/" className="text-foreground text-lg font-bold">
          LOGO
        </Link>

        <div className="flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-foreground/70 text-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button asChild className="rounded-2xl px-5 text-lg">
            <Link href="/">Реєстрація</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

export function MobileNavbar() {
  return (
    <header className="absolute top-0 z-50 w-full md:hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-foreground text-base font-bold">
          LOGO
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="min-h-11 rounded-full px-4 text-sm">
            <Link href="/">Реєстрація</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Відкрити меню" className="size-11">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Навігація</SheetTitle>
              <nav aria-label="Мобільне меню" className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-foreground hover:text-foreground/70 rounded-lg px-3 py-3 text-lg transition-colors"
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

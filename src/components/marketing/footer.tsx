import Link from "next/link";

const footerLinks = {
  Продукт: [
    { href: "#features", label: "Можливості" },
    { href: "#pricing", label: "Тарифи" },
    { href: "#integrations", label: "Інтеграції" },
    { href: "#partners", label: "Партнерство" },
  ],
  Ресурс: [
    { href: "/blog", label: "Блог" },
    { href: "/updates", label: "Оновлення" },
    { href: "/about", label: "Про нас" },
  ],
  Почати: [
    { href: "/sign-up", label: "Створити ШІ-агента" },
    { href: "/sign-in", label: "Увійти в кабінет" },
    { href: "/support", label: "Підтримка" },
  ],
  Документи: [
    { href: "/offer", label: "Публічна оферта" },
    { href: "/terms", label: "Умови використання" },
    { href: "/privacy", label: "Політика конфиденційності" },
  ],
};

export function Footer() {
  return (
    <footer>
      {/* Wordmark section */}
      <div className="bg-footer-dark pt-8">
        {/* Large wordmark text */}
        <div className="mx-auto max-w-5xl px-4">
          <p className="overflow-hidden text-center text-8xl font-medium uppercase leading-none tracking-wide text-white/70 md:text-9xl">
            NAME
          </p>
        </div>
      </div>

      {/* Dark footer content section */}
      <div className="bg-footer-dark px-4 pb-10 pt-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[340px_1fr]">
          {/* Company info column */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-base font-semibold leading-snug tracking-wide text-white"
            >
              Logo
            </Link>
            <p className="max-w-xs text-base font-normal leading-snug tracking-wide text-white text-justify">
              AI-агент для рутинних дзвінків: підтверджує записи, нагадує клієнтам, фіксує результат
              і передає дані в CRM або менеджеру.
            </p>
          </div>

          {/* Navigation columns */}
          <nav aria-label="Навігація по сайту" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-4 text-base font-normal uppercase leading-snug tracking-wide text-white">
                  {category}
                </h3>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-base font-normal leading-10 tracking-wide text-white transition-colors hover:text-white/80"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-12 max-w-5xl">
          <p className="text-base font-normal leading-snug tracking-wide text-white">
            © {new Date().getFullYear()} Назва . Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}

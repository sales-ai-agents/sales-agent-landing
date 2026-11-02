"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SIGN_IN_URL } from "@/components/landing/data";

const SCROLLED_OFFSET = 20;
const HIDE_AFTER = 360;
const DIRECTION_THRESHOLD = 3;

function useNavVisibility() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = (): void => {
      const y = window.scrollY;
      setScrolled(y > SCROLLED_OFFSET);
      if (y > HIDE_AFTER && y > lastY + DIRECTION_THRESHOLD) setHidden(true);
      else if (y < lastY - DIRECTION_THRESHOLD || y <= HIDE_AFTER) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrolled, hidden };
}

export function LandingNav() {
  const { scrolled, hidden } = useNavVisibility();

  return (
    <header className={cn("nav", scrolled && "scrolled", hidden && "hide")} id="nav">
      <div className="wrap">
        <a href="#top" className="logo" aria-label="Calls4U">
          <Image src="/image/Logo.svg" alt="" width={39} height={40} priority />
          <Image
            className="word"
            src="/image/calls4u.svg"
            alt="calls4u"
            width={96}
            height={20}
            priority
          />
        </a>
        <nav className="nav-links" aria-label="Головне меню">
          {NAV_LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            )
          )}
        </nav>
        <div className="nav-cta">
          <Link className="nav-login" href={SIGN_IN_URL}>
            Увійти
          </Link>
          <a className="btn btn-blue" href="#top" data-focus-phone="">
            Тестовий дзвінок
          </a>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnchorLink } from "@/components/landing/anchor-link";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, resolveNavHref, SIGN_IN_URL } from "@/components/landing/data";

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

interface LandingNavProps {
  basePath?: string;
}

export function LandingNav({ basePath = "" }: LandingNavProps) {
  const { locale, copy } = useLandingCopy();
  const { scrolled, hidden } = useNavVisibility();
  const topHref = basePath ? basePath : "#top";

  return (
    <header className={cn("nav", scrolled && "scrolled", hidden && "hide")}>
      <div className="wrap">
        <AnchorLink href={topHref} className="logo" aria-label="Calls4U">
          <Image src="/image/Logo.svg" alt="" width={39} height={40} loading="eager" />
          <Image
            className="word"
            src="/image/calls4u.svg"
            alt="calls4u"
            width={99}
            height={22}
            loading="eager"
          />
        </AnchorLink>
        <nav className="nav-links" aria-label={copy.nav.menuLabel}>
          {NAV_ITEMS.map((item) => (
            <AnchorLink key={item.id} href={resolveNavHref(item, basePath, locale)}>
              {copy.nav.links[item.id]}
            </AnchorLink>
          ))}
        </nav>
        <div className="nav-cta">
          <a className="nav-login" href={SIGN_IN_URL}>
            {copy.nav.login}
          </a>
          <AnchorLink className="btn btn-blue" href={`${basePath}#top`} data-focus-phone="">
            {copy.nav.testCall}
          </AnchorLink>
        </div>
      </div>
    </header>
  );
}

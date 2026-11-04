import type { ReactNode } from "react";
import { BackToTop } from "@/components/landing/back-to-top";
import { LANDING_FONT_CLASSES } from "@/components/landing/fonts";
import "@/components/landing/calls4u.css";

const ANIMATION_BOOT_SCRIPT = `(function(){var r=document.currentScript&&document.currentScript.parentElement;if(!r||matchMedia('(prefers-reduced-motion: reduce)').matches)return;r.setAttribute('data-anim','');setTimeout(function(){if(!r.hasAttribute('data-anim-ready'))r.removeAttribute('data-anim')},4000)})();`;

interface LandingShellProps {
  animated?: boolean;
  children: ReactNode;
}

export function LandingShell({ animated = false, children }: LandingShellProps) {
  return (
    <div className={`${LANDING_FONT_CLASSES} c4u`} suppressHydrationWarning>
      {animated ? <script dangerouslySetInnerHTML={{ __html: ANIMATION_BOOT_SCRIPT }} /> : null}
      {children}
      <BackToTop />
    </div>
  );
}

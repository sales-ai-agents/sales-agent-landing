import type { ReactNode, SVGProps } from "react";

const PHONE_PATH =
  "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2";
const SHIELD_PATH = "M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z";

const STROKE_ICONS = {
  check: <path d="m5 12 5 5 9-10" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  link: (
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  ),
  phone: <path d={PHONE_PATH} />,
  phoneMissed: (
    <>
      <path d={PHONE_PATH} />
      <path d="m16 3 5 5m0-5-5 5" />
    </>
  ),
  overview: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="m7 13 3-3 3 3 4-5" />
    </>
  ),
  agents: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 4v4M9 13h.01M15 13h.01" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
    </>
  ),
  puzzle: (
    <path d="M9 3h6v4a2 2 0 1 0 4 0h2v6h-4a2 2 0 1 0 0 4h4v4H9v-4a2 2 0 1 0-4 0H3V9h4a2 2 0 1 0 0-4H3" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  pause: (
    <>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </>
  ),
  shield: <path d={SHIELD_PATH} />,
  shieldCheck: (
    <>
      <path d={SHIELD_PATH} />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
} as const satisfies Record<string, ReactNode>;

export type StrokeIconName = keyof typeof STROKE_ICONS;

interface StrokeIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: StrokeIconName;
  weight?: number;
}

export function StrokeIcon({ name, weight = 2, ...props }: StrokeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      aria-hidden="true"
      {...props}
    >
      {STROKE_ICONS[name]}
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="6" y="4.5" width="4" height="15" rx="1" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" />
    </svg>
  );
}

export function CheckIcon() {
  return <StrokeIcon name="check" weight={3} />;
}

import { Blocks } from "lucide-react";

import { cn } from "@/lib/utils";

interface IntegrationLogoProps {
  id: string;
  size?: "md" | "sm";
}

const LOGO_SIZE_CLASS = {
  md: "h-16 w-16",
  sm: "h-10 w-10",
} as const;

const KEYCRM_PATH =
  "M6 0C9.31371 0 12 2.68629 12 6C12 8.26095 10.7485 10.2282 8.90137 11.251C8.96308 11.4907 9 11.741 9 12V17C9 18.6569 7.65685 20 6 20C4.34315 20 3 18.6569 3 17V12C3 11.7411 3.03598 11.4906 3.09766 11.251C1.25091 10.2281 0 8.26064 0 6C0 2.68629 2.68629 0 6 0Z";

const KeyCrmGlyph = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="24"
    viewBox="0 0 12 20"
    fill="none"
    aria-hidden="true"
  >
    <path d={KEYCRM_PATH} fill="currentColor" />
  </svg>
);

export const IntegrationLogo = ({ id, size = "md" }: IntegrationLogoProps) => {
  const base = cn("flex shrink-0 items-center justify-center rounded-full", LOGO_SIZE_CLASS[size]);

  switch (id) {
    case "bitrix24":
      return (
        <div className={cn(base, "border-primary bg-primary/5 border")} aria-hidden="true">
          <span className="text-primary text-xl font-bold">24</span>
        </div>
      );
    case "keycrm":
      return (
        <div className={cn(base, "bg-primary text-primary-foreground")}>
          <KeyCrmGlyph />
        </div>
      );
    case "pipedrive":
      return (
        <div className={cn(base, "bg-black text-white")} aria-hidden="true">
          <span className="text-xl font-bold">P</span>
        </div>
      );
    default:
      return (
        <div className={cn(base, "bg-muted text-muted-foreground")}>
          <Blocks className="h-7 w-7" aria-hidden="true" />
        </div>
      );
  }
};

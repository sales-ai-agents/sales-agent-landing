"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const FALLBACK_PATH = "/";

interface LegalBackButtonProps {
  label: string;
}

export function LegalBackButton({ label }: LegalBackButtonProps) {
  const router = useRouter();

  const handleBack = (): void => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(FALLBACK_PATH);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm transition-colors"
    >
      <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </button>
  );
}

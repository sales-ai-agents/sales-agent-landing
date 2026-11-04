"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ClientCopy } from "@/components/landing/copy/client-types";
import type { Locale } from "@/lib/i18n/config";

interface LandingCopyContextValue {
  readonly locale: Locale;
  readonly copy: ClientCopy;
}

const LandingCopyContext = createContext<LandingCopyContextValue | null>(null);

interface LandingCopyProviderProps extends LandingCopyContextValue {
  children: ReactNode;
}

export function LandingCopyProvider({ locale, copy, children }: LandingCopyProviderProps) {
  return (
    <LandingCopyContext.Provider value={{ locale, copy }}>{children}</LandingCopyContext.Provider>
  );
}

export function useLandingCopy(): LandingCopyContextValue {
  const value = useContext(LandingCopyContext);
  if (!value) throw new Error("useLandingCopy must be used inside LandingCopyProvider");
  return value;
}

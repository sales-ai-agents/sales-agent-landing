import type { ReactNode } from "react";
import { LegalFooter } from "@/components/legal/legal-footer";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="font-body relative flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1">{children}</main>
      <LegalFooter />
    </div>
  );
}

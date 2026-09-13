import Image from "next/image";
import Link from "next/link";

import { LegalBackButton } from "@/components/marketing/legal-back-button";

export function LegalHeader() {
  return (
    <header className="border-border border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Calls4u.ai — на головну" className="flex items-center gap-4">
          <Image
            src="/image/Logo.svg"
            alt="Calls4u.ai"
            width={36}
            height={36}
            className="h-auto w-auto"
          />
          <Image
            src="/image/calls4u.svg"
            alt=""
            width={90}
            height={24}
            className="hidden h-auto w-auto sm:block"
            aria-hidden="true"
          />
        </Link>

        <LegalBackButton />
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui";

const REDIRECT_DELAY_MS = 3000;

export default function EmailConfirmedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
      <span className="bg-success/10 text-success grid size-16 place-items-center rounded-full">
        <Check className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-heading text-3xl">Пошту підтверджено!</h1>
      <p className="text-muted-foreground">
        Ваш акаунт активовано. Тепер ви можете увійти й почати роботу.
      </p>
      <Link className={buttonVariants({ size: "lg", className: "w-full" })} href="/dashboard">
        Перейти в кабінет
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}

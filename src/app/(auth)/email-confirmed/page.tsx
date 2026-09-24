"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle, Mail } from "lucide-react";

import { Button } from "@/components/ui";

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
    <div className="w-full max-w-md text-center">
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
            <Mail className="text-primary h-10 w-10" />
          </div>
          <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold sm:text-3xl">Пошту підтверджено!</h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-xs text-base">
        Дякуємо, тепер можете увійти у свій акаунт і почати роботу.
      </p>

      <Button
        className="bg-primary hover:bg-primary/90 mt-8 h-11 w-full rounded-lg text-base font-semibold text-white"
        onClick={() => router.replace("/dashboard")}
      >
        Увійти в акаунт →
      </Button>

      <div className="bg-primary/5 mt-4 rounded-lg p-4 text-left">
        <p className="text-muted-foreground text-sm">
          Якщо перенаправлення не відбулося автоматично, натисніть на кнопку вище.
        </p>
      </div>
    </div>
  );
}

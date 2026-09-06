"use client";

import { AlertTriangle, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api-client";
import { cn, formatDateShort } from "@/lib/utils";
import { useDeletePaymentMethod } from "@dashboard/hooks";
import type { BillingPaymentMethodResponse } from "@dashboard/types";

interface PaymentMethodSectionProps {
  data?: BillingPaymentMethodResponse;
  isLoading: boolean;
  isError: boolean;
  isTrial: boolean;
  onRetry: () => void;
  onSelectPlan: () => void;
}

export const PaymentMethodSection = ({
  data,
  isLoading,
  isError,
  isTrial,
  onRetry,
  onSelectPlan,
}: PaymentMethodSectionProps) => {
  const deletePaymentMethod = useDeletePaymentMethod();
  const card = data?.card;
  const hasSavedCard = card?.saved === true;

  const handleDetach = () => {
    deletePaymentMethod.mutate(undefined, {
      onSuccess: () => toast.success("Картку успішно відв'язано."),
      onError: (error) => {
        if (error instanceof ApiError && error.code === "no_card") {
          toast.error("Збереженої картки не знайдено.");
          return;
        }
        toast.error("Не вдалося відв'язати картку. Спробуйте пізніше.");
      },
    });
  };

  return (
    <section className="border-border bg-background rounded-2xl border p-6">
      <h2 className="text-muted-foreground mb-4 text-sm font-medium">Спосіб оплати</h2>

      {isLoading ? (
        <SectionLoading label="Завантаження способу оплати..." />
      ) : isError ? (
        <SectionError
          title="Не вдалося завантажити спосіб оплати"
          description="Виникла помилка під час отримання даних про картку"
          onRetry={onRetry}
        />
      ) : (
        <div className="border-border flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-lg px-5 py-3",
                hasSavedCard ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {hasSavedCard
                  ? [card.brand || "Картка", card.masked].filter(Boolean).join(" ")
                  : "Спосіб оплати не додано"}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {hasSavedCard
                  ? `${card.saved_at ? `Збережено ${formatDateShort(card.saved_at)} · ` : ""}${
                      data?.auto_charge
                        ? "Автоматична оплата увімкнена"
                        : "Наступна оплата здійснюється вручну"
                    }`
                  : "Картка збережеться автоматично після першої успішної оплати"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasSavedCard && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={handleDetach}
                disabled={deletePaymentMethod.isPending}
                aria-busy={deletePaymentMethod.isPending}
              >
                {deletePaymentMethod.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                Відвʼязати
              </Button>
            )}
            <Button variant="outline" className="px-6" size="sm" onClick={onSelectPlan}>
              {isTrial ? "Обрати тариф" : "Продовжити тариф"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

const SectionLoading = ({ label }: { label: string }) => (
  <div className="border-border text-muted-foreground flex items-center justify-center gap-2 rounded-lg border p-6 text-sm">
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

interface SectionErrorProps {
  title: string;
  description: string;
  onRetry: () => void;
}

const SectionError = ({ title, description, onRetry }: SectionErrorProps) => (
  <div className="border-destructive/30 bg-destructive/5 flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center">
    <div className="flex items-center gap-3">
      <AlertTriangle className="text-destructive h-5 w-5 shrink-0" />
      <div>
        <p className="text-destructive text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
    <Button variant="outline" size="sm" onClick={onRetry}>
      Повторити
    </Button>
  </div>
);

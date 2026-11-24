"use client";

import { useState } from "react";
import { Loader2, Mail, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
} from "@/components/ui";
import { useDeleteAccount, useDeleteCode, useMe } from "@/lib/hooks";
import { ApiError } from "@/lib/api-client";
import { SettingsSection } from "./settings-section";

const CONFIRM_KEYWORD = "DELETE";
const LOGIN_PATH = "/sign-in";
const OTP_LENGTH = 6;

const PasswordFlow = ({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) => {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const deleteAccount = useDeleteAccount();

  const canSubmit = password.length > 0 && confirmText === CONFIRM_KEYWORD;

  const handleDelete = (): void => {
    if (!canSubmit) return;
    setFieldError(null);

    deleteAccount.mutate(
      { password, confirm: CONFIRM_KEYWORD },
      {
        onSuccess,
        onError: (error) => {
          if (error instanceof ApiError && error.status === 403) {
            setFieldError("Невірний пароль.");
          } else {
            toast.error("Щось пішло не так. Спробуйте ще раз.");
          }
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="delete-password">Пароль</Label>
          <Input
            id="delete-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldError(null);
            }}
            disabled={deleteAccount.isPending}
          />
          {fieldError && <p className="text-destructive text-sm">{fieldError}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="delete-confirm">Введіть {CONFIRM_KEYWORD} для підтвердження</Label>
          <Input
            id="delete-confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_KEYWORD}
            disabled={deleteAccount.isPending}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={deleteAccount.isPending}>
          Скасувати
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={!canSubmit || deleteAccount.isPending}
          aria-busy={deleteAccount.isPending}
        >
          {deleteAccount.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          Видалити назавжди
        </Button>
      </DialogFooter>
    </>
  );
};

const CodeFlow = ({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) => {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const deleteCode = useDeleteCode();
  const deleteAccount = useDeleteAccount();

  const goToRequest = (): void => {
    setStep("request");
    setCode("");
    setFieldError(null);
  };

  const handleSendCode = (): void => {
    setFieldError(null);
    deleteCode.mutate(undefined, {
      onSuccess: (data) => {
        setSentTo(data.sent_to);
        setStep("confirm");
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 429) {
          const wait = error.retryAfter ?? 60;
          setFieldError(`Надто часто. Зачекайте ${wait} с і спробуйте знову.`);
        } else {
          toast.error("Не вдалося надіслати код. Спробуйте ще раз.");
        }
      },
    });
  };

  const handleDelete = (): void => {
    if (code.length !== OTP_LENGTH) return;
    setFieldError(null);

    deleteAccount.mutate(
      { code, confirm: CONFIRM_KEYWORD },
      {
        onSuccess,
        onError: (error) => {
          if (!(error instanceof ApiError)) {
            toast.error("Щось пішло не так.");
            return;
          }
          if (error.status === 403) {
            const left = error.attemptsLeft;
            setFieldError(
              left !== undefined ? `Невірний код. Залишилось спроб: ${left}.` : "Невірний код."
            );
            setCode("");
            return;
          }
          if (error.code === "code_expired" || error.code === "code_required") {
            setFieldError("Код застарів або недійсний. Запросіть новий.");
            goToRequest();
            return;
          }
          if (error.code === "too_many_attempts") {
            setFieldError("Занадто багато спроб — запросіть новий код.");
            goToRequest();
            return;
          }
          toast.error("Щось пішло не так.");
        },
      }
    );
  };

  if (step === "request") {
    return (
      <>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Ваш акаунт створений через соціальний вхід. Для підтвердження ми надішлемо шестизначний
            код на вашу пошту.
          </p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="delete-confirm-keyword">
              Введіть {CONFIRM_KEYWORD} для підтвердження
            </Label>
            <Input
              id="delete-confirm-keyword"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setFieldError(null);
              }}
              placeholder={CONFIRM_KEYWORD}
              disabled={deleteCode.isPending}
            />
          </div>
          {fieldError && <p className="text-destructive text-sm">{fieldError}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleteCode.isPending}>
            Скасувати
          </Button>
          <Button
            variant="destructive"
            onClick={handleSendCode}
            disabled={confirmText !== CONFIRM_KEYWORD || deleteCode.isPending}
            aria-busy={deleteCode.isPending}
          >
            {deleteCode.isPending ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Mail aria-hidden="true" />
            )}
            Надіслати код
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Код надіслано на <b>{sentTo}</b>. Він діє 15 хвилин.
        </p>
        <div className="flex flex-col items-start gap-2">
          <Label>Код підтвердження</Label>
          <InputOTP
            maxLength={OTP_LENGTH}
            value={code}
            onChange={(val) => {
              setCode(val);
              setFieldError(null);
            }}
            disabled={deleteAccount.isPending}
          >
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }, (_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {fieldError && <p className="text-destructive text-sm">{fieldError}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={goToRequest} disabled={deleteAccount.isPending}>
          Запросити новий код
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={code.length !== OTP_LENGTH || deleteAccount.isPending}
          aria-busy={deleteAccount.isPending}
        >
          {deleteAccount.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          Видалити назавжди
        </Button>
      </DialogFooter>
    </>
  );
};

export const DangerZone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: account } = useMe();
  const isPasswordAccount = !account?.sign_in || account.sign_in === "password";

  const handleSuccess = (): void => {
    window.location.assign(LOGIN_PATH);
  };

  return (
    <SettingsSection
      destructive
      title="Видалення акаунту"
      description="Безповоротне видалення акаунту та всіх пов'язаних даних"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <TriangleAlert className="text-destructive size-5 shrink-0" aria-hidden="true" />
          <p className="text-muted-foreground text-sm">
            Ми назавжди видалимо ваш акаунт, агентів, контакти, номери, журнал дзвінків, записи
            розмов, транскрипти та платежі. Відновити ці дані буде неможливо.
          </p>
        </div>
        <Button variant="destructive" className="shrink-0" onClick={() => setIsOpen(true)}>
          Видалити акаунт
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <TriangleAlert className="size-5" aria-hidden="true" />
              Видалити акаунт назавжди?
            </DialogTitle>
            <DialogDescription>
              Записи розмов, журнал дзвінків та всі персональні дані зникнуть без можливості
              відновлення.
            </DialogDescription>
          </DialogHeader>

          {isPasswordAccount ? (
            <PasswordFlow onSuccess={handleSuccess} onClose={() => setIsOpen(false)} />
          ) : (
            <CodeFlow onSuccess={handleSuccess} onClose={() => setIsOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </SettingsSection>
  );
};

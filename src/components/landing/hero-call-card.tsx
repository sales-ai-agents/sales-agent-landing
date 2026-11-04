"use client";

import { useId } from "react";
import { useFormDialog } from "@/components/landing/use-form-dialog";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/landing/phone-input";
import { Arrow } from "@/components/landing/typography";
import { useTestCall } from "@/components/landing/use-test-call";

export function HeroCallCard() {
  const { value, onChange, onSubmit, status, message, isLoading } = useTestCall("landing_hero");
  const messageId = useId();
  const { show: showFeedback, dialog: feedbackDialog } = useFormDialog(
    "feedback",
    "landing_hero_demo"
  );

  return (
    <>
      <form className="call-card" id="heroForm" onSubmit={onSubmit} noValidate>
        <div className="cc-top mono">
          <span>Тест у реальному часі</span>
          <span className="live-dot">
            <i />
            00:20
          </span>
        </div>
        <p className="cc-title t2">
          Введіть номер — агент <em>зателефонує за 20 секунд</em>
        </p>
        <label className="phone-field">
          <span className="cc">+380</span>
          <PhoneInput
            value={value}
            onChange={onChange}
            invalid={status === "error"}
            describedBy={messageId}
          />
        </label>
        <button className="btn btn-blue" type="submit" disabled={isLoading}>
          Запустити тестовий дзвінок <Arrow />
        </button>
        <div
          className={cn("form-msg", status === "ok" && "ok", status === "error" && "err")}
          id={messageId}
          role="status"
        >
          {message}
          {status === "ok" ? (
            <button type="button" className="form-msg-action" onClick={showFeedback}>
              Отримати розрахунок
            </button>
          ) : null}
        </div>
        <div className="call-foot">
          <span className="call-foot-lead">
            <span className="avatars">
              <span>О</span>
              <span>І</span>
              <span>С</span>
            </span>
            <span>
              Вже протестували <b>200+ компаній</b>
            </span>
          </span>
          <span>Один дзвінок. Без спаму.</span>
        </div>
      </form>
      {feedbackDialog}
    </>
  );
}

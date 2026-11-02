"use client";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/landing/typography";
import { useTestCall } from "@/components/landing/use-test-call";

export function HeroCallCard() {
  const { value, onChange, onSubmit, status, message, isLoading } = useTestCall("landing_hero");

  return (
    <form className="call-card" id="heroForm" onSubmit={onSubmit} noValidate>
      <div className="cc-top mono">
        <span>Тест у реальному часі</span>
        <span className="live-dot">
          <i />
          00:20
        </span>
      </div>
      <h3 className="t2">
        Введіть номер — агент <em>зателефонує за 20 секунд</em>
      </h3>
      <label className="phone-field">
        <span className="cc">+380</span>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="__ ___ __ __"
          aria-label="Номер телефону"
          data-phone=""
          value={value}
          onChange={onChange}
        />
      </label>
      <button className="btn btn-blue" type="submit" disabled={isLoading}>
        Запустити тестовий дзвінок <Arrow />
      </button>
      <div
        className={cn("form-msg", status === "ok" && "ok", status === "error" && "err")}
        role="status"
      >
        {message}
      </div>
      <div className="call-foot">
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
  );
}

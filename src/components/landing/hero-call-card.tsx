"use client";

import { useId } from "react";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { useFormDialog } from "@/components/landing/form-dialog-provider";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/landing/phone-input";
import { Arrow } from "@/components/landing/typography";
import { useTestCall } from "@/components/landing/use-test-call";

export function HeroCallCard() {
  const { copy } = useLandingCopy();
  const card = copy.heroCard;
  const { value, onChange, onSubmit, status, message, isLoading } = useTestCall("landing_hero");
  const messageId = useId();
  const showFeedback = useFormDialog("feedback", "landing_hero_demo");

  return (
    <form className="call-card" id="heroForm" onSubmit={onSubmit} noValidate>
      <div className="cc-top mono">
        <span>{card.topLabel}</span>
        <span className="live-dot">
          <i />
          00:20
        </span>
      </div>
      <p className="cc-title t2">
        {card.titleLead}
        <em>{card.titleAccent}</em>
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
        {card.submit} <Arrow />
      </button>
      <div
        className={cn("form-msg", status === "ok" && "ok", status === "error" && "err")}
        id={messageId}
        role="status"
      >
        {message}
        {status === "ok" ? (
          <button type="button" className="form-msg-action" onClick={showFeedback}>
            {card.getEstimate}
          </button>
        ) : null}
      </div>
      <div className="call-foot">
        <span className="call-foot-lead">
          <span className="avatars">
            {card.avatars.map((initial) => (
              <span key={initial}>{initial}</span>
            ))}
          </span>
          <span>
            {card.footLead}
            <b>{card.footStrong}</b>
          </span>
        </span>
        <span>{card.footNote}</span>
      </div>
    </form>
  );
}

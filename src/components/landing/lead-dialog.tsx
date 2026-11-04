"use client";

import { useId, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { DialogShell } from "@/components/landing/dialog-shell";
import type { FormDialogProps } from "@/components/landing/dialog-types";
import { formatPhoneInput, extractSubscriberDigits } from "@/components/landing/phone";
import { PhoneInput } from "@/components/landing/phone-input";
import { Arrow } from "@/components/landing/typography";
import { buildLeadSchema } from "@/components/landing/schemas";
import { LEAD_FIELD_MAX_LENGTH } from "@/lib/schemas";
import { trackEvent } from "@/lib/analytics";
import { useLeadForm } from "@/components/landing/api/use-lead-form";
import "./dialogs.css";

const COUNTRY_CODE = "+380";
const TELEGRAM_URL = "https://t.me/calls4u_ai";

interface LeadValues {
  name: string;
  phone: string;
  niche: string;
  contact: string;
}

const EMPTY_VALUES: LeadValues = { name: "", phone: "", niche: "", contact: "" };

export function LeadDialog({ open, source, onClose }: FormDialogProps) {
  const { copy } = useLandingCopy();
  const text = copy.dialogs.lead;
  const leadSchema = useMemo(() => buildLeadSchema(copy.validation), [copy.validation]);
  const [values, setValues] = useState<LeadValues>(EMPTY_VALUES);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { submitLeadAsync, isLoading, errorMessage, reset } = useLeadForm();
  const messageId = useId();

  const close = (): void => {
    setSubmitted(false);
    onClose();
  };

  const update =
    (field: keyof LeadValues) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const next = field === "phone" ? formatPhoneInput(event.target.value) : event.target.value;
      setValues((current) => ({ ...current, [field]: next }));
      setValidationError(null);
      if (errorMessage) reset();
    };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const parsed = leadSchema.safeParse({
      ...values,
      phone: extractSubscriberDigits(values.phone),
    });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? null);
      return;
    }
    trackEvent("lead_form_submit", { location: source });
    try {
      await submitLeadAsync({
        name: parsed.data.name,
        phone: `${COUNTRY_CODE}${parsed.data.phone}`,
        niche: parsed.data.niche || undefined,
        contact: parsed.data.contact || undefined,
        source_page: source,
      });
      setValues(EMPTY_VALUES);
      setSubmitted(true);
    } catch {
      return;
    }
  };

  const message = validationError ?? errorMessage;

  return (
    <DialogShell
      open={open}
      onClose={close}
      title={submitted ? text.doneTitle : text.title}
      description={submitted ? text.doneDescription : text.description}
    >
      {submitted ? (
        <button type="button" className="btn btn-blue" onClick={close}>
          {copy.dialogs.done}
        </button>
      ) : (
        <form className="dlg-form" onSubmit={submit} noValidate>
          <label className="dlg-field">
            <span className="mono">{text.name}</span>
            <input
              name="name"
              autoComplete="name"
              maxLength={LEAD_FIELD_MAX_LENGTH}
              value={values.name}
              onChange={update("name")}
              aria-invalid={Boolean(validationError) && !values.name.trim()}
              aria-describedby={messageId}
            />
          </label>
          <label className="dlg-field">
            <span className="mono">{text.phone}</span>
            <span className="dlg-phone">
              <span className="cc">{COUNTRY_CODE}</span>
              <PhoneInput
                value={values.phone}
                onChange={update("phone")}
                invalid={Boolean(validationError) && !values.phone}
                describedBy={messageId}
              />
            </span>
          </label>
          <label className="dlg-field">
            <span className="mono">{text.niche}</span>
            <input
              name="niche"
              maxLength={LEAD_FIELD_MAX_LENGTH}
              value={values.niche}
              onChange={update("niche")}
            />
          </label>
          <label className="dlg-field">
            <span className="mono">{text.contact}</span>
            <input
              name="contact"
              autoComplete="email"
              maxLength={LEAD_FIELD_MAX_LENGTH}
              value={values.contact}
              onChange={update("contact")}
            />
          </label>
          <p className={message ? "form-msg err" : "form-msg"} id={messageId} role="alert">
            {message}
          </p>
          <button className="btn btn-blue" type="submit" disabled={isLoading}>
            {isLoading ? text.submitting : text.submit} <Arrow />
          </button>
          <a className="dlg-alt" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            {text.telegram}
          </a>
        </form>
      )}
    </DialogShell>
  );
}

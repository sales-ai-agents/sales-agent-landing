"use client";

import { useId, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLandingCopy } from "@/components/landing/copy/provider";
import { DialogShell } from "@/components/landing/dialog-shell";
import type { FormDialogProps } from "@/components/landing/dialog-types";
import { Arrow } from "@/components/landing/typography";
import { buildFeedbackSchema } from "@/components/landing/schemas";
import { FEEDBACK_MESSAGE_MAX_LENGTH } from "@/lib/schemas";
import { trackEvent } from "@/lib/analytics";
import { useFeedbackForm } from "@/components/landing/api/use-feedback-form";
import "./dialogs.css";

interface FeedbackValues {
  message: string;
  email: string;
  marketingConsent: boolean;
}

const EMPTY_VALUES: FeedbackValues = { message: "", email: "", marketingConsent: false };

export function FeedbackDialog({ open, source, onClose }: FormDialogProps) {
  const { copy } = useLandingCopy();
  const text = copy.dialogs.feedback;
  const feedbackSchema = useMemo(() => buildFeedbackSchema(copy.validation), [copy.validation]);
  const [values, setValues] = useState<FeedbackValues>(EMPTY_VALUES);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { submitFeedbackAsync, isLoading, errorMessage, reset } = useFeedbackForm();
  const messageId = useId();

  const close = (): void => {
    setSubmitted(false);
    onClose();
  };

  const update =
    (field: keyof FeedbackValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const target = event.target;
      const next =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setValues((current) => ({ ...current, [field]: next }));
      setValidationError(null);
      if (errorMessage) reset();
    };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const parsed = feedbackSchema.safeParse(values);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? null);
      return;
    }
    try {
      await submitFeedbackAsync({ ...parsed.data, source_page: source });
      trackEvent("feedback_form_submit", { location: source });
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
            <span className="mono">{text.message}</span>
            <textarea
              name="message"
              rows={4}
              maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
              value={values.message}
              onChange={update("message")}
              aria-describedby={messageId}
            />
          </label>
          <label className="dlg-field">
            <span className="mono">{text.email}</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={update("email")}
              aria-describedby={messageId}
            />
          </label>
          <label className="dlg-check">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={values.marketingConsent}
              onChange={update("marketingConsent")}
            />
            <span>{text.consent}</span>
          </label>
          <p className={message ? "form-msg err" : "form-msg"} id={messageId} role="alert">
            {message}
          </p>
          <button className="btn btn-blue" type="submit" disabled={isLoading}>
            {isLoading ? text.submitting : text.submit} <Arrow />
          </button>
        </form>
      )}
    </DialogShell>
  );
}

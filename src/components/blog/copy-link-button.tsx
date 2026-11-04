"use client";

import { useEffect, useRef, useState } from "react";

const RESET_DELAY_MS = 1800;

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_DELAY_MS);
  };

  return (
    <button type="button" onClick={copy} aria-live="polite">
      {copied ? "Скопійовано ✓" : "Скопіювати посилання"}
    </button>
  );
}

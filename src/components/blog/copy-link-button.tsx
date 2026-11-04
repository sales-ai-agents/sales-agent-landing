"use client";

import { useEffect, useRef, useState } from "react";
import { useLandingCopy } from "@/components/landing/copy/provider";

const RESET_DELAY_MS = 1800;

export function CopyLinkButton() {
  const { copy } = useLandingCopy();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyToClipboard = async (): Promise<void> => {
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
    <button type="button" onClick={copyToClipboard} aria-live="polite">
      {copied ? copy.blog.copied : copy.blog.copyLink}
    </button>
  );
}

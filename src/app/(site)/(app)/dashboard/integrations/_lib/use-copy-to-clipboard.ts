import { useCallback, useState } from "react";
import { toast } from "sonner";

const COPIED_RESET_MS = 1400;

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      toast.error("Не вдалося скопіювати");
    }
  }, []);

  return { copied, copy };
};

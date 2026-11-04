import { useCallback, useState } from "react";

import { openSpreadsheetPicker, type PickedSpreadsheet } from "@/lib/google-picker";

interface UseGooglePickerResult {
  pick: () => Promise<PickedSpreadsheet | null>;
  isOpening: boolean;
}

export const useGooglePicker = (): UseGooglePickerResult => {
  const [isOpening, setIsOpening] = useState(false);

  const pick = useCallback(async (): Promise<PickedSpreadsheet | null> => {
    setIsOpening(true);
    try {
      return await openSpreadsheetPicker();
    } finally {
      setIsOpening(false);
    }
  }, []);

  return { pick, isOpening };
};

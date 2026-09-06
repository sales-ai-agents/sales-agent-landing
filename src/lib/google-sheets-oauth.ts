const GOOGLE_SHEETS_OAUTH_STATE_KEY = "google_sheets_oauth_state";

function generateSecureRandomToken(): string {
  if (typeof globalThis.crypto !== "undefined") {
    if (typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    if (typeof globalThis.crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(32);
      globalThis.crypto.getRandomValues(bytes);
      return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
  }
  throw new Error(
    "Криптографічно надійний генератор випадкових чисел недоступний у вашому браузері."
  );
}

export const generateAndSaveGoogleSheetsOAuthState = (): string => {
  const state = generateSecureRandomToken();

  try {
    if (typeof window === "undefined" || !window.sessionStorage) {
      throw new Error("sessionStorage недоступний");
    }
    window.sessionStorage.setItem(GOOGLE_SHEETS_OAUTH_STATE_KEY, state);
    const saved = window.sessionStorage.getItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);
    if (saved !== state) {
      throw new Error("Не вдалося зберегти стан у sessionStorage");
    }
  } catch {
    throw new Error(
      "Для безпечної авторизації потрібен доступ до сховища sessionStorage. Перевірте налаштування конфіденційності браузера."
    );
  }

  return state;
};

export const verifyGoogleSheetsOAuthState = (returnedState: string | null): boolean => {
  try {
    const savedState = window.sessionStorage.getItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);
    window.sessionStorage.removeItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);

    return Boolean(returnedState && savedState && returnedState === savedState);
  } catch {
    return false;
  }
};

export const clearGoogleSheetsOAuthState = (): void => {
  try {
    window.sessionStorage.removeItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);
  } catch {
    // Storage can be unavailable when the browser blocks site data.
  }
};

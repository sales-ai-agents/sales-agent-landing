const GOOGLE_SHEETS_OAUTH_STATE_KEY = "google_sheets_oauth_state";
const STATE_TTL_MS = 10 * 60 * 1000;
const RANDOM_TOKEN_BYTES = 32;
const HEX_RADIX = 16;

interface StoredOAuthState {
  value: string;
  expiresAt: number;
}

const isBrowserStorageAvailable = (): boolean => {
  return typeof window !== "undefined" && Boolean(window.localStorage);
};

const generateSecureRandomToken = (): string => {
  const cryptoApi = globalThis.crypto;

  if (typeof cryptoApi !== "undefined") {
    if (typeof cryptoApi.randomUUID === "function") {
      return cryptoApi.randomUUID();
    }
    if (typeof cryptoApi.getRandomValues === "function") {
      const bytes = new Uint8Array(RANDOM_TOKEN_BYTES);
      cryptoApi.getRandomValues(bytes);
      return Array.from(bytes, (byte) => byte.toString(HEX_RADIX).padStart(2, "0")).join("");
    }
  }

  throw new Error(
    "Криптографічно надійний генератор випадкових чисел недоступний у вашому браузері."
  );
};

const readStoredState = (): StoredOAuthState | null => {
  if (!isBrowserStorageAvailable()) return null;

  const raw = window.localStorage.getItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredOAuthState>;
    if (typeof parsed.value !== "string" || typeof parsed.expiresAt !== "number") {
      return null;
    }
    return { value: parsed.value, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
};

export const generateAndSaveGoogleSheetsOAuthState = (): string => {
  const state = generateSecureRandomToken();

  try {
    if (!isBrowserStorageAvailable()) {
      throw new Error("localStorage недоступний");
    }

    const payload: StoredOAuthState = { value: state, expiresAt: Date.now() + STATE_TTL_MS };
    window.localStorage.setItem(GOOGLE_SHEETS_OAUTH_STATE_KEY, JSON.stringify(payload));

    if (readStoredState()?.value !== state) {
      throw new Error("Не вдалося зберегти стан у localStorage");
    }
  } catch {
    throw new Error(
      "Для безпечної авторизації потрібен доступ до сховища localStorage. Перевірте налаштування конфіденційності браузера."
    );
  }

  return state;
};

export const verifyGoogleSheetsOAuthState = (returnedState: string | null): boolean => {
  try {
    const stored = readStoredState();
    if (!stored) return false;

    const isExpired = Date.now() > stored.expiresAt;
    if (isExpired) {
      clearGoogleSheetsOAuthState();
      return false;
    }

    // Consume the state only on a confirmed match so a retry cannot discard a valid token.
    const isMatch = Boolean(returnedState) && returnedState === stored.value;
    if (isMatch) {
      clearGoogleSheetsOAuthState();
    }

    return isMatch;
  } catch {
    return false;
  }
};

export const clearGoogleSheetsOAuthState = (): void => {
  try {
    if (!isBrowserStorageAvailable()) return;
    window.localStorage.removeItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);
  } catch {
    // Storage can be unavailable when the browser blocks site data.
  }
};

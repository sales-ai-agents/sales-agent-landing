const GOOGLE_SHEETS_OAUTH_STATE_KEY = "google_sheets_oauth_state";

export const saveGoogleSheetsOAuthState = (authUrl: string): boolean => {
  try {
    const url = new URL(authUrl, window.location.origin);
    const state = url.searchParams.get("state");

    if (!state) return false;

    sessionStorage.setItem(GOOGLE_SHEETS_OAUTH_STATE_KEY, state);
    return true;
  } catch {
    return false;
  }
};

export const verifyGoogleSheetsOAuthState = (returnedState: string | null): boolean => {
  try {
    const savedState = sessionStorage.getItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);
    sessionStorage.removeItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);

    return Boolean(returnedState && savedState && returnedState === savedState);
  } catch {
    return false;
  }
};

export const clearGoogleSheetsOAuthState = (): void => {
  try {
    sessionStorage.removeItem(GOOGLE_SHEETS_OAUTH_STATE_KEY);
  } catch {
    // Storage can be unavailable when the browser blocks site data.
  }
};

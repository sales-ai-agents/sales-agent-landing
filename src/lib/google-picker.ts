const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GAPI_SCRIPT_SRC = "https://apis.google.com/js/api.js";
const DRIVE_FILE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const SPREADSHEET_MIME_TYPE = "application/vnd.google-apps.spreadsheet";

export interface PickedSpreadsheet {
  id: string;
  name: string;
}

interface GooglePickerConfig {
  clientId: string;
  apiKey: string;
  appId: string;
}

const readPickerConfig = (): GooglePickerConfig | null => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PICKER_API_KEY;
  const appId = process.env.NEXT_PUBLIC_GOOGLE_PICKER_APP_ID;

  if (!clientId || !apiKey || !appId) return null;

  return { clientId, apiKey, appId };
};

export const isGooglePickerConfigured = (): boolean => readPickerConfig() !== null;

const scriptPromises = new Map<string, Promise<void>>();

const loadScript = (src: string): Promise<void> => {
  const cached = scriptPromises.get(src);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Не вдалося завантажити ${src}`));
    document.head.appendChild(script);
  });

  scriptPromises.set(src, promise);
  return promise;
};

const loadPickerApi = async (): Promise<void> => {
  await loadScript(GAPI_SCRIPT_SRC);

  await new Promise<void>((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error("Google API недоступний"));
      return;
    }
    window.gapi.load("picker", () => resolve());
  });
};

const requestAccessToken = (config: GooglePickerConfig): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    if (!window.google) {
      reject(new Error("Google Identity Services недоступний"));
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: config.clientId,
      scope: DRIVE_FILE_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error_description ?? "Авторизацію скасовано"));
          return;
        }
        resolve(response.access_token);
      },
    });

    tokenClient.requestAccessToken({ prompt: "" });
  });
};

const showPicker = (
  config: GooglePickerConfig,
  accessToken: string
): Promise<PickedSpreadsheet | null> => {
  return new Promise<PickedSpreadsheet | null>((resolve, reject) => {
    const picker = window.google?.picker;
    if (!picker) {
      reject(new Error("Google Picker недоступний"));
      return;
    }

    const view = new picker.DocsView(picker.ViewId.SPREADSHEETS)
      .setIncludeFolders(true)
      .setMimeTypes(SPREADSHEET_MIME_TYPE);

    const instance = new picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(config.apiKey)
      .setAppId(config.appId)
      .setCallback((data) => {
        if (data.action === picker.Action.PICKED) {
          const doc = data.docs?.[0];
          resolve(doc ? { id: doc.id, name: doc.name } : null);
        } else if (data.action === picker.Action.CANCEL) {
          resolve(null);
        }
      })
      .build();

    instance.setVisible(true);
  });
};

export const openSpreadsheetPicker = async (): Promise<PickedSpreadsheet | null> => {
  const config = readPickerConfig();
  if (!config) {
    throw new Error("Google Picker не налаштовано. Зверніться до підтримки.");
  }

  await Promise.all([loadScript(GSI_SCRIPT_SRC), loadPickerApi()]);

  const accessToken = await requestAccessToken(config);
  return showPicker(config, accessToken);
};

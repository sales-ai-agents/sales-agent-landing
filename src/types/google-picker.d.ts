export {};

interface GooglePickerDocument {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

interface GooglePickerResponse {
  action: string;
  docs?: GooglePickerDocument[];
}

interface GooglePickerBuilder {
  addView: (view: unknown) => GooglePickerBuilder;
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  setAppId: (appId: string) => GooglePickerBuilder;
  setCallback: (callback: (data: GooglePickerResponse) => void) => GooglePickerBuilder;
  setTitle: (title: string) => GooglePickerBuilder;
  enableFeature: (feature: unknown) => GooglePickerBuilder;
  build: () => { setVisible: (visible: boolean) => void };
}

interface GoogleDocsView {
  setIncludeFolders: (include: boolean) => GoogleDocsView;
  setMimeTypes: (mimeTypes: string) => GoogleDocsView;
  setMode: (mode: unknown) => GoogleDocsView;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  callback: (response: GoogleTokenResponse) => void;
  requestAccessToken: (options?: { prompt?: string }) => void;
}

declare global {
  interface Window {
    gapi?: {
      load: (api: string, callback: () => void) => void;
    };
    google?: {
      picker: {
        PickerBuilder: new () => GooglePickerBuilder;
        DocsView: new (viewId?: unknown) => GoogleDocsView;
        ViewId: { SPREADSHEETS: unknown; DOCS: unknown };
        Action: { PICKED: string; CANCEL: string };
        Feature: { NAV_HIDDEN: unknown; MULTISELECT_ENABLED: unknown };
        DocsViewMode: { LIST: unknown; GRID: unknown };
      };
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
          }) => GoogleTokenClient;
          revoke: (token: string, callback?: () => void) => void;
        };
      };
    };
  }
}

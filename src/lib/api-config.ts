const API_BASE = "/api";

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: `${API_BASE}/auth/register`,
  AUTH_LOGIN: `${API_BASE}/auth/login`,
  AUTH_ME: `${API_BASE}/auth/me`,
  AUTH_LOGOUT: `${API_BASE}/auth/logout`,

  // App (authenticated)
  APP_STATS: `${API_BASE}/app/stats`,
  APP_CALLS: `${API_BASE}/app/calls`,
  APP_AGENTS: `${API_BASE}/app/agents`,
  APP_CONTACTS: `${API_BASE}/app/contacts`,
  APP_CONTACTS_UPLOAD: `${API_BASE}/app/contacts/upload`,
  APP_TEST_CALL: `${API_BASE}/app/agents/test-call`,
  APP_CAMPAIGNS: `${API_BASE}/app/campaigns`,
  APP_CAMPAIGNS_CONTROL: `${API_BASE}/app/campaigns/control`,

  // Landing page (public)
  DEMO_CALL: `${API_BASE}/demo-call`,
  LEAD: `${API_BASE}/website/lead`,
  WEB_AGENT: `${API_BASE}/web-agent/start`,
  PRESETS: `${API_BASE}/constructor/presets`,
} as const;

export const apiUrl = {
  agent: (id: number | string) => `${API_ENDPOINTS.APP_AGENTS}/${id}`,
  agentStatus: (id: number | string) => `${API_ENDPOINTS.APP_AGENTS}/${id}/status`,
  agentDelete: (id: number | string) => `${API_ENDPOINTS.APP_AGENTS}/${id}/delete`,
  contact: (id: number | string) => `${API_ENDPOINTS.APP_CONTACTS}/${id}`,
  contactDelete: (id: number | string) => `${API_ENDPOINTS.APP_CONTACTS}/${id}/delete`,
  call: (id: string) => `${API_ENDPOINTS.APP_CALLS}/${id}`,
  calls: (params?: { limit?: number; offset?: number }) => {
    const url = API_ENDPOINTS.APP_CALLS;

    if (!params) return url;

    const sp = new URLSearchParams();

    if (params.limit !== undefined) sp.set("limit", String(params.limit));
    if (params.offset !== undefined) sp.set("offset", String(params.offset));

    const qs = sp.toString();

    return qs ? `${url}?${qs}` : url;
  },
  contacts: (search?: string) => {
    if (!search) return API_ENDPOINTS.APP_CONTACTS;

    return `${API_ENDPOINTS.APP_CONTACTS}?search=${encodeURIComponent(search)}`;
  },
} as const;

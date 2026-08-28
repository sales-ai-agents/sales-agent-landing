const API_BASE = "/api";

export const API_ENDPOINTS = {
  // Auth
  AUTH_PROVIDERS: `${API_BASE}/auth/providers`,
  AUTH_REGISTER: `${API_BASE}/auth/register`,
  AUTH_LOGIN: `${API_BASE}/auth/login`,
  AUTH_ME: `${API_BASE}/auth/me`,
  AUTH_PASSWORD: `${API_BASE}/auth/password`,
  AUTH_LOGOUT: `${API_BASE}/auth/logout`,
  AUTH_SOCIAL: `${API_BASE}/auth/social`,

  // App (authenticated)
  APP_STATS: `${API_BASE}/app/stats`,
  APP_CALLS: `${API_BASE}/app/calls`,
  APP_CALLS_EXPORT: `${API_BASE}/app/calls/export`,
  APP_AGENTS: `${API_BASE}/app/agents`,
  APP_VOICES: `${API_BASE}/app/voices`,
  APP_CONTACTS: `${API_BASE}/app/contacts`,
  APP_CONTACTS_UPLOAD: `${API_BASE}/app/contacts/upload`,
  APP_CONTACTS_EXPORT: `${API_BASE}/app/contacts/export`,
  APP_TEST_CALL: `${API_BASE}/app/agents/test-call`,

  // Integrations
  APP_INTEGRATIONS: `${API_BASE}/app/integrations`,
  APP_WEBHOOKS: `${API_BASE}/app/webhooks`,
  APP_WEBHOOK_DELIVERIES: `${API_BASE}/app/webhooks/deliveries`,
  APP_API_KEYS: `${API_BASE}/app/api-keys`,

  // Team & Settings
  APP_TEAM: `${API_BASE}/app/team`,
  APP_NOTIFICATIONS: `${API_BASE}/app/notifications`,
  APP_AUDIT: `${API_BASE}/app/audit`,

  // Billing
  APP_BILLING_PLANS: `${API_BASE}/app/billing/plans`,
  APP_BILLING_CHECKOUT: `${API_BASE}/app/billing/checkout`,
  APP_BILLING_STATUS: `${API_BASE}/app/billing/status`,
  APP_BILLING_HISTORY: `${API_BASE}/app/billing/history`,

  // Support
  APP_SUPPORT_CHAT: `${API_BASE}/app/support-chat`,

  // Landing page (public)
  DEMO_CALL: `${API_BASE}/demo-call`,
  LEAD: `${API_BASE}/website/lead`,
  WEB_AGENT: `${API_BASE}/web-agent/start`,
  PRESETS: `${API_BASE}/constructor/presets`,
} as const;

export const apiUrl = {
  agent: (id: number | string) => `${API_ENDPOINTS.APP_AGENTS}/${id}`,
  agents: (params?: { stats?: boolean; days?: number }) => {
    const url = API_ENDPOINTS.APP_AGENTS;
    if (!params?.stats) return url;

    const sp = new URLSearchParams();
    sp.set("stats", "1");
    if (params.days !== undefined) sp.set("days", String(params.days));

    return `${url}?${sp.toString()}`;
  },
  contact: (id: number | string) => `${API_ENDPOINTS.APP_CONTACTS}/${id}`,
  call: (id: string) => `${API_ENDPOINTS.APP_CALLS}/${id}`,
  calls: (params?: {
    limit?: number;
    offset?: number;
    date_from?: string;
    date_to?: string;
    status?: string;
    agent_id?: number;
    phone?: string;
  }) => {
    const url = API_ENDPOINTS.APP_CALLS;

    if (!params) return url;

    const sp = new URLSearchParams();

    if (params.limit !== undefined) sp.set("limit", String(params.limit));
    if (params.offset !== undefined) sp.set("offset", String(params.offset));
    if (params.date_from) sp.set("date_from", params.date_from);
    if (params.date_to) sp.set("date_to", params.date_to);
    if (params.status) sp.set("status", params.status);
    if (params.agent_id !== undefined) sp.set("agent_id", String(params.agent_id));
    if (params.phone) sp.set("phone", params.phone);

    const qs = sp.toString();

    return qs ? `${url}?${qs}` : url;
  },
  contacts: (search?: string) => {
    if (!search) return API_ENDPOINTS.APP_CONTACTS;

    return `${API_ENDPOINTS.APP_CONTACTS}?search=${encodeURIComponent(search)}`;
  },
  billingStatus: (invoiceId: string) =>
    `${API_ENDPOINTS.APP_BILLING_STATUS}?invoice_id=${encodeURIComponent(invoiceId)}`,
  callAudio: (callId: string) => `${API_ENDPOINTS.APP_CALLS}/${callId}/audio`,
  callCrmStatus: (callId: string) => `${API_ENDPOINTS.APP_CALLS}/${callId}/crm-status`,
  callCrmRetry: (callId: string) => `${API_ENDPOINTS.APP_CALLS}/${callId}/crm-retry`,
  callNote: (callId: string) => `${API_ENDPOINTS.APP_CALLS}/${callId}/note`,
  callsExport: (params?: {
    date_from?: string;
    date_to?: string;
    status?: string;
    agent_id?: number;
    phone?: string;
  }) => {
    const url = API_ENDPOINTS.APP_CALLS_EXPORT;
    if (!params) return url;
    const sp = new URLSearchParams();
    if (params.date_from) sp.set("date_from", params.date_from);
    if (params.date_to) sp.set("date_to", params.date_to);
    if (params.status) sp.set("status", params.status);
    if (params.agent_id !== undefined) sp.set("agent_id", String(params.agent_id));
    if (params.phone) sp.set("phone", params.phone);
    const qs = sp.toString();
    return qs ? `${url}?${qs}` : url;
  },
  contactsExport: (search?: string) => {
    const url = API_ENDPOINTS.APP_CONTACTS_EXPORT;
    if (!search) return url;
    return `${url}?search=${encodeURIComponent(search)}`;
  },
  webhook: (id: number) => `${API_ENDPOINTS.APP_WEBHOOKS}/${id}`,
  webhookTest: (id: number) => `${API_ENDPOINTS.APP_WEBHOOKS}/${id}/test`,
  webhookSecret: (id: number) => `${API_ENDPOINTS.APP_WEBHOOKS}/${id}/secret`,
  webhookDeliveries: (webhookId?: number, limit?: number) => {
    const url = API_ENDPOINTS.APP_WEBHOOK_DELIVERIES;
    const sp = new URLSearchParams();
    if (webhookId !== undefined) sp.set("webhook_id", String(webhookId));
    if (limit !== undefined) sp.set("limit", String(limit));
    const qs = sp.toString();
    return qs ? `${url}?${qs}` : url;
  },
  apiKey: (id: number) => `${API_ENDPOINTS.APP_API_KEYS}/${id}`,
  teamMember: (id: number) => `${API_ENDPOINTS.APP_TEAM}/${id}`,
  audit: (params?: { limit?: number; offset?: number }) => {
    const url = API_ENDPOINTS.APP_AUDIT;
    if (!params) return url;
    const sp = new URLSearchParams();
    if (params.limit !== undefined) sp.set("limit", String(params.limit));
    if (params.offset !== undefined) sp.set("offset", String(params.offset));
    const qs = sp.toString();
    return qs ? `${url}?${qs}` : url;
  },
} as const;

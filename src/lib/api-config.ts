/**
 * Centralized API endpoint configuration.
 * All external API URLs are defined here to ensure consistency
 * and make environment-based overrides straightforward.
 */

const API_BASE_URL = "https://api.calls4u.ai";

export const API_ENDPOINTS = {
  DEMO_CALL: `${API_BASE_URL}/webhook/demo-call`,
  LEAD: `${API_BASE_URL}/webhook/website/lead`,
  WEB_AGENT: `${API_BASE_URL}/webhook/web-agent/start`,
  PRESETS: `${API_BASE_URL}/webhook/constructor/presets`,
} as const;

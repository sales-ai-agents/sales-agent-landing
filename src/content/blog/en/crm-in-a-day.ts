import type { BlogPost } from "@/content/blog/types";

export const crmInADayPost: BlogPost = {
  slug: "crm-in-a-day",
  category: "How-to",
  readMinutes: 4,
  cover: "crm",
  title: "How to Launch an AI Voice Agent with CRM Integration in One Day",
  excerpt:
    "Step by step: script, voice, contacts, a test call, and result syncing, with no developers needed.",
  publishedAt: "2026-09-23",
  updatedAt: "2026-09-23",
  blocks: [
    {
      type: "lead",
      text: "Launching an agent doesn't require developers. Here is a step-by-step plan that fits into a single workday.",
    },
    { type: "heading", text: "Step 1. Choose a scenario" },
    {
      type: "paragraph",
      text: "Start with a ready-made template: appointment confirmation, reminders, order verification, or lead qualification. You can adapt the phrasing to your business and your tone of voice.",
    },
    { type: "heading", text: "Step 2. Set up your agent" },
    {
      type: "paragraph",
      text: "Give the agent a name, pick a female or male voice, and describe the conversation rules in plain language: what to ask, how to answer common questions, and when to hand the call to a manager.",
    },
    { type: "heading", text: "Step 3. Connect your data" },
    {
      type: "paragraph",
      text: "Upload contacts from a CSV, Google Sheets, or a connected CRM. After each call, the result is written back to the customer record: status, a short summary, and the call recording. For other systems, webhooks are available.",
    },
    { type: "heading", text: "Step 4. Test it on yourself" },
    {
      type: "paragraph",
      text: "Make a test call to your own number: listen to the voice and check the script and how the agent behaves. Only then start calling customers.",
    },
    { type: "quote", text: "From sign-up to your first calls takes one day." },
    { type: "heading", text: "After launch" },
    {
      type: "paragraph",
      text: "You can change the script at any time: the phrasing, call times, and handoff rules. If you need to check your contact list or script, calls can be paused in one click.",
    },
  ],
};

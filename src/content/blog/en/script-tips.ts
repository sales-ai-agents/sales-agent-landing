import type { BlogPost } from "@/content/blog/types";

export const scriptTipsPost: BlogPost = {
  slug: "script-tips",
  category: "Guides",
  readMinutes: 5,
  cover: "script",
  title: "How to Write a Script for an AI Voice Agent: 7 Rules That Work",
  excerpt:
    "Short phrases, closed questions, a clear outcome for every call, and four more rules for a good script.",
  publishedAt: "2026-10-07",
  updatedAt: "2026-10-07",
  blocks: [
    {
      type: "lead",
      text: "A good script is short, polite, and steers the conversation toward a specific outcome. Here are seven rules that work in most industries.",
    },
    { type: "heading", text: "1. State your name and the reason for the call right away" },
    {
      type: "paragraph",
      text: "From the first sentence, the customer should know who is calling and why: “Hello! This is Maria from the Lumi salon, calling about your appointment.”",
    },
    { type: "heading", text: "2. One idea, one sentence" },
    {
      type: "paragraph",
      text: "Short lines are easier to follow by ear. Long sentences with several questions confuse the person on the other end.",
    },
    { type: "heading", text: "3. Use closed questions when you need a clear answer" },
    {
      type: "paragraph",
      text: "“Shall we confirm your appointment for 2 PM?” works better than “How are your plans looking for tomorrow?”",
    },
    { type: "heading", text: "4. Anticipate the typical answers" },
    {
      type: "paragraph",
      text: "Rescheduling, declining, “call me back later,” “how much does it cost?”: spell out how the agent responds to each one.",
    },
    { type: "heading", text: "5. Define the outcome of every call" },
    {
      type: "paragraph",
      text: "“Confirmed,” “rescheduled,” “needs a manager”: clear statuses that then flow into the call log and the CRM.",
    },
    { type: "heading", text: "6. Specify when to hand the conversation to a person" },
    {
      type: "paragraph",
      text: "Complex questions, complaints, requests to speak with a manager: the agent has to know when to connect the customer with a person.",
    },
    { type: "heading", text: "7. Test it on yourself" },
    {
      type: "paragraph",
      text: "Make a test call, listen to recordings of the first few conversations, and tweak the phrasing.",
    },
    {
      type: "quote",
      text: "A script isn't set in stone like an old price list at the front desk. You can change it any time.",
    },
  ],
};

import type { BlogPost } from "@/content/blog/types";

export const mythsPost: BlogPost = {
  slug: "myths",
  category: "Myths",
  readMinutes: 5,
  cover: "myth",
  title: "5 Myths About AI Voice Agents That Business Owners Still Believe",
  excerpt:
    "“The agent will say too much,” “it's complicated,” “I won't have any control”: we test each myth.",
  publishedAt: "2026-09-30",
  updatedAt: "2026-09-30",
  blocks: [
    {
      type: "lead",
      text: "AI voice agents still raise suspicion. We go through the five most common myths and what's actually true.",
    },
    { type: "heading", text: "Myth 1. “The agent will say too much”" },
    {
      type: "paragraph",
      text: "The agent follows your script. If a question falls outside it, or the customer asks for a person, the agent doesn't improvise. It hands the call to a manager along with a summary of the conversation.",
    },
    { type: "heading", text: "Myth 2. “It's hard to set up”" },
    {
      type: "paragraph",
      text: "The script is configured without code, in plain language, and ready-made templates cover typical tasks. From sign-up to your first calls takes one day.",
    },
    { type: "heading", text: "Myth 3. “I won't know what the agent told my customers”" },
    {
      type: "paragraph",
      text: "Every conversation is saved in the log: status, a short summary, and an audio recording. Results sync with your CRM or Google Sheets.",
    },
    { type: "heading", text: "Myth 4. “It's expensive”" },
    {
      type: "paragraph",
      text: "Plans start at $29 a month, and you pay only for the conversation minutes you use. Scripts, integrations, and a test balance are already included.",
    },
    { type: "heading", text: "Myth 5. “You can't test it first”" },
    {
      type: "paragraph",
      text: "You can, and you should: before launch, the agent calls your own number, and you hear the conversation exactly as a customer would.",
    },
    {
      type: "quote",
      text: "The best way to bust a myth is one test call to your own number.",
    },
  ],
};

import type { BlogPost } from "@/content/blog/types";

export const agentVsAdminPost: BlogPost = {
  slug: "agent-vs-admin",
  category: "Comparison",
  readMinutes: 6,
  cover: "vs",
  title: "AI Voice Agent vs. Receptionist: An Honest Comparison for Salons and Clinics",
  excerpt:
    "Where people are irreplaceable, and where an agent works faster, more accurately, and without days off. And why the best setup is both.",
  publishedAt: "2026-09-16",
  updatedAt: "2026-09-16",
  blocks: [
    {
      type: "lead",
      text: "The question isn't who to replace. It's how to split the work so your receptionist doesn't spend the day on identical calls and your customers get an answer right away.",
    },
    { type: "heading", text: "Where a receptionist is strong" },
    {
      type: "list",
      items: [
        "Personal conversations with regular customers.",
        "Complex and conflict situations.",
        "Advice and upselling additional services during a visit.",
      ],
    },
    { type: "heading", text: "Where an AI voice agent is strong" },
    {
      type: "list",
      items: [
        "High-volume, repetitive calls: confirmations, reminders, clarifications.",
        "Calls in the evening, at night, and on weekends.",
        "Fast callbacks on new leads while the customer is still warm.",
        "An accurate log: the status, summary, and recording of every conversation.",
      ],
    },
    { type: "heading", text: "The economics" },
    {
      type: "paragraph",
      text: "A receptionist has a work schedule, days off, and sick leave. An agent works 24/7 and is paid for by the minute of conversation, with plans starting at $29 a month. But the main savings aren't in salary, they're in time: an agent frees up to 70% of the time your manager used to spend on routine calls.",
    },
    {
      type: "quote",
      text: "The agent takes the routine. People take the conversations that need a person.",
    },
    { type: "heading", text: "The best setup is both" },
    {
      type: "paragraph",
      text: "The agent handles repetitive calls and passes complex conversations to a manager along with the context. Your receptionist gets customers who are already prepared, and more time for the people who walk in.",
    },
  ],
};

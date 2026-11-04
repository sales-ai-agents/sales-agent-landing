import type { BlogPost } from "@/content/blog/types";

export const scenariosPost: BlogPost = {
  slug: "scenarios",
  category: "Guides",
  readMinutes: 6,
  cover: "five",
  title: "5 Call Scenarios to Hand Over to an AI Voice Agent Today",
  excerpt:
    "Appointment confirmation calls, reminders, order verification: here is which conversations an AI voice agent handles without a manager, and how to launch them in a single day.",
  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",
  blocks: [
    {
      type: "lead",
      text: "Most calls in a service business are the same: confirm an appointment, remind someone about a visit, check a delivery address. Your manager makes these calls dozens of times a day when they could be selling. Here are five scenarios an AI agent can take over without changing your processes.",
    },
    { type: "heading", text: "1. Appointment confirmation calls" },
    {
      type: "paragraph",
      text: "Ideal for salons, clinics, auto repair shops, and anyone who works by appointment. The agent calls the client the day before, checks that everything still works, and records the answer: “confirmed” or “reschedule”. If the client wants a different time, the agent offers open slots and books the change.",
    },
    {
      type: "dialog",
      lines: [
        {
          speaker: "agent",
          text: "Hello, Olena! This is Maria from the “Lumi” salon. Are we still on for your appointment tomorrow at 2 PM?",
        },
        { speaker: "client", text: "Yes, I'll be there." },
        { speaker: "agent", text: "Great! I'll send you a reminder two hours before." },
      ],
    },
    {
      type: "paragraph",
      text: "The result goes straight into the call log and your CRM, so your front desk can see the status of every appointment before the workday starts.",
    },
    { type: "heading", text: "2. Visit reminders" },
    {
      type: "paragraph",
      text: "A reminder a day or a few hours before the visit is the simplest way to cut no-shows and empty slots in your schedule. The agent states the date, time, address, and any details, such as what to bring to the appointment. If the client can't make it, they can reschedule right on the call, and the change lands in your system too.",
    },
    { type: "heading", text: "3. Order verification" },
    {
      type: "paragraph",
      text: "For online stores, this is the most common routine call: checking the order contents, the address, the payment method, and a convenient delivery time. The agent goes through everything in a minute or two and sends the order on for processing. If something has changed, it records the correction and your manager sees it in the dashboard.",
    },
    { type: "heading", text: "4. Lead qualification" },
    {
      type: "paragraph",
      text: "Leads from ads go cold fast. The agent calls back right away, asks a few questions about needs, budget, and timeline, and hands your manager a warm contact with a short summary of the conversation. Your manager spends time only on people who are ready to buy.",
    },
    {
      type: "quote",
      text: "The agent doesn't replace your manager. It takes the routine so your manager can focus on sales.",
    },
    { type: "heading", text: "5. Re-engagement calls to your customer base" },
    {
      type: "paragraph",
      text: "Every business has customers who haven't been back in a while. The agent works through that list using your script: it invites them to book, reminds them about a service or a new offer, and records each customer's response and the next step.",
    },
    { type: "heading", text: "What not to hand over to the agent" },
    {
      type: "paragraph",
      text: "Complex negotiations, conflicts, and unusual questions. For these cases, Calls4U has a human handoff: if the client asks for a manager or the question goes beyond the script, the agent doesn't improvise. It connects the client to a manager and passes along the context of the conversation.",
    },
    { type: "heading", text: "Where to start" },
    {
      type: "list",
      items: [
        "Pick one scenario: the most frequent call in your business.",
        "Set up the voice and a few phrases to match your tone.",
        "Upload your contacts from a CSV, Google Sheets, or your CRM.",
        "Make a test call to your own number, and only then start calling customers.",
      ],
    },
    {
      type: "paragraph",
      text: "Launch takes one day, and the first test call takes a few minutes.",
    },
  ],
};

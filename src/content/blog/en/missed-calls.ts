import type { BlogPost } from "@/content/blog/types";

export const missedCallsPost: BlogPost = {
  slug: "missed-calls",
  category: "Economics",
  readMinutes: 5,
  cover: "econ",
  title: "What a Missed Call Costs and How to Calculate Your Business Losses",
  excerpt:
    "A simple four-number formula that shows how much money you lose every month on calls nobody answered.",
  publishedAt: "2026-09-09",
  updatedAt: "2026-09-09",
  blocks: [
    {
      type: "lead",
      text: "A missed call rarely looks like a problem: the phone rings, nobody gets to it, and the day moves on. But behind every one of those calls is a person who is most likely already dialing your competitor.",
    },
    { type: "heading", text: "The loss formula" },
    {
      type: "paragraph",
      text: "You can calculate your losses from four numbers in your business:",
    },
    {
      type: "list",
      items: [
        "how many inbound calls you get per day;",
        "what share of them you miss or don't handle in time;",
        "how many of those callers would have become customers;",
        "your average order value.",
      ],
    },
    {
      type: "formula",
      text: "calls per day × share missed × conversion rate × average order value × working days",
    },
    { type: "heading", text: "Example calculation" },
    {
      type: "paragraph",
      text: "Take a sample business: 40 calls a day, 15% of them missed, 30% of those calls could have become a sale, and an average order value of UAH 1,100. Over 26 working days, that is 47 lost customers and UAH 51,480 a month.",
    },
    {
      type: "note",
      text: "The numbers in this example are illustrative. Plug in your own to see the real cost of missed calls for your business.",
    },
    { type: "heading", text: "Why these losses go almost unnoticed" },
    {
      type: "paragraph",
      text: "Missed calls never show up in sales reports. A person who couldn't get through doesn't file a complaint; they just leave. That's why the cost of missed calls is almost always underestimated, especially in the evening, on weekends, and at peak hours when your front desk is busy with customers in person.",
    },
    { type: "quote", text: "The most expensive call is the one nobody answered." },
    { type: "heading", text: "How to close the gap" },
    {
      type: "paragraph",
      text: "An AI voice agent calls back a missed caller within seconds, finds out what they need, and books them in, even in the evening or on a weekend. Your manager gets a ready result in the call log and the CRM, and the customer gets an answer exactly when they need it.",
    },
  ],
};

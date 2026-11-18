import {
  CONNECTOR_URL,
  PRIVACY_POLICY_HREF,
  SIGN_UP_LINK,
  SUPPORT_EMAIL_LINK,
  SUPPORT_TELEGRAM_LINK,
} from "./shared";
import type { ClaudePage } from "./types";

export const CLAUDE_PAGE_EN: ClaudePage = {
  metaTitle: "Calls4U for Claude: calls, reports and voice agents from the chat",
  metaDescription:
    "The Calls4U connector for Claude: review calls and post-call reports, set up AI voice agents, manage contacts and bookings, and start test calls or call campaigns in plain language.",
  title: "Calls4U for Claude: calls, reports and voice agents from the chat",
  crumb: "Claude",
  lead: [
    "The Calls4U connector lets you work with your Calls4U account in plain language: review calls and post-call reports, set up AI voice agents, manage contacts and bookings, and start test calls or call campaigns.",
  ],
  sections: [
    {
      heading: "Example prompts",
      blocks: [
        {
          type: "list",
          items: [
            ["“Show yesterday's calls where the customer asked to be called back.”"],
            ["“How many bookings did the agent make this week? Who is booked for Saturday?”"],
            ["“Create a booking agent for a barbershop from the receptionist template.”"],
            ["“Add a note to the last call: the customer wants a discount.”"],
            ["“Connect KeyCRM and send a test card.”"],
            ["“Start calling the ‘November clients’ list with the agent Oleh.”"],
          ],
        },
      ],
    },
    {
      heading: "How to connect",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            [
              "In Claude open ",
              { strong: "Settings → Connectors" },
              " → ",
              { strong: "Calls4U" },
              " (or ",
              { strong: "Add custom connector" },
              " with ",
              { code: CONNECTOR_URL },
              ").",
            ],
            [
              "Click ",
              { strong: "Connect" },
              " and sign in to your Calls4U account (email and password, or Google).",
            ],
            ["Approve access."],
          ],
        },
        {
          type: "paragraph",
          content: [
            "You need a Calls4U account. Sign up at ",
            SIGN_UP_LINK,
            "; the trial is free.",
          ],
        },
      ],
    },
    {
      heading: "Safety",
      blocks: [
        {
          type: "list",
          items: [
            [
              { strong: "Your account only." },
              " One authorization grants access to one Calls4U account. Claude never sees other customers' data.",
            ],
            [
              { strong: "Consequential actions need your explicit consent." },
              " Placing a test call, starting, pausing or stopping a campaign, and disconnecting the CRM require your explicit “yes” in the chat. Without it the server refuses.",
            ],
            [
              { strong: "Campaigns only for verified businesses." },
              " Bulk calling opens only after the company is verified. A do-not-call list is enforced.",
            ],
            [
              { strong: "The agent never pretends to be human." },
              " It introduces itself as a virtual assistant and answers truthfully when asked whether it is a robot.",
            ],
            [
              { strong: "Revoke access anytime" },
              " in Claude → Settings → Connectors → Calls4U → Disconnect. Changing your Calls4U password also ends all sessions and connector access.",
            ],
          ],
        },
      ],
    },
    {
      heading: "What the connector can access",
      blocks: [
        {
          type: "paragraph",
          content: [
            "33 tools: 17 are read-only (account overview, calls and transcripts, reports, agents, templates, voices, free time slots, bookings, campaigns, contacts, contact lists, numbers, notifications, integrations, CRM) and 16 change data (notes, agents, bookings, contacts, notifications, CRM, test call, campaigns).",
          ],
        },
      ],
    },
    {
      heading: "Support",
      blocks: [
        {
          type: "paragraph",
          content: [
            SUPPORT_EMAIL_LINK,
            " · Telegram ",
            SUPPORT_TELEGRAM_LINK,
            " · ",
            { label: "Privacy policy", href: PRIVACY_POLICY_HREF },
          ],
        },
      ],
    },
  ],
};

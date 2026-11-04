import type {
  BuilderSectionCopy,
  DemoSectionCopy,
  HeroCopy,
  NumbersCopy,
  ScenariosCopy,
} from "@/components/landing/copy/types";

export const EN_HERO: HeroCopy = {
  srTitle: "AI agent calls for you",
  titleLines: ["AI agent", "calls", " for you"],
  metaLeft: "(01) Voice AI agent",
  metaCenter: "Ukraine · Calls 24/7",
  metaLive: "Agent on the line",
  leadStrong: "of manager time freed up.",
  leadRest:
    " The agent phones your customers, clarifies the details and writes the result to your CRM. No developers, no manual dialing.",
  signUp: "Try it free",
  listenDemo: "Listen to the demo",
  chips: [
    { icon: "clock", label: "Launch in 1 day" },
    { icon: "link", label: "CRM integration" },
    { icon: "phone", label: "Calls 24/7" },
  ],
};

export const EN_DEMO: DemoSectionCopy = {
  meta: "(02) Hear it yourself",
  metaRight: "Real call scenarios",
  heading: [["Not a presentation,"], ["but a ", { em: "live call" }]],
  lead: "Hear how the agent confirms an appointment, asks follow-up questions and records the result in your dashboard.",
};

export const EN_NUMBERS: NumbersCopy = {
  meta: "(03) By the numbers",
  metaRight: "What your business gets",
  stats: [
    {
      value: "20",
      count: 20,
      unit: "sec",
      description: "and the agent calls your number for a test",
    },
    {
      value: "70",
      count: 70,
      unit: "%",
      description: "of manager time freed from routine calls",
    },
    { value: "24/7", description: "calls with no days off, sick leave or queues" },
    {
      value: "1",
      count: 1,
      unit: "day",
      description: "from sign-up to the first calls to your customers",
    },
  ],
};

export const EN_SCENARIOS: ScenariosCopy = {
  meta: "(04) Ready-made scenarios",
  heading: [["Calls the agent"], [{ em: "takes over right away" }]],
  lead: "No need to write a script from scratch. Pick a call type, adapt a few phrases to your business and run a test.",
  ctaText: "Start with a ready-made scenario and adapt the phrases to your business",
  ctaButton: "Choose a scenario",
  cards: [
    {
      number: "01",
      audience: "Salons · Clinics · Auto service",
      title: "Appointment confirmation",
      askLabel: "Asks",
      ask: "Whether the customer will come at the chosen time",
      bubble: "Confirming your appointment tomorrow at 2:00 PM?",
      result: "Confirmed / rescheduled",
      tone: "white",
    },
    {
      number: "02",
      audience: "Appointment-based services",
      title: "Visit reminder",
      askLabel: "Does",
      ask: "Reminds about the date, time and details",
      bubble: "Reminder: your visit is tomorrow at 10:30 AM. We look forward to seeing you!",
      result: "Fewer no-shows and manual calls",
      tone: "blue",
    },
    {
      number: "03",
      audience: "Online stores",
      title: "Order clarification",
      askLabel: "Asks",
      ask: "Product, address, delivery",
      bubble: "Delivery to branch 12 in Lviv. Is that correct?",
      result: "Order ready for processing",
      tone: "ink",
    },
    {
      number: "04",
      audience: "Ad leads",
      title: "Lead qualification",
      askLabel: "Asks",
      ask: "Need, budget, timeline",
      bubble: "When are you planning to start, and what is your budget?",
      result: "Warm lead for a manager",
      tone: "soft",
    },
    {
      number: "05",
      audience: "Customers from your database",
      title: "Follow-up call",
      askLabel: "Does",
      ask: "Offers an appointment or a service",
      bubble: "It's time for your scheduled service. Shall I book you for Saturday?",
      result: "Status and next action",
      tone: "blue",
    },
    {
      number: "06",
      audience: "Non-standard processes",
      title: "Custom scenario",
      askLabel: "Does",
      ask: "Speaks in your own phrases",
      bubble: "I speak in your words and follow your rules",
      result: "A scenario built for your business",
      tone: "ink",
    },
  ],
};

export const EN_BUILDER: BuilderSectionCopy = {
  meta: "(05) How to launch",
  metaRight: "No code, no developers",
  heading: [["4 steps to your"], [{ em: "first call" }]],
  lead: "Choose a scenario, set up the voice, add contacts and test the call on yourself before launch.",
  steps: [
    {
      number: "01",
      title: "Choose a scenario",
      description: "A ready template for appointments, reminders, orders or leads.",
    },
    {
      number: "02",
      title: "Set up the agent",
      description: "Voice, phrases and conversation rules, in plain language.",
    },
    {
      number: "03",
      title: "Add contacts",
      description: "Upload numbers via CSV, Google Sheets or your connected CRM.",
    },
    {
      number: "04",
      title: "Test the call",
      description: "Try it on yourself first, and only then call your customers.",
    },
  ],
  builderTitle: "Agent builder",
  builderAccent: "without code",
  checklist: [
    "Female or male voice",
    "Instructions in plain language",
    "Ready templates for your niche",
    "Instant CRM integration",
    "Test call before launch",
  ],
  signUp: "Try it free",
};

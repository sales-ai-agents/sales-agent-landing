import type {
  DashboardCopy,
  IntegrationsCopy,
  PricingCopy,
  SecurityCopy,
  VideoSectionCopy,
} from "@/components/landing/copy/types";

export const EN_DASHBOARD: DashboardCopy = {
  meta: "(06) Your dashboard",
  metaRight: "Full control after every call",
  heading: [["You see"], [{ em: "every conversation" }]],
  lead: "This is the Calls4U dashboard: minutes, calls, time saved and the outcome of every conversation, all in one place.",
  menuLabel: "Dashboard menu (demo)",
  sidebar: [
    { icon: "overview", label: "Overview" },
    { icon: "agents", label: "Agents" },
    { icon: "users", label: "Contacts" },
    { icon: "phone", label: "Calls" },
    { icon: "grid", label: "Numbers" },
    { icon: "card", label: "Plans & Billing" },
    { icon: "puzzle", label: "Integrations" },
  ],
  planLabel: "Plan",
  planName: "Pro",
  planLink: "Manage plan →",
  headTitle: "Overview",
  headSubtitle: "Performance of your AI agents",
  demoChip: "Demo data",
  range: "7 days ▾",
  newAgent: "+ New agent",
  usage: {
    label: "Minutes used",
    total: " / 300 min",
    note: "114 min left · enough for ~9 more days",
  },
  totalCalls: {
    label: "Total calls",
    note: "Last 7 days",
    trend: "+18% vs previous 7 days",
  },
  savedTime: {
    label: "Time saved",
    unit: " h",
    note: "Last 7 days",
    trend: "≈ 4 manager workdays",
  },
  goals: {
    label: "Goals achieved",
    note: "69% of all calls",
    trend: "+12% vs previous 7 days",
  },
  chart: {
    title: "Call activity",
    legend: ["All calls", "Goals achieved", "Time saved"],
    ariaLabel: "Weekly call activity chart",
    days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
  },
  agentsPanel: {
    title: "Agent performance",
    all: "All agents →",
    button: "Go to all agents",
    rows: [
      { initial: "M", name: "Maria", task: "Appointment confirmations", rate: 86 },
      { initial: "O", name: "Oleg", task: "Order clarification", rate: 74 },
      { initial: "I", name: "Iryna", task: "Lead qualification", rate: 61 },
    ],
  },
  callsTable: {
    title: "Recent calls",
    all: "All calls →",
    headers: ["Customer", "Agent", "Duration", "Outcome", "Time"],
    rows: [
      {
        client: "Olena K.",
        agent: "Maria",
        duration: "1:02",
        tone: "g",
        status: "Appointment confirmed",
        time: "10:24",
      },
      {
        client: "Igor M.",
        agent: "Oleg",
        duration: "1:45",
        tone: "y",
        status: "Rescheduled to Friday",
        time: "10:31",
      },
      {
        client: "Svitlana T.",
        agent: "Maria",
        duration: "0:15",
        tone: "r",
        status: "No answer · retry at 2:00 PM",
        time: "10:38",
      },
      {
        client: "Andriy V.",
        agent: "Iryna",
        duration: "2:55",
        tone: "b",
        status: "Warm lead → manager",
        time: "10:45",
      },
    ],
  },
};

export const EN_INTEGRATIONS: IntegrationsCopy = {
  meta: "(07) Integrations",
  metaRight: "Works with your tools",
  heading: [["Nothing to"], [{ em: "rebuild" }]],
  lead: "After the call, the agent sends the status, summary and recording to your CRM, spreadsheet or automation system.",
  items: [
    {
      title: "CRM",
      description:
        "The call result lands in the customer record: status, summary and call recording.",
    },
    {
      title: "Google Sheets",
      description:
        "The log updates in your spreadsheet automatically: customer, status, summary and next action.",
    },
    {
      title: "CSV",
      description: "Upload your contact base and export call results in a convenient format.",
    },
    {
      title: "Webhooks",
      description: "Send post-call events to your system: CRM, chat, analytics or automation.",
    },
  ],
};

export const EN_VIDEO: VideoSectionCopy = {
  meta: "(08) Video",
  metaRight: "7 minutes on calls and money · video in Ukrainian",
  heading: [["Where your business loses"], [{ em: "customers" }, " on calls"]],
  lead: "We calculate what missed calls cost, up to UAH 60,000 a month, and show a real AI agent call.",
};

export const EN_PRICING: PricingCopy = {
  meta: "(09) Pricing",
  metaRight: "Billed monthly · No contracts",
  heading: [["A plan for the number of"], [{ em: "your calls" }]],
  lead: "Every plan includes ready-to-use talk minutes, AI agents and a call log. Start with a free test call.",
  plans: [
    {
      id: "trial",
      tagline: "Free trial",
      name: "Trial",
      price: "$0",
      period: "/ no payment",
      subtitle: "Connect an agent and try it on your own customers before you pay",
      features: ["20 talk minutes", "1 AI agent", "Ready-made scenarios", "No time limit"],
      ctaLabel: "Start the Trial",
      ctaTone: "blue",
      variant: "trial",
      badge: "No card required",
    },
    {
      id: "start",
      tagline: "For your first launch",
      name: "Start",
      price: "$29",
      period: "/ month",
      subtitle: "For a small call flow",
      features: [
        "100 talk minutes",
        "1 AI agent",
        "1 phone number",
        "$5 call balance",
        "Call log and results",
        "Basic scenario setup",
      ],
      ctaLabel: "Try it free",
      ctaTone: "ghost",
    },
    {
      id: "pro",
      tagline: "For scaling up",
      name: "Pro",
      price: "$199",
      period: "/ month",
      subtitle: "For teams with a high call volume",
      features: [
        "800 talk minutes",
        "Unlimited AI agents",
        "Up to 3 phone numbers",
        "$20 call balance",
        "All available integrations",
        "Priority support",
        "Connection to business processes",
      ],
      ctaLabel: "Discuss integration",
      ctaTone: "ghost",
    },
    {
      id: "pro-plus",
      tagline: "Pro + chatbot",
      name: "Pro+",
      price: "$199",
      period: "/ month",
      subtitle: "The same price as Pro, with a chatbot that also answers your customers",
      features: [
        "800 talk minutes",
        "Everything in Pro",
        "Chatbot",
        "Answers 24/7 and passes leads to your CRM",
        "Calls and chats in one dashboard",
      ],
      highlightedFeatures: [0, 2],
      ctaLabel: "Get Pro+",
      ctaTone: "white",
      variant: "featured",
      badge: "Best value",
    },
  ],
  note: "You pay only for the minutes you use. Scenarios, CRM integrations and a test balance are already included.",
};

export const EN_SECURITY: SecurityCopy = {
  meta: "(10) Security and control",
  metaRight: "Your data stays yours",
  heading: [["Customer data"], [{ em: "stays with you" }]],
  lead: "You control recordings, access and when calls are launched.",
  cards: [
    {
      icon: "lock",
      title: "Recordings in your dashboard",
      description: "Every conversation is stored with its status, summary and audio.",
    },
    {
      icon: "pause",
      title: "Pause in one click",
      description: "Stop the calls if you need to check a scenario or your database.",
    },
    {
      icon: "users",
      title: "Access control",
      description: "You decide which team members see the database, recordings and results.",
    },
    {
      icon: "shieldCheck",
      title: "Protected data",
      description: "Contacts are never shared with third parties or used for unrelated purposes.",
    },
  ],
  badges: [
    { icon: "shield", label: "GDPR Compliant" },
    { icon: "lock", label: "Data encryption" },
    { icon: "globe", label: "EU data storage servers" },
  ],
};

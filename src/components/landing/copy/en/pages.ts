import type {
  BlogPagesCopy,
  BlogTeaserCopy,
  FaqCopy,
  FinalCtaCopy,
  FooterCopy,
  LlmsCopy,
  SeoCopy,
} from "@/components/landing/copy/types";

export const EN_SEO: SeoCopy = {
  title: "Calls4U: Voice AI Agent for Customer Calls and CRM",
  description:
    "Calls4U is a voice AI agent that confirms appointments, sends visit reminders, clarifies orders and writes results to your CRM. Test call in 20 seconds, launch in 1 day.",
  socialDescription:
    "An AI agent that phones your customers for you: appointments, reminders, orders, leads. Results go to your CRM. Launch in 1 day, no developers.",
  ogImageAlt: "Calls4U: voice AI agent for customer calls",
  organizationDescription:
    "Calls4U is a platform of voice AI agents that phone customers on behalf of a business: they confirm appointments, remind about visits, clarify orders and write the result to your CRM.",
  pageDescription:
    "A voice AI agent that automates routine customer calls: appointment confirmations, reminders, order clarification, lead qualification and CRM integration.",
  features: [
    "Appointment confirmations",
    "Visit reminders",
    "Order clarification",
    "Lead qualification",
    "Integration with CRM, Google Sheets, CSV and webhooks",
    "No-code agent builder",
    "Call handoff to a manager",
    "Call log with conversation recordings",
  ],
  howToName: "How to launch an AI calling agent in 4 steps",
  breadcrumbHome: "Home",
};

export const EN_FOOTER: FooterCopy = {
  about:
    "Calls4U is an AI agent for routine calls: it confirms appointments and passes the result to your CRM or a manager.",
  navTitle: "Navigation",
  documentsTitle: "Documents",
  documentsNote: "Legal documents are available in Ukrainian.",
  contactsTitle: "Contacts",
  leaveRequest: "Leave a request",
  rights: "All rights reserved.",
  tagline: "Built so your managers can focus on sales.",
  documents: {
    offer: "Public offer",
    serviceTerms: "Terms of service",
    refundPolicy: "Refund policy",
    privacyPolicy: "Privacy policy",
    cookiePolicy: "Cookie policy",
    termsOfUse: "Website terms of use",
  },
};

export const EN_BLOG_TEASER: BlogTeaserCopy = {
  meta: "(11) Blog",
  metaRight: "Guides · Economics · How-tos",
  heading: [["A blog about calls,"], [{ em: "sales" }, " and AI"]],
  lead: "Calculations, scripts and practical tips: everything that helps a business stop losing customers on the phone.",
  allPosts: "All articles",
};

export const EN_FAQ: FaqCopy = {
  meta: "(12) FAQ",
  heading: [["Questions"], ["and ", { em: "answers" }]],
  lead: "Can't find an answer? Give us a call and we will reply within one business day.",
  card: {
    kicker: "Faster than email",
    title: "Ask the agent: it will call you back in 20 seconds",
    action: "Test call",
  },
  items: [
    {
      question: "What is Calls4U and how does it work?",
      answer:
        "Calls4U is a service of voice AI agents that phone customers on behalf of your business: they confirm appointments, remind about visits, clarify orders and qualify leads. After each call, the status, summary and call recording land in your dashboard, CRM or Google Sheets. Launch takes one day and no developers are needed.",
    },
    {
      question: "How is Calls4U spelled and pronounced?",
      answer:
        "The name is spelled Calls4U (website calls4u.ai) and pronounced “calls for you”. People also search for us as Calls 4U, Calls4You or Calls For You. Calls4U is an AI agent for phone calls that confirms appointments, reminds customers about visits and passes the result to your CRM.",
    },
    {
      question: "How does launching an agent start?",
      answer:
        "First, you choose a scenario: appointment confirmation, reminder, order or lead. Then you set up the voice and the instructions, and test the call on yourself.",
    },
    {
      question: "Can I change the scenario after launch?",
      answer:
        "Yes. You can update phrases, conversation rules, call times and the logic for handing over to a manager. A scenario is not set in stone like an old price list at the front desk.",
    },
    {
      question: "How do I know the agent handled a call well?",
      answer:
        "After every call, the log shows the status, a short summary, the audio recording and the result of syncing with your CRM or spreadsheet.",
    },
    {
      question: "What happens if the customer doesn't answer?",
      answer:
        "The agent records the status “No answer”. You can then schedule a retry or pass the contact to a manager for manual handling.",
    },
    {
      question: "Can I test it first without calling customers?",
      answer:
        "Yes. Before running it on your database, you can place a test call to your own number and check the voice, the scenario and how the agent behaves.",
    },
    {
      question: "Where do the call results go?",
      answer:
        "To your dashboard, CRM, Google Sheets, or your own system via webhook. You don't have to change your whole process for the agent.",
    },
    {
      question: "What calls is it best suited for?",
      answer:
        "Routine calls: order confirmations, booking visits, reminders and answers to common questions. If a request is complex, the agent hands the call to a manager right away.",
    },
    {
      question: "How much does it cost?",
      answer:
        "You can start for free: Trial gives you 20 talk minutes with no card. Paid plans start at $29 per month. You pay only for the talk minutes you use, and all scenarios, CRM integrations and a test balance are already included in the plans.",
    },
  ],
};

export const EN_FINAL_CTA: FinalCtaCopy = {
  meta: "(13) Your move",
  heading: [["Try it"], [{ em: "yourself" }]],
  lead: "Enter your number and the agent will call in 20 seconds. One scenario and your phone are all you need for a first test.",
  demoWithManager: "Or book a demo with a manager",
};

export const EN_BLOG_PAGES: BlogPagesCopy = {
  name: "Calls4U Blog",
  titleTemplate: "%s | Calls4U Blog",
  rssDescription: "Guides, calculations and tips on call automation and AI agents.",
  index: {
    title: "Calls4U Blog: Calls, Sales and AI",
    description:
      "Guides, calculations and practical tips on call automation, voice AI agents and phone sales. Scenarios, economics, how-tos and myths.",
    schemaDescription:
      "Guides, calculations and practical tips on call automation, voice AI agents and phone sales.",
    metaLeft: "(Blog) Calls4U",
    metaRight: "Guides · Economics · How-tos · Myths",
    heading: "Blog",
    introTitle: "On calls, sales ",
    introAccent: "and AI",
    introTail: ", with no fluff and with numbers",
    introLead:
      "Calculations, ready-made scenarios and practical tips for businesses that don't want to lose customers on the phone.",
    ctaKicker: "Instead of a thousand words",
    ctaTitle: "One test call ",
    ctaAccent: "to your own number",
    ctaText:
      "Enter your number on the home page and the agent will call in 20 seconds to show how a conversation with your customers sounds.",
    ctaButton: "Start a test call",
  },
  article: {
    crumbsLabel: "Breadcrumb",
    team: "Calls4U Team",
    bottomCtaKicker: "Try it in practice",
    bottomCtaTitle: "Hear the agent on your own scenario",
    bottomCtaText:
      "Enter your number and the agent will call in 20 seconds. No spam, and your database stays with you.",
    sideCtaKicker: "Try it yourself",
    sideCtaTitle: "The agent will call you in 20 seconds",
    sideCtaText: "One test call and you will hear how a conversation with your customers sounds.",
    ctaButton: "Start a test call",
    sideCtaButton: "Test call",
    related: "Related reading",
    allArticles: "All articles →",
  },
};

export const EN_LLMS: LlmsCopy = {
  languageName: "English",
  summary:
    "Calls4U is a voice AI agent that phones your customers for you: it confirms appointments, sends visit reminders, clarifies orders, qualifies leads and writes the outcome to your CRM. Launch in one day, no developers needed.",
  fullTitle: "Calls4U: full description",
  pricing: "Pricing",
  faq: "FAQ",
  blog: "Blog",
  category: "Category",
  published: "Published",
  updated: "Updated",
};

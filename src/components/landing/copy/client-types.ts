import type { RoomStatus } from "@/components/landing/api/types";

export type NavId = "demo" | "scenarios" | "control" | "pricing" | "blog" | "faq";

export type DemoScenarioId = "logistics" | "warehouse" | "service" | "delivery";

export type PresetId = "admin" | "logist" | "order";

export interface ApiErrors {
  readonly fallback: string;
  readonly codes: Readonly<Record<string, string>>;
}

export interface ValidationCopy {
  readonly nameRequired: string;
  readonly phoneInvalid: string;
  readonly maxLength: string;
  readonly messageTooShort: string;
  readonly emailInvalid: string;
  readonly consentRequired: string;
}

export interface NavCopy {
  readonly menuLabel: string;
  readonly links: Readonly<Record<NavId, string>>;
  readonly login: string;
  readonly testCall: string;
}

export interface HeroCardCopy {
  readonly topLabel: string;
  readonly titleLead: string;
  readonly titleAccent: string;
  readonly submit: string;
  readonly getEstimate: string;
  readonly avatars: readonly [string, string, string];
  readonly footLead: string;
  readonly footStrong: string;
  readonly footNote: string;
}

export interface HeroWaveLine {
  readonly speaker: "agent" | "client";
  readonly text: string;
}

export interface HeroWaveCopy {
  readonly agent: string;
  readonly client: string;
  readonly transcript: readonly HeroWaveLine[];
}

export interface DemoScenarioCopy {
  readonly tag: string;
  readonly title: string;
  readonly result: string;
}

export interface DemoPlayerCopy {
  readonly play: string;
  readonly pause: string;
  readonly recording: string;
  readonly seek: string;
  readonly failed: string;
  readonly transcript: string;
  readonly hint: string;
  readonly result: string;
  readonly scenarios: Readonly<Record<DemoScenarioId, DemoScenarioCopy>>;
}

export interface PresetCopy {
  readonly label: string;
  readonly description: string;
}

export interface BuilderCardCopy {
  readonly title: string;
  readonly nameLabel: string;
  readonly voiceLabel: string;
  readonly voices: { readonly female: string; readonly male: string };
  readonly defaultNames: { readonly female: string; readonly male: string };
  readonly scenarioLabel: string;
  readonly scenarioGroup: string;
  readonly promptPlaceholder: string;
  readonly start: string;
  readonly starting: string;
  readonly presets: Readonly<Record<PresetId, PresetCopy>>;
}

export interface LivePanelCopy {
  readonly status: Readonly<Record<RoomStatus, string>>;
  readonly hintConnected: string;
  readonly hintConnecting: string;
  readonly hintDone: string;
  readonly end: string;
  readonly errors: {
    readonly generic: string;
    readonly room: string;
    readonly permission: string;
    readonly noDevice: string;
    readonly deviceBusy: string;
    readonly connection: string;
  };
}

export interface VideoChapterCopy {
  readonly startSeconds: number;
  readonly label: string;
  readonly badge?: string;
}

export interface VideoPlayerCopy {
  readonly iframeTitle: string;
  readonly startLabel: string;
  readonly missedTitle: string;
  readonly missedTime: string;
  readonly callbackTitle: string;
  readonly callbackNote: string;
  readonly signUp: string;
  readonly chapters: readonly VideoChapterCopy[];
}

export interface LeadDialogCopy {
  readonly title: string;
  readonly description: string;
  readonly doneTitle: string;
  readonly doneDescription: string;
  readonly name: string;
  readonly phone: string;
  readonly niche: string;
  readonly contact: string;
  readonly submit: string;
  readonly submitting: string;
  readonly telegram: string;
}

export interface FeedbackDialogCopy {
  readonly title: string;
  readonly description: string;
  readonly doneTitle: string;
  readonly doneDescription: string;
  readonly message: string;
  readonly email: string;
  readonly consent: string;
  readonly submit: string;
  readonly submitting: string;
}

export interface DialogsCopy {
  readonly close: string;
  readonly done: string;
  readonly lead: LeadDialogCopy;
  readonly feedback: FeedbackDialogCopy;
}

export interface CoversCopy {
  readonly five: { readonly label: string; readonly agent: string; readonly client: string };
  readonly econ: { readonly label: string; readonly amount: string; readonly caption: string };
  readonly vs: { readonly label: string; readonly left: string; readonly right: string };
  readonly crm: { readonly label: string; readonly value: string };
  readonly myth: { readonly label: string; readonly value: string };
  readonly script: {
    readonly label: string;
    readonly before: string;
    readonly accent: string;
    readonly after: string;
  };
}

export interface BlogClientCopy {
  readonly readTime: string;
  readonly read: string;
  readonly all: string;
  readonly listHeading: string;
  readonly categoriesLabel: string;
  readonly tocLabel: string;
  readonly tocTitle: string;
  readonly copyLink: string;
  readonly copied: string;
  readonly covers: CoversCopy;
}

export interface ClientCopy {
  readonly speakers: { readonly agent: string; readonly client: string };
  readonly errors: ApiErrors;
  readonly validation: ValidationCopy;
  readonly nav: NavCopy;
  readonly backToTop: { readonly label: string; readonly title: string };
  readonly phoneAriaLabel: string;
  readonly heroCard: HeroCardCopy;
  readonly heroWave: HeroWaveCopy;
  readonly testCallSuccess: string;
  readonly testCallInvalid: string;
  readonly finalForm: { readonly submit: string; readonly note: string };
  readonly demoPlayer: DemoPlayerCopy;
  readonly builderCard: BuilderCardCopy;
  readonly livePanel: LivePanelCopy;
  readonly video: VideoPlayerCopy;
  readonly dialogs: DialogsCopy;
  readonly blog: BlogClientCopy;
}

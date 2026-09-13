import {
  Bot,
  Users,
  PhoneCall,
  Settings,
  CreditCard,
  ActivitySquareIcon,
  Puzzle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
}

export const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard", icon: ActivitySquareIcon, label: "Огляд" },
  { href: "/dashboard/agents", icon: Bot, label: "Агенти" },
  { href: "/dashboard/contacts", icon: Users, label: "Контакти" },
  { href: "/dashboard/call-logs", icon: PhoneCall, label: "Дзвінки" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Тарифи і Оплата" },
  { href: "/dashboard/integrations", icon: Puzzle, label: "Інтеграції" },
] as const satisfies readonly NavItem[];

export const DASHBOARD_SETTINGS_ITEM: NavItem = {
  href: "/dashboard/settings",
  icon: Settings,
  label: "Налаштування",
};

export const COMPANY_INFO = {
  legalName: "Фізична особа-підприємець Овсієнко Богдан Володимирович",
  shortName: "ФОП Овсієнко Богдан Володимирович",
  taxId: "3888313957",
  taxSystem: "Спрощена система оподаткування, 3 група, 5% (не платник ПДВ)",
  address: "02000, м. Київ, б-р Ярослава Гашека, 24",
  email: "support@calls4u.ai",
  phone: "+380 99 036 73 86",
  site: "calls4u.ai",
} as const;

export interface LegalPageLink {
  readonly href: string;
  readonly label: string;
}

export const LEGAL_PAGES = {
  offer: { href: "/offer", label: "Публічна оферта" },
  serviceTerms: { href: "/service-terms", label: "Умови надання послуг" },
  refundPolicy: { href: "/refund-policy", label: "Умови повернення коштів" },
  privacyPolicy: { href: "/privacy-policy", label: "Політика конфіденційності" },
  cookiePolicy: { href: "/cookie-policy", label: "Політика cookie" },
  termsOfUse: { href: "/terms-of-use", label: "Умови використання сайту" },
  contacts: { href: "/contacts", label: "Контакти" },
} as const satisfies Record<string, LegalPageLink>;

export const LEGAL_PAGE_LIST: readonly LegalPageLink[] = Object.values(LEGAL_PAGES);

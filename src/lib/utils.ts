import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(sec: number | null): string {
  if (!sec || sec <= 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatUaPhoneDigits(digits: string): string {
  const cleaned = digits.replace(/\D/g, "").slice(0, 9);

  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  if (cleaned.length <= 7)
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;

  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
}

export function formatUaPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 12) return phone;
  const cc = digits.slice(0, 3);
  const area = digits.slice(3, 5);
  const part1 = digits.slice(5, 8);
  const part2 = digits.slice(8, 10);
  const part3 = digits.slice(10, 12);
  return `+${cc} ${area} ${part1} ${part2} ${part3}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("uk-UA");
}

export function formatTimeSaved(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) return `${hours} год ${mins} хв`;
  return `${mins} хв`;
}

export function formatMinutesUsed(minutes: number): string {
  return `${Math.round(minutes)} хв`;
}

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

export function formatSlaMinutes(minutes: number): string {
  const total = Math.abs(Math.round(minutes));
  if (total < MINUTES_PER_HOUR) return `${total} хв`;

  const days = Math.floor(total / MINUTES_PER_DAY);
  const hours = Math.floor((total % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
  const mins = total % MINUTES_PER_HOUR;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} дн`);
  if (hours > 0) parts.push(`${hours} год`);
  if (mins > 0 && days === 0) parts.push(`${mins} хв`);

  return parts.join(" ");
}

const DATE_LOCALE = "uk-UA";
const UTC_OFFSET_PATTERN = /([zZ]|[+-]\d{2}:?\d{2})$/;

export function parseServerDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const withZone = UTC_OFFSET_PATTERN.test(normalized) ? normalized : `${normalized}Z`;

  const date = new Date(withZone);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRelativeTime(dateStr: string): string {
  const date = parseServerDate(dateStr);
  if (!date) return "—";
  return formatDistanceToNow(date, { addSuffix: true, locale: uk });
}

export function formatDateShort(iso: string): string {
  const date = parseServerDate(iso);
  if (!date) return "—";
  return date.toLocaleDateString(DATE_LOCALE);
}

export function formatDateLong(iso: string): string {
  const date = parseServerDate(iso);
  if (!date) return "—";
  return date.toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  const date = parseServerDate(iso);
  if (!date) return "—";
  return date.toLocaleTimeString(DATE_LOCALE, { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(iso: string): string {
  const date = parseServerDate(iso);
  if (!date) return "—";
  return date.toLocaleString(DATE_LOCALE);
}

export function formatMonthYear(iso: string): string {
  const date = parseServerDate(iso);
  if (!date) return "—";
  return date.toLocaleString(DATE_LOCALE, { month: "long", year: "numeric" });
}

export function maskPhone(phone: string): string {
  if (phone.length > 7) {
    return phone.slice(0, 4) + "...";
  }
  return phone;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type UkrainianForms = [one: string, few: string, many: string];

export function pluralizeUk(n: number, [one, few, many]: UkrainianForms): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export const pluralizeDays = (n: number): string => pluralizeUk(n, ["день", "дні", "днів"]);
export const pluralizeMonths = (n: number): string =>
  pluralizeUk(n, ["місяць", "місяці", "місяців"]);

export function getPageIndex(currentPage: number, pageCount: number, index: number): number {
  if (pageCount <= 5) return index;
  if (currentPage <= 2) return index;
  if (currentPage >= pageCount - 3) return pageCount - 5 + index;
  return currentPage - 2 + index;
}

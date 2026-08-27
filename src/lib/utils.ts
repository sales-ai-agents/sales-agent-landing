import { clsx, type ClassValue } from "clsx";
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

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA");
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export function getPageIndex(currentPage: number, pageCount: number, index: number): number {
  if (pageCount <= 5) return index;
  if (currentPage <= 2) return index;
  if (currentPage >= pageCount - 3) return pageCount - 5 + index;
  return currentPage - 2 + index;
}

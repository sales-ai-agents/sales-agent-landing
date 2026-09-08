export interface TimezoneOption {
  value: string;
  label: string;
  offsetMinutes: number;
}

const FALLBACK_TIMEZONE = "UTC";
const MINUTES_IN_HOUR = 60;

const DEPRECATED_TIMEZONE_ALIASES: Record<string, string> = {
  "Europe/Kiev": "Europe/Kyiv",
  "Europe/Uzhgorod": "Europe/Kyiv",
  "Europe/Zaporozhye": "Europe/Kyiv",
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Katmandu": "Asia/Kathmandu",
  "Asia/Rangoon": "Asia/Yangon",
  "Asia/Saigon": "Asia/Ho_Chi_Minh",
  "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
  "America/Godthab": "America/Nuuk",
  "Pacific/Enderbury": "Pacific/Kanton",
  "Asia/Istanbul": "Europe/Istanbul",
  "Asia/Chongqing": "Asia/Shanghai",
  "US/Pacific": "America/Los_Angeles",
  "US/Eastern": "America/New_York",
  "US/Central": "America/Chicago",
  "US/Mountain": "America/Denver",
  GMT: "UTC",
  "Etc/GMT": "UTC",
  "Etc/UTC": "UTC",
};

export const canonicalizeTimezone = (timezone: string): string => {
  let resolved = timezone;

  try {
    resolved = new Intl.DateTimeFormat("en-US", { timeZone: timezone }).resolvedOptions().timeZone;
  } catch {
    resolved = timezone;
  }

  return DEPRECATED_TIMEZONE_ALIASES[resolved] ?? resolved;
};

const getSupportedTimezones = (): string[] => {
  if (typeof Intl.supportedValuesOf !== "function") {
    return [FALLBACK_TIMEZONE];
  }

  const canonicalNames = Intl.supportedValuesOf("timeZone").map(canonicalizeTimezone);
  return Array.from(new Set(canonicalNames));
};

const getOffsetMinutes = (timezone: string): number => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  });

  const offsetPart = formatter
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName");

  const match = offsetPart?.value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);

  return sign * (hours * MINUTES_IN_HOUR + minutes);
};

const formatOffsetLabel = (offsetMinutes: number): string => {
  const sign = offsetMinutes < 0 ? "-" : "+";
  const absolute = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absolute / MINUTES_IN_HOUR)).padStart(2, "0");
  const minutes = String(absolute % MINUTES_IN_HOUR).padStart(2, "0");

  return `UTC${sign}${hours}:${minutes}`;
};

const toTimezoneOption = (timezone: string): TimezoneOption => {
  const offsetMinutes = getOffsetMinutes(timezone);
  const readableName = timezone.replace(/_/g, " ");

  return {
    value: timezone,
    label: `(${formatOffsetLabel(offsetMinutes)}) ${readableName}`,
    offsetMinutes,
  };
};

const compareByOffsetThenName = (first: TimezoneOption, second: TimezoneOption): number => {
  if (first.offsetMinutes !== second.offsetMinutes) {
    return first.offsetMinutes - second.offsetMinutes;
  }
  return first.value.localeCompare(second.value);
};

export const buildTimezoneOptions = (): TimezoneOption[] => {
  return getSupportedTimezones().map(toTimezoneOption).sort(compareByOffsetThenName);
};

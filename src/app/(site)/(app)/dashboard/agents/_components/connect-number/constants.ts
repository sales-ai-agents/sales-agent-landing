export const UA_SUBSCRIBER_DIGITS = 9;
export const UA_COUNTRY_CODE = "+380";

export type ConnectMethod = "sip" | "forward" | "buy";

export const OPERATOR_FORWARD_HINTS: string[] = [
  "Binotel: Налаштування → Переадресація → додати зовнішній номер.",
  "Ringostat: Схема обробки дзвінків → переадресація на зовнішній номер.",
  "Kyivstar/Vodafone/lifecell: наберіть **21*номер# для безумовної переадресації.",
];

export const SIP_ACTIVATION_DELAY_SECONDS = 60;

export const normalizeUaPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  const subscriber = digits.startsWith("380")
    ? digits.slice(3)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;

  return `${UA_COUNTRY_CODE}${subscriber.slice(0, UA_SUBSCRIBER_DIGITS)}`;
};

export const isValidUaPhone = (raw: string): boolean => {
  const normalized = normalizeUaPhone(raw);
  return normalized.length === UA_COUNTRY_CODE.length + UA_SUBSCRIBER_DIGITS;
};

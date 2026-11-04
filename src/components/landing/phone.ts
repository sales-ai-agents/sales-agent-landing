export const SUBSCRIBER_DIGITS = 9;

export const extractSubscriberDigits = (value: string): string =>
  value.replace(/\D/g, "").replace(/^380/, "").replace(/^0/, "").slice(0, SUBSCRIBER_DIGITS);

export const formatPhoneInput = (value: string): string => {
  const digits = extractSubscriberDigits(value);
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    .filter(Boolean)
    .join(" ");
};

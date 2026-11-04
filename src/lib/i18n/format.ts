const PLACEHOLDER = /\{(\w+)\}/g;

export const formatMessage = (
  template: string,
  values: Readonly<Record<string, string | number>>
): string => template.replace(PLACEHOLDER, (match, key: string) => String(values[key] ?? match));

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidSlug = (value: string): boolean => SLUG_PATTERN.test(value);

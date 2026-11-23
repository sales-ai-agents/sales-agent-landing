export const PASSWORD_MIN_LENGTH = 8;

const SPECIAL_OR_DIGIT = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const UPPERCASE = /[A-ZА-ЯІЇЄҐ]/;

export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

export const REQUIRED_PASSWORD_RULE: PasswordRule = {
  label: `Мінімум ${PASSWORD_MIN_LENGTH} символів`,
  test: (value) => value.length >= PASSWORD_MIN_LENGTH,
};

export const RECOMMENDED_PASSWORD_RULES: readonly PasswordRule[] = [
  { label: "Велика літера", test: (value) => UPPERCASE.test(value) },
  { label: "Цифра або спецсимвол", test: (value) => SPECIAL_OR_DIGIT.test(value) },
];
